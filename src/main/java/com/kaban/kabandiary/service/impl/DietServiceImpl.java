package com.kaban.kabandiary.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.kaban.kabandiary.dto.DietRecordDTO;
import com.kaban.kabandiary.dto.DietStatDTO;
import com.kaban.kabandiary.entity.DietRecord;
import com.kaban.kabandiary.entity.UserProfile;
import com.kaban.kabandiary.entity.WaterRecord;
import com.kaban.kabandiary.entity.ExerciseRecord;
import com.kaban.kabandiary.mapper.DietRecordMapper;
import com.kaban.kabandiary.mapper.UserProfileMapper;
import com.kaban.kabandiary.mapper.WaterRecordMapper;
import com.kaban.kabandiary.mapper.ExerciseRecordMapper;
import com.kaban.kabandiary.service.DietService;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 饮食服务实现
 */
@Slf4j
@Service
public class DietServiceImpl implements DietService {

    @Resource
    private DietRecordMapper dietRecordMapper;

    @Resource
    private UserProfileMapper userProfileMapper;

    @Resource
    private WaterRecordMapper waterRecordMapper;

    @Resource
    private ExerciseRecordMapper exerciseRecordMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addDietRecord(Long userId, DietRecordDTO dto) {
        // 如果没有提供热量等信息，按默认值计算（实际应该从食物表查询）
        if (dto.getCalorie() == null) {
            // 简单估算：每100g约100-300卡路里
            int baseCalorie = 200;
            BigDecimal calorie = BigDecimal.valueOf(baseCalorie)
                    .multiply(dto.getAmount())
                    .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
            dto.setCalorie(calorie);
        }

        // 设置默认营养成分
        if (dto.getProtein() == null) {
            dto.setProtein(dto.getCalorie().multiply(BigDecimal.valueOf(0.15))
                    .divide(BigDecimal.valueOf(4), 1, RoundingMode.HALF_UP));
        }
        if (dto.getFat() == null) {
            dto.setFat(dto.getCalorie().multiply(BigDecimal.valueOf(0.25))
                    .divide(BigDecimal.valueOf(9), 1, RoundingMode.HALF_UP));
        }
        if (dto.getCarbohydrate() == null) {
            dto.setCarbohydrate(dto.getCalorie().multiply(BigDecimal.valueOf(0.60))
                    .divide(BigDecimal.valueOf(4), 1, RoundingMode.HALF_UP));
        }

        DietRecord record = new DietRecord();
        record.setUserId(userId);
        record.setFoodId(dto.getFoodId());
        record.setFoodName(dto.getFoodName());
        record.setMealType(dto.getMealType());
        record.setAmount(dto.getAmount());
        record.setCalorie(dto.getCalorie());
        record.setProtein(dto.getProtein());
        record.setFat(dto.getFat());
        record.setCarbohydrate(dto.getCarbohydrate());
        record.setFiber(dto.getFiber());
        record.setRecordDate(LocalDate.now());
        record.setRecordTime(LocalDateTime.now());
        record.setImage(dto.getImage());

        dietRecordMapper.insert(record);

        // 更新用户饮食天数
        UserProfile profile = userProfileMapper.selectOne(
                new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUserId, userId)
        );
        if (profile != null) {
            LocalDate lastDietDate = LocalDate.now();
            // TODO: 判断是否新的一天
            profile.setDietDays((profile.getDietDays() == null ? 0 : profile.getDietDays()) + 1);
            userProfileMapper.updateById(profile);
        }

        log.info("用户 {} 添加饮食记录: {}", userId, dto.getFoodName());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteDietRecord(Long recordId, Long userId) {
        dietRecordMapper.delete(new LambdaQueryWrapper<DietRecord>()
                .eq(DietRecord::getId, recordId)
                .eq(DietRecord::getUserId, userId));
        log.info("用户 {} 删除饮食记录: {}", userId, recordId);
    }

