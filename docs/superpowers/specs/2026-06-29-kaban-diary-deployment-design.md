# 卡伴日记 Cloudflare + Render 部署设计文档

**日期**: 2026-06-29
**项目**: 卡伴日记 (Kaban Diary)
**部署方案**: 方案A - Cloudflare Pages + Render + PostgreSQL

## 1. 整体架构

### 1.1 架构图
```
用户浏览器 → Cloudflare Pages (前端静态文件)
                    ↓
            API调用 → Render Web Service (Spring Boot后端)
                    ↓
            Render PostgreSQL (数据库)
```

### 1.2 技术栈
- **前端**: 静态HTML/CSS/JavaScript
- **后端**: Spring Boot 2.7.18
- **数据库**: PostgreSQL (从MySQL迁移)
- **部署平台**:
  - 前端: Cloudflare Pages
  - 后端: Render免费版
- **认证**: JWT (保持现有实现)

## 2. 前端部署设计

### 2.1 Cloudflare Pages配置
- **构建方式**: 直接上传静态文件
- **源目录**: `frontend/`
- **环境变量**:
  - `API_BASE_URL`: 指向Render后端地址（例如：`https://kabandiary-backend.onrender.com`）
  - `CF_PAGES_URL`: Cloudflare自动提供的Pages域名（例如：`https://kabandiary.pages.dev`）

### 2.2 API调用修改
需要修改`frontend/api.js`中的API地址配置：
```javascript
const API_BASE_URL = process.env.CF_PAGES_URL
    ? 'https://kabandiary-backend.onrender.com'  // 部署环境
    : 'http://localhost:8080';                   // 开发环境
```

### 2.3 文件结构
```
frontend/
├── login.html          # 登录页面
├── main.html           # 主应用页面
├── api.js              # API调用配置
├── app.js              # 主应用逻辑
├── styles.css          # 样式文件
├── server.js           # 本地开发服务器
└── ui页面设计素材/      # UI资源
```

## 3. 后端部署设计

### 3.1 Render配置
- **构建命令**: `mvn clean install`
- **启动命令**: `java -jar target/kaban-diary-1.0.0.jar`
- **运行时**: Java 8
- **端口**: 8080 (Render自动分配)

### 3.2 环境变量
需要在Render设置以下环境变量：
```
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=kaban-diary-secret-key-production
PORT=8080
```

### 3.3 健康检查
需要添加健康检查端点以确保服务正常运行：
```java
@GetMapping("/health")
public ResponseEntity<String> health() {
    return ResponseEntity.ok("OK");
}
```

## 4. 数据库迁移设计

### 4.1 MySQL → PostgreSQL 主要差异

| MySQL | PostgreSQL | 说明 |
|-------|-----------|------|
| INT AUTO_INCREMENT | SERIAL | 自增主键 |
| TINYINT | SMALLINT | 小整数类型 |
| DATETIME | TIMESTAMP | 日期时间 |
| TEXT | TEXT | 保持不变 |
| VARCHAR(n) | VARCHAR(n) | 保持不变 |

### 4.2 SQL修改示例

**MySQL语法:**
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**PostgreSQL语法:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 pom.xml修改
需要更换数据库驱动：
```xml
<!-- 移除MySQL驱动 -->
<!-- <dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency> -->

<!-- 添加PostgreSQL驱动 -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 4.4 application.yml修改
```yaml
spring:
  datasource:
    driver-class-name: org.postgresql.Driver
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/kaban_diary}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:password}
```

## 5. 认证与安全设计

### 5.1 JWT配置
- 保持现有JWT实现
- 生产环境使用更强的密钥
- 密钥通过Render环境变量存储

### 5.2 安全措施
- Render自动HTTPS证书
- API端点保持JWT验证
- 数据库连接使用环境变量
- 敏感信息不暴露在前端代码中
- CORS配置允许Cloudflare Pages域名

### 5.3 CORS配置
需要添加CORS配置允许Cloudflare Pages访问：
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("https://kabandiary.pages.dev");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

## 6. WebSocket实时通信设计

### 6.1 挑战
Render免费版可能休眠，影响WebSocket长连接稳定性。

### 6.2 解决方案

**后端优化:**
```java
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatHandler(), "/ws/chat")
                .setAllowedOrigins("https://your-project.pages.dev");
    }
}
```

**前端重连机制:**
```javascript
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

