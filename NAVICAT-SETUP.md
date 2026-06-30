# 使用 Navicat 初始化数据库

## 快速步骤

### 1. 连接数据库

1. 打开 Navicat
2. 点击 **连接** → **MySQL**
3. 填写连接信息：
   - 连接名：`kaban-diary`（任意）
   - 主机：`localhost`
   - 端口：`3306`
   - 用户名：`root`
   - 密码：`123456`
4. 点击 **测试连接** 确认成功
5. 点击 **确定**

### 2. 创建数据库

1. 双击刚创建的连接
2. 在连接上右键 → **新建数据库**
3. 填写信息：
   - 数据库名：`kaban_diary`
   - 字符集：`utf8mb4`
   - 排序规则：`utf8mb4_unicode_ci`
4. 点击 **确定**

### 3. 导入数据库结构

1. 展开 `kaban_diary` 数据库
2. 点击 **查询** → **新建查询**
3. 复制以下完整 SQL 代码并粘贴：

```sql
-- 创建所有表结构
CREATE TABLE IF NOT EXISTS `user` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    `phone` VARCHAR(11) UNIQUE NOT NULL COMMENT '手机号',
    `password` VARCHAR(255) COMMENT '密码(加密)',
    `nickname` VARCHAR(50) DEFAULT '卡伴用户' COMMENT '昵称',
    `avatar` VARCHAR(255) COMMENT '头像URL',
    `signature` VARCHAR(200) COMMENT '个性签名',
    `login_type` TINYINT DEFAULT 1 COMMENT '登录方式: 1-手机, 2-微信, 3-QQ, 4-访客',
    `open_id` VARCHAR(100) COMMENT '第三方登录OpenID',
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-禁用, 1-正常',
    `deleted` TINYINT DEFAULT 0 COMMENT '删除标记',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_phone (`phone`),
    INDEX idx_open_id (`open_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

