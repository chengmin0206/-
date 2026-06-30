Add-Type -AssemblyName System.Drawing

$basePath = 'C:\Users\HUAWEI\Desktop\KBRJ\kaban-diary\ui页面设计素材'

$pngFiles = Get-ChildItem -Path $basePath -Filter '*.png' -Recurse | Sort-Object FullName

foreach ($file in $pngFiles) {
    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        $bmp = New-Object System.Drawing.Bitmap($img)
        $w = $img.Width
        $h = $img.Height
        $relPath = $file.FullName.Replace($basePath, '')
        Write-Output "=== $relPath ($w x $h) ==="
        
        Write-Output "  VSCAN:"
        for ($ypct = 0; $ypct -le 100; $ypct += 10) {
            $x = [int]($w * 0.5)
            $y = [int]($h * $ypct / 100)
            if ($x -ge $w) { $x = $w - 1 }
            if ($y -ge $h) { $y = $h - 1 }
            $pixel = $bmp.GetPixel($x, $y)
            $hex = $pixel.R.ToString("X2") + $pixel.G.ToString("X2") + $pixel.B.ToString("X2")
            Write-Output "    ${ypct}:$hex"
        }

        Write-Output "  HSCAN:"
        for ($xpct = 0; $xpct -le 100; $xpct += 10) {
            $x = [int]($w * $xpct / 100)
            $y = [int]($h * 0.5)
            if ($x -ge $w) { $x = $w - 1 }
            if ($y -ge $h) { $y = $h - 1 }
            $pixel = $bmp.GetPixel($x, $y)
            $hex = $pixel.R.ToString("X2") + $pixel.G.ToString("X2") + $pixel.B.ToString("X2")
            Write-Output "    ${xpct}:$hex"
        }
        
        $bmp.Dispose()
        $img.Dispose()
    } catch {
        Write-Output "  ERROR: $($_.Exception.Message)"
    }
}

$svgFiles = Get-ChildItem -Path $basePath -Filter '*.svg' -Recurse | Sort-Object FullName
foreach ($file in $svgFiles) {
    $relPath = $file.FullName.Replace($basePath, '')
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        $colors = [regex]::Matches($content, '#[0-9a-fA-F]{6}') | ForEach-Object { $_.Value } | Select-Object -Unique
        Write-Output "=== SVG: $relPath ==="
        Write-Output "  COLORS: $($colors -join ', ')"
    }
}