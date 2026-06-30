// 检查登录状态
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // 已登录，显示主应用
        document.getElementById('splashScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        switchPage('diet');
    } else {
        // 未登录，显示启动页
        document.getElementById('splashScreen').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }
}
// 进入应用（点击"开始使用"按钮）
function enterApp() {
    // 检查是否已经登录过
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
        // 已登录，直接进入主应用
        document.getElementById('splashScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        switchPage('diet');
    } else {
        // 未登录，跳转到账户创建页面
        window.location.href = 'zhanghu.html';
    }
}

// 页面加载时检查登录状态
window.onload = function() {
    checkLoginStatus();
};

// 页面内容
const pages = {
    diet: `
<div class="header">
    <h1>🍽️ 今日饮食</h1>
    <p>记录每一餐，健康每一天</p>
</div>

<!-- 热量概览 -->
<div class="card">
    <div class="card-title">今日热量</div>
    <div style="text-align: center; padding: 20px;">
        <div class="stat-value" style="font-size: 48px;">1,248</div>
        <div class="stat-label">已摄入 / 2,000 kcal</div>
        <div class="progress-bar" style="margin-top: 15px; background: #e0e0e0; border-radius: 10px;">
            <div class="progress-fill" style="width: 62%;"></div>
        </div>
        <div style="margin-top: 10px; color: #667eea; font-size: 14px;">
            还可摄入 752 kcal
        </div>
    </div>
</div>

<!-- 营养成分 -->
<div class="card">
    <div class="card-title">营养成分</div>
    <div class="stat-grid">
        <div class="stat-item">
            <div class="stat-value">128g</div>
            <div class="stat-label">碳水化合物</div>
            <div class="progress-bar" style="margin-top: 8px; height: 6px;">
                <div class="progress-fill" style="width: 64%; background: #ff9800;"></div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-value">68g</div>
            <div class="stat-label">蛋白质</div>
            <div class="progress-bar" style="margin-top: 8px; height: 6px;">
                <div class="progress-fill" style="width: 72%; background: #4caf50;"></div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-value">45g</div>
            <div class="stat-label">脂肪</div>
            <div class="progress-bar" style="margin-top: 8px; height: 6px;">
                <div class="progress-fill" style="width: 56%; background: #f44336;"></div>
            </div>
        </div>
        <div class="stat-item">
            <div class="stat-value">15g</div>
            <div class="stat-label">膳食纤维</div>
            <div class="progress-bar" style="margin-top: 8px; height: 6px;">
                <div class="progress-fill" style="width: 60%; background: #9c27b0;"></div>
            </div>
        </div>
    </div>
</div>

<!-- 饮水记录 -->
<div class="card">
    <div class="card-title">💧 今日饮水</div>
    <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
            <div class="stat-value" style="font-size: 36px;">1,500</div>
            <div class="stat-label">ml / 2,000 ml</div>
        </div>
        <button class="btn btn-primary" onclick="addWater()">+250ml</button>
    </div>
    <div class="progress-bar" style="margin-top: 15px;">
        <div class="progress-fill" style="width: 75%; background: #2196f3;"></div>
    </div>
</div>

<!-- 运动记录 -->
<div class="card">
    <div class="card-title">🏃 今日运动</div>
    <div style="display: flex; gap: 15px;">
        <div class="stat-item" style="flex: 1;">
            <div class="stat-value">320</div>
            <div class="stat-label">消耗 kcal</div>
        </div>
        <div class="stat-item" style="flex: 1;">
            <div class="stat-value">45</div>
            <div class="stat-label">运动 分钟</div>
        </div>
    </div>
</div>

<!-- AI拍照识别 -->
<div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
    <div class="card-title" style="color: white; margin-bottom: 10px;">📸 AI智能识别</div>
    <p style="margin-bottom: 15px; opacity: 0.9;">拍照即可自动识别食物热量和营养成分</p>
    <button class="btn" style="background: white; color: #667eea;" onclick="openCamera()">
        拍照识别食物
    </button>
</div>

<!-- 今日饮食记录 -->
<div class="card">
    <div class="card-title">今日饮食</div>
    <div class="list-item">
        <div class="list-icon" style="background: #fff3e0;">🌅</div>
        <div class="list-content">
            <div class="list-title">早餐</div>
            <div class="list-desc">鸡蛋、牛奶、全麦面包 - 380 kcal</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
    <div class="list-item">
        <div class="list-icon" style="background: #fff9c4;">☀️</div>
        <div class="list-content">
            <div class="list-title">午餐</div>
            <div class="list-desc">鸡胸肉沙拉、米饭 - 520 kcal</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
    <div class="list-item">
        <div class="list-icon" style="background: #e1f5fe;">🍎</div>
        <div class="list-content">
            <div class="list-title">加餐</div>
            <div class="list-desc">苹果、坚果 - 180 kcal</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
    <button class="btn btn-outline" style="width: 100%; margin-top: 10px;">
        + 添加食物
    </button>
</div>
    `,

    weight: `
<div class="header">
    <h1>⚖️ 体重管理</h1>
    <p>记录每一次变化，见证更好的自己</p>
</div>

<!-- 今日数据 -->
<div class="card">
    <div class="card-title">今日数据</div>
    <div class="stat-grid">
        <div class="stat-item">
            <div class="stat-value">65.5</div>
            <div class="stat-label">体重 (kg)</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">170</div>
            <div class="stat-label">身高 (cm)</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">22.6</div>
            <div class="stat-label">BMI 指数</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">18.5%</div>
            <div class="stat-label">体脂率</div>
        </div>
    </div>
</div>

<!-- 目标进度 -->
<div class="card">
    <div class="card-title">🎯 目标进度</div>
    <div style="padding: 15px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>当前体重</span>
            <span style="font-weight: 600;">65.5 kg</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>目标体重</span>
            <span style="font-weight: 600; color: #667eea;">60 kg</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span>还需减重</span>
            <span style="font-weight: 600; color: #f44336;">5.5 kg</span>
        </div>
        <div class="progress-bar" style="margin-top: 20px; height: 12px;">
            <div class="progress-fill" style="width: 55%;"></div>
        </div>
        <div style="text-align: center; margin-top: 10px; color: #667eea;">
            已完成 55%
        </div>
    </div>
</div>

<!-- 体重记录 -->
<div class="card">
    <div class="card-title">体重记录</div>
    <div style="height: 200px; background: linear-gradient(to top, rgba(102, 126, 234, 0.1), transparent); border-radius: 10px; padding: 20px; display: flex; align-items: flex-end; justify-content: space-between;">
        <div style="width: 30px; height: 80%; background: linear-gradient(to top, #667eea, #764ba2); border-radius: 4px 4px 0 0;"></div>
        <div style="width: 30px; height: 75%; background: linear-gradient(to top, #667eea, #764ba2); border-radius: 4px 4px 0 0;"></div>
        <div style="width: 30px; height: 70%; background: linear-gradient(to top, #667eea, #764ba2); border-radius: 4px 4px 0 0;"></div>
        <div style="width: 30px; height: 68%; background: linear-gradient(to top, #667eea, #764ba2); border-radius: 4px 4px 0 0;"></div>
        <div style="width: 30px; height: 65%; background: linear-gradient(to top, #667eea, #764ba2); border-radius: 4px 4px 0 0;"></div>
        <div style="width: 30px; height: 63%; background: linear-gradient(to top, #667eea, #764ba2); border-radius: 4px 4px 0 0;"></div>
        <div style="width: 30px; height: 60%; background: #667eea; border-radius: 4px 4px 0 0;"></div>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 10px; font-size: 12px; color: #999;">
        <span>周一</span>
        <span>周二</span>
        <span>周三</span>
        <span>周四</span>
        <span>周五</span>
        <span>周六</span>
        <span>今天</span>
    </div>
</div>

<!-- 添加记录 -->
<div class="card">
    <div class="card-title">添加记录</div>
    <div class="input-group">
        <label>身高 (cm)</label>
        <input type="number" id="heightInput" placeholder="请输入身高" value="170">
    </div>
    <div class="input-group">
        <label>体重 (kg)</label>
        <input type="number" id="weightInput" placeholder="请输入体重" value="65.5">
    </div>
    <div class="input-group">
        <label>体脂率 (%)</label>
        <input type="number" id="fatInput" placeholder="请输入体脂率" value="18.5" step="0.1">
    </div>
    <button class="btn btn-primary" style="width: 100%;" onclick="saveWeight()">
        保存记录
    </button>
</div>

<!-- 健康指标 -->
<div class="card">
    <div class="card-title">健康指标</div>
    <div class="list-item">
        <div class="list-icon" style="background: #e8f5e9; color: #4caf50;">✓</div>
        <div class="list-content">
            <div class="list-title">BMI 正常</div>
            <div class="list-desc">您的BMI处于正常范围内</div>
        </div>
        <span class="tag tag-success">正常</span>
    </div>
    <div class="list-item">
        <div class="list-icon" style="background: #fff3e0; color: #ff9800;">!</div>
        <div class="list-content">
            <div class="list-title">体脂率偏上</div>
            <div class="list-desc">建议增加运动量</div>
        </div>
        <span class="tag tag-warning">注意</span>
    </div>
</div>
    `,

    chat: `
<div class="header" style="padding-bottom: 0;">
    <h1>💬 健康助手</h1>
    <p>AI助手随时为您解答健康问题</p>
</div>

<div class="chat-container">
    <div class="chat-messages" id="chatMessages">
        <div class="message assistant">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                你好！我是您的健康助手小伴 🌟<br><br>
                我可以帮您：<br>
                • 制定个性化饮食计划<br>
                • 推荐适合的食谱<br>
                • 解答营养健康问题<br>
                • 分析您的饮食习惯<br><br>
                有什么可以帮您的吗？
            </div>
        </div>
    </div>

    <div class="chat-input-area">
        <input type="text" id="chatInput" placeholder="输入您的问题..." onkeypress="handleKeyPress(event)">
        <button class="btn btn-primary" style="padding: 12px 20px; border-radius: 25px;" onclick="sendMessage()">
            发送
        </button>
    </div>
</div>
    `,

    recipes: `
<div class="header">
    <h1>📖 食谱中心</h1>
    <p>健康美味，营养均衡</p>
</div>

<!-- 会员专属 -->
<div class="card" style="background: linear-gradient(135deg, #ffd700 0%, #ff9800 100%); color: white;">
    <div class="card-title" style="color: white;">👑 会员专属</div>
    <p style="margin-bottom: 15px;">解锁VIP，享受专属定制食谱服务</p>
    <button class="btn" style="background: white; color: #ff9800;">立即开通</button>
</div>

<!-- 快捷入口 -->
<div class="card">
    <div class="function-grid" style="padding: 0; gap: 10px;">
        <div class="function-item" style="padding: 15px;">
            <div class="function-icon" style="background: linear-gradient(135deg, #ff6b6b, #ff8e8e);">🔥</div>
            <div class="function-name">热门食谱</div>
        </div>
        <div class="function-item" style="padding: 15px;">
            <div class="function-icon" style="background: linear-gradient(135deg, #4ecdc4, #6dd5ed);">⭐</div>
            <div class="function-name">精选食谱</div>
        </div>
        <div class="function-item" style="padding: 15px;">
            <div class="function-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">📚</div>
            <div class="function-name">食谱库</div>
        </div>
        <div class="function-item" style="padding: 15px;">
            <div class="function-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c);">✨</div>
            <div class="function-name">AI智能</div>
        </div>
        <div class="function-item" style="padding: 15px;">
            <div class="function-icon" style="background: linear-gradient(135deg, #11998e, #38ef7d);">🎯</div>
            <div class="function-name">专家食谱</div>
        </div>
        <div class="function-item" style="padding: 15px;">
            <div class="function-icon" style="background: linear-gradient(135deg, #fa709a, #fee140);">🛒</div>
            <div class="function-name">商城</div>
        </div>
    </div>
</div>

<!-- 小贴士 -->
<div class="card">
    <div class="card-title">💡 小贴士</div>
    <div class="list-item">
        <div class="list-icon" style="background: #e3f2fd; color: #2196f3;">💧</div>
        <div class="list-content">
            <div class="list-title">每天喝足8杯水</div>
            <div class="list-desc">保持充足的水分摄入有助于新陈代谢</div>
        </div>
    </div>
    <div class="list-item">
        <div class="list-icon" style="background: #f3e5f5; color: #9c27b0;">🥗</div>
        <div class="list-content">
            <div class="list-title">多吃深色蔬菜</div>
            <div class="list-desc">深色蔬菜富含维生素和矿物质</div>
        </div>
    </div>
    <div class="list-item">
        <div class="list-icon" style="background: #fff3e0; color: #ff9800;">⏰</div>
        <div class="list-content">
            <div class="list-title">规律进餐时间</div>
            <div class="list-desc">按时吃饭有助于维持稳定的血糖水平</div>
        </div>
    </div>
</div>

<!-- 热门食谱 -->
<div class="card">
    <div class="card-title">🔥 热门食谱</div>
    <div class="recipe-card">
        <div class="recipe-image">🥗</div>
        <div class="recipe-content">
            <div class="recipe-title">鸡胸肉牛油果沙拉</div>
            <div class="recipe-info">
                <span>🔥 328 kcal</span>
                <span>⏱️ 15分钟</span>
                <span>⭐ 4.9</span>
            </div>
        </div>
    </div>
    <div class="recipe-card">
        <div class="recipe-image">🍜</div>
        <div class="recipe-content">
            <div class="recipe-title">荞麦面蔬菜汤</div>
            <div class="recipe-info">
                <span>🔥 256 kcal</span>
                <span>⏱️ 20分钟</span>
                <span>⭐ 4.8</span>
            </div>
        </div>
    </div>
    <div class="recipe-card">
        <div class="recipe-image">🥣</div>
        <div class="recipe-content">
            <div class="recipe-title">燕麦蓝莓碗</div>
            <div class="recipe-info">
                <span>🔥 298 kcal</span>
                <span>⏱️ 10分钟</span>
                <span>⭐ 4.7</span>
            </div>
        </div>
    </div>
</div>

<!-- 网络热门减肥法 -->
<div class="card">
    <div class="card-title">🌟 热门减肥法跟练</div>
    <div class="list-item">
        <div class="list-icon" style="background: #fce4ec; color: #e91e63;">📊</div>
        <div class="list-content">
            <div class="list-title">16+8 间歇性断食</div>
            <div class="list-desc">科学减肥，轻松上手</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
    <div class="list-item">
        <div class="list-icon" style="background: #e8f5e9; color: #4caf50;">🥬</div>
        <div class="list-content">
            <div class="list-title">低碳水饮食法</div>
            <div class="list-desc">快速燃脂，效果显著</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
    <div class="list-item">
        <div class="list-icon" style="background: #fff3e0; color: #ff9800;">🍎</div>
        <div class="list-content">
            <div class="list-title">5+2 轻断食法</div>
            <div class="list-desc">灵活安排，易于坚持</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
</div>

<!-- 瘦身食谱推荐 -->
<div class="card">
    <div class="card-title">🥗 瘦身食谱推荐</div>
    <div style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px;">
        <div class="recipe-card" style="min-width: 150px;">
            <div class="recipe-image" style="height: 100px;">🥑</div>
            <div class="recipe-content">
                <div class="recipe-title" style="font-size: 14px;">牛油果吐司</div>
                <div class="recipe-info">245 kcal</div>
            </div>
        </div>
        <div class="recipe-card" style="min-width: 150px;">
            <div class="recipe-image" style="height: 100px;">🍣</div>
            <div class="recipe-content">
                <div class="recipe-title" style="font-size: 14px;">三文鱼沙拉</div>
                <div class="recipe-info">380 kcal</div>
            </div>
        </div>
        <div class="recipe-card" style="min-width: 150px;">
            <div class="recipe-image" style="height: 100px;">🍲</div>
            <div class="recipe-content">
                <div class="recipe-title" style="font-size: 14px;">蔬菜豆腐汤</div>
                <div class="recipe-info">168 kcal</div>
            </div>
        </div>
    </div>
</div>

<!-- 自定义食谱 -->
<div class="card">
    <div class="card-title">✏️ 自定义食谱</div>
    <p style="color: #666; margin-bottom: 15px;">创建属于自己的健康食谱</p>
    <button class="btn btn-primary" style="width: 100%;">创建新食谱</button>
</div>
    `,

    profile: `
<div class="header">
    <div style="display: flex; align-items: center; gap: 20px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; font-size: 40px;">
            😊
        </div>
        <div style="flex: 1;">
            <h2 style="font-size: 22px; margin-bottom: 5px;">小美</h2>
            <p style="opacity: 0.8; font-size: 14px;">每天进步一点点 💪</p>
        </div>
        <div style="font-size: 24px;">✏️</div>
    </div>
</div>

<!-- 健康数据概览 -->
<div class="card">
    <div class="card-title">今日数据</div>
    <div class="stat-grid">
        <div class="stat-item">
            <div class="stat-value">22.6</div>
            <div class="stat-label">BMI 指数</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">1,248</div>
            <div class="stat-label">今日卡路里</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">28</div>
            <div class="stat-label">饮食天数</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">65.5</div>
            <div class="stat-label">当前体重</div>
        </div>
    </div>
</div>

<!-- 功能模块 -->
<div class="card">
    <div class="card-title">功能中心</div>
    <div class="function-grid" style="padding: 0; gap: 15px;">
        <div class="function-item">
            <div class="function-icon" style="background: linear-gradient(135deg, #ff6b6b, #ff8e8e);">🍽️</div>
            <div class="function-name">饮食记录</div>
        </div>
        <div class="function-item">
            <div class="function-icon" style="background: linear-gradient(135deg, #4ecdc4, #6dd5ed);">🎯</div>
            <div class="function-name">健康目标</div>
        </div>
        <div class="function-item">
            <div class="function-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">📊</div>
            <div class="function-name">营养分析</div>
        </div>
        <div class="function-item">
            <div class="function-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c);">⭐</div>
            <div class="function-name">食谱收藏</div>
        </div>
        <div class="function-item">
            <div class="function-icon" style="background: linear-gradient(135deg, #11998e, #38ef7d);">⚖️</div>
            <div class="function-name">体重管理</div>
        </div>
        <div class="function-item">
            <div class="function-icon" style="background: linear-gradient(135deg, #fa709a, #fee140);">💧</div>
            <div class="function-name">饮水管理</div>
        </div>
    </div>
</div>

<!-- 设置菜单 -->
<div class="card">
    <div class="card-title">设置</div>
    <div class="list-item">
        <div class="list-icon" style="background: #e3f2fd; color: #2196f3;">⚙️</div>
        <div class="list-content">
            <div class="list-title">账户设置</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
    <div class="list-item">
        <div class="list-icon" style="background: #f3e5f5; color: #9c27b0;">🔒</div>
        <div class="list-content">
            <div class="list-title">隐私政策</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
    <div class="list-item">
        <div class="list-icon" style="background: #fff3e0; color: #ff9800;">ℹ️</div>
        <div class="list-content">
            <div class="list-title">关于我们</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
    <div class="list-item">
        <div class="list-icon" style="background: #e8f5e9; color: #4caf50;">💬</div>
        <div class="list-content">
            <div class="list-title">意见反馈</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
    <div class="list-item" onclick="handleLogout()" style="cursor: pointer;">
        <div class="list-icon" style="background: #ffebee; color: #f44336;">🚪</div>
        <div class="list-content">
            <div class="list-title" style="color: #f44336;">退出登录</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
</div>

<!-- 底部信息 -->
<div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    卡伴日记 v1.0.0<br>
    © 2026 All Rights Reserved
</div>
    `
};