function connectWithRetry() {
    const ws = new WebSocket(wsUrl);

    ws.onclose = () => {
        if (reconnectAttempts < maxReconnectAttempts) {
            setTimeout(() => {
                reconnectAttempts++;
                connectWithRetry();
            }, 3000);
        }
    };

    ws.onopen = () => {
        reconnectAttempts = 0; // 重置计数
    };
}
```

**用户提示:**
- 连接断开时显示"服务暂时离线"提示
- 提供手动重连按钮
- 显示服务状态指示器

## 7. 部署流程设计

### 7.1 准备阶段
1. 注册Cloudflare账户
2. 注册Render账户
3. 确保项目已推送到GitHub

### 7.2 数据库迁移
1. 修改`pom.xml`更换数据库驱动
2. 修改`application.yml`配置
3. 适配SQL语法（AUTO_INCREMENT → SERIAL）
4. 本地测试PostgreSQL连接

### 7.3 Render后端部署
1. 在Render创建新Web Service
2. 连接GitHub仓库
3. 配置构建和启动命令
4. 设置环境变量
5. 连接PostgreSQL数据库
6. 等待部署完成并测试

### 7.4 Cloudflare Pages前端部署
1. 在Cloudflare创建新Pages项目
2. 连接GitHub仓库
3. 配置构建设置（静态文件直接上传）
4. 设置环境变量
5. 部署完成并测试

### 7.5 集成测试
1. 前端页面可访问
2. API调用正常
3. 用户注册登录
4. 核心功能测试
5. WebSocket连接测试

### 7.6 DNS配置（可选）
- 配置自定义域名指向Cloudflare Pages
- 设置SSL证书

## 8. 成本分析

### 8.1 月度成本
- **Render Web Service (免费版)**: $0
- **Render PostgreSQL (免费版)**: $0
- **Cloudflare Pages**: $0
- **总计**: $0/月

### 8.2 免费额度限制

**Render免费版:**
- Web Service: 750小时/月
- PostgreSQL: 90天内存数据保留
- 带宽: 100GB/月

**Cloudflare Pages:**
- 构建时间: 500分钟/月
- 带宽: 无限制
- 请求: 100,000/天

## 9. 维护策略

### 9.1 自动化
- Git推送自动触发部署
- Render自动重启失败的服务
- Cloudflare Pages自动构建和部署

### 9.2 监控
- 监控Render仪表盘查看服务状态
- 定期检查免费额度使用情况
- 监控数据库存储使用（1GB限制）

### 9.3 备份
- Render PostgreSQL自动备份（保留7天）
- GitHub代码版本控制
- 定期导出重要数据

### 9.4 更新
- 代码更新通过Git提交和推送
- 依赖更新通过Maven版本管理
- 配置更新通过环境变量

## 10. 潜在风险与解决方案

### 10.1 Render休眠问题
**风险**: 15分钟无访问后服务休眠，首次访问冷启动30秒

**解决方案**:
- 前端添加加载状态提示
- 设置定时请求保持服务活跃
- 明确告知用户可能的延迟

### 10.2 数据库存储限制
**风险**: PostgreSQL免费版仅1GB存储

**解决方案**:
- 监控存储使用情况
- 定期清理历史数据
- 设置数据保留策略
- 必要时升级付费计划

### 10.3 WebSocket连接稳定性
**风险**: 服务休眠影响长连接

**解决方案**:
- 前端实现自动重连机制
- 显示连接状态指示器
- 提供手动重连功能
- 优化心跳机制

### 10.4 Cloudflare请求限制
**风险**: 免费版100,000请求/天限制

**解决方案**:
- 监控每日请求量
- 优化API调用频率
- 实现客户端缓存
- 必要时升级计划

### 10.5 数据库连接池
**风险**: Render环境可能限制连接数

**解决方案**:
- 调整HikariCP连接池配置
- 减少最大连接数
- 设置合理的超时时间

## 11. 成功标准

### 11.1 部署成功标准
- ✅ 前端可通过Cloudflare Pages域名访问
- ✅ 后端API正常响应（包括健康检查）
- ✅ 用户注册登录功能正常
- ✅ 核心功能（体重、饮食、饮水）可用
- ✅ WebSocket聊天功能基本可用
- ✅ 文件上传功能正常

### 11.2 性能标准
- ✅ 页面首屏加载 < 3秒
- ✅ API响应时间 < 2秒
- ✅ WebSocket连接成功率 > 90%

### 11.3 稳定性标准
- ✅ 服务可用性 > 95%（考虑休眠影响）
- ✅ 数据持久化正常
- ✅ 错误处理和提示完善

## 12. 技术债务与未来优化

### 12.1 当前技术债务
- 前端Node.js开发服务器不适合生产环境
- 端口冲突（前后端都使用8080）
- 缺乏完善的错误处理和日志
- 数据库迁移可能存在兼容性问题

### 12.2 未来优化方向
- 前端迁移到现代框架（Vue/React）
- 实现前后端完全分离
- 添加全面的监控和告警
- 优化数据库查询性能
- 实现自动备份和恢复机制
- 考虑升级到付费计划获得更好稳定性

## 13. 附录

### 13.1 环境变量清单
```
# Render环境变量
DATABASE_URL=postgresql://user:password@host:5432/database  # Render自动提供
JWT_SECRET=kaban-diary-prod-secret-key-2026-very-secure      # 需要生成强密钥
PORT=8080

# Cloudflare Pages环境变量
API_BASE_URL=https://kabandiary-backend.onrender.com        # Render应用域名
```

### 13.2 重要URL和域名
- Render后端: `https://kaban-diary.onrender.com`
- Cloudflare Pages: `https://kaban-diary.pages.dev`
- 健康检查: `https://kaban-diary.onrender.com/health`

### 13.3 故障排查指南
1. **服务无法启动**: 检查Render日志，确认环境变量配置正确
2. **数据库连接失败**: 验证DATABASE_URL格式和权限
3. **API调用失败**: 检查CORS配置和前端API地址
4. **WebSocket断开**: 查看Render服务状态，考虑休眠问题

---

**文档版本**: v1.0
**最后更新**: 2026-06-29
**负责人**: 项目开发团队