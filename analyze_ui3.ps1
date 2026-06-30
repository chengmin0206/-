Add-Type -AssemblyName System.Drawing
$basePath = 'C:\Users\HUAWEI\Desktop\KBRJ\kaban-diary\ui页面设计素材'
$outPath = 'C:\Users\HUAWEI\Desktop\KBRJ\kaban-diary\ui_analysis.txt'

$sb = [System.Text.StringBuilder]::new()

$pngFiles = Get-ChildItem -Path $basePath -Filter '*.png' -Recurse | Sort-Object FullName

foreach ($file in $pngFiles) {
    try {
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        $bmp = New-Object System.Drawing.Bitmap($img)
        $w = $img.Width
        $h = $img.Height
        $name = $file.Name
        [void]$sb.AppendLine("=== $name ($w x $h) ===")
        
        for ($ypct = 0; $ypct -le 100; $ypct += 20) {
            $x = [int]($w * 0.5)
            $y = [int]($h * $ypct / 100)
            if ($x -ge $w) { $x = $w - 1 }
            if ($y -ge $h) { $y = $h - 1 }
            $pixel = $bmp.GetPixel($x, $y)
            $hex = $pixel.R.ToString("X2") + $pixel.G.ToString("X2") + $pixel.B.ToString("X2")
            [void]$sb.AppendLine("  ${ypct}:$hex")
        }
        
        $bmp.Dispose()
        $img.Dispose()
    } catch {
        [void]$sb.AppendLine("=== $($file.Name) ERROR ===")
    }
}

$svgFiles = Get-ChildItem -Path $basePath -Filter '*.svg' -Recurse | Sort-Object FullName
foreach ($file in $svgFiles) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        $colors = [regex]::Matches($content, '#[0-9a-fA-F]{6}') | ForEach-Object { $_.Value } | Select-Object -Unique
        [void]$sb.AppendLine("=== SVG: $($file.Name) ===")
        [void]$sb.AppendLine("  COLORS: $($colors -join ', ')")
    }
}

$sb.ToString() | Out-File -FilePath $outPath -Encoding utf8
Write-Output "Done. Output saved to $outPath"