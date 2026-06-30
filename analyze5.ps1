Add-Type -AssemblyName System.Drawing
$bp = 'C:\Users\HUAWEI\Desktop\KBRJ\kaban-diary\ui页面设计素材'
$op = 'C:\Users\HUAWEI\Desktop\KBRJ\kaban-diary\ui_out.txt'
$r = [System.Collections.ArrayList]::new()

$pf = Get-ChildItem -Path $bp -Filter '*.png' -Recurse | Sort-Object FullName
foreach ($f in $pf) {
    try {
        $i = [System.Drawing.Image]::FromFile($f.FullName)
        $b = New-Object System.Drawing.Bitmap($i)
        $n = $f.Name
        $w = $i.Width
        $h = $i.Height
        [void]$r.Add("$n ${w}x${h}")
        for ($p = 0; $p -le 100; $p += 25) {
            $x = [int]($w * 0.5)
            $y = [int]($h * $p / 100)
            if ($x -ge $w) { $x = $w - 1 }
            if ($y -ge $h) { $y = $h - 1 }
            $c = $b.GetPixel($x, $y)
            $hx = $c.R.ToString("X2") + $c.G.ToString("X2") + $c.B.ToString("X2")
            [void]$r.Add("  ${p}:$hx")
        }
        $b.Dispose()
        $i.Dispose()
    } catch {
        [void]$r.Add("$($f.Name) ERR")
    }
}

$sf = Get-ChildItem -Path $bp -Filter '*.svg' -Recurse | Sort-Object FullName
foreach ($f in $sf) {
    try {
        $t = [System.IO.File]::ReadAllText($f.FullName)
        $ms = [regex]::Matches($t, '#[0-9a-fA-F]{6}')
        $cs = @()
        foreach ($m in $ms) { $cs += $m.Value }
        $uc = $cs | Select-Object -Unique
        [void]$r.Add("SVG:$($f.Name) COLORS:$($uc -join ',')")
    } catch {}
}

[System.IO.File]::WriteAllLines($op, $r, [System.Text.Encoding]::ASCII)