$ErrorActionPreference = "Stop"

$headers = @{
    "Authorization" = "bot-ob8w17ku5jHwJPwF1eHkTtsCHcTjK7Px"
    "Content-Type"  = "application/json"
}

$body = @{
    question = "你好"
    botId    = "51C41F6775ED4364"
    source   = 1
} | ConvertTo-Json

Write-Host "=== Test 1: /chat with bot apiKey ==="
try {
    $r = Invoke-RestMethod -Uri "https://openapi.youdao.com/q_anything/api/chat" -Method Post -Headers $headers -Body $body
    $r | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $sr = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        Write-Host "Response: $($sr.ReadToEnd())"
    }
}

Write-Host ""
Write-Host "=== Test 2: /chat with personal apiKey ==="
$headers2 = @{
    "Authorization" = "qanything-huhasSe1B9QCNtUndEDmdZSAK9QkvHzM"
    "Content-Type"  = "application/json"
}
try {
    $r2 = Invoke-RestMethod -Uri "https://openapi.youdao.com/q_anything/api/chat" -Method Post -Headers $headers2 -Body $body
    $r2 | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $sr2 = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        Write-Host "Response: $($sr2.ReadToEnd())"
    }
}

Write-Host ""
Write-Host "=== Test 3: /chat_stream with bot apiKey ==="
try {
    $r3 = Invoke-WebRequest -Uri "https://openapi.youdao.com/q_anything/api/chat_stream" -Method Post -Headers $headers -Body $body
    Write-Host "Status: $($r3.StatusCode)"
    Write-Host "Content: $($r3.Content.Substring(0, [Math]::Min(500, $r3.Content.Length)))"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $sr3 = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        Write-Host "Response: $($sr3.ReadToEnd())"
    }
}