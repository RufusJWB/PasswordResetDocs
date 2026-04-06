param(
    [string]$ThemeDir = "vendor/docs-theme"
)

$ErrorActionPreference = "Stop"

$bash = Get-Command bash -ErrorAction SilentlyContinue
if ($null -eq $bash) {
    throw "bash is required to bootstrap the Siemens docs theme on Windows. Install Git for Windows and ensure bash is on PATH."
}

$rootDir = Split-Path -Parent $PSScriptRoot
$env:THEME_DIR = Join-Path $rootDir $ThemeDir
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
