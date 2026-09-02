<#
.SYNOPSIS
    Updates the vendored Siemens docs-theme to a given tag.

.DESCRIPTION
    Automates the full theme update, including the workarounds this repository needs:

      * pulls the tag into vendor/docs-theme via git subtree
      * drops the cypress/ and playwright/ test snapshots, whose Git LFS objects are
        unavailable upstream (HTTP 404) and cause GitHub to reject pushes with GH008
      * rebuilds the prebuilt mkdocs_siemens/ package in a Linux container, because the
        theme's yarn scripts are POSIX-only and silently corrupt the output on Windows
      * deletes superseded hashed stylesheets and sed .bak byproducts
      * reports any mkdocs-material version drift against the theme's own pin

    Requires: git, docker (running), uv. Leaves everything staged but uncommitted.

.PARAMETER Tag
    Theme tag to update to, e.g. v8.3.0. Defaults to the newest tag on the docs-theme remote.

.PARAMETER SkipBuild
    Pull sources only; do not rebuild the prebuilt package. The result is NOT publishable.

.EXAMPLE
    ./scripts/update-docs-theme.ps1
    ./scripts/update-docs-theme.ps1 -Tag v8.4.0
#>
[CmdletBinding()]
param(
    [string]$Tag,
    [switch]$SkipBuild
)

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $PSScriptRoot
$ThemeDir = Join-Path $RepoRoot 'vendor/docs-theme'
# Test snapshots only; their LFS objects 404 upstream and GitHub rejects pushes that reference them.
$SnapshotDirs = @('cypress', 'playwright')

function Write-Step { param([string]$Message) Write-Host "`n==> $Message" -ForegroundColor Cyan }

