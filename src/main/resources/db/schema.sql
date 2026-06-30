-- 卡伴日记数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS kaban_diary DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE kaban_diary;

-- 用户表
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

-- 用户资料表
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

-- 体重记录表
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

-- 食物信息表
CREATE TABLE IF NOT EXISTS `food` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL COMMENT '食物名称',
    `category` VARCHAR(50) COMMENT '分类',
    `calorie` DECIMAL(8,2) COMMENT '热量(kcal/100g)',
    `protein` DECIMAL(8,2) COMMENT '蛋白质(g/100g)',
    `fat` DECIMAL(8,2) COMMENT '脂肪(g/100g)',
    `carbohydrate` DECIMAL(8,2) COMMENT '碳水化合物(g/100g)',
    `fiber` DECIMAL(8,2) COMMENT '膳食纤维(g/100g)',
    `image` VARCHAR(255) COMMENT '图片URL',
    `deleted` TINYINT DEFAULT 0,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (`name`),
    INDEX idx_category (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食物信息表';

-- 饮食记录表
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

-- 饮水记录表
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

-- 运动记录表
CREATE TABLE IF NOT EXISTS `exercise_record` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `exercise_type` VARCHAR(50) NOT NULL COMMENT '运动类型',
    `duration` INT NOT NULL COMMENT '运动时长(分钟)',
    `calorie_burned` DECIMAL(8,2) NOT NULL COMMENT '消耗热量(kcal)',
    `record_date` DATE NOT NULL COMMENT '记录日期',
    `record_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
    `note` VARCHAR(200) COMMENT '备注',
    `deleted` TINYINT DEFAULT 0,
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_date (`user_id`, `record_date`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='运动记录表';

-- 食谱表
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

-- 食谱收藏表
CREATE TABLE IF NOT EXISTS `recipe_collection` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL COMMENT '用户ID',
    `recipe_id` BIGINT NOT NULL COMMENT '食谱ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_recipe (`user_id`, `recipe_id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='食谱收藏表';

-- 健康目标表
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

-- 聊天消息表
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

-- 热门减肥法表
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

-- 用户反馈表
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

-- 插入示例数据
INSERT INTO `food` (`name`, `category`, `calorie`, `protein`, `fat`, `carbohydrate`, `fiber`) VALUES
('鸡蛋', '蛋白质', 144, 13.3, 8.8, 2.8, 0),
('鸡胸肉', '蛋白质', 118, 31, 1.2, 0, 0),
('牛奶', '饮品', 54, 3, 3.2, 4.7, 0),
('全麦面包', '主食', 250, 9.5, 2.5, 50, 6),
('米饭', '主食', 116, 2.6, 0.3, 25.9, 0.3),
('苹果', '水果', 52, 0.3, 0.2, 13.8, 2.4),
('牛油果', '水果', 160, 2, 15, 8.5, 6.7),
('三文鱼', '蛋白质', 208, 20, 13, 0, 0),
('燕麦', '主食', 389, 16.9, 6.9, 66, 10),
('豆腐', '蛋白质', 76, 8.1, 4.8, 1.9, 0.4);

INSERT INTO `recipe` (`title`, `description`, `category`, `prep_time`, `calories`, `protein`, `fat`, `carbohydrate`, `rating`) VALUES
('鸡胸肉牛油果沙拉', '高蛋白低脂肪的健康沙拉', 'hot', 15, 328, 32, 18, 12, 4.9),
('荞麦面蔬菜汤', '低热量饱腹汤品', 'hot', 20, 256, 8, 5, 45, 4.8),
('燕麦蓝莓碗', '营养丰富的早餐', 'hot', 10, 298, 12, 8, 48, 4.7),
('牛油果吐司', '简单快手早餐', 'selected', 5, 245, 6, 15, 30, 4.6),
('三文鱼沙拉', 'Omega-3富含', 'selected', 15, 380, 28, 22, 8, 4.9),
('蔬菜豆腐汤', '清爽低热量', 'selected', 20, 168, 12, 6, 18, 4.5);

INSERT INTO `diet_method` (`title`, `description`, `difficulty`, `duration`, `calorie_limit`) VALUES
('16+8 间歇性断食', '每天8小时进食窗口，16小时禁食，科学减肥轻松上手', 1, '长期坚持', 1500),
('低碳水饮食法', '减少碳水化合物摄入，快速燃脂效果显著', 2, '2-4周', 1200),
('5+2 轻断食法', '每周5天正常饮食，2天限制热量，灵活安排易于坚持', 1, '长期坚持', 600);