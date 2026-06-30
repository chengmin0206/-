package com.kaban.kabandiary.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.kaban.kabandiary.entity.RecipeCollection;
import org.apache.ibatis.annotations.Mapper;

/**
 * 食谱收藏Mapper
 */
@Mapper
public interface RecipeCollectionMapper extends BaseMapper<RecipeCollection> {
}