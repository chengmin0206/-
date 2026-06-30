package com.kaban.kabandiary.dto;

import javax.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 登录请求DTO
 */
@Data
public class LoginDTO {

    /**
     * 手机号
     */
    @NotBlank(message = "手机号不能为空")
    private String phone;

    /**
     * 验证码
     */
    private String verifyCode;

    /**
     * 密码(加密)
     */
    private String password;

    /**
     * 登录类型: 1-手机验证码, 2-微信, 3-QQ, 4-访客, 5-密码登录
     */
    private Integer loginType;

    /**
     * OpenID (第三方登录用)
     */
    private String openId;

    /**
     * 昵称 (第三方登录用)
     */
    private String nickname;

    /**
     * 头像 (第三方登录用)
     */
    private String avatar;
}