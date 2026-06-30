package com.kaban.kabandiary.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 饮食记录实体类
 */
@Data
@TableName("diet_record")
public class DietRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 食物ID
     */
    private Long foodId;

    /**
     * 食物名称
     */
    private String foodName;

    /**
     * 餐次: 1-早餐, 2-午餐, 3-晚餐, 4-加餐
     */
    private Integer mealType;

    /**
     * 食用量(g)
     */
    private BigDecimal amount;

    /**
     * 热量(kcal)
     */
    private BigDecimal calorie;

    /**
     * 蛋白质(g)
     */
    private BigDecimal protein;

    /**
     * 脂肪(g)
     */
    private BigDecimal fat;

    /**
     * 碳水化合物(g)
     */
    private BigDecimal carbohydrate;

    /**
     * 膳食纤维(g)
     */
    private BigDecimal fiber;

    /**
     * 记录日期
     */
    private LocalDate recordDate;

    /**
     * 记录时间
     */
    private LocalDateTime recordTime;

    /**
     * 食物图片
     */
    private String image;

    @TableLogic
    private Integer deleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}