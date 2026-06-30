package com.kaban.kabandiary.service;

import com.kaban.kabandiary.dto.DietRecordDTO;
import com.kaban.kabandiary.dto.DietStatDTO;
import com.kaban.kabandiary.entity.DietRecord;

import java.time.LocalDate;
import java.util.List;

/**
 * 饮食服务接口
 */
public interface DietService {

    /**
     * 添加饮食记录
     */
    void addDietRecord(Long userId, DietRecordDTO dto);

    /**
     * 删除饮食记录
     */
    void deleteDietRecord(Long recordId, Long userId);

    /**
     * 获取今日饮食记录
     */
    List<DietRecord> getTodayDietRecords(Long userId);

    /**
     * 获取指定日期的饮食统计
     */
    DietStatDTO getDietStat(Long userId, LocalDate date);

    /**
     * AI识别食物（返回可能的食物列表）
     */
    List<String> recognizeFood(String imageUrl);
}