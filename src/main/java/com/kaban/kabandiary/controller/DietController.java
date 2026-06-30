package com.kaban.kabandiary.controller;

import com.kaban.kabandiary.common.result.Result;
import com.kaban.kabandiary.dto.DietRecordDTO;
import com.kaban.kabandiary.dto.DietStatDTO;
import com.kaban.kabandiary.entity.DietRecord;
import com.kaban.kabandiary.service.DietService;
import com.kaban.kabandiary.util.JwtUtil;
import javax.annotation.Resource;
import javax.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 饮食管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/diet")
public class DietController {

    @Resource
    private DietService dietService;

    @Resource
    private JwtUtil jwtUtil;

    /**
     * 获取今日饮食统计
     */
    @GetMapping("/stat")
    public Result<DietStatDTO> getTodayStat(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        DietStatDTO stat = dietService.getDietStat(userId, LocalDate.now());
        return Result.success(stat);
    }

    /**
     * 获取指定日期饮食统计
     */
    @GetMapping("/stat/date")
    public Result<DietStatDTO> getStatByDate(
            @RequestHeader("Authorization") String token,
            @RequestParam String date) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        DietStatDTO stat = dietService.getDietStat(userId, LocalDate.parse(date));
        return Result.success(stat);
    }

    /**
     * 获取今日饮食记录
     */
    @GetMapping("/records")
    public Result<List<DietRecord>> getTodayRecords(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        List<DietRecord> records = dietService.getTodayDietRecords(userId);
        return Result.success(records);
    }

    /**
     * 添加饮食记录
     */
    @PostMapping("/record")
    public Result<Void> addDietRecord(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody DietRecordDTO dto) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        dietService.addDietRecord(userId, dto);
        return Result.success();
    }

    /**
     * 删除饮食记录
     */
    @DeleteMapping("/record/{id}")
    public Result<Void> deleteDietRecord(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        dietService.deleteDietRecord(id, userId);
        return Result.success();
    }

    /**
     * AI识别食物
     */
    @PostMapping("/recognize")
    public Result<List<String>> recognizeFood(@RequestBody String imageUrl) {
        List<String> foods = dietService.recognizeFood(imageUrl);
        return Result.success(foods);
    }
}