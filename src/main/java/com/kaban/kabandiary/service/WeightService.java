package com.kaban.kabandiary.service;

import com.kaban.kabandiary.dto.WeightStatDTO;
import com.kaban.kabandiary.entity.WeightRecord;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 体重服务接口
 */
public interface WeightService {

    /**
     * 添加体重记录
     */
    void addWeightRecord(Long userId, BigDecimal weight, BigDecimal bodyFatRate, String note);

    /**
     * 获取用户最新体重记录
     */
    WeightRecord getLatestWeightRecord(Long userId);

    /**
     * 获取用户体重记录列表（近30天）
     */
    List<WeightRecord> getWeightRecords(Long userId, int days);

    /**
     * 获取体重统计数据
     */
    WeightStatDTO getWeightStat(Long userId);

    /**
     * 更新用户身高
     */
    void updateHeight(Long userId, BigDecimal height);

    /**
     * 更新目标体重
     */
    void updateTargetWeight(Long userId, BigDecimal targetWeight);
}