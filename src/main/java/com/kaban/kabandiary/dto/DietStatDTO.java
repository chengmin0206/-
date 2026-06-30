package com.kaban.kabandiary.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 饮食统计DTO
 */
@Data
public class DietStatDTO {

    /**
     * 已摄入热量
     */
    private Integer consumedCalories;

    /**
     * 推荐热量
     */
    private Integer recommendedCalories;

    /**
     * 还可摄入热量
     */
    private Integer remainingCalories;

    /**
     * 碳水化合物(g)
     */
    private BigDecimal carbohydrate;

    /**
     * 蛋白质(g)
     */
    private BigDecimal protein;

    /**
     * 脂肪(g)
     */
    private BigDecimal fat;

    /**
     * 膳食纤维(g)
     */
    private BigDecimal fiber;

    /**
     * 今日饮水量(ml)
     */
    private Integer waterIntake;

    /**
     * 今日运动消耗(kcal)
     */
    private Integer exerciseCalories;

    /**
     * 今日运动时长(分钟)
     */
    private Integer exerciseDuration;
}