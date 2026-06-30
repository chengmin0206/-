package com.kaban.kabandiary.config;

import com.kaban.kabandiary.entity.*;
import com.kaban.kabandiary.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 数据初始化配置 - 添加测试数据
 */
@Component
public class DataInitConfig implements CommandLineRunner {

    @Autowired
    private com.kaban.kabandiary.mapper.UserMapper userMapper;

    @Autowired
    private com.kaban.kabandiary.mapper.UserProfileMapper userProfileMapper;

    @Autowired
    private com.kaban.kabandiary.mapper.WeightRecordMapper weightRecordMapper;

    @Autowired
    private com.kaban.kabandiary.mapper.DietRecordMapper dietRecordMapper;

    @Autowired
    private com.kaban.kabandiary.mapper.WaterRecordMapper waterRecordMapper;

    @Autowired
    private com.kaban.kabandiary.mapper.RecipeMapper recipeMapper;

    /**
     * 应用启动后执行
     */

    public void run(String... args) {
        System.out.println("开始初始化测试数据...");
        initTestUser();
        initTestWeightRecords();
        initTestDietRecords();
        initTestWaterRecords();
        initTestRecipes();
        System.out.println("测试数据初始化成功！");
    }

    /**
     * 初始化测试用户
     */
    private void initTestUser() {
        // 检查是否已有测试用户
        User user = userMapper.selectById(1L);
        if (user == null) {
            // 创建测试用户
            user = new com.kaban.kabandiary.entity.User();
            user.setId(1L);
            user.setPhone("13800138000");
            user.setNickname("测试用户");
            user.setSignature("每天进步一点点");
            user.setLoginType(1);
            user.setStatus(1);
            userMapper.insert(user);

            // 创建用户资料
            com.kaban.kabandiary.entity.UserProfile profile = new com.kaban.kabandiary.entity.UserProfile();
            profile.setUserId(1L);
            profile.setHeight(new java.math.BigDecimal("170"));
            profile.setWeight(new java.math.BigDecimal("65.5"));
            profile.setBodyFatRate(new java.math.BigDecimal("18.5"));
            profile.setTargetWeight(new java.math.BigDecimal("60"));
            profile.setDailyCalorieGoal(2000);
            profile.setDailyWaterGoal(2000);
            profile.setDietDays(0);
            profile.setGender(2);
            profile.setActivityLevel(2);
            userProfileMapper.insert(profile);

            System.out.println("创建测试用户");
        } else {
            System.out.println("用户已存在");
        }
    }

    /**
     * 初始化测试体重记录
     */
    private void initTestWeightRecords() {
        Long count = weightRecordMapper.selectCount(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<com.kaban.kabandiary.entity.WeightRecord>()
                        .eq(com.kaban.kabandiary.entity.WeightRecord::getUserId, 1L));
        if (count > 0) {
            System.out.println("体重记录已存在，跳过初始化");
            return;
        }
        for (int i = 0; i < 7; i++) {
            java.time.LocalDate date = java.time.LocalDate.now().minusDays(6 - i);
            com.kaban.kabandiary.entity.WeightRecord record = new com.kaban.kabandiary.entity.WeightRecord();
            record.setUserId(1L);
            record.setWeight(new java.math.BigDecimal(65.5));
            record.setBodyFatRate(new java.math.BigDecimal(18.5));
            double bmi = 65.5 / (1.7 * 1.7);
            record.setBmi(new java.math.BigDecimal(bmi).setScale(1, java.math.RoundingMode.HALF_UP));
            record.setNote(i == 0 ? "初始体重" : "记录");
            record.setRecordDate(date);
            weightRecordMapper.insert(record);
        }
        System.out.println("初始化7条体重记录");
    }

