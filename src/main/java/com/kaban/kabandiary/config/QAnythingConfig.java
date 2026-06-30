package com.kaban.kabandiary.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "qanything")
public class QAnythingConfig {

    private String baseUrl = "https://openapi.youdao.com/q_anything/api";

    private String apiKey = "qanything-huhasSe1B9QCNtUndEDmdZSAK9QkvHzM";

    private String botKey = "bot-1fnEZAEtHhUrjH7RN6LDOvOosy8Zv3KZ";

    private String botId = "EB94CDDDB3724152";

    private String kbId = "KB9bf98ed989a64efcb7280c3f058a157e_240430";

    private Boolean enabled = true;

    private String chatPath = "/bot/chat_stream";

    public String getFullChatUrl() {
        return baseUrl + chatPath;
    }
}