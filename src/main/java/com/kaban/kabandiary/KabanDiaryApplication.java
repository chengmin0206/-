package com.kaban.kabandiary;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 卡伴日记应用启动类
 */
@SpringBootApplication
@MapperScan("com.kaban.kabandiary.mapper")
public class KabanDiaryApplication {

    public static void main(String[] args) {
        SpringApplication.run(KabanDiaryApplication.class, args);
        System.out.println("\n" +
                "========================================\n" +
                "📝  卡伴日记后端服务启动成功！\n" +
                "========================================\n" +
                "🌐  访问地址: http://localhost:8080/api\n" +
                "💬  WebSocket: ws://localhost:8080/ws/chat?token=xxx\n" +
                "📊  Druid监控: http://localhost:8080/api/druid\n" +
                "========================================\n");
    }
}