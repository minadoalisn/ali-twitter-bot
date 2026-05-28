[CmdletBinding()]
param(
  [string]$RepoPath = "D:\noirven-automation-repo",
  [int]$Attempts = 24,
  [int]$IntervalMinutes = 15
)

$ErrorActionPreference = "Continue"

$watchdog = Join-Path $RepoPath "scripts\noirven-watchdog.ps1"
$logDir = Join-Path $env:USERPROFILE ".codex\automations\noirven-daily-story-product-library"
$logPath = Join-Path $logDir "watchdog-daemon.log"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

function Write-DaemonLog {
  param([string]$Message)
  $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"), $Message
  Add-Content -LiteralPath $logPath -Value $line -Encoding UTF8
  Write-Output $line
}

if (-not (Test-Path -LiteralPath $watchdog)) {
  Write-DaemonLog "Watchdog not found: $watchdog"
  exit 1
}

Write-DaemonLog "Noirven watchdog daemon started. Attempts=$Attempts IntervalMinutes=$IntervalMinutes"

for ($attempt = 1; $attempt -le $Attempts; $attempt += 1) {
  Write-DaemonLog "Attempt $attempt/$Attempts"
  & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $watchdog -LaunchCodex
  $exitCode = $LASTEXITCODE
  Write-DaemonLog "Watchdog exit code: $exitCode"

  if ($attempt -lt $Attempts) {
    Start-Sleep -Seconds ([Math]::Max(60, $IntervalMinutes * 60))
  }
}

Write-DaemonLog "Noirven watchdog daemon finished."
