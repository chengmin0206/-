package com.kaban.kabandiary.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.kaban.kabandiary.entity.Recipe;
import com.kaban.kabandiary.entity.RecipeCollection;
import com.kaban.kabandiary.mapper.RecipeMapper;
import com.kaban.kabandiary.mapper.RecipeCollectionMapper;
import com.kaban.kabandiary.service.RecipeService;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 食谱服务实现
 */
@Slf4j
@Service
public class RecipeServiceImpl implements RecipeService {

    @Resource
    private RecipeMapper recipeMapper;

    @Resource
    private RecipeCollectionMapper recipeCollectionMapper;

    @Override
    public List<Recipe> getHotRecipes(Integer limit) {
        Page<Recipe> page = new Page<>(1, limit != null ? limit : 10);
        return recipeMapper.selectPage(
                page,
                new LambdaQueryWrapper<Recipe>()
                        .eq(Recipe::getCategory, "hot")
                        .eq(Recipe::getStatus, 1)
                        .orderByDesc(Recipe::getViewCount)
        ).getRecords();
    }

    @Override
    public List<Recipe> getSelectedRecipes(Integer limit) {
        Page<Recipe> page = new Page<>(1, limit != null ? limit : 10);
        return recipeMapper.selectPage(
                page,
                new LambdaQueryWrapper<Recipe>()
                        .eq(Recipe::getCategory, "selected")
                        .eq(Recipe::getStatus, 1)
                        .orderByDesc(Recipe::getRating)
        ).getRecords();
    }

    @Override
    public List<Recipe> getAiRecipes(Long userId, Integer limit) {
        // TODO: 根据用户画像和饮食记录推荐AI食谱
        Page<Recipe> page = new Page<>(1, limit != null ? limit : 10);
        return recipeMapper.selectPage(
                page,
                new LambdaQueryWrapper<Recipe>()
                        .eq(Recipe::getCategory, "ai")
                        .eq(Recipe::getStatus, 1)
                        .orderByDesc(Recipe::getRating)
        ).getRecords();
    }

    @Override
    public List<Recipe> getExpertRecipes(Integer limit) {
        Page<Recipe> page = new Page<>(1, limit != null ? limit : 10);
        return recipeMapper.selectPage(
                page,
                new LambdaQueryWrapper<Recipe>()
                        .eq(Recipe::getCategory, "expert")
                        .eq(Recipe::getStatus, 1)
                        .orderByDesc(Recipe::getRating)
        ).getRecords();
    }

    @Override
    public List<Recipe> getRecipesByCategory(String category, Integer page, Integer size) {
        Page<Recipe> pageParam = new Page<>(page != null ? page : 1, size != null ? size : 20);
        return recipeMapper.selectPage(
                pageParam,
                new LambdaQueryWrapper<Recipe>()
                        .eq(Recipe::getCategory, category)
                        .eq(Recipe::getStatus, 1)
                        .orderByDesc(Recipe::getCreateTime)
        ).getRecords();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void collectRecipe(Long userId, Long recipeId) {
        // 检查是否已收藏
        Long count = recipeCollectionMapper.selectCount(
                new QueryWrapper<RecipeCollection>()
                        .eq("user_id", userId)
                        .eq("recipe_id", recipeId)
        );

        if (count == 0) {
            // 添加收藏
            RecipeCollection collection = new RecipeCollection();
            collection.setUserId(userId);
            collection.setRecipeId(recipeId);
            collection.setCreateTime(java.time.LocalDateTime.now());
            recipeCollectionMapper.insert(collection);

            // 增加食谱收藏数
            Recipe recipe = recipeMapper.selectById(recipeId);
            if (recipe != null) {
                recipe.setCollectCount((recipe.getCollectCount() == null ? 0 : recipe.getCollectCount()) + 1);
                recipeMapper.updateById(recipe);
            }

            log.info("用户 {} 收藏食谱 {}", userId, recipeId);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void uncollectRecipe(Long userId, Long recipeId) {
        recipeCollectionMapper.delete(
                new QueryWrapper<RecipeCollection>()
                        .eq("user_id", userId)
                        .eq("recipe_id", recipeId)
        );

        // 减少食谱收藏数
        Recipe recipe = recipeMapper.selectById(recipeId);
        if (recipe != null && recipe.getCollectCount() != null && recipe.getCollectCount() > 0) {
            recipe.setCollectCount(recipe.getCollectCount() - 1);
            recipeMapper.updateById(recipe);
        }

        log.info("用户 {} 取消收藏食谱 {}", userId, recipeId);
    }

    @Override
    public List<Recipe> searchRecipes(String keyword) {
        return recipeMapper.selectList(
                new LambdaQueryWrapper<Recipe>()
                        .like(Recipe::getTitle, keyword)
                        .or()
                        .like(Recipe::getDescription, keyword)
                        .eq(Recipe::getStatus, 1)
                        .orderByDesc(Recipe::getRating)
        );
    }
}