package com.kaban.kabandiary.dto;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 饮食记录DTO
 */
@Data
public class DietRecordDTO {

    /**
     * 食物ID
     */
    private Long foodId;

    /**
     * 食物名称
     */
    @NotBlank(message = "食物名称不能为空")
    private String foodName;

    /**
     * 餐次: 1-早餐, 2-午餐, 3-晚餐, 4-加餐
     */
    @NotNull(message = "餐次不能为空")
    private Integer mealType;

    /**
     * 食用量(g)
     */
    @NotNull(message = "食用量不能为空")
    @DecimalMin(value = "0", inclusive = false, message = "食用量必须大于0")
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
     * 食物图片
     */
    private String image;
}