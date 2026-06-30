package com.kaban.kabandiary.service;

import com.kaban.kabandiary.entity.Recipe;

import java.util.List;

/**
 * 食谱服务接口
 */
public interface RecipeService {

    /**
     * 获取热门食谱
     */
    List<Recipe> getHotRecipes(Integer limit);

    /**
     * 获取精选食谱
     */
    List<Recipe> getSelectedRecipes(Integer limit);

    /**
     * 获取AI智能食谱
     */
    List<Recipe> getAiRecipes(Long userId, Integer limit);

    /**
     * 获取专家食谱
     */
    List<Recipe> getExpertRecipes(Integer limit);

    /**
     * 根据分类获取食谱
     */
    List<Recipe> getRecipesByCategory(String category, Integer page, Integer size);

    /**
     * 收藏食谱
     */
    void collectRecipe(Long userId, Long recipeId);

    /**
     * 取消收藏食谱
     */
    void uncollectRecipe(Long userId, Long recipeId);

    /**
     * 搜索食谱
     */
    List<Recipe> searchRecipes(String keyword);
}