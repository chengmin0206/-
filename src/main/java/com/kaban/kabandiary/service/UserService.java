package com.kaban.kabandiary.service;

import com.kaban.kabandiary.dto.LoginDTO;
import com.kaban.kabandiary.dto.UserInfoDTO;
import com.kaban.kabandiary.entity.User;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 用户登录
     */
    String login(LoginDTO loginDTO);

    /**
     * 用户注册（密码方式）
     */
    void register(String phone, String password, String verifyCode);

    /**
     * 获取用户信息
     */
    UserInfoDTO getUserInfo(Long userId);

    /**
     * 获取用户基本信息
     */
    User getUserById(Long userId);

    /**
     * 发送验证码
     */
    void sendVerifyCode(String phone);

    /**
     * 退出登录
     */
    void logout(String token);
}