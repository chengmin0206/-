package com.kaban.kabandiary.controller;

import com.kaban.kabandiary.common.result.Result;
import com.kaban.kabandiary.dto.UserInfoDTO;
import com.kaban.kabandiary.entity.User;
import com.kaban.kabandiary.mapper.UserMapper;
import com.kaban.kabandiary.service.UserService;
import com.kaban.kabandiary.util.JwtUtil;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 用户控制器
 */
@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    private UserService userService;

    @Resource
    private JwtUtil jwtUtil;

    @Resource
    private UserMapper userMapper;

    /**
     * 获取用户信息
     */
    @GetMapping("/info")
    public Result<UserInfoDTO> getUserInfo(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        UserInfoDTO userInfo = userService.getUserInfo(userId);
        return Result.success(userInfo);
    }

    /**
     * 更新用户昵称
     */
    @PutMapping("/nickname")
    public Result<Void> updateNickname(
            @RequestHeader("Authorization") String token,
            @RequestParam String nickname) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        User user = userService.getUserById(userId);
        user.setNickname(nickname);
        userMapper.updateById(user);
        return Result.success();
    }

    /**
     * 更新用户签名
     */
    @PutMapping("/signature")
    public Result<Void> updateSignature(
            @RequestHeader("Authorization") String token,
            @RequestParam String signature) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        User user = userService.getUserById(userId);
        user.setSignature(signature);
        userMapper.updateById(user);
        return Result.success();
    }
}