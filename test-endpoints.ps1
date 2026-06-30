$ErrorActionPreference = "Continue"

$botApiKey = "bot-ob8w17ku5jHwJPwF1eHkTtsCHcTjK7Px"
$personalApiKey = "qanything-huhasSe1B9QCNtUndEDmdZSAK9QkvHzM"

$body = '{"question":"你好","botId":"51C41F6775ED4364","source":1}'

$endpoints = @(
    "https://openapi.youdao.com/q_anything/api/chat",
    "https://openapi.youdao.com/q_anything/api/kb_chat",
    "https://openapi.youdao.com/q_anything/api/bot_chat",
    "https://openapi.youdao.com/q_anything/api/agent/chat",
    "https://openapi.youdao.com/q_anything/chat",
    "https://openapi.youdao.com/q_anything/api/chat_stream",
    "https://ai.youdao.com/saas/qanything/api/chat",
    "https://ai.youdao.com/qanything/api/chat"
)

foreach ($url in $endpoints) {
    Write-Host "`n=== Testing: $url ==="
    Write-Host "--- With bot apiKey ---"
    try {
        $headers = @{
            "Authorization" = $botApiKey
            "Content-Type"  = "application/json"
        }
        $r = Invoke-WebRequest -Uri $url -Method Post -Headers $headers -Body $body -UseBasicParsing -TimeoutSec 10
        Write-Host "Status: $($r.StatusCode)"
        Write-Host "Response: $($r.Content.Substring(0, [Math]::Min(500, $r.Content.Length)))"
    } catch {
        $status = ""
        if ($_.Exception.Response) {
            $status = [int]$_.Exception.Response.StatusCode
        }
        Write-Host "Error (HTTP $status): $($_.Exception.Message)"
    }

    Write-Host "--- With personal apiKey ---"
    try {
        $headers2 = @{
            "Authorization" = $personalApiKey
            "Content-Type"  = "application/json"
        }
        $r2 = Invoke-WebRequest -Uri $url -Method Post -Headers $headers2 -Body $body -UseBasicParsing -TimeoutSec 10
        Write-Host "Status: $($r2.StatusCode)"
        Write-Host "Response: $($r2.Content.Substring(0, [Math]::Min(500, $r2.Content.Length)))"
    } catch {
        $status2 = ""
        if ($_.Exception.Response) {
            $status2 = [int]$_.Exception.Response.StatusCode
        }
        Write-Host "Error (HTTP $status2): $($_.Exception.Message)"
    }
}