[CmdletBinding()]
param(
  [switch]$CheckOnly,
  [switch]$LaunchCodex,
  [string]$RepoPath = "D:\noirven-automation-repo",
  [string]$ProductionUrl = "https://nvonly.com"
)

$ErrorActionPreference = "Stop"

$LogDir = Join-Path $env:USERPROFILE ".codex\automations\noirven-daily-story-product-library"
$LogPath = Join-Path $LogDir "watchdog.log"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Write-WatchdogLog {
  param([string]$Message)
  $line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"), $Message
  Add-Content -LiteralPath $LogPath -Value $line -Encoding UTF8
  Write-Output $line
}

function Invoke-CheckedCommand {
  param(
    [string]$FilePath,
    [string[]]$Arguments
  )

  Write-WatchdogLog ("RUN {0} {1}" -f $FilePath, ($Arguments -join " "))
  & $FilePath @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw ("Command failed with exit code {0}: {1} {2}" -f $LASTEXITCODE, $FilePath, ($Arguments -join " "))
  }
}

function Test-GitCleanForPath {
  param([string[]]$Paths)
  $status = & git status --porcelain -- @Paths
  return [string]::IsNullOrWhiteSpace(($status | Out-String))
}

function Get-LatestLocalProduct {
  $dataPath = Join-Path $RepoPath "src\lib\noirven-data.ts"
  $source = Get-Content -LiteralPath $dataPath -Raw -Encoding UTF8
  $seedStart = $source.IndexOf("export const dailyProductSeeds")
  if ($seedStart -lt 0) {
    throw "dailyProductSeeds export not found"
  }

  $seedSource = $source.Substring($seedStart)
  $seedEnd = $seedSource.IndexOf("export const internalProductConceptSeeds")
  if ($seedEnd -gt 0) {
    $seedSource = $seedSource.Substring(0, $seedEnd)
  }

  $serials = [regex]::Matches($seedSource, 'serial:\s*"(N-\d+)"') | ForEach-Object { $_.Groups[1].Value }
  if (-not $serials) {
    throw "No product serials found in dailyProductSeeds"
  }

  $latestSerial = $serials | Sort-Object { [int]($_ -replace "\D", "") } -Descending | Select-Object -First 1
  $blockMatch = [regex]::Match($seedSource, ('\{{[^{{}}]*serial:\s*"{0}"[^{{}}]*\}}' -f [regex]::Escape($latestSerial)))
  if (-not $blockMatch.Success) {
    throw "Could not parse latest product block for $latestSerial"
  }

  $block = $blockMatch.Value
  $image = [regex]::Match($block, 'image:\s*"([^"]+)"').Groups[1].Value
  $seriesId = [regex]::Match($block, 'seriesId:\s*"([^"]+)"').Groups[1].Value
  if (-not $image -or -not $seriesId) {
    throw "Could not parse latest product image/series for $latestSerial"
  }
  $slug = "{0}-{1}" -f $seriesId, $latestSerial.ToLowerInvariant()
  $imagePath = Join-Path $RepoPath ($image.TrimStart("/") -replace "/", "\")
  if (-not $imagePath.Contains("\public\")) {
    $imagePath = Join-Path $RepoPath ("public" + ($image -replace "/", "\"))
  }

  [pscustomobject]@{
    Serial = $latestSerial
    SeriesId = $seriesId
    Slug = $slug
    Image = $image
    ImagePath = $imagePath
  }
}

try {
  if ($LaunchCodex) {
    try {
      $codexCandidates = @(
        (Join-Path $env:LOCALAPPDATA "OpenAI\Codex\bin\codex.exe"),
        ((Get-Command codex.exe -ErrorAction SilentlyContinue).Source)
      ) | Where-Object { $_ -and (Test-Path -LiteralPath $_) } | Select-Object -Unique
      $codexProcess = Get-Process -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -like "codex*" } | Select-Object -First 1
      if (-not $codexProcess) {
        foreach ($candidate in $codexCandidates) {
          try {
            Start-Process -FilePath $candidate -WindowStyle Minimized
            Write-WatchdogLog "Started Codex app for local automations: $candidate"
            break
          } catch {
            Write-WatchdogLog ("Codex autostart candidate failed: {0} / {1}" -f $candidate, $_.Exception.Message)
          }
        }
      }
    } catch {
      Write-WatchdogLog ("Codex autostart skipped: " + $_.Exception.Message)
    }
  }

  if (-not (Test-Path -LiteralPath $RepoPath)) {
    throw "Repo path not found: $RepoPath"
  }

  Set-Location -LiteralPath $RepoPath
  $product = Get-LatestLocalProduct
  Write-WatchdogLog ("Latest local product: {0} / {1}" -f $product.Serial, $product.Slug)

  $auctionsHtml = (Invoke-WebRequest -Uri "$ProductionUrl/auctions" -UseBasicParsing -TimeoutSec 30).Content
  $productionHasLatest = $auctionsHtml.Contains($product.Serial)

  if ($productionHasLatest) {
    Write-WatchdogLog ("Production already contains {0}; running focused verification." -f $product.Serial)
    Invoke-CheckedCommand "node" @("scripts/verify-production-launch.mjs", "--serial", $product.Serial, "--retries", "2", "--delay-ms", "2000")
    exit 0
  }

  Write-WatchdogLog ("Production is missing {0}; attempting publish repair." -f $product.Serial)
  if ($CheckOnly) {
    Write-WatchdogLog "CheckOnly mode: not committing or deploying."
    exit 2
  }

  $pathsToPublish = @(
    "src/lib/noirven-data.ts",
    "src/lib/localized-content.ts",
    ($product.ImagePath.Replace($RepoPath + "\", ""))
  )

  Invoke-CheckedCommand "npm.cmd" @("run", "verify:catalog")
  Invoke-CheckedCommand "npm.cmd" @("run", "verify:geo")
  Invoke-CheckedCommand "npm.cmd" @("run", "verify:admin")
  Invoke-CheckedCommand "npm.cmd" @("run", "verify:customer-service")
  Invoke-CheckedCommand "npm.cmd" @("run", "lint")
  Invoke-CheckedCommand "npm.cmd" @("run", "build")

  Invoke-CheckedCommand "git" (@("add") + $pathsToPublish)
  & git diff --cached --quiet
  if ($LASTEXITCODE -ne 0) {
    $date = Get-Date -Format "yyyy-MM-dd"
    Invoke-CheckedCommand "git" @("commit", "-m", "Add Noirven daily story product $date")
    Invoke-CheckedCommand "git" @("push", "origin", "main")
  } else {
    Write-WatchdogLog "No staged changes; skipping commit."
  }

  Invoke-CheckedCommand "npm.cmd" @("run", "deploy:prod:clean")
  Invoke-CheckedCommand "node" @("scripts/verify-production-launch.mjs", "--serial", $product.Serial, "--retries", "4", "--delay-ms", "5000")
  Write-WatchdogLog ("Publish repair completed for {0}." -f $product.Serial)
} catch {
  Write-WatchdogLog ("ERROR " + $_.Exception.Message)
  exit 1
}
