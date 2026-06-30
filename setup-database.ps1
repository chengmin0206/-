# 卡伴日记数据库初始化脚本
# Usage: ./setup-database.ps1 [mysql_password] [mysql_root_user]

param(
    [string]$Password = "123456",
    [string]$User = "root",
    [string]$Host = "localhost",
    [int]$Port = 3306
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  卡伴日记 - 数据库初始化脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 MySQL 是否运行
Write-Host "检查 MySQL 服务状态..." -ForegroundColor Yellow
try {
    $tcpConnection = New-Object System.Net.Sockets.TcpClient
    $tcpConnection.ConnectAsync($Host, $Port).Wait(3000)
    if ($tcpConnection.Connected) {
        Write-Host "✓ MySQL 正在运行于 ${Host}:${Port}" -ForegroundColor Green
        $tcpConnection.Close()
    } else {
        Write-Host "✗ MySQL 未响应，请检查服务是否启动" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ 无法连接到 MySQL: $_" -ForegroundColor Red
    exit 1
}

# 查找 mysql 客户端
Write-Host "查找 MySQL 客户端..." -ForegroundColor Yellow
$mysqlPaths = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\wamp64\bin\mysql\mysql8.0.xx\bin\mysql.exe"
)

$mysqlPath = $null
foreach ($path in $mysqlPaths) {
    if (Test-Path $path) {
        $mysqlPath = $path
        Write-Host "✓ 找到 MySQL: $path" -ForegroundColor Green
        break
    }
}

if (-not $mysqlPath) {
    Write-Host "✗ 未找到 MySQL 客户端，请手动安装或提供路径" -ForegroundColor Red
    Write-Host "尝试使用系统 PATH 中的 mysql..." -ForegroundColor Yellow
    $mysqlPath = "mysql"
}

# 测试数据库连接
Write-Host "测试数据库连接..." -ForegroundColor Yellow
$testCommand = & $mysqlPath -u$User -p$Password -e "SELECT 1" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 数据库连接失败！" -ForegroundColor Red
    Write-Host "错误信息: $testCommand" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因:" -ForegroundColor Yellow
    Write-Host "  1. MySQL 密码不正确" -ForegroundColor White
    Write-Host "  2. MySQL 用户名不正确" -ForegroundColor White
    Write-Host "  3. 需要修改 application.yml 中的数据库配置" -ForegroundColor White
    Write-Host ""
    Write-Host "解决方法:" -ForegroundColor Cyan
    Write-Host "  1. 使用正确的密码运行: ./setup-database.ps1 -Password '你的密码'" -ForegroundColor White
    Write-Host "  2. 或者修改 src/main/resources/application.yml 中的数据库配置" -ForegroundColor White
    exit 1
}
Write-Host "✓ 数据库连接成功" -ForegroundColor Green

# 获取脚本目录
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$schemaFile = Join-Path $scriptDir "src\main\resources\db\schema.sql"
$testUserFile = Join-Path $scriptDir "src\main\resources\db\add_test_user.sql"

# 检查 SQL 文件是否存在
Write-Host "检查 SQL 文件..." -ForegroundColor Yellow
if (-not (Test-Path $schemaFile)) {
    Write-Host "✗ 未找到 schema.sql 文件" -ForegroundColor Red
    exit 1
}
Write-Host "✓ schema.sql 存在" -ForegroundColor Green

# 执行数据库初始化
Write-Host "执行数据库初始化..." -ForegroundColor Yellow
& $mysqlPath -u$User -p$Password < $schemaFile 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 数据库初始化失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 数据库初始化完成" -ForegroundColor Green

# 执行测试用户数据
if (Test-Path $testUserFile) {
    Write-Host "添加测试用户数据..." -ForegroundColor Yellow
    & $mysqlPath -u$User -p$Password < $testUserFile 2>&1
    Write-Host "✓ 测试用户数据添加完成" -ForegroundColor Green
}

# 验证数据库和表
Write-Host "验证数据库..." -ForegroundColor Yellow
$checkResult = & $mysqlPath -u$User -p$Password -e "USE kaban_diary; SHOW TABLES;" 2>&1
$tableCount = ($checkResult | Measure-Object -Line).Lines - 1
Write-Host "✓ 数据库 kaban_diary 包含 $tableCount 张表" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  数据库初始化成功！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Cyan
Write-Host "  1. 重启后端服务器（如果正在运行）" -ForegroundColor White
Write-Host "  2. 刷新前端页面" -ForegroundColor White
Write-Host "  3. 使用测试账号登录: 13768247331 / 123456" -ForegroundColor White
Write-Host ""