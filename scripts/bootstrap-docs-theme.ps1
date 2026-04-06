param(
    [string]$ThemeRef = "v8.0.1",
    [string]$ThemeRepo = "https://code.siemens.com/code-ops/docs-theme.git"
)

$ErrorActionPreference = "Stop"

$bash = Get-Command bash -ErrorAction SilentlyContinue
if ($null -eq $bash) {
    throw "bash is required to bootstrap the Siemens docs theme on Windows. Install Git for Windows and ensure bash is on PATH."
}

$rootDir = Split-Path -Parent $PSScriptRoot
$env:THEME_REF = $ThemeRef
$env:THEME_REPO = $ThemeRepo
$env:GITLAB_REPO_USERNAME = if ($env:GITLAB_REPO_USERNAME) { $env:GITLAB_REPO_USERNAME } else { $env:UV_INDEX_MKDOCS_USERNAME }
$env:GITLAB_REPO_TOKEN = if ($env:GITLAB_REPO_TOKEN) { $env:GITLAB_REPO_TOKEN } else { $env:UV_INDEX_MKDOCS_PASSWORD }
$env:GIT_TERMINAL_PROMPT = "0"
git config --global core.longpaths true

Push-Location $rootDir
try {
    & $bash.Source -lc "./scripts/bootstrap-docs-theme.sh"
}
finally {
    Pop-Location
}

if ($LASTEXITCODE -ne 0) {
    throw "Theme bootstrap failed with exit code $LASTEXITCODE."
}