// 当前页面
let currentPage = 'diet';

// 页面切换
function switchPage(pageName) {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = pages[pageName];
    currentPage = pageName;

    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });

    // 滚动到顶部
    window.scrollTo(0, 0);
}

// 导航点击事件
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const pageName = item.dataset.page;
        switchPage(pageName);
    });
});

// 初始化加载默认页面
switchPage('diet');

// 添加饮水记录
function addWater() {
    alert('已添加 250ml 饮水记录！');
}

// 保存体重记录
function saveWeight() {
    const height = document.getElementById('heightInput').value;
    const weight = document.getElementById('weightInput').value;
    const fat = document.getElementById('fatInput').value;

    alert(`已保存记录：\n身高：${height}cm\n体重：${weight}kg\n体脂率：${fat}%`);
}

// 打开相机
function openCamera() {
    alert('正在打开相机...\n（实际项目中会调用相机API进行食物识别）');
}

// 发送消息
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    const messagesContainer = document.getElementById('chatMessages');

    // 添加用户消息
    messagesContainer.innerHTML += `
        <div class="message user">
            <div class="message-content">${message}</div>
            <div class="message-avatar">😊</div>
        </div>
    `;

    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // 模拟AI回复
    setTimeout(() => {
        messagesContainer.innerHTML += `
            <div class="message assistant">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    收到您的问题：${message}<br><br>
                    让我来为您解答...
                </div>
            </div>
        `;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}

// 回车发送消息
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// 退出登录
function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        // 清除登录状态
        localStorage.removeItem('isLoggedIn');
        // 跳转到启动页
        window.location.href = 'main.html';
    }
}