    /**
     * 初始化测试饮食记录
     */
    private void initTestDietRecords() {
        Long count = dietRecordMapper.selectCount(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<com.kaban.kabandiary.entity.DietRecord>()
                        .eq(com.kaban.kabandiary.entity.DietRecord::getUserId, 1L));
        if (count > 0) {
            System.out.println("饮食记录已存在，跳过初始化");
            return;
        }
        String[] meals = {"鸡胸肉沙拉", "燕麦蓝莓碗", "三文鱼沙拉"};

        for (int i = 0; i < 3; i++) {
            com.kaban.kabandiary.entity.DietRecord record = new com.kaban.kabandiary.entity.DietRecord();
            record.setUserId(1L);
            record.setFoodName(meals[i]);

            int calorieValue = 328;
            int proteinValue = 32;
            int fatValue = 8;
            int carbValue = 12;
            int fiberValue = 5;

            switch (i) {
                case 0:
                    break;
                case 1:
                    calorieValue = 298;
                    proteinValue = 12;
                    fatValue = 8;
                    carbValue = 48;
                    fiberValue = 6;
                    break;
                case 2:
                    calorieValue = 380;
                    proteinValue = 28;
                    fatValue = 22;
                    carbValue = 8;
                    fiberValue = 2;
                    break;
            }

            record.setMealType(i + 1);
            record.setAmount(new java.math.BigDecimal("200"));
            record.setCalorie(new java.math.BigDecimal(calorieValue));
            record.setProtein(new java.math.BigDecimal(proteinValue));
            record.setFat(new java.math.BigDecimal(fatValue));
            record.setCarbohydrate(new java.math.BigDecimal(carbValue));
            record.setFiber(new java.math.BigDecimal(fiberValue));
            record.setRecordDate(java.time.LocalDate.now());
            record.setRecordTime(java.time.LocalDateTime.now());
            dietRecordMapper.insert(record);
        }
        System.out.println("初始化3条饮食记录");
    }

    /**
     * 初始化测试饮水记录
     */
    private void initTestWaterRecords() {
        Long count = waterRecordMapper.selectCount(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<com.kaban.kabandiary.entity.WaterRecord>()
                        .eq(com.kaban.kabandiary.entity.WaterRecord::getUserId, 1L));
        if (count > 0) {
            System.out.println("饮水记录已存在，跳过初始化");
            return;
        }
        // 添加今天的饮水记录
        com.kaban.kabandiary.entity.WaterRecord record1 = new com.kaban.kabandiary.entity.WaterRecord();
        record1.setUserId(1L);
        record1.setAmount(500);
        record1.setRecordDate(java.time.LocalDate.now());
        record1.setRecordTime(java.time.LocalDateTime.now().minusHours(3));
        waterRecordMapper.insert(record1);

        com.kaban.kabandiary.entity.WaterRecord record2 = new com.kaban.kabandiary.entity.WaterRecord();
        record2.setUserId(1L);
        record2.setAmount(500);
        record2.setRecordDate(java.time.LocalDate.now());
        record2.setRecordTime(java.time.LocalDateTime.now().minusHours(1));
        waterRecordMapper.insert(record2);

        com.kaban.kabandiary.entity.WaterRecord record3 = new com.kaban.kabandiary.entity.WaterRecord();
        record3.setUserId(1L);
        record3.setAmount(500);
        record3.setRecordDate(java.time.LocalDate.now());
        record3.setRecordTime(java.time.LocalDateTime.now());
        waterRecordMapper.insert(record3);
        System.out.println("初始化3条饮水记录");
    }

    /**
     * 初始化测试食谱
     */
    private void initTestRecipes() {
        Long count = recipeMapper.selectCount(null);
        if (count > 0) {
            System.out.println("食谱已存在，跳过初始化");
            return;
        }
        createRecipe("鸡胸肉牛油果沙拉", "hot", 328, 32, 8, 12);
        createRecipe("燕麦蓝莓碗", "hot", 298, 12, 8, 48);
        createRecipe("三文鱼沙拉", "selected", 380, 28, 22, 8);
    }

    private void createRecipe(String title, String category, int calories, int protein, int fat,
                               int carb) {
        com.kaban.kabandiary.entity.Recipe recipe = new com.kaban.kabandiary.entity.Recipe();
        recipe.setTitle(title);
        recipe.setDescription(title);
        recipe.setCategory(category);
        recipe.setIsVip(0);
        recipe.setPrepTime(15);
        recipe.setCookTime(10);
        recipe.setCalories(calories);
        recipe.setProtein(new java.math.BigDecimal(protein));
        recipe.setFat(new java.math.BigDecimal(fat));
        recipe.setCarbohydrate(new java.math.BigDecimal(carb));
        recipe.setViewCount(500);
        recipe.setCollectCount(100);
        recipe.setRating(new java.math.BigDecimal("4.9"));
        recipe.setStatus(1);
        recipeMapper.insert(recipe);
        System.out.println("初始化3条食谱");
    }
}