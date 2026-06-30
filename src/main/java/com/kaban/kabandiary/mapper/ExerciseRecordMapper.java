package com.kaban.kabandiary.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.kaban.kabandiary.entity.ExerciseRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 运动记录Mapper
 */
@Mapper
public interface ExerciseRecordMapper extends BaseMapper<ExerciseRecord> {
}