    @Override
    public List<DietRecord> getTodayDietRecords(Long userId) {
        return dietRecordMapper.selectList(
                new LambdaQueryWrapper<DietRecord>()
                        .eq(DietRecord::getUserId, userId)
                        .eq(DietRecord::getRecordDate, LocalDate.now())
                        .orderByAsc(DietRecord::getMealType)
                        .orderByAsc(DietRecord::getRecordTime)
        );
    }

    @Override
    public DietStatDTO getDietStat(Long userId, LocalDate date) {
        DietStatDTO dto = new DietStatDTO();

        // 获取用户资料中的每日目标
        UserProfile profile = userProfileMapper.selectOne(
                new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUserId, userId)
        );
        int recommendedCalories = profile != null ? profile.getDailyCalorieGoal() : 2000;
        dto.setRecommendedCalories(recommendedCalories);

        // 查询当日饮食记录
        List<DietRecord> records = dietRecordMapper.selectList(
                new LambdaQueryWrapper<DietRecord>()
                        .eq(DietRecord::getUserId, userId)
                        .eq(DietRecord::getRecordDate, date)
        );

        // 计算总热量和营养成分
        BigDecimal totalCalorie = BigDecimal.ZERO;
        BigDecimal totalProtein = BigDecimal.ZERO;
        BigDecimal totalFat = BigDecimal.ZERO;
        BigDecimal totalCarb = BigDecimal.ZERO;
        BigDecimal totalFiber = BigDecimal.ZERO;

        for (DietRecord record : records) {
            totalCalorie = totalCalorie.add(record.getCalorie() != null ? record.getCalorie() : BigDecimal.ZERO);
            totalProtein = totalProtein.add(record.getProtein() != null ? record.getProtein() : BigDecimal.ZERO);
            totalFat = totalFat.add(record.getFat() != null ? record.getFat() : BigDecimal.ZERO);
            totalCarb = totalCarb.add(record.getCarbohydrate() != null ? record.getCarbohydrate() : BigDecimal.ZERO);
            totalFiber = totalFiber.add(record.getFiber() != null ? record.getFiber() : BigDecimal.ZERO);
        }

        int consumed = totalCalorie.intValue();
        dto.setConsumedCalories(consumed);
        dto.setRemainingCalories(Math.max(0, recommendedCalories - consumed));
        dto.setCarbohydrate(totalCarb);
        dto.setProtein(totalProtein);
        dto.setFat(totalFat);
        dto.setFiber(totalFiber);

        // 查询当日饮水记录
        List<WaterRecord> waterRecords = waterRecordMapper.selectList(
                new LambdaQueryWrapper<WaterRecord>()
                        .eq(WaterRecord::getUserId, userId)
                        .eq(WaterRecord::getRecordDate, date)
        );
        int totalWater = waterRecords.stream()
                .mapToInt(WaterRecord::getAmount)
                .sum();
        dto.setWaterIntake(totalWater);

        // 查询当日运动记录
        List<ExerciseRecord> exerciseRecords = exerciseRecordMapper.selectList(
                new LambdaQueryWrapper<ExerciseRecord>()
                        .eq(ExerciseRecord::getUserId, userId)
                        .eq(ExerciseRecord::getRecordDate, date)
        );
        int totalExerciseCalories = exerciseRecords.stream()
                .mapToInt(e -> e.getCalorieBurned() != null ? e.getCalorieBurned().intValue() : 0)
                .sum();
        int totalExerciseDuration = exerciseRecords.stream()
                .mapToInt(ExerciseRecord::getDuration)
                .sum();
        dto.setExerciseCalories(totalExerciseCalories);
        dto.setExerciseDuration(totalExerciseDuration);

        return dto;
    }

    @Override
    public List<String> recognizeFood(String imageUrl) {
        // TODO: 实际项目中调用AI识别服务
        // 这里返回一些常见食物用于演示
        return Arrays.asList(
                "鸡胸肉沙拉",
                "牛油果吐司",
                "燕麦蓝莓碗",
                "三文鱼",
                "蔬菜汤",
                "全麦面包",
                "鸡蛋",
                "牛奶"
        ).stream().limit(3).collect(Collectors.toList());
    }
}