param (
  [Parameter(Mandatory = $true)][string]$FolderPath
)

$HashString = (Get-ChildItem $FolderPath -Recurse -Attributes !Directory | Get-FileHash -Algorithm SHA256).Hash | Out-String

$CompoundHash = (Get-FileHash -InputStream ([IO.MemoryStream]::new([char[]]$HashString))).Hash

Write-Output $CompoundHash
