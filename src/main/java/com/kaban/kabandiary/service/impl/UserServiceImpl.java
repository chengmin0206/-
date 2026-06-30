package com.kaban.kabandiary.service.impl;

import cn.hutool.core.util.RandomUtil;
import cn.hutool.crypto.digest.DigestUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.kaban.kabandiary.common.exception.BusinessException;
import com.kaban.kabandiary.dto.LoginDTO;
import com.kaban.kabandiary.dto.UserInfoDTO;
import com.kaban.kabandiary.entity.User;
import com.kaban.kabandiary.entity.UserProfile;
import com.kaban.kabandiary.mapper.UserMapper;
import com.kaban.kabandiary.mapper.UserProfileMapper;
import com.kaban.kabandiary.service.UserService;
import com.kaban.kabandiary.util.JwtUtil;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 用户服务实现
 */
@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Resource
    private UserMapper userMapper;

    @Resource
    private UserProfileMapper userProfileMapper;

    @Resource
    private JwtUtil jwtUtil;

    private static final String VERIFY_CODE_PREFIX = "verify_code:";
    private static final int VERIFY_CODE_EXPIRE_MINUTES = 5;

    private final Map<String, CacheEntry> verifyCodeCache = new ConcurrentHashMap<>();

    private static class CacheEntry {
        final String code;
        final long expireTime;
        CacheEntry(String code, long expireMillis) {
            this.code = code;
            this.expireTime = System.currentTimeMillis() + expireMillis;
        }
        boolean isExpired() {
            return System.currentTimeMillis() > expireTime;
        }
    }

    private String getVerifyCode(String phone) {
        CacheEntry entry = verifyCodeCache.get(VERIFY_CODE_PREFIX + phone);
        if (entry == null || entry.isExpired()) {
            verifyCodeCache.remove(VERIFY_CODE_PREFIX + phone);
            return null;
        }
        return entry.code;
    }

    private void setVerifyCode(String phone, String code) {
        verifyCodeCache.put(VERIFY_CODE_PREFIX + phone,
                new CacheEntry(code, VERIFY_CODE_EXPIRE_MINUTES * 60 * 1000L));
    }

    private void deleteVerifyCode(String phone) {
        verifyCodeCache.remove(VERIFY_CODE_PREFIX + phone);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public String login(LoginDTO loginDTO) {
        User user;

        if (loginDTO.getLoginType() == null || loginDTO.getLoginType() == 1) {
            // 手机验证码登录
            // 验证验证码
            String cacheCode = getVerifyCode(loginDTO.getPhone());
            if (cacheCode == null || !cacheCode.equals(loginDTO.getVerifyCode())) {
                throw new BusinessException("验证码错误或已过期");
            }

            // 查找或创建用户
            user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                    .eq(User::getPhone, loginDTO.getPhone()));

            if (user == null) {
                user = new User();
                user.setPhone(loginDTO.getPhone());
                user.setNickname("卡伴用户" + RandomUtil.randomNumbers(4));
                user.setLoginType(1);
                user.setStatus(1);
                userMapper.insert(user);

                // 创建用户资料
                UserProfile profile = new UserProfile();
                profile.setUserId(user.getId());
                profile.setDailyCalorieGoal(2000);
                profile.setDailyWaterGoal(2000);
                profile.setDietDays(0);
                userProfileMapper.insert(profile);
            }

            deleteVerifyCode(loginDTO.getPhone());
        } else if (loginDTO.getLoginType() == 5) {
            // 密码登录
            user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                    .eq(User::getPhone, loginDTO.getPhone()));

            if (user == null) {
                throw new BusinessException("用户不存在，请先注册");
            }

            if (user.getPassword() == null) {
                throw new BusinessException("该账号未设置密码，请使用验证码登录");
            }

            // 验证密码
            String encryptedPassword = DigestUtil.md5Hex(loginDTO.getPassword() + "kaban_salt");
            if (!encryptedPassword.equals(user.getPassword())) {
                throw new BusinessException("密码错误");
            }
        } else if (loginDTO.getLoginType() == 4) {
            // 访客登录
            user = new User();
            user.setPhone("guest_" + System.currentTimeMillis());
            user.setNickname("访客" + RandomUtil.randomNumbers(4));
            user.setLoginType(4);
            user.setStatus(1);
            userMapper.insert(user);

            UserProfile profile = new UserProfile();
            profile.setUserId(user.getId());
            profile.setDailyCalorieGoal(2000);
            profile.setDailyWaterGoal(2000);
            profile.setDietDays(0);
            userProfileMapper.insert(profile);
        } else {
            // 第三方登录 (微信、QQ等)
            user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                    .eq(User::getOpenId, loginDTO.getOpenId())
                    .eq(User::getLoginType, loginDTO.getLoginType()));

            if (user == null) {
                user = new User();
                user.setPhone("third_" + System.currentTimeMillis());
                user.setNickname(loginDTO.getNickname());
                user.setAvatar(loginDTO.getAvatar());
                user.setOpenId(loginDTO.getOpenId());
                user.setLoginType(loginDTO.getLoginType());
                user.setStatus(1);
                userMapper.insert(user);

                UserProfile profile = new UserProfile();
                profile.setUserId(user.getId());
                profile.setDailyCalorieGoal(2000);
                profile.setDailyWaterGoal(2000);
                profile.setDietDays(0);
                userProfileMapper.insert(profile);
            }
        }

        // 生成Token
        return jwtUtil.generateToken(user.getId(), user.getPhone());
    }

    @Override
    public UserInfoDTO getUserInfo(Long userId) {
        User user = getUserById(userId);
        UserProfile profile = userProfileMapper.selectOne(new LambdaQueryWrapper<UserProfile>()
                .eq(UserProfile::getUserId, userId));

        UserInfoDTO dto = new UserInfoDTO();
        dto.setUserId(user.getId());
        dto.setNickname(user.getNickname());
        dto.setAvatar(user.getAvatar());
        dto.setSignature(user.getSignature());

        if (profile != null) {
            dto.setDietDays(profile.getDietDays());
            dto.setWeight(profile.getWeight());

            // 计算BMI
            if (profile.getHeight() != null && profile.getWeight() != null) {
                double heightInMeters = profile.getHeight().doubleValue() / 100;
                double bmi = profile.getWeight().doubleValue() / (heightInMeters * heightInMeters);
                dto.setBmi(BigDecimal.valueOf(Math.round(bmi * 10.0) / 10.0));
            }

            // TODO: 查询今日卡路里
            dto.setTodayCalories(1248);
        }

        return dto;
    }

    @Override
    public User getUserById(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        return user;
    }

    @Override
    public void sendVerifyCode(String phone) {
        // 手机号格式验证
        if (!phone.matches("^1[3-9]\\d{9}$")) {
            throw new BusinessException("手机号格式不正确");
        }

        // 生成6位验证码 - 测试环境固定为123456
        String code = "123456";  // 测试环境固定验证码，生产环境请改为: RandomUtil.randomNumbers(6);

        setVerifyCode(phone, code);

        // TODO: 实际项目中调用短信服务发送验证码
        log.info("发送验证码到 {}: {}", phone, code);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void register(String phone, String password, String verifyCode) {
        // 手机号格式验证
        if (!phone.matches("^1[3-9]\\d{9}$")) {
            throw new BusinessException("手机号格式不正确");
        }

        // 验证码校验
        String cacheCode = getVerifyCode(phone);
        if (cacheCode == null || !cacheCode.equals(verifyCode)) {
            throw new BusinessException("验证码错误或已过期");
        }

        // 检查用户是否已存在
        User existingUser = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getPhone, phone));
        if (existingUser != null) {
            throw new BusinessException("该手机号已注册");
        }

        // 密码长度验证
        if (password == null || password.length() < 6) {
            throw new BusinessException("密码长度不能少于6位");
        }

        // 创建用户
        User user = new User();
        user.setPhone(phone);
        user.setPassword(DigestUtil.md5Hex(password + "kaban_salt"));
        user.setNickname("卡伴用户" + RandomUtil.randomNumbers(4));
        user.setLoginType(1);
        user.setStatus(1);
        userMapper.insert(user);

        // 创建用户资料
        UserProfile profile = new UserProfile();
        profile.setUserId(user.getId());
        profile.setDailyCalorieGoal(2000);
        profile.setDailyWaterGoal(2000);
        profile.setDietDays(0);
        userProfileMapper.insert(profile);

        deleteVerifyCode(phone);
    }

    @Override
    public void logout(String token) {
        // TODO: 将Token加入黑名单
        log.info("用户退出登录");
    }
}