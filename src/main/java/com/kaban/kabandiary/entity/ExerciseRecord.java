package com.kaban.kabandiary.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 运动记录实体类
 */
@Data
@TableName("exercise_record")
public class ExerciseRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 运动类型
     */
    private String exerciseType;

    /**
     * 运动时长(分钟)
     */
    private Integer duration;

    /**
     * 消耗热量(kcal)
     */
    private BigDecimal calorieBurned;

    /**
     * 记录日期
     */
    private LocalDate recordDate;

    /**
     * 记录时间
     */
    private LocalDateTime recordTime;

    /**
     * 备注
     */
    private String note;

    @TableLogic
    private Integer deleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
}