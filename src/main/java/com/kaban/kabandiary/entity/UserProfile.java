package com.kaban.kabandiary.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 用户资料实体类
 */
@Data
@TableName("user_profile")
public class UserProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 身高(cm)
     */
    private BigDecimal height;

    /**
     * 体重(kg)
     */
    private BigDecimal weight;

    /**
     * 体脂率(%)
     */
    private BigDecimal bodyFatRate;

    /**
     * 目标体重(kg)
     */
    private BigDecimal targetWeight;

    /**
     * 每日热量目标(kcal)
     */
    private Integer dailyCalorieGoal;

    /**
     * 每日饮水目标(ml)
     */
    private Integer dailyWaterGoal;

    /**
     * 生日
     */
    private LocalDate birthday;

    /**
     * 性别: 0-未知, 1-男, 2-女
     */
    private Integer gender;

    /**
     * 活动水平: 1-久坐, 2-轻度, 3-中度, 4-高度
     */
    private Integer activityLevel;

    /**
     * 记录饮食天数
     */
    private Integer dietDays;

    @TableLogic
    private Integer deleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}