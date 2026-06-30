package com.kaban.kabandiary.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 食谱实体类
 */
@Data
@TableName("recipe")
public class Recipe implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 食谱标题
     */
    private String title;

    /**
     * 食谱描述
     */
    private String description;

    /**
     * 食谱图片
     */
    private String image;

    /**
     * 分类: hot-热门, selected-精选, ai-智能, expert-专家
     */
    private String category;

    /**
     * 是否VIP专享
     */
    private Integer isVip;

    /**
     * 准备时间(分钟)
     */
    private Integer prepTime;

    /**
     * 烹饪时间(分钟)
     */
    private Integer cookTime;

    /**
     * 总热量(kcal)
     */
    private Integer calories;

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
     * 食材(JSON格式)
     */
    private String ingredients;

    /**
     * 制作步骤(JSON格式)
     */
    private String steps;

    /**
     * 小贴士
     */
    private String tips;

    /**
     * 浏览量
     */
    private Integer viewCount;

    /**
     * 收藏量
     */
    private Integer collectCount;

    /**
     * 评分
     */
    private BigDecimal rating;

    /**
     * 状态: 0-下架, 1-上架
     */
    private Integer status;

    @TableLogic
    private Integer deleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}