Push-Location $RepoRoot
try {
    if (git status --porcelain) {
        throw "Working tree is not clean. Commit or stash first - git subtree pull requires a clean tree."
    }

    Write-Step 'Fetching docs-theme tags'
    git fetch docs-theme --tags --quiet
    if ($LASTEXITCODE -ne 0) { throw 'git fetch docs-theme failed.' }

    if (-not $Tag) {
        $Tag = git tag --list 'v*' --sort=-v:refname |
            Where-Object { $_ -match '^v\d+\.\d+\.\d+$' } |
            Select-Object -First 1
        if (-not $Tag) { throw 'Could not determine the latest tag; pass -Tag explicitly.' }
        Write-Host "Latest tag: $Tag"
    }

    $current = (Select-String -Path (Join-Path $ThemeDir 'pyproject.toml') -Pattern '^version\s*=\s*"(.+)"').Matches[0].Groups[1].Value
    Write-Host "Current: $current  ->  Target: $Tag"
    if ("v$current" -eq $Tag) { Write-Host 'Already up to date.' -ForegroundColor Yellow; return }

    Write-Step "Changelog $current -> $Tag (review for breaking changes)"
    git show "${Tag}:CHANGELOG.md" 2>$null |
        Select-String -Pattern 'BREAKING|^#{1,3}\s' |
        Select-Object -First 25 |
        ForEach-Object { $_.Line }

    Write-Step "Pulling $Tag into vendor/docs-theme"
    git subtree pull --prefix=vendor/docs-theme docs-theme $Tag --squash
    if ($LASTEXITCODE -ne 0) { throw 'git subtree pull failed - resolve conflicts, then rerun.' }

    Write-Step 'Removing LFS test snapshots'
    foreach ($d in $SnapshotDirs) {
        $p = "vendor/docs-theme/$d"
        if (Test-Path (Join-Path $RepoRoot $p)) {
            git rm -r -q --cached $p
            Remove-Item (Join-Path $RepoRoot $p) -Recurse -Force
            Write-Host "  removed $p"
        }
    }

    if ($SkipBuild) {
        Write-Warning 'Skipping rebuild: mkdocs_siemens/ is now STALE and must not be committed as-is.'
        return
    }

    Write-Step 'Rebuilding prebuilt theme in a Linux container'
    docker info --format '{{.ServerVersion}}' *> $null
    if ($LASTEXITCODE -ne 0) { throw 'Docker daemon is not reachable. Start Docker Desktop and rerun.' }

    # POSIX shell required: yarn 1.x uses cmd.exe on Windows and mangles the single-quoted globs.
    $steps = @('src:compile', 'src:postcss', 'dist:cpy:src', 'dist:cpy:vendor', 'dist:cpy:html', 'src:hash')
    $lines = @(
        'set -euo pipefail'
        'apt-get update -qq >/dev/null 2>&1'
        'apt-get install -y -qq jq >/dev/null 2>&1'
        'cd /work'
        'yarn --frozen-lockfile --ignore-engines 2>&1 | tail -2'
    )
    foreach ($s in $steps) {
        $lines += "echo '--- yarn $s'"
        $lines += "yarn $s 2>&1 | tail -1"
    }
    $scriptDir = Join-Path ([IO.Path]::GetTempPath()) 'docs-theme-build'
    New-Item -ItemType Directory -Force -Path $scriptDir | Out-Null
    [IO.File]::WriteAllText((Join-Path $scriptDir 'build.sh'), (($lines -join "`n") + "`n"))

    docker run --rm `
        -v "${ThemeDir}:/work" `
        -v 'docstheme_nm:/work/node_modules' `
        -v "${scriptDir}:/scripts:ro" `
        -w /work node:20-bookworm bash /scripts/build.sh
    if ($LASTEXITCODE -ne 0) { throw 'Theme build failed inside the container.' }

    Write-Step 'Cleaning build byproducts'
    # sed -i'.bak' leaves backups that the root .gitignore cannot catch: the vendored
    # .gitignore has "!/mkdocs_siemens/templates/**" and a nested .gitignore wins.
    Get-ChildItem (Join-Path $ThemeDir 'mkdocs_siemens') -Recurse -Filter '*.bak' -Force -ErrorAction SilentlyContinue |
        ForEach-Object { Remove-Item $_.FullName -Force; Write-Host "  removed $($_.Name)" }

    # postcss-hash writes code-<name>.<hash>.css but never deletes the previous hash.
    $styleDir = Join-Path $ThemeDir 'mkdocs_siemens/templates/assets/stylesheets'
    $templateText = (Get-ChildItem (Join-Path $ThemeDir 'mkdocs_siemens/templates') -Recurse -Filter '*.html' |
        ForEach-Object { Get-Content $_.FullName -Raw }) -join "`n"
    $stylesheets = @(Get-ChildItem $styleDir -Filter 'code-*.css')
    $referenced = @($stylesheets | Where-Object { $templateText -match [regex]::Escape($_.Name) })
    if ($referenced.Count -eq 0) {
        Write-Warning "No stylesheet is referenced by any template - skipping prune to avoid deleting the whole theme."
    }
    else {
        foreach ($css in $stylesheets | Where-Object { $referenced.Name -notcontains $_.Name }) {
            foreach ($f in @($css.FullName, "$($css.FullName).map")) {
                if (Test-Path $f) { git rm -q --ignore-unmatch -- $f; Remove-Item $f -Force -ErrorAction SilentlyContinue }
            }
            Write-Host "  removed superseded $($css.Name)"
        }
    }

    Write-Step 'Checking mkdocs-material pin'
    $themePin = (Select-String -Path (Join-Path $ThemeDir 'pyproject.toml') -Pattern 'mkdocs-material==([\d.]+)').Matches[0].Groups[1].Value
    $ourPin = (Select-String -Path (Join-Path $RepoRoot 'pyproject.toml') -Pattern 'mkdocs-material==([\d.]+)').Matches[0].Groups[1].Value
    if ($themePin -ne $ourPin) {
        Write-Warning "mkdocs-material drift: theme wants $themePin, pyproject.toml pins $ourPin."
        Write-Host "  Fix with: update pyproject.toml to ==$themePin, then 'uv lock'"
    }
    else { Write-Host "  in sync ($ourPin)" }

    Write-Step 'Installing theme and building docs'
    uv pip install --no-deps ./vendor/docs-theme
    if ($LASTEXITCODE -ne 0) { throw 'uv pip install of the theme failed.' }
    uv run --no-sync mkdocs build --strict
    if ($LASTEXITCODE -ne 0) { throw 'mkdocs build --strict failed.' }

    Write-Step 'Done'
    Write-Host "Theme updated to $Tag. Review 'git status', then commit sources and"
    Write-Host "mkdocs_siemens/ together - CI only checks that the directory exists, so a"
    Write-Host 'stale prebuilt package would ship unnoticed.'
}
finally {
    Pop-Location
}
