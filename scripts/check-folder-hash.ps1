param (
  [Parameter(Mandatory = $true)][string]$FolderPath
)

$HashString = (Get-ChildItem $FolderPath -Recurse | Get-FileHash -Algorithm SHA256).Hash | Out-String

Get-FileHash -InputStream ([IO.MemoryStream]::new([char[]]$HashString))
