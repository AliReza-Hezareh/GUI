param(
  [string]$Project = ""
)

$ErrorActionPreference = "Continue"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

$argsList = @("playwright", "test")
if ($Project -ne "") {
  $argsList += "--project=$Project"
}

& npx.cmd @argsList
$testExitCode = $LASTEXITCODE

& node qa\generate-report.mjs
Start-Process qa\index.html

exit $testExitCode
