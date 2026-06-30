# 卡伴日记 - 连接问题修复指南

## 问题诊断

根据系统调试，发现以下三个问题的根本原因是：

1. **AI助手无法连接** 
2. **发送对话显示连接已断开**
3. **登录之后各数据无法显示**

### 根本原因

MySQL 数据库 `kaban_diary` 未正确初始化，导致：
- 后端 API 请求失败（无法查询用户数据）
- WebSocket 连接关闭（无法验证用户）

**当前状态：**
- ✓ 后端服务器正在运行（端口 8080）
- ✓ MySQL 服务正在运行（端口 3306）
- ✗ 数据库连接失败（数据库不存在或凭据不匹配）

---

## 解决方案

### 方法 1：使用提供的初始化脚本（推荐）

1. **找到您的 MySQL 安装路径**

   常见位置：
   ```
   C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
   C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe
   C:\xampp\mysql\bin\mysql.exe
   C:\ProgramData\MySQL\MySQL Server 8.0\bin\mysql.exe
   ```

2. **运行初始化脚本**

   在命令提示符（CMD）中运行：
   ```cmd
   cd C:\Users\HUAWEI\Desktop\KBRJ\kaban-diary
   setup-database.bat
   ```

   如果脚本提示密码错误，请：
   - 使用正确的密码运行：
     ```cmd
     setup-database.bat [密码]
     ```
   - 或者修改 `src/main/resources/application.yml` 中的数据库密码

3. **重启后端服务器**

---

### 方法 2：手动创建数据库（使用 MySQL 客户端）

1. **打开 MySQL 客户端**
   - 使用 MySQL Workbench
   - 使用 phpMyAdmin（如使用 XAMPP）
   - 使用命令行

2. **创建数据库并执行 SQL**

   在 MySQL 客户端中执行以下命令：

   ```sql
   CREATE DATABASE IF NOT EXISTS kaban_diary DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE kaban_diary;
   ```

3. **导入数据库结构**

   在 MySQL 客户端中导入 `src/main/resources/db/schema.sql` 文件

4. **添加测试用户**

   在 MySQL 客户端中执行：
   ```sql
   INSERT INTO `user` (`phone`, `nickname`, `signature`, `login_type`, `status`)
   VALUES ('13768247331', '测试用户', '每天进步一点点', 1, 1);

   -- 获取刚插入的用户ID
   SET @user_id = LAST_INSERT_ID();

   -- 创建用户资料
   INSERT INTO `user_profile` (`user_id`, `height`, `weight`, `body_fat_rate`, `target_weight`, `daily_calorie_goal`, `daily_water_goal`, `gender`, `activity_level`)
   VALUES (@user_id, 170.0, 65.5, 18.5, 60.0, 2000, 2000, 2, 2);
   ```

---

### 方法 3：如果 MySQL 密码不是 123456

1. **查找或重置 MySQL 密码**

   方法 A：查看配置文件
   - 检查 MySQL 配置文件中的密码设置

   方法 B：重置密码（仅限开发环境）
   ```cmd
   # 停止 MySQL 服务
   net stop MySQL80

   # 以安全模式启动 MySQL
   mysqld --skip-grant-tables

   # 在另一个命令行中连接并重置密码
   mysql -u root
   ```
   ```sql
   USE mysql;
   UPDATE user SET authentication_string = PASSWORD('123456') WHERE User = 'root';
   FLUSH PRIVILEGES;
   EXIT;
   ```

2. **更新应用配置**

   编辑 `src/main/resources/application.yml`，将密码改为您的实际密码：
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/kaban_diary?...
       username: root
       password: YOUR_PASSWORD  # 改为实际密码
   ```

3. **重启后端应用**

---

## 验证修复

完成上述步骤后：

1. **重启后端服务器**

2. **打开浏览器**，访问：
   ```
   http://localhost:8080/login.html
   ```

3. **使用测试账号登录**
   - 手机号：`13768247331`
   - 验证码：`123456`（或使用密码登录，密码：`123456`）

4. **测试功能**
   - 检查饮食数据是否显示
   - 检查体重数据是否显示
   - 点击"助手"标签，尝试发送消息

---

## 常见问题

### Q: 提示 "Access denied for user 'root'@'localhost'"
**A:** MySQL 密码不正确，请使用方法 3 更新密码或修改 application.yml

### Q: 提示 "Unknown database 'kaban_diary'"
**A:** 数据库未创建，请运行方法 2 中的 SQL 命令

### Q: WebSocket 连接后立即断开
**A:** 这是数据库问题的症状，请先解决数据库连接问题

### Q: 找不到 mysql.exe
**A:** 请确认 MySQL 已正确安装，或者在 XAMPP 环境下使用 XAMPP 的 MySQL

---

## 技术说明

### 为什么数据库问题导致这些症状？

1. **数据不显示**：所有 API 端点都查询数据库，连接失败导致返回错误

2. **WebSocket 断开**：
   - [ChatWebSocketHandler.java:52-66](src/main/java/com/kaban/kabandiary/websocket/ChatWebSocketHandler.java)
   - WebSocket 握手时验证 Token
   - 如果数据库不可用，用户查找失败，连接被关闭

3. **登录后问题**：登录可能成功（使用默认验证码），但后续功能需要数据库

---

## 快速命令参考

```cmd
# 检查 MySQL 是否运行
netstat -an | findstr 3306

# 重启 MySQL 服务（如使用 XAMPP）
# 或
net stop MySQL80
net start MySQL80

# 使用 MySQL 命令行（需要正确路径）
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

---

## 联系支持

如果以上方法都无法解决问题，请提供：
1. 后端控制台的错误日志
2. 浏览器开发者工具（F12）中的网络请求错误
3. MySQL 服务状态和版本信息