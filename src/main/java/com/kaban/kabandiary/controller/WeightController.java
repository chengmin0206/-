package com.kaban.kabandiary.controller;

import com.kaban.kabandiary.common.result.Result;
import com.kaban.kabandiary.dto.WeightStatDTO;
import com.kaban.kabandiary.entity.WeightRecord;
import com.kaban.kabandiary.service.WeightService;
import com.kaban.kabandiary.util.JwtUtil;
import javax.annotation.Resource;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 体重管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/weight")
@Validated
public class WeightController {

    @Resource
    private WeightService weightService;

    @Resource
    private JwtUtil jwtUtil;

    /**
     * 获取体重统计
     */
    @GetMapping("/stat")
    public Result<WeightStatDTO> getWeightStat(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        WeightStatDTO stat = weightService.getWeightStat(userId);
        return Result.success(stat);
    }

    /**
     * 添加体重记录
     */
    @PostMapping("/record")
    public Result<Void> addWeightRecord(
            @RequestHeader("Authorization") String token,
            @RequestParam @NotNull @DecimalMin("0") BigDecimal weight,
            @RequestParam(required = false) BigDecimal bodyFatRate,
            @RequestParam(required = false) String note) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        weightService.addWeightRecord(userId, weight, bodyFatRate, note);
        return Result.success();
    }

    /**
     * 获取体重记录列表
     */
    @GetMapping("/records")
    public Result<List<WeightRecord>> getWeightRecords(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "30") int days) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        List<WeightRecord> records = weightService.getWeightRecords(userId, days);
        return Result.success(records);
    }

    /**
     * 更新身高
     */
    @PutMapping("/height")
    public Result<Void> updateHeight(
            @RequestHeader("Authorization") String token,
            @RequestParam @NotNull @DecimalMin("0") BigDecimal height) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        weightService.updateHeight(userId, height);
        return Result.success();
    }

    /**
     * 更新目标体重
     */
    @PutMapping("/target")
    public Result<Void> updateTargetWeight(
            @RequestHeader("Authorization") String token,
            @RequestParam @NotNull @DecimalMin("0") BigDecimal targetWeight) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        weightService.updateTargetWeight(userId, targetWeight);
        return Result.success();
    }
}