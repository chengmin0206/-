package com.kaban.kabandiary.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 食谱收藏实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("recipe_collection")
public class RecipeCollection implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = com.baomidou.mybatisplus.annotation.IdType.AUTO)
    private Long id;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 食谱ID
     */
    private Long recipeId;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;
}