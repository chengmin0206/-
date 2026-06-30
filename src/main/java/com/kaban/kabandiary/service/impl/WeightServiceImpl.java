package com.kaban.kabandiary.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.kaban.kabandiary.dto.WeightStatDTO;
import com.kaban.kabandiary.dto.WeightStatDTO.WeeklyWeight;
import com.kaban.kabandiary.entity.UserProfile;
import com.kaban.kabandiary.entity.WeightRecord;
import com.kaban.kabandiary.mapper.UserProfileMapper;
import com.kaban.kabandiary.mapper.WeightRecordMapper;
import com.kaban.kabandiary.service.WeightService;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * 体重服务实现
 */
@Slf4j
@Service
public class WeightServiceImpl implements WeightService {

    @Resource
    private WeightRecordMapper weightRecordMapper;

    @Resource
    private UserProfileMapper userProfileMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addWeightRecord(Long userId, BigDecimal weight, BigDecimal bodyFatRate, String note) {
        WeightRecord record = new WeightRecord();
        record.setUserId(userId);
        record.setWeight(weight);
        record.setBodyFatRate(bodyFatRate);
        record.setNote(note);
        record.setRecordDate(LocalDate.now());

        // 计算BMI
        UserProfile profile = userProfileMapper.selectOne(
                new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUserId, userId)
        );
        if (profile != null && profile.getHeight() != null) {
            double heightInMeters = profile.getHeight().doubleValue() / 100;
            double bmi = weight.doubleValue() / (heightInMeters * heightInMeters);
            record.setBmi(BigDecimal.valueOf(bmi).setScale(1, RoundingMode.HALF_UP));

            // 更新用户资料中的体重
            profile.setWeight(weight);
            profile.setBodyFatRate(bodyFatRate);
            userProfileMapper.updateById(profile);
        }

        weightRecordMapper.insert(record);
        log.info("用户 {} 添加体重记录: {}kg", userId, weight);
    }

    @Override
    public WeightRecord getLatestWeightRecord(Long userId) {
        return weightRecordMapper.selectOne(
                new LambdaQueryWrapper<WeightRecord>()
                        .eq(WeightRecord::getUserId, userId)
                        .orderByDesc(WeightRecord::getRecordDate)
                        .last("LIMIT 1")
        );
    }

    @Override
    public List<WeightRecord> getWeightRecords(Long userId, int days) {
        LocalDate startDate = LocalDate.now().minusDays(days - 1);
        return weightRecordMapper.selectList(
                new LambdaQueryWrapper<WeightRecord>()
                        .eq(WeightRecord::getUserId, userId)
                        .ge(WeightRecord::getRecordDate, startDate)
                        .orderByAsc(WeightRecord::getRecordDate)
        );
    }

    @Override
    public WeightStatDTO getWeightStat(Long userId) {
        WeightStatDTO dto = new WeightStatDTO();

        UserProfile profile = userProfileMapper.selectOne(
                new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUserId, userId)
        );

        WeightRecord latest = getLatestWeightRecord(userId);

        if (profile != null) {
            dto.setHeight(profile.getHeight());
            dto.setTargetWeight(profile.getTargetWeight());
            dto.setCurrentWeight(latest != null ? latest.getWeight() : profile.getWeight());
            dto.setBodyFatRate(latest != null ? latest.getBodyFatRate() : profile.getBodyFatRate());

            // 计算BMI
            if (profile.getHeight() != null && dto.getCurrentWeight() != null) {
                double heightInMeters = profile.getHeight().doubleValue() / 100;
                double bmi = dto.getCurrentWeight().doubleValue() / (heightInMeters * heightInMeters);
                dto.setBmi(BigDecimal.valueOf(bmi).setScale(1, RoundingMode.HALF_UP));
            }

            // 计算还需减重和进度
            if (dto.getTargetWeight() != null && dto.getCurrentWeight() != null) {
                BigDecimal needLose = dto.getCurrentWeight().subtract(dto.getTargetWeight());
                dto.setNeedLoseWeight(needLose.max(BigDecimal.ZERO));

                // 计算进度
                List<WeightRecord> allRecords = weightRecordMapper.selectList(
                        new LambdaQueryWrapper<WeightRecord>()
                                .eq(WeightRecord::getUserId, userId)
                                .orderByAsc(WeightRecord::getRecordDate)
                );

                if (!allRecords.isEmpty()) {
                    BigDecimal startWeight = allRecords.get(0).getWeight();
                    BigDecimal totalToLose = startWeight.subtract(dto.getTargetWeight());
                    BigDecimal lost = startWeight.subtract(dto.getCurrentWeight());

                    if (totalToLose.compareTo(BigDecimal.ZERO) > 0) {
                        int progress = lost.multiply(BigDecimal.valueOf(100))
                                .divide(totalToLose, 0, RoundingMode.HALF_UP).intValue();
                        dto.setProgress(Math.min(100, Math.max(0, progress)));
                        dto.setStartWeight(startWeight);
                    }
                }
            }

            // 获取近7天数据
            List<WeightRecord> weeklyRecords = getWeightRecords(userId, 7);
            List<WeeklyWeight> weeklyWeights = new ArrayList<>();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd");

            for (WeightRecord record : weeklyRecords) {
                WeeklyWeight ww = new WeeklyWeight();
                ww.setDate(record.getRecordDate().format(formatter));
                ww.setWeight(record.getWeight());
                weeklyWeights.add(ww);
            }
            dto.setWeeklyWeights(weeklyWeights);
        }

        return dto;
    }

    @Override
    public void updateHeight(Long userId, BigDecimal height) {
        UserProfile profile = userProfileMapper.selectOne(
                new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUserId, userId)
        );
        if (profile == null) {
            profile = new UserProfile();
            profile.setUserId(userId);
            profile.setHeight(height);
            profile.setDailyCalorieGoal(2000);
            profile.setDailyWaterGoal(2000);
            profile.setDietDays(0);
            userProfileMapper.insert(profile);
        } else {
            profile.setHeight(height);
            userProfileMapper.updateById(profile);
        }
    }

    @Override
    public void updateTargetWeight(Long userId, BigDecimal targetWeight) {
        UserProfile profile = userProfileMapper.selectOne(
                new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUserId, userId)
        );
        if (profile == null) {
            profile = new UserProfile();
            profile.setUserId(userId);
            profile.setTargetWeight(targetWeight);
            profile.setDailyCalorieGoal(2000);
            profile.setDailyWaterGoal(2000);
            profile.setDietDays(0);
            userProfileMapper.insert(profile);
        } else {
            profile.setTargetWeight(targetWeight);
            userProfileMapper.updateById(profile);
        }
    }
}