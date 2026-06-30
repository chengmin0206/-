package com.kaban.kabandiary.service;

/**
 * 饮水服务接口
 */
public interface WaterService {

    /**
     * 添加饮水记录
     */
    void addWaterRecord(Long userId, Integer amount);

    /**
     * 获取今日饮水量
     */
    Integer getTodayWaterIntake(Long userId);

    /**
     * 获取饮水目标
     */
    Integer getWaterGoal(Long userId);
}