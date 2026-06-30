package com.kaban.kabandiary.controller;

import com.kaban.kabandiary.common.result.Result;
import com.kaban.kabandiary.entity.Recipe;
import com.kaban.kabandiary.service.RecipeService;
import com.kaban.kabandiary.util.JwtUtil;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 食谱控制器
 */
@Slf4j
@RestController
@RequestMapping("/recipe")
public class RecipeController {

    @Resource
    private RecipeService recipeService;

    @Resource
    private JwtUtil jwtUtil;

    /**
     * 获取热门食谱
     */
    @GetMapping("/hot")
    public Result<List<Recipe>> getHotRecipes(@RequestParam(defaultValue = "10") Integer limit) {
        List<Recipe> recipes = recipeService.getHotRecipes(limit);
        return Result.success(recipes);
    }

    /**
     * 获取精选食谱
     */
    @GetMapping("/selected")
    public Result<List<Recipe>> getSelectedRecipes(@RequestParam(defaultValue = "10") Integer limit) {
        List<Recipe> recipes = recipeService.getSelectedRecipes(limit);
        return Result.success(recipes);
    }

    /**
     * 获取AI智能食谱
     */
    @GetMapping("/ai")
    public Result<List<Recipe>> getAiRecipes(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "10") Integer limit) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        List<Recipe> recipes = recipeService.getAiRecipes(userId, limit);
        return Result.success(recipes);
    }

    /**
     * 获取专家食谱
     */
    @GetMapping("/expert")
    public Result<List<Recipe>> getExpertRecipes(@RequestParam(defaultValue = "10") Integer limit) {
        List<Recipe> recipes = recipeService.getExpertRecipes(limit);
        return Result.success(recipes);
    }

    /**
     * 搜索食谱
     */
    @GetMapping("/search")
    public Result<List<Recipe>> searchRecipes(@RequestParam String keyword) {
        List<Recipe> recipes = recipeService.searchRecipes(keyword);
        return Result.success(recipes);
    }

    /**
     * 收藏食谱
     */
    @PostMapping("/collect/{recipeId}")
    public Result<Void> collectRecipe(
            @RequestHeader("Authorization") String token,
            @PathVariable Long recipeId) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        recipeService.collectRecipe(userId, recipeId);
        return Result.success();
    }

    /**
     * 取消收藏食谱
     */
    @DeleteMapping("/collect/{recipeId}")
    public Result<Void> uncollectRecipe(
            @RequestHeader("Authorization") String token,
            @PathVariable Long recipeId) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        recipeService.uncollectRecipe(userId, recipeId);
        return Result.success();
    }

    /**
     * 根据分类获取食谱
     */
    @GetMapping("/category/{category}")
    public Result<List<Recipe>> getRecipesByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        List<Recipe> recipes = recipeService.getRecipesByCategory(category, page, size);
        return Result.success(recipes);
    }
}