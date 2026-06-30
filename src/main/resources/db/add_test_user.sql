-- 添加测试用户和验证码脚本

USE kaban_diary;

-- 1. 插入或更新测试用户
INSERT INTO `user` (`phone`, `nickname`, `signature`, `login_type`, `status`)
VALUES ('13768247331', '测试用户', '每天进步一点点', 1, 1)
ON DUPLICATE KEY UPDATE
    `nickname` = '测试用户',
    `signature` = '每天进步一点点',
    `login_type` = 1,
    `status` = 1;

-- 2. 为该用户创建用户资料
INSERT INTO `user_profile` (`user_id`, `height`, `weight`, `body_fat_rate`, `target_weight`, `daily_calorie_goal`, `daily_water_goal`, `gender`, `activity_level`)
SELECT id, 170.0, 65.5, 18.5, 60.0, 2000, 2000, 2, 2
FROM `user`
WHERE phone = '13768247331'
AND NOT EXISTS (SELECT 1 FROM `user_profile` WHERE user_id = (SELECT id FROM `user` WHERE phone = '13768247331'));