CREATE TABLE IF NOT EXISTS `user_profile` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `height` DECIMAL(5,2) COMMENT '身高(cm)',
    `weight` DECIMAL(5,2) COMMENT '体重(kg)',
    `body_fat_rate` DECIMAL(5,2) COMMENT '体脂率(%)',
    `target_weight` DECIMAL(5,2) COMMENT '目标体重(kg)',
    `daily_calorie_goal` INT DEFAULT 2000 COMMENT '每日热量目标(kcal)',
    `daily_water_goal` INT DEFAULT 2000 COMMENT '每日饮水目标(ml)',
    `birthday` DATE COMMENT '生日',
    `gender` TINYINT COMMENT '性别: 0-未知, 1-男, 2-女',
    `activity_level` TINYINT DEFAULT 1 COMMENT '活动水平: 1-久坐, 2-轻度, 3-中度, 4-高度',
    `diet_days` INT DEFAULT 0 COMMENT '记录饮食天数',
    `deleted` TINYINT DEFAULT 0,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_id (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户资料表';

CREATE TABLE IF NOT EXISTS `weight_record` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `weight` DECIMAL(5,2) NOT NULL COMMENT '体重(kg)',
    `body_fat_rate` DECIMAL(5,2) COMMENT '体脂率(%)',
    `bmi` DECIMAL(5,2) COMMENT 'BMI指数',
    `note` VARCHAR(200) COMMENT '备注',
    `record_date` DATE NOT NULL COMMENT '记录日期',
    `deleted` TINYINT DEFAULT 0,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_date (`user_id`, `record_date`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='体重记录表';

CREATE TABLE IF NOT EXISTS `diet_record` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `food_id` BIGINT COMMENT '食物ID',
    `food_name` VARCHAR(100) NOT NULL COMMENT '食物名称',
    `meal_type` TINYINT DEFAULT 1 COMMENT '餐次: 1-早餐, 2-午餐, 3-晚餐, 4-加餐',
    `amount` DECIMAL(8,2) NOT NULL COMMENT '食用量(g)',
    `calorie` DECIMAL(8,2) NOT NULL COMMENT '热量(kcal)',
    `protein` DECIMAL(8,2) COMMENT '蛋白质(g)',
    `fat` DECIMAL(8,2) COMMENT '脂肪(g)',
    `carbohydrate` DECIMAL(8,2) COMMENT '碳水化合物(g)',
    `fiber` DECIMAL(8,2) COMMENT '膳食纤维(g)',
    `record_date` DATE NOT NULL COMMENT '记录日期',
    `record_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
    `image` VARCHAR(255) COMMENT '食物图片',
    `deleted` TINYINT DEFAULT 0,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_date (`user_id`, `record_date`),
    INDEX idx_meal_type (`meal_type`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='饮食记录表';

CREATE TABLE IF NOT EXISTS `water_record` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `amount` INT NOT NULL COMMENT '饮水量(ml)',
    `record_date` DATE NOT NULL COMMENT '记录日期',
    `record_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
    `deleted` TINYINT DEFAULT 0,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_date (`user_id`, `record_date`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='饮水记录表';

CREATE TABLE IF NOT EXISTS `recipe` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL COMMENT '食谱标题',
    `description` TEXT COMMENT '食谱描述',
    `image` VARCHAR(255) COMMENT '食谱图片',
    `category` VARCHAR(50) COMMENT '分类: hot-热门, selected-精选, ai-智能, expert-专家',
    `is_vip` TINYINT DEFAULT 0 COMMENT '是否VIP专享',
    `prep_time` INT COMMENT '准备时间(分钟)',
    `cook_time` INT COMMENT '烹饪时间(分钟)',
    `calories` INT COMMENT '总热量(kcal)',
    `protein` DECIMAL(8,2) COMMENT '蛋白质(g)',
    `fat` DECIMAL(8,2) COMMENT '脂肪(g)',
    `carbohydrate` DECIMAL(8,2) COMMENT '碳水化合物(g)',
    `ingredients` TEXT COMMENT '食材(JSON格式)',
    `steps` TEXT COMMENT '制作步骤(JSON格式)',
    `tips` TEXT COMMENT '小贴士',
    `view_count` INT DEFAULT 0 COMMENT '浏览量',
    `collect_count` INT DEFAULT 0 COMMENT '收藏量',
    `rating` DECIMAL(3,2) DEFAULT 4.5 COMMENT '评分',
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-下架, 1-上架',
    `deleted` TINYINT DEFAULT 0,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (`category`),
    INDEX idx_is_vip (`is_vip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食谱表';

CREATE TABLE IF NOT EXISTS `recipe_collection` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `recipe_id` BIGINT NOT NULL COMMENT '食谱ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_recipe (`user_id`, `recipe_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食谱收藏表';

CREATE TABLE IF NOT EXISTS `health_goal` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `goal_type` VARCHAR(50) NOT NULL COMMENT '目标类型: weight-体重, calorie-热量, water-饮水, exercise-运动',
    `target_value` DECIMAL(10,2) NOT NULL COMMENT '目标值',
    `current_value` DECIMAL(10,2) COMMENT '当前值',
    `start_date` DATE COMMENT '开始日期',
    `end_date` DATE COMMENT '结束日期',
    `status` TINYINT DEFAULT 1 COMMENT '状态: 0-已完成, 1-进行中, 2-已放弃',
    `deleted` TINYINT DEFAULT 0,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_type (`user_id`, `goal_type`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='健康目标表';

CREATE TABLE IF NOT EXISTS `chat_message` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `session_id` VARCHAR(100) COMMENT '会话ID',
    `message_type` TINYINT DEFAULT 1 COMMENT '消息类型: 1-用户, 2-AI助手',
    `content` TEXT NOT NULL COMMENT '消息内容',
    `deleted` TINYINT DEFAULT 0,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_session (`user_id`, `session_id`),
    INDEX idx_create_time (`create_time`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天消息表';

CREATE TABLE IF NOT EXISTS `diet_method` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL COMMENT '标题',
    `description` TEXT COMMENT '描述',
    `image` VARCHAR(255) COMMENT '封面图片',
    `content` TEXT COMMENT '详细内容',
    `difficulty` TINYINT COMMENT '难度: 1-简单, 2-中等, 3-困难',
    `duration` VARCHAR(50) COMMENT '建议周期',
    `calorie_limit` INT COMMENT '热量限制(kcal)',
    `view_count` INT DEFAULT 0 COMMENT '浏览量',
    `status` TINYINT DEFAULT 1 COMMENT '状态',
    `deleted` TINYINT DEFAULT 0,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='热门减肥法表';

CREATE TABLE IF NOT EXISTS `user_feedback` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `content` TEXT NOT NULL COMMENT '反馈内容',
    `contact` VARCHAR(100) COMMENT '联系方式',
    `status` TINYINT DEFAULT 0 COMMENT '处理状态: 0-待处理, 1-已处理',
    `reply` TEXT COMMENT '回复内容',
    `deleted` TINYINT DEFAULT 0,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户反馈表';
```

4. 点击 **运行**（或按 F5）

### 4. 添加测试用户

**方法 A：新建查询运行以下 SQL**

```sql
INSERT INTO `user` (`phone`, `nickname`, `signature`, `login_type`, `status`)
VALUES ('13768247331', '测试用户', '每天进步一点点', 1, 1);

-- 创建用户资料
INSERT INTO `user_profile` (`user_id`, `height`, `weight`, `body_fat_rate`, `target_weight`, `daily_calorie_goal`, `daily_water_goal`, `gender`, `activity_level`)
VALUES (LAST_INSERT_ID(), 170.0, 65.5, 18.5, 60.0, 2000, 2000, 2, 2);
```

**方法 B：直接在 user 表中手动插入**

1. 双击 `user` 表 → 打开数据
2. 点击 + 添加行
3. 填入：
   - phone: `13768247331`
   - nickname: `测试用户`
   - signature: `每天进步一点点`
   - login_type: `1`
   - status: `1`
4. 保存

### 5. 验证

刷新数据库，确认看到以下表：
- user
- user_profile
- weight_record
- diet_record
- water_record
- recipe
- recipe_collection
- chat_message
- ...

---

## 完成后操作

1. **刷新浏览器** `http://localhost:8080/login.html`
2. **使用测试账号登录**：
   - 手机号：`13768247331`
   - 验证码：`123456`
3. **验证功能**：
   - 饮食数据是否显示
   - 体重数据是否显示
   - AI 助手是否可以连接

---

## 如果导入文件更方便

您也可以直接运行项目中的 SQL 文件：

1. 在 Navicat 中右键 `kaban_diary` 数据库
2. 选择 **运行 SQL 文件**
3. 选择项目中的：`src/main/resources/db/schema.sql`
4. 点击运行

然后再运行：`src/main/resources/db/add_test_user.sql`