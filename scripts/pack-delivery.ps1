[CmdletBinding()]
param()
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$config = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $root 'delivery-package.json') | ConvertFrom-Json
if ($config.name -notmatch '^diana-[a-z0-9-]+-delivery-candidate$') { throw 'Invalid candidate package name.' }
$files = @{}
function Add-Input {
  param([string]$Source, [string]$Relative)
  if ($Relative -match '(^|/)(\.{1,2}|\.git|node_modules|state|logs|backups|evidence|probes|\.env)(/|$)' -or $Relative -match '[:\\]' -or $Relative -match '\.(exe|dll|asar|msix|bak|log)$') { throw "Forbidden package entry: $Relative" }
  $resolved = [IO.Path]::GetFullPath($Source)
  if (-not $resolved.StartsWith($root + '\', [StringComparison]::OrdinalIgnoreCase)) { throw 'Input outside repository.' }
  $item = Get-Item -Force -LiteralPath $resolved
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw 'Package links are not allowed.' }
  if ($item.PSIsContainer) {
    foreach ($child in Get-ChildItem -Force -LiteralPath $resolved) { Add-Input $child.FullName ($Relative.TrimEnd('/') + '/' + $child.Name) }
  } else {
    if ($item.Length -gt 10MB -or $files.ContainsKey($Relative)) { throw "Oversized or duplicate package entry: $Relative" }
    $files[$Relative] = $resolved
  }
}
foreach ($entry in $config.paths) {
  if ($entry -is [string]) { Add-Input (Join-Path $root $entry) $entry }
  else { Add-Input (Join-Path $root $entry.source) $entry.target }
}
$dist = Join-Path $root 'dist'
New-Item -ItemType Directory -Path $dist -Force | Out-Null
$output = Join-Path $dist ($config.name + '-' + [DateTime]::UtcNow.ToString('yyyyMMddTHHmmssfff') + '.zip')
$stream = [IO.File]::Open($output,[IO.FileMode]::CreateNew)
$archive = New-Object IO.Compression.ZipArchive($stream,[IO.Compression.ZipArchiveMode]::Create)
try {
  foreach ($relative in ($files.Keys | Sort-Object)) {
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive,$files[$relative],$relative,[IO.Compression.CompressionLevel]::Optimal) | Out-Null
  }
} finally { $archive.Dispose(); $stream.Dispose() }
$sha = [Security.Cryptography.SHA256]::Create()
$check = [IO.Compression.ZipFile]::OpenRead($output)
try {
  if ($check.Entries.Count -ne $files.Count) { throw 'Candidate inventory mismatch.' }
  foreach ($entry in $check.Entries) {
    $content = $entry.Open()
    try { $actual = [Convert]::ToBase64String($sha.ComputeHash($content)) } finally { $content.Dispose() }
    $expected = [Convert]::ToBase64String($sha.ComputeHash([IO.File]::ReadAllBytes($files[$entry.FullName])))
    if ($actual -ne $expected) { throw "Archive verification failed: $($entry.FullName)" }
  }
} finally { $check.Dispose() }
$digest = ([BitConverter]::ToString($sha.ComputeHash([IO.File]::ReadAllBytes($output)))).Replace('-','').ToLowerInvariant()
$sha.Dispose()
[IO.File]::WriteAllText($output + '.sha256', $digest + '  ' + [IO.Path]::GetFileName($output) + [Environment]::NewLine, [Text.UTF8Encoding]::new($false))
[pscustomobject]@{status='candidate_only';file=$output;entries=$files.Count;bytes=(Get-Item -LiteralPath $output).Length;sha256=$digest;nativeAccepted=$false;published=$false} | ConvertTo-Json
