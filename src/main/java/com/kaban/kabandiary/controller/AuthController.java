package com.kaban.kabandiary.controller;

import com.kaban.kabandiary.common.result.Result;
import com.kaban.kabandiary.dto.LoginDTO;
import com.kaban.kabandiary.service.UserService;
import javax.annotation.Resource;
import javax.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Resource
    private UserService userService;

    /**
     * 发送验证码
     */
    @PostMapping("/verify-code")
    public Result<String> sendVerifyCode(@RequestParam String phone) {
        userService.sendVerifyCode(phone);
        return Result.success("验证码已发送");
    }

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<String> login(@Valid @RequestBody LoginDTO loginDTO) {
        String token = userService.login(loginDTO);
        return Result.success("登录成功", token);
    }

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public Result<String> register(@RequestParam String phone,
                                    @RequestParam String password,
                                    @RequestParam String verifyCode) {
        userService.register(phone, password, verifyCode);
        return Result.success("注册成功");
    }

    /**
     * 退出登录
     */
    @PostMapping("/logout")
    public Result<String> logout(@RequestHeader("Authorization") String token) {
        userService.logout(token);
        return Result.success("退出成功");
    }
}