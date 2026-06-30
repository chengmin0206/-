package com.kaban.kabandiary.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.kaban.kabandiary.entity.WeightRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 体重记录Mapper
 */
@Mapper
public interface WeightRecordMapper extends BaseMapper<WeightRecord> {
}