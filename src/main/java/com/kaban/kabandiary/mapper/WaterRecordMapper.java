package com.kaban.kabandiary.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.kaban.kabandiary.entity.WaterRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 饮水记录Mapper
 */
@Mapper
public interface WaterRecordMapper extends BaseMapper<WaterRecord> {
}