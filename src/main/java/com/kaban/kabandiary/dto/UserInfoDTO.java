package com.kaban.kabandiary.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 用户信息DTO
 */
@Data
public class UserInfoDTO {

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 个性签名
     */
    private String signature;

    /**
     * BMI指数
     */
    private BigDecimal bmi;

    /**
     * 今日卡路里
     */
    private Integer todayCalories;

    /**
     * 饮食天数
     */
    private Integer dietDays;

    /**
     * 当前体重
     */
    private BigDecimal weight;
}