Add-Type -AssemblyName System.Drawing

$projectDir = 'C:\Users\HUAWEI\Desktop\KBRJ\kaban-diary'
$subDirs = Get-ChildItem -Path $projectDir -Directory
$basePath = $null

foreach ($d in $subDirs) {
    $jpgCount = (Get-ChildItem -Path $d.FullName -Filter '*.jpg' -ErrorAction SilentlyContinue).Count
    if ($jpgCount -gt 5) {
        $basePath = $d.FullName
        break
    }
}

$jpgFiles = Get-ChildItem -Path $basePath -Filter '*.jpg' | Sort-Object Name

foreach ($file in $jpgFiles) {
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    $bmp = New-Object System.Drawing.Bitmap($img)
    $w = $img.Width
    $h = $img.Height
    $name = $file.Name
    Write-Output "=== $name ($w x $h) ==="
    
    Write-Output "  VSCAN-CENTER:"
    for ($ypct = 0; $ypct -le 100; $ypct += 5) {
        $x = [int]($w * 0.5)
        $y = [int]($h * $ypct / 100)
        if ($x -ge $w) { $x = $w - 1 }
        if ($y -ge $h) { $y = $h - 1 }
        $pixel = $bmp.GetPixel($x, $y)
        $hex = $pixel.R.ToString("X2") + $pixel.G.ToString("X2") + $pixel.B.ToString("X2")
        Write-Output "    ${ypct}:$hex"
    }

    Write-Output "  VSCAN-LEFT:"
    for ($ypct = 0; $ypct -le 100; $ypct += 5) {
        $x = [int]($w * 0.1)
        $y = [int]($h * $ypct / 100)
        if ($x -ge $w) { $x = $w - 1 }
        if ($y -ge $h) { $y = $h - 1 }
        $pixel = $bmp.GetPixel($x, $y)
        $hex = $pixel.R.ToString("X2") + $pixel.G.ToString("X2") + $pixel.B.ToString("X2")
        Write-Output "    ${ypct}:$hex"
    }

    Write-Output "  CORNERS:"
    $corners = @(@(5,5), @($w-6,5), @(5,$h-6), @($w-6,$h-6))
    foreach ($c in $corners) {
        $pixel = $bmp.GetPixel($c[0], $c[1])
        $hex = $pixel.R.ToString("X2") + $pixel.G.ToString("X2") + $pixel.B.ToString("X2")
        Write-Output "    ($($c[0]),$($c[1])):$hex"
    }
    
    $bmp.Dispose()
    $img.Dispose()
}