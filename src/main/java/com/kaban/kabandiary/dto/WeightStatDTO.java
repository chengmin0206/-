package com.kaban.kabandiary.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 体重统计DTO
 */
@Data
public class WeightStatDTO {

    /**
     * 当前体重
     */
    private BigDecimal currentWeight;

    /**
     * 目标体重
     */
    private BigDecimal targetWeight;

    /**
     * BMI
     */
    private BigDecimal bmi;

    /**
     * 体脂率
     */
    private BigDecimal bodyFatRate;

    /**
     * 身高
     */
    private BigDecimal height;

    /**
     * 还需减重
     */
    private BigDecimal needLoseWeight;

    /**
     * 进度百分比
     */
    private Integer progress;

    /**
     * 初始体重
     */
    private BigDecimal startWeight;

    /**
     * 近7天体重数据
     */
    private List<WeeklyWeight> weeklyWeights;

    @Data
    public static class WeeklyWeight {
        private String date;
        private BigDecimal weight;
    }
}