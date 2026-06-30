Add-Type -AssemblyName System.Drawing
$basePath = 'C:\Users\HUAWEI\Desktop\KBRJ\kaban-diary\ui页面设计素材'
$outPath = 'C:\Users\HUAWEI\Desktop\KBRJ\kaban-diary\ui_analysis.txt'

$lines = @()

$pngFiles = Get-ChildItem -Path $basePath -Filter '*.png' -Recurse | Sort-Object FullName

foreach ($file in $pngFiles) {
    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        $bmp = New-Object System.Drawing.Bitmap($img)
        $w = $img.Width
        $h = $img.Height
        $name = $file.Name
        $lines += "=== $name ($w x $h) ==="
        
        for ($ypct = 0; $ypct -le 100; $ypct += 20) {
            $x = [int]($w * 0.5)
            $y = [int]($h * $ypct / 100)
            if ($x -ge $w) { $x = $w - 1 }
            if ($y -ge $h) { $y = $h - 1 }
            $pixel = $bmp.GetPixel($x, $y)
            $hex = $pixel.R.ToString("X2") + $pixel.G.ToString("X2") + $pixel.B.ToString("X2")
            $lines += "  ${ypct}:$hex"
        }
        
        $bmp.Dispose()
        $img.Dispose()
    } catch {
        $lines += "=== $($file.Name) ERROR ==="
    }
}

$svgFiles = Get-ChildItem -Path $basePath -Filter '*.svg' -Recurse | Sort-Object FullName
foreach ($file in $svgFiles) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName)
        $colorMatches = [regex]::Matches($content, '#[0-9a-fA-F]{6}')
        $colors = @()
        foreach ($m in $colorMatches) {
            $colors += $m.Value
        }
        $uniqueColors = $colors | Select-Object -Unique
        $lines += "=== SVG: $($file.Name) ==="
        $lines += "  COLORS: $($uniqueColors -join ', ')"
    } catch {}
}

[System.IO.File]::WriteAllLines($outPath, $lines, [System.Text.Encoding]::UTF8)