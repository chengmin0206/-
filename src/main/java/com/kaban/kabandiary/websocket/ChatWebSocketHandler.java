package com.kaban.kabandiary.websocket;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kaban.kabandiary.entity.ChatMessage;
import com.kaban.kabandiary.mapper.ChatMessageMapper;
import com.kaban.kabandiary.service.QAnythingService;
import com.kaban.kabandiary.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 聊天WebSocket处理器
 */
@Slf4j
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    // 消息类型常量
    private static final int MESSAGE_TYPE_USER = 1;
    private static final int MESSAGE_TYPE_AI = 2;

    @Resource
    private JwtUtil jwtUtil;

    @Resource
    private ChatMessageMapper chatMessageMapper;

    @Resource
    private QAnythingService qAnythingService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // 存储用户会话: userId -> WebSocketSession
    private final Map<Long, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    // 存储会话ID: sessionId -> userId
    private final Map<String, Long> sessionToUser = new ConcurrentHashMap<>();

    // 异步任务执行器
    @Resource
    private ThreadPoolTaskExecutor asyncExecutor;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        if (session.getUri() == null) {
            session.close();
            log.warn("WebSocket连接被拒绝: URI为空");
            return;
        }

        String uri = session.getUri().toString();
        String token = extractToken(uri);

        if (token == null || !jwtUtil.validateToken(token)) {
            session.close();
            log.warn("WebSocket连接被拒绝: Token无效");
            return;
        }

        Long userId = jwtUtil.getUserIdFromToken(token);
        String sessionId = session.getId();

        userSessions.put(userId, session);
        sessionToUser.put(sessionId, userId);

        log.info("用户 {} 建立WebSocket连接, sessionId: {}", userId, sessionId);

        // 发送欢迎消息
        sendMessage(userId, createMessage(MESSAGE_TYPE_AI, "你好！我是您的健康助手小伴 🌟\n\n我可以帮您：\n• 制定个性化饮食计划\n• 推荐适合的食谱\n• 解答营养健康问题\n• 分析您的饮食习惯\n\n有什么可以帮您的吗？"));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        String sessionId = session.getId();
        Long userId = sessionToUser.get(sessionId);

        if (userId == null) {
            log.warn("未找到对应的用户: {}", sessionId);
            return;
        }

        try {
            JsonNode jsonNode = objectMapper.readTree(payload);
            String content = jsonNode.get("content").asText();

            // 保存用户消息
            saveMessage(userId, MESSAGE_TYPE_USER, content);

            log.info("收到用户 {} 的消息: {}", userId, content);

            // 模拟AI回复
            String aiResponse = generateAIResponse(content, userId);

            // 延迟发送，模拟AI思考
            asyncExecutor.execute(() -> {
                try {
                    Thread.sleep(500);
                    sendMessage(userId, createMessage(MESSAGE_TYPE_AI, aiResponse));
                    saveMessage(userId, MESSAGE_TYPE_AI, aiResponse);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    log.warn("AI回复发送被中断", e);
                }
            });

        } catch (Exception e) {
            log.error("处理消息失败", e);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String sessionId = session.getId();
        Long userId = sessionToUser.remove(sessionId);
        if (userId != null) {
            userSessions.remove(userId);
            log.info("用户 {} 断开WebSocket连接", userId);
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        log.error("WebSocket传输错误", exception);
        session.close();
    }

    /**
     * 发送消息给指定用户
     */
    public void sendMessage(Long userId, String message) {
        WebSocketSession session = userSessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (IOException e) {
                log.error("发送消息失败", e);
            }
        }
    }

    /**
     * 创建消息JSON
     */
    private String createMessage(int messageType, String content) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", messageType);
        message.put("content", content);
        message.put("timestamp", System.currentTimeMillis());
        try {
            return objectMapper.writeValueAsString(message);
        } catch (Exception e) {
            log.error("创建消息失败", e);
            return "{\"type\":" + messageType + ",\"content\":\"" + content + "\"}";
        }
    }

    /**
     * 生成AI回复
     */
    private String generateAIResponse(String userMessage, Long userId) {
        // 使用 QAnything 服务获取智能回复
        try {
            String response = qAnythingService.healthChat(userMessage);
            if (response != null && !response.isEmpty()) {
                return response;
            }
        } catch (Exception e) {
            log.error("调用 QAnything 失败，使用本地回复", e);
        }

        // 失败时使用本地回复（备用方案）
        String lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.contains("减肥") || lowerMessage.contains("减重")) {
            return "关于减肥，我建议您：\n\n1. 合理控制热量摄入，每天减少300-500kcal\n2. 增加蛋白质摄入，保持肌肉量\n3. 多吃蔬菜，增加饱腹感\n4. 规律运动，每周至少150分钟\n5. 保证充足睡眠，帮助新陈代谢\n\n您可以从记录饮食开始，我来帮您分析！";
        } else if (lowerMessage.contains("食谱") || lowerMessage.contains("吃什么")) {
            return "根据您的需求，我推荐以下食谱：\n\n🥗 鸡胸肉牛油果沙拉 - 328kcal\n高蛋白低脂肪，适合减脂期\n\n🍜 荞麦面蔬菜汤 - 256kcal\n低热量饱腹，营养丰富\n\n🥣 燕麦蓝莓碗 - 298kcal\n营养早餐，提供持久能量\n\n您可以查看食谱页获取更多详情！";
        } else if (lowerMessage.contains("体重") || lowerMessage.contains("减")) {
            return "体重管理需要注意以下几点：\n\n• 建议每周减重0.5-1kg，不宜过快\n• 定期测量体重，建议每天固定时间\n• 关注体脂率变化，而不仅是体重数字\n• 配合饮食记录，了解热量摄入\n• 坚持运动，提高基础代谢\n\n您今天体重是多少？我可以帮您记录！";
        } else if (lowerMessage.contains("谢谢")) {
            return "不客气！😊 有什么问题随时问我，我会一直陪伴您的健康之旅！";
        } else {
            return "收到您的问题：" + userMessage + "\n\n作为您的健康助手，我可以帮您：\n• 🍽️ 制定饮食计划\n• 📖 推荐健康食谱\n• ⚖️ 分析体重变化\n• 💧 监控饮水量\n• 🏃 运动建议\n\n请告诉我您需要哪方面的帮助？";
        }
    }

    /**
     * 保存消息到数据库
     */
    private void saveMessage(Long userId, int messageType, String content) {
        ChatMessage message = new ChatMessage();
        message.setUserId(userId);
        message.setMessageType(messageType);
        message.setContent(content);
        message.setSessionId(String.valueOf(userId));
        chatMessageMapper.insert(message);
    }

    /**
     * 从URI中提取Token
     */
    private String extractToken(String uri) {
        if (uri != null && uri.contains("token=")) {
            int start = uri.indexOf("token=") + 6;
            int end = uri.indexOf("&", start);
            return end > 0 ? uri.substring(start, end) : uri.substring(start);
        }
        return null;
    }
}