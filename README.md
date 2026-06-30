# 卡伴日记 - 后端API服务

基于 Spring Boot 3 + MyBatis Plus + MySQL 的健康管理后端服务。

## 技术栈

- **框架**: Spring Boot 3.2.0
- **数据库**: MySQL 8.0
- **ORM**: MyBatis Plus 3.5.5
- **认证**: JWT
- **实时通信**: WebSocket
- **工具**: Hutool

## 项目结构

```
kaban-diary/
├── src/main/java/com/kaban/kabandiary/
│   ├── common/          # 公共模块
│   │   ├── exception/   # 异常处理
│   │   └── result/      # 统一响应
│   ├── config/          # 配置类
│   ├── controller/      # 控制器层
│   ├── dto/             # 数据传输对象
│   ├── entity/          # 实体类
│   ├── mapper/          # 数据访问层
│   ├── service/         # 业务层
│   ├── util/            # 工具类
│   └── websocket/       # WebSocket处理器
├── src/main/resources/
│   ├── application.yml  # 配置文件
│   └── db/schema.sql    # 数据库初始化脚本
└── pom.xml              # Maven配置
```

## 快速开始

### 1. 环境要求

- JDK 17+
- Maven 3.6+
- MySQL 8.0+

### 2. 数据库初始化

```bash
# 连接MySQL
mysql -u root -p

# 执行初始化脚本
source src/main/resources/db/schema.sql
```

### 3. 修改配置

编辑 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/kaban_diary?...
    username: your_username
    password: your_password
```

### 4. 启动服务

```bash
mvn clean install
mvn spring-boot:run
```

服务将在 `http://localhost:8080/api` 启动。

## API文档

### 认证相关

#### 发送验证码
```
POST /api/auth/verify-code
参数: phone (手机号)
```

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "phone": "13800138000",
  "verifyCode": "123456",
  "loginType": 1
}

返回: { "code": 200, "message": "登录成功", "data": "jwt_token" }
```

### 用户相关

#### 获取用户信息
```
GET /api/user/info
Headers: Authorization: Bearer {token}
```

### 体重管理

#### 获取体重统计
```
GET /api/weight/stat
Headers: Authorization: Bearer {token}
```

#### 添加体重记录
```
POST /api/weight/record
Headers: Authorization: Bearer {token}

参数:
- weight: 体重(kg)
- bodyFatRate: 体脂率(可选)
- note: 备注(可选)
```

### 饮食管理

#### 获取今日饮食统计
```
GET /api/diet/stat
Headers: Authorization: Bearer {token}

返回: {
  "consumedCalories": 1248,
  "recommendedCalories": 2000,
  "carbohydrate": 128.5,
  "protein": 68.2,
  "fat": 45.3,
  ...
}
```

#### 添加饮食记录
```
POST /api/diet/record
Headers: Authorization: Bearer {token}
Content-Type: application/json

{
  "foodName": "鸡胸肉沙拉",
  "mealType": 1,
  "amount": 200,
  "calorie": 200,
  "protein": 30,
  "fat": 8,
  "carbohydrate": 10
}
```

#### AI识别食物
```
POST /api/diet/recognize
Content-Type: application/json

"image_url"

返回: ["鸡胸肉", "蔬菜", "沙拉酱"]
```

### 饮水管理

#### 添加饮水记录
```
POST /api/water/add
Headers: Authorization: Bearer {token}

参数: amount (ml)
```

#### 获取今日饮水信息
```
GET /api/water/today
Headers: Authorization: Bearer {token}

返回: {
  "todayIntake": 1500,
  "goal": 2000,
  "remaining": 500,
  "progress": 75
}
```

### 食谱相关

#### 获取热门食谱
```
GET /api/recipe/hot?limit=10
```

#### 获取AI智能食谱
```
GET /api/recipe/ai?limit=10
Headers: Authorization: Bearer {token}
```

#### 搜索食谱
```
GET /api/recipe/search?keyword=鸡胸肉
```

#### 收藏食谱
```
POST /api/recipe/collect/{recipeId}
Headers: Authorization: Bearer {token}
```

### WebSocket实时通信

#### 连接地址
```
ws://localhost:8080/api/ws/chat?token={jwt_token}
```

#### 消息格式

发送消息：
```json
{
  "content": "我想减肥"
}
```

接收消息：
```json
{
  "type": 2,
  "content": "关于减肥，我建议您...",
  "timestamp": 1234567890
}
```

消息类型：
- 1: 用户消息
- 2: AI助手消息

## 功能特性

### 1. 实时动态响应
- RESTful API 设计
- JWT 身份认证
- 统一响应格式
- 全局异常处理

### 2. 数据库设计
- 用户管理（手机/微信/QQ/访客登录）
- 体重记录（含BMI计算）
- 饮食记录（营养分析）
- 饮水管理
- 运动记录
- 食谱管理
- 聊天消息

### 3. 实时通信
- WebSocket 支持实时聊天
- 在线用户管理
- 消息持久化

### 4. 营养分析
- 热量计算
- 营养成分统计（碳水/蛋白质/脂肪）
- 饮水追踪
- 运动消耗计算

## 监控

### Druid 监控
```
地址: http://localhost:8080/api/druid
账号: admin
密码: admin123
```

## 开发建议

1. 使用 IDEA 开发工具
2. 启用 Lombok 插件
3. 配置好 Maven 仓库镜像
4. 使用 Postman 测试 API

## License

Copyright © 2026 卡伴日记