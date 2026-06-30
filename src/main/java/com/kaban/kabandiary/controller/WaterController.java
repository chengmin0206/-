package com.kaban.kabandiary.controller;

import com.kaban.kabandiary.common.result.Result;
import com.kaban.kabandiary.service.WaterService;
import com.kaban.kabandiary.util.JwtUtil;
import javax.annotation.Resource;
import javax.validation.constraints.Min;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 饮水管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/water")
@Validated
public class WaterController {

    @Resource
    private WaterService waterService;

    @Resource
    private JwtUtil jwtUtil;

    /**
     * 添加饮水记录
     */
    @PostMapping("/add")
    public Result<Void> addWater(
            @RequestHeader("Authorization") String token,
            @RequestParam @Min(1) Integer amount) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        waterService.addWaterRecord(userId, amount);
        return Result.success();
    }

    /**
     * 获取今日饮水信息
     */
    @GetMapping("/today")
    public Result<Map<String, Object>> getTodayWater(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        int todayIntake = waterService.getTodayWaterIntake(userId);
        int goal = waterService.getWaterGoal(userId);

        Map<String, Object> data = new HashMap<>();
        data.put("todayIntake", todayIntake);
        data.put("goal", goal);
        data.put("remaining", Math.max(0, goal - todayIntake));
        data.put("progress", goal > 0 ? (int) ((double) todayIntake / goal * 100) : 0);

        return Result.success(data);
    }
}