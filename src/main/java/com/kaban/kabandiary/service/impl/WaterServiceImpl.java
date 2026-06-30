package com.kaban.kabandiary.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.kaban.kabandiary.entity.UserProfile;
import com.kaban.kabandiary.entity.WaterRecord;
import com.kaban.kabandiary.mapper.UserProfileMapper;
import com.kaban.kabandiary.mapper.WaterRecordMapper;
import com.kaban.kabandiary.service.WaterService;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * 饮水服务实现
 */
@Slf4j
@Service
public class WaterServiceImpl implements WaterService {

    @Resource
    private WaterRecordMapper waterRecordMapper;

    @Resource
    private UserProfileMapper userProfileMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void addWaterRecord(Long userId, Integer amount) {
        WaterRecord record = new WaterRecord();
        record.setUserId(userId);
        record.setAmount(amount);
        record.setRecordDate(LocalDate.now());
        waterRecordMapper.insert(record);

        log.info("用户 {} 添加饮水记录: {}ml", userId, amount);
    }

    @Override
    public Integer getTodayWaterIntake(Long userId) {
        return waterRecordMapper.selectList(
                new LambdaQueryWrapper<WaterRecord>()
                        .eq(WaterRecord::getUserId, userId)
                        .eq(WaterRecord::getRecordDate, LocalDate.now())
        ).stream().mapToInt(WaterRecord::getAmount).sum();
    }

    @Override
    public Integer getWaterGoal(Long userId) {
        UserProfile profile = userProfileMapper.selectOne(
                new LambdaQueryWrapper<UserProfile>().eq(UserProfile::getUserId, userId)
        );
        return profile != null ? profile.getDailyWaterGoal() : 2000;
    }
}