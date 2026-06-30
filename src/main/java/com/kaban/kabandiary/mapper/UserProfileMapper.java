package com.kaban.kabandiary.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.kaban.kabandiary.entity.UserProfile;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户资料Mapper
 */
@Mapper
public interface UserProfileMapper extends BaseMapper<UserProfile> {
}