$ErrorActionPreference = "Stop"

$tests = @(
    @{name="bot key (with bot- prefix)"; key="bot-1fnEZAEtHhUrjH7RN6LDOvOosy8Zv3KZ"; kbids=@("EB94CDDDB3724152")},
    @{name="bot key (no prefix)"; key="1fnEZAEtHhUrjH7RN6LDOvOosy8Zv3KZ"; kbids=@("EB94CDDDB3724152")},
    @{name="personal key + kbids[botId]"; key="qanything-huhasSe1B9QCNtUndEDmdZSAK9QkvHzM"; kbids=@("EB94CDDDB3724152")},
    @{name="personal key + kbids[kbId]"; key="qanything-huhasSe1B9QCNtUndEDmdZSAK9QkvHzM"; kbids=@("KB9bf98ed989a64efcb7280c3f058a157e_240430")},
    @{name="bot key (no prefix) + NO kbids"; key="1fnEZAEtHhUrjH7RN6LDOvOosy8Zv3KZ"; kbids=@()},
    @{name="bot key (no prefix) + kbids[kbId]"; key="1fnEZAEtHhUrjH7RN6LDOvOosy8Zv3KZ"; kbids=@("KB9bf98ed989a64efcb7280c3f058a157e_240430")}
)

foreach ($t in $tests) {
    Write-Host "=== Test: $($t.name) ==="
    $body = @{question="hello"; kbids=$t.kbids; history=@()} | ConvertTo-Json -Compress
    $headers = @{"Authorization"=$t.key}
    try {
        $r = Invoke-WebRequest -Uri "https://openapi.youdao.com/q_anything/api/bot/chat_stream" -Method POST -Headers $headers -Body $body -ContentType "application/json" -UseBasicParsing
        Write-Host "STATUS: $($r.StatusCode)"
        Write-Host "BODY: $($r.Content.Substring(0, [Math]::Min(300, $r.Content.Length)))"
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $respBody = $reader.ReadToEnd()
        Write-Host "STATUS: $status"
        Write-Host "BODY: $($respBody.Substring(0, [Math]::Min(300, $respBody.Length)))"
    }
    Write-Host ""
}