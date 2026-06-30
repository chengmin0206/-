Add-Type -AssemblyName System.Drawing
$basePath = 'C:\Users\HUAWEI\Desktop\KBRJ\kaban-diary\ui页面设计素材'

$keyFiles = @(
    'AI人物背景图\1.png',
    'AI人物背景图\2.png',
    'AI人物背景图\3.png',
    'AI人物背景图\4.png',
    'AI选择页\AI人物标题栏.png',
    'AI选择页\AI人物装饰.png',
    'AI选择页\图标.png',
    'AI选择页\彩虹装饰.png',
    'AI选择页\热度.png',
    'AI选择页\跃仔.png',
    'AI选择页\飒飒.png',
    'AI选择页\麦小星.png',
    'AI聊天页面\聊天头像.png',
    'AI聊天页面\AI聊天页面早餐图标.png',
    '体重记录页\体重指数图.png',
    '饮食记录页\饮食记录图标.png',
    '详细食谱页\食谱页面展示图标.png',
    '食谱页\菜谱装饰.png',
    '导航栏\底部中间图标（廖米）.png'
)

foreach ($rel in $keyFiles) {
    $fullPath = Join-Path $basePath $rel
    if (Test-Path $fullPath) {
        try {
            $img = [System.Drawing.Image]::FromFile($fullPath)
            $bmp = New-Object System.Drawing.Bitmap($img)
            $w = $img.Width
            $h = $img.Height
            Write-Output "=== $rel ($w x $h) ==="
            for ($ypct = 0; $ypct -le 100; $ypct += 20) {
                $x = [int]($w * 0.5)
                $y = [int]($h * $ypct / 100)
                if ($x -ge $w) { $x = $w - 1 }
                if ($y -ge $h) { $y = $h - 1 }
                $pixel = $bmp.GetPixel($x, $y)
                $hex = $pixel.R.ToString("X2") + $pixel.G.ToString("X2") + $pixel.B.ToString("X2")
                Write-Output "  ${ypct}:$hex"
            }
            $bmp.Dispose()
            $img.Dispose()
        } catch {
            Write-Output "=== $rel ERROR ==="
        }
    }
}