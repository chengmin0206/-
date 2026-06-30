@echo off
chcp 65001 >nul
echo ========================================
echo   卡伴日记 - Database Setup
echo ========================================
echo.

REM Find MySQL client
set MYSQL_CMD=
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" set MYSQL_CMD="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if exist "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe" set MYSQL_CMD="C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe"
if exist "C:\xampp\mysql\bin\mysql.exe" set MYSQL_CMD="C:\xampp\mysql\bin\mysql.exe"

if "%MYSQL_CMD%"=="" (
    echo ERROR: MySQL client not found!
    echo Please install MySQL or provide the correct path.
    echo.
    echo Common locations:
    echo   - C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
    echo   - C:\xampp\mysql\bin\mysql.exe
    echo.
    pause
    exit /b 1
)

echo Found MySQL client
echo.

REM Get MySQL password if not provided
set MYSQL_PWD=123456
set MYSQL_USER=root

echo Using MySQL user: %MYSQL_USER%
echo Using MySQL password: [hidden]
echo.

REM Test connection
echo Testing MySQL connection...
%MYSQL_CMD% -u%MYSQL_USER% -p%MYSQL_PWD% -e "SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo ERROR: MySQL connection failed!
    echo.
    echo Possible reasons:
    echo   1. Incorrect password
    echo   2. MySQL not running
    echo   3. Wrong username
    echo.
    echo Please check your MySQL credentials in application.yml
    echo.
    pause
    exit /b 1
)

echo Connection successful!
echo.

REM Execute schema
echo Creating database and tables...
%MYSQL_CMD% -u%MYSQL_USER% -p%MYSQL_PWD% < "%~dp0src\main\resources\db\schema.sql"
if errorlevel 1 (
    echo ERROR: Schema creation failed!
    pause
    exit /b 1
)

echo Schema created successfully!
echo.

REM Execute test user
echo Adding test user...
%MYSQL_CMD% -u%MYSQL_USER% -p%MYSQL_PWD% < "%~dp0src\main\resources\db\add_test_user.sql"
echo Test user added!
echo.

echo ========================================
echo   Database Setup Complete!
echo ========================================
echo.
echo Test account: 13768247331 / 123456
echo.
echo Please restart the backend server.
echo.
pause