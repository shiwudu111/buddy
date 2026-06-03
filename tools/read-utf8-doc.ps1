param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Path,

  [int]$First = 0
)

$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)

$resolved = Resolve-Path -LiteralPath $Path

if ($First -gt 0) {
  Get-Content -LiteralPath $resolved -Encoding UTF8 | Select-Object -First $First
} else {
  Get-Content -LiteralPath $resolved -Encoding UTF8
}
