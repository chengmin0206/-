package com.kaban.kabandiary.controller;

import com.kaban.kabandiary.config.QAnythingConfig;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class IndexController {

    @Resource
    private QAnythingConfig qAnythingConfig;

    @Resource
    private RestTemplate restTemplate;

    @GetMapping({"/", "/api"})
    public String index() {
        return "login.html";
    }

    @GetMapping("/api/docs")
    @ResponseBody
    public Map<String, Object> apiIndex() {
        Map<String, Object> result = new HashMap<>();
        result.put("message", "卡伴日记 API");
        result.put("version", "1.0.0");

        Map<String, String> docs = new HashMap<>();
        docs.put("认证", "/api/auth/*");
        docs.put("用户", "/api/user/*");
        docs.put("体重", "/api/weight/*");
        docs.put("饮食", "/api/diet/*");
        docs.put("饮水", "/api/water/*");
        docs.put("食谱", "/api/recipe/*");
        docs.put("WebSocket", "ws://localhost:8080/ws/chat?token={token}");
        result.put("接口文档", docs);

        Map<String, String> notes = new HashMap<>();
        notes.put("数据源", "HikariCP");
        notes.put("框架", "Spring Boot 2.7.18");
        notes.put("JDK", "1.8");
        result.put("说明", notes);

        return result;
    }

    @GetMapping("/api/test-qanything")
    @ResponseBody
    public Map<String, Object> testQAnything() {
        Map<String, Object> result = new HashMap<>();
        String personalKey = qAnythingConfig.getApiKey();
        String botKey = qAnythingConfig.getBotKey();
        String botId = qAnythingConfig.getBotId();
        String kbId = qAnythingConfig.getKbId();
        String botKeyNoPrefix = botKey.startsWith("bot-") ? botKey.substring(4) : botKey;

        List<Map<String, Object>> results = new ArrayList<>();
        int idx = 0;

        String baseUrl = "https://openapi.youdao.com/q_anything/api";

        idx++;
        results.add(doGetTest(idx, "personal key: GET /bot/list", baseUrl + "/bot/list", personalKey));

        idx++;
        String curtime = String.valueOf(System.currentTimeMillis() / 1000);
        String salt = java.util.UUID.randomUUID().toString();
        String sign = sha256(personalKey + salt + curtime);
        results.add(doTestWithCustomHeaders(idx, "chat_stream: appKey+salt+curtime+sign in body", baseUrl + "/chat_stream", () -> {
            Map<String, Object> b = new HashMap<>();
            b.put("question", "你好");
            b.put("kbids", Collections.singletonList(kbId));
            b.put("history", new ArrayList<>());
            b.put("appKey", personalKey);
            b.put("salt", salt);
            b.put("curtime", curtime);
            b.put("sign", sign);
            b.put("signType", "v4");
            return b;
        }, h -> {
            h.setContentType(MediaType.APPLICATION_JSON);
        }));

        idx++;
        String sign2 = sha256(personalKey + salt + curtime);
        results.add(doTestWithCustomHeaders(idx, "chat_stream: appKey+salt+curtime+sign in body + Auth header", baseUrl + "/chat_stream", () -> {
            Map<String, Object> b = new HashMap<>();
            b.put("question", "你好");
            b.put("kbids", Collections.singletonList(kbId));
            b.put("history", new ArrayList<>());
            b.put("appKey", personalKey);
            b.put("salt", salt);
            b.put("curtime", curtime);
            b.put("sign", sign2);
            b.put("signType", "v4");
            return b;
        }, h -> {
            h.setContentType(MediaType.APPLICATION_JSON);
            h.set("Authorization", personalKey);
        }));

        idx++;
        results.add(doTestWithCustomHeaders(idx, "bot/chat_stream: bot key no prefix + streaming=true", baseUrl + "/bot/chat_stream", () -> {
            Map<String, Object> b = new HashMap<>();
            b.put("question", "你好");
            b.put("kbids", Collections.singletonList(botId));
            b.put("history", new ArrayList<>());
            b.put("streaming", true);
            return b;
        }, h -> {
            h.setContentType(MediaType.APPLICATION_JSON);
            h.set("Authorization", botKeyNoPrefix);
        }));

        idx++;
        results.add(doTestWithCustomHeaders(idx, "bot/chat_stream: bot key no prefix + streaming=false", baseUrl + "/bot/chat_stream", () -> {
            Map<String, Object> b = new HashMap<>();
            b.put("question", "你好");
            b.put("kbids", Collections.singletonList(botId));
            b.put("history", new ArrayList<>());
            b.put("streaming", false);
            return b;
        }, h -> {
            h.setContentType(MediaType.APPLICATION_JSON);
            h.set("Authorization", botKeyNoPrefix);
        }));

        idx++;
        results.add(doTestWithCustomHeaders(idx, "bot/chat_stream: bot key no prefix + prompt", baseUrl + "/bot/chat_stream", () -> {
            Map<String, Object> b = new HashMap<>();
            b.put("question", "你好");
            b.put("kbids", Collections.singletonList(botId));
            b.put("history", new ArrayList<>());
            b.put("prompt", "你是一个健康助手");
            return b;
        }, h -> {
            h.setContentType(MediaType.APPLICATION_JSON);
            h.set("Authorization", botKeyNoPrefix);
        }));

        idx++;
        results.add(doTestWithCustomHeaders(idx, "bot/chat_stream: bot key no prefix + kbids[kbId] + streaming=false", baseUrl + "/bot/chat_stream", () -> {
            Map<String, Object> b = new HashMap<>();
            b.put("question", "你好");
            b.put("kbids", Collections.singletonList(kbId));
            b.put("history", new ArrayList<>());
            b.put("streaming", false);
            return b;
        }, h -> {
            h.setContentType(MediaType.APPLICATION_JSON);
            h.set("Authorization", botKeyNoPrefix);
        }));

        idx++;
        results.add(doTestWithCustomHeaders(idx, "bot/chat_stream: bot key no prefix + NO history + streaming=false", baseUrl + "/bot/chat_stream", () -> {
            Map<String, Object> b = new HashMap<>();
            b.put("question", "你好");
            b.put("kbids", Collections.singletonList(botId));
            b.put("streaming", false);
            return b;
        }, h -> {
            h.setContentType(MediaType.APPLICATION_JSON);
            h.set("Authorization", botKeyNoPrefix);
        }));

        result.put("tests", results);
        Map<String, Object> config = new HashMap<>();
        config.put("botId", botId);
        config.put("kbId", kbId);
        config.put("botKeyNoPrefix", botKeyNoPrefix.substring(0, Math.min(10, botKeyNoPrefix.length())) + "...");
        config.put("personalKeyPrefix", personalKey.substring(0, Math.min(15, personalKey.length())) + "...");
        result.put("config", config);
        return result;
    }

    private Map<String, Object> doTestWithCustomHeaders(int idx, String desc, String url, java.util.function.Supplier<Map<String, Object>> bodySupplier, java.util.function.Consumer<HttpHeaders> headerCustomizer) {
        Map<String, Object> tr = new HashMap<>();
        tr.put("idx", idx);
        tr.put("desc", desc);
        try {
            Map<String, Object> body = bodySupplier.get();
            HttpHeaders h = new HttpHeaders();
            headerCustomizer.accept(h);
            HttpEntity<Map<String, Object>> req = new HttpEntity<>(body, h);
            ResponseEntity<String> resp = restTemplate.postForEntity(url, req, String.class);
            tr.put("status", resp.getStatusCodeValue());
            String respBody = resp.getBody();
            tr.put("response", respBody != null && respBody.length() > 1000 ? respBody.substring(0, 1000) : respBody);
        } catch (Exception e) {
            tr.put("status", "ERROR");
            tr.put("error", e.getMessage() != null && e.getMessage().length() > 500 ? e.getMessage().substring(0, 500) : e.getMessage());
        }
        return tr;
    }

    private Map<String, Object> doGetTest(int idx, String desc, String url, String authKey) {
        Map<String, Object> tr = new HashMap<>();
        tr.put("idx", idx);
        tr.put("desc", desc);
        try {
            HttpHeaders h = new HttpHeaders();
            h.set("Authorization", authKey);
            HttpEntity<Void> req = new HttpEntity<>(h);
            ResponseEntity<String> resp = restTemplate.exchange(url, HttpMethod.GET, req, String.class);
            tr.put("status", resp.getStatusCodeValue());
            String respBody = resp.getBody();
            tr.put("response", respBody != null && respBody.length() > 1000 ? respBody.substring(0, 1000) : respBody);
        } catch (Exception e) {
            tr.put("status", "ERROR");
            tr.put("error", e.getMessage() != null && e.getMessage().length() > 500 ? e.getMessage().substring(0, 500) : e.getMessage());
        }
        return tr;
    }

    private Map<String, Object> doTest(int idx, String desc, String url, String authKey, java.util.function.Supplier<Map<String, Object>> bodySupplier) {
        Map<String, Object> tr = new HashMap<>();
        tr.put("idx", idx);
        tr.put("desc", desc);
        try {
            Map<String, Object> body = bodySupplier.get();
            HttpHeaders h = new HttpHeaders();
            h.setContentType(MediaType.APPLICATION_JSON);
            h.set("Authorization", authKey);
            HttpEntity<Map<String, Object>> req = new HttpEntity<>(body, h);
            ResponseEntity<String> resp = restTemplate.postForEntity(url, req, String.class);
            tr.put("status", resp.getStatusCodeValue());
            String respBody = resp.getBody();
            tr.put("response", respBody != null && respBody.length() > 1000 ? respBody.substring(0, 1000) : respBody);
        } catch (Exception e) {
            tr.put("status", "ERROR");
            tr.put("error", e.getMessage() != null && e.getMessage().length() > 500 ? e.getMessage().substring(0, 500) : e.getMessage());
        }
        return tr;
    }

    private String sha256(String input) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}