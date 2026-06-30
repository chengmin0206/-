package com.kaban.kabandiary.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 体重记录实体类
 */
@Data
@TableName("weight_record")
public class WeightRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 体重(kg)
     */
    private BigDecimal weight;

    /**
     * 体脂率(%)
     */
    private BigDecimal bodyFatRate;

    /**
     * BMI指数
     */
    private BigDecimal bmi;

    /**
     * 备注
     */
    private String note;

    /**
     * 记录日期
     */
    private LocalDate recordDate;

    @TableLogic
    private Integer deleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}