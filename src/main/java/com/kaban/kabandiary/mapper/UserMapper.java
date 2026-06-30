package com.kaban.kabandiary.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.kaban.kabandiary.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户Mapper
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
}