-- 修复 diet_record 表缺少 update_time 列
ALTER TABLE `diet_record` ADD COLUMN `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `create_time`;

-- 同样修复 water_record 表（可能也有相同问题）
ALTER TABLE `water_record` ADD COLUMN `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `create_time`;

-- 修复 weight_record 表
ALTER TABLE `weight_record` ADD COLUMN `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `create_time`;

-- 修复 recipe 表
ALTER TABLE `recipe` ADD COLUMN `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `create_time`;

-- 修复 chat_message 表
ALTER TABLE `chat_message` ADD COLUMN `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `create_time`;