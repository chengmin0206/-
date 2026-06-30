package com.kaban.kabandiary.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.kaban.kabandiary.entity.Recipe;
import org.apache.ibatis.annotations.Mapper;

/**
 * 食谱Mapper
 */
@Mapper
public interface RecipeMapper extends BaseMapper<Recipe> {
}