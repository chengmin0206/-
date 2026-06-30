package com.kaban.kabandiary.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kaban.kabandiary.config.QAnythingConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class QAnythingService {

    @Resource
    private QAnythingConfig qAnythingConfig;

    @Resource
    private RestTemplate restTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String chat(String question) {
        if (!qAnythingConfig.getEnabled()) {
            log.warn("QAnything 未启用");
            return null;
        }

        try {
            String url = qAnythingConfig.getFullChatUrl();

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("uuid", qAnythingConfig.getBotId());
            requestBody.put("question", question);
            requestBody.put("sourceNeeded", true);

            List<Map<String, String>> history = new ArrayList<>();
            requestBody.put("history", history);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", qAnythingConfig.getBotKey());

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            log.info("发送请求到 QAnything: url={}, botId={}, question={}", url, qAnythingConfig.getBotId(), question);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.info("收到 QAnything 响应: {}", response.getBody());
                return parseResponse(response.getBody());
            } else {
                log.error("QAnything 请求失败: status={}, body={}", response.getStatusCode(), response.getBody());
                return null;
            }

        } catch (Exception e) {
            log.error("调用 QAnything 失败", e);
            return null;
        }
    }

    public String healthChat(String question) {
        String answer = chat(question);
        if (answer != null && !answer.isEmpty()) {
            return answer;
        }
        log.warn("QAnything API 调用失败，无法获取回答");
        return "抱歉，我现在无法回答您的问题，请稍后再试。";
    }

    private String parseResponse(String responseBody) {
        try {
            String lastDataJson = null;
            String[] lines = responseBody.split("\n");
            for (String line : lines) {
                String trimmed = line.trim();
                if (trimmed.startsWith("data:")) {
                    String jsonStr = trimmed.substring(5).trim();
                    if (!jsonStr.isEmpty() && !"[DONE]".equals(jsonStr)) {
                        lastDataJson = jsonStr;
                    }
                }
            }

            if (lastDataJson != null) {
                JsonNode root = objectMapper.readTree(lastDataJson);
                if (root.has("errorCode") && root.get("errorCode").asInt() != 0) {
                    String errorMsg = root.has("msg") ? root.get("msg").asText() : "未知错误";
                    log.error("QAnything 返回错误: errorCode={}, msg={}", root.get("errorCode").asInt(), errorMsg);
                    return null;
                }
                if (root.has("result")) {
                    JsonNode result = root.get("result");
                    if (result.has("response")) {
                        String response = result.get("response").asText();
                        response = response.replace("<tool_call>", "").replace("</think>", "");
                        response = response.replaceAll("<response>", "").replaceAll("</response>", "");
                        return response.trim();
                    }
                }
            }

            JsonNode root = objectMapper.readTree(responseBody);
            if (root.has("result")) {
                JsonNode result = root.get("result");
                if (result.has("response")) {
                    return result.get("response").asText();
                }
                if (result.isTextual()) {
                    return result.asText();
                }
            }
            if (root.has("errorCode") && root.get("errorCode").asInt() != 0) {
                String errorMsg = root.has("msg") ? root.get("msg").asText() : "未知错误";
                log.error("QAnything 返回错误: errorCode={}, msg={}", root.get("errorCode").asInt(), errorMsg);
                return null;
            }

            return responseBody;
        } catch (Exception e) {
            log.error("解析 QAnything 响应失败", e);
            return responseBody;
        }
    }
}