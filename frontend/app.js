const DEBUG = true;

function log(message) {
    if (DEBUG) console.log('[DEBUG]', message);
}

let currentAiRole = 'liaomi';

const aiRoleConfig = {
    liaomi: {
        name: '健康助手小伴',
        avatar: 'ui页面设计素材/AI选择页/底部中间图标（廖米） - 副本.png',
        navIcon: 'ui页面设计素材/导航栏/底部中间图标（廖米）.png',
        fallback: '🌿',
        greeting: '你好！我是健康助手小伴<br><br>我可以帮您：<br>• 制定个性化饮食计划<br>• 推荐适合的食谱<br>• 解答营养健康问题<br>• 分析您的饮食习惯<br><br>有什么可以帮您的吗？',
        quickActions: [
            { text: '今天吃什么', question: '今天应该吃什么更健康？' },
            { text: '减脂计划', question: '帮我制定一个减脂饮食计划' },
            { text: '高蛋白食物', question: '哪些食物蛋白质含量高？' },
            { text: '饮水量建议', question: '每天喝多少水合适？' }
        ]
    },
    yuezai: {
        name: '运动达人跃仔',
        avatar: 'ui页面设计素材/AI选择页/跃仔.png',
        navIcon: 'ui页面设计素材/AI选择页/跃仔.png',
        fallback: '💪',
        greeting: '你好！我是运动达人跃仔<br><br>我可以帮您：<br>• 制定个性化运动计划<br>• 指导正确的健身动作<br>• 计算运动消耗热量<br>• 提供运动恢复建议<br><br>准备好开始运动了吗？',
        quickActions: [
            { text: '减脂运动', question: '推荐一些高效的减脂运动' },
            { text: '增肌计划', question: '帮我制定增肌训练计划' },
            { text: '拉伸放松', question: '运动后如何正确拉伸放松？' },
            { text: '运动饮食', question: '运动前后应该怎么吃？' }
        ]
    },
    sasa: {
        name: '营养专家飒飒',
        avatar: 'ui页面设计素材/AI选择页/飒飒.png',
        navIcon: 'ui页面设计素材/AI选择页/飒飒.png',
        fallback: '🥗',
        greeting: '你好！我是营养专家飒飒<br><br>我可以帮您：<br>• 科学搭配每日三餐<br>• 分析食物营养成分<br>• 制定特殊饮食方案<br>• 解答营养搭配疑问<br><br>想了解什么营养知识呢？',
        quickActions: [
            { text: '营养搭配', question: '一日三餐怎么搭配最营养？' },
            { text: '维生素补充', question: '日常需要补充哪些维生素？' },
            { text: '低卡食谱', question: '推荐一些低卡又好吃的食谱' },
            { text: '食材功效', question: '常见食材有哪些养生功效？' }
        ]
    },
    maixiaoxing: {
        name: '心理导师麦小星',
        avatar: 'ui页面设计素材/AI选择页/麦小星.png',
        navIcon: 'ui页面设计素材/AI选择页/麦小星.png',
        fallback: '🧘',
        greeting: '你好！我是心理导师麦小星<br><br>我可以帮您：<br>• 缓解压力与焦虑<br>• 改善睡眠质量<br>• 提供情绪管理建议<br>• 引导正念冥想练习<br><br>今天心情怎么样呢？',
        quickActions: [
            { text: '缓解焦虑', question: '最近总是焦虑怎么办？' },
            { text: '改善睡眠', question: '晚上失眠有什么好办法？' },
            { text: '减压方法', question: '工作压力大如何减压？' },
            { text: '正念冥想', question: '教我一个简单的正念冥想' }
        ]
    }
};

const pages = {
    weight: `
<div class="weight-header">
    <div class="weight-header-top">
        <div class="weight-greeting">
            <div class="weight-greeting-text" id="weightGreeting">早上好</div>
            <div class="weight-greeting-sub">今天也要加油哦</div>
        </div>
        <div class="weight-date" id="weightDate"></div>
    </div>
</div>

<div class="weight-index-card">
    <div class="weight-index-img-wrap">
        <img src="ui页面设计素材/体重记录页/体重指数图.png" alt="体重指数" class="weight-index-img" onerror="this.style.display='none'">
        <div class="weight-index-overlay">
            <div class="weight-index-value" id="weightRingValue">--</div>
            <div class="weight-index-unit">kg</div>
            <div class="weight-index-label">当前体重</div>
        </div>
    </div>
    <div class="weight-index-footer">
        <div class="weight-index-footer-item">
            <span class="weight-index-footer-label">目标</span>
            <span class="weight-index-footer-value" id="weightTargetDisplay">-- kg</span>
        </div>
        <div class="weight-index-footer-divider"></div>
        <div class="weight-index-footer-item">
            <span class="weight-index-footer-label">还需</span>
            <span class="weight-index-footer-value weight-index-footer-accent" id="weightNeedDisplay">-- kg</span>
        </div>
    </div>
</div>

<div class="weight-stats-row">
    <div class="weight-stat-chip">
        <div class="weight-stat-chip-icon" style="background: #e8f5e9;">
            <img src="ui页面设计素材/体重记录页/体脂BMI图示.svg" alt="BMI" width="22" height="22" onerror="this.outerHTML='<svg viewBox=\'0 0 1024 1024\' width=\'22\' height=\'22\'><path d=\'M225.2 574.6c4.5 4 11.2 5.9 17.9 5.9a24.5 24.5 0 0 0 17.9-7.9l118.3-124.2v551c0 11.8 11.2 21.7 24.6 21.7h81.5c13.4 0 24.6-9.8 24.6-21.7V681.1h34.6v320.4c0 11.8 11.2 21.7 24.6 21.7h81.5c13.4 0 24.5-9.8 24.5-21.7V449.4l122.8 125.2c8.9 8.9 24.5 8.9 34.6 1l59.2-53.2a18.6 18.6 0 0 0 0-28.6L635.3 324.3c-35.7-34.5-87.1-55.2-139.5-55.2H473c-53.6 1-103.8 20.7-139.5 55.2L161.6 494.7a18.6 18.6 0 0 0 0 28.6L225.2 574.6zm166.3-454.5c0 66.1 60.3 119.3 134 119.3s134-53.2 134-119.3c0-66-60.3-119.3-134-119.3s-134 53.2-134 119.3z\' fill=\'#36da28\'/></svg>'">
        </div>
        <div class="weight-stat-chip-info">
            <div class="weight-stat-chip-value" id="weightBmi">--</div>
            <div class="weight-stat-chip-label">BMI</div>
        </div>
    </div>
    <div class="weight-stat-chip">
        <div class="weight-stat-chip-icon" style="background: #fff3e0;">
            <img src="ui页面设计素材/体重记录页/身体维度指标图示.svg" alt="体脂" width="22" height="22" onerror="this.outerHTML='🏃'">
        </div>
        <div class="weight-stat-chip-info">
            <div class="weight-stat-chip-value" id="weightFat">--%</div>
            <div class="weight-stat-chip-label">体脂率</div>
        </div>
    </div>
    <div class="weight-stat-chip">
        <div class="weight-stat-chip-icon" style="background: #e3f2fd;">
            <img src="ui页面设计素材/饮食记录页/杠铃.svg" alt="身高" width="22" height="22" onerror="this.outerHTML='📏'">
        </div>
        <div class="weight-stat-chip-info">
            <div class="weight-stat-chip-value" id="weightHeight">--</div>
            <div class="weight-stat-chip-label">身高cm</div>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-title-row">
        <span class="card-title">体重趋势</span>
        <span class="card-title-sub">近7天</span>
    </div>
    <div class="weight-chart-container" id="weightChartContainer">
        <div class="loading">加载中</div>
    </div>
</div>

<div class="card">
    <div class="card-title-row">
        <span class="card-title">记录体重</span>
    </div>
    <div class="weight-input-row">
        <div class="weight-input-group">
            <label>身高 (cm)</label>
            <input type="number" id="heightInput" placeholder="0.0" step="0.1" oninput="calcBmi()">
        </div>
        <div class="weight-input-group">
            <label>体重 (kg)</label>
            <input type="number" id="weightInput" placeholder="0.0" step="0.1" oninput="calcBmi()">
        </div>
        <div class="weight-input-group">
            <label>体脂率 (%)</label>
            <input type="number" id="fatInput" placeholder="0.0" step="0.1">
        </div>
        <button class="btn-weight-save" onclick="saveWeight()">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white"/></svg>
        </button>
    </div>
    <div class="weight-input-row" style="margin-top: 10px;">
        <div class="weight-input-group">
            <label>目标体重 (kg)</label>
            <input type="number" id="targetWeightInput" placeholder="0.0" step="0.1">
        </div>
    </div>
    <div class="weight-calc-result" id="weightCalcResult" style="display: none;">
        <div class="weight-calc-item">
            <span class="weight-calc-label">BMI</span>
            <span class="weight-calc-value" id="calcBmiValue">--</span>
            <span class="weight-calc-tag" id="calcBmiTag">--</span>
        </div>
    </div>
</div>
    `,

    diet: `
<div class="diet-header">
    <div class="diet-header-top">
        <div class="diet-greeting">
            <div class="diet-greeting-text">今日饮食</div>
            <div class="diet-greeting-sub">合理搭配，均衡营养</div>
        </div>
        <div class="diet-date" id="dietDate"></div>
    </div>
</div>

<div class="diet-ring-section">
    <div class="diet-ring-container">
        <svg class="diet-ring-svg" viewBox="0 0 200 200">
            <circle class="diet-ring-bg" cx="100" cy="100" r="85"/>
            <circle class="diet-ring-fill" cx="100" cy="100" r="85" id="dietRingFill" style="stroke-dashoffset: 534;"/>
        </svg>
        <div class="diet-ring-center">
            <div class="diet-ring-value" id="dietRingValue">0</div>
            <div class="diet-ring-unit">kcal</div>
            <div class="diet-ring-label">已摄入</div>
        </div>
    </div>
    <div class="diet-ring-info">
        <div class="diet-ring-info-item">
            <span class="diet-ring-info-label">推荐</span>
            <span class="diet-ring-info-value" id="dietRecommended">-- kcal</span>
        </div>
        <div class="diet-ring-info-divider"></div>
        <div class="diet-ring-info-item">
            <span class="diet-ring-info-label">剩余</span>
            <span class="diet-ring-info-value diet-ring-info-accent" id="dietRemaining">-- kcal</span>
        </div>
    </div>
</div>

<div class="diet-nutrition-section">
    <div class="diet-nutrition-title">营养素摄入</div>
    <div class="diet-nutrition-bars">
        <div class="diet-nutrition-bar-item">
            <div class="diet-nutrition-bar-header">
                <span class="diet-nutrition-bar-name">
                    <img src="ui页面设计素材/饮食记录页/火.svg" alt="" width="16" height="16" style="vertical-align: middle; margin-right: 4px;" onerror="this.outerHTML='<svg viewBox=\'0 0 1024 1024\' width=\'16\' height=\'16\' style=\'vertical-align: middle; margin-right: 4px;\'><path d=\'M859.9 609.9l0 45.6c-0.7 2.2-1.5 4.4-2 6.7-4.7 24.1-7.3 48.8-14.3 72.2-20.8 69-59.9 126.5-114.7 173.5-42.2 36.2-89.8 62.4-144.1 75.2-17.9 4.2-36.2 6.7-54.3 10l-45.6 0c-2.2-0.7-4.5-1.7-6.8-1.9-48.1-3-93.7-15.5-136.5-37.4-80.9-41.2-139.2-102.5-165.8-190.7-5.7-18.9-8-38.6-12-58l0-43.5c1.7-10.7 3.2-21.5 5.2-32.2 8.6-46.7 29.4-88 56.8-126.2 25.9-35.9 53.4-70.7 78-107.5 26.6-40 39.4-84.3 31.9-132.9-1.5-9.6-2.9-19.2-4.3-28.8 1-0.3 2-0.5 3-0.7 59.3 62.2 69 138.5 60.5 220.9 2.2-2.3 4-3.9 5.4-5.8 50.3-68.1 72-143.3 55.6-227.5-10.4-53.6-33-101.8-70.3-141.8C369.3 61.8 349.7 47.7 331.6 32l18.7 0c1.5 0.6 3 1.7 4.5 1.9 32.8 2.8 63.7 13 93 27.2 67.2 32.5 121.6 80.6 167.2 139.2 67 86.3 110.5 182 119.1 292.2 3.3 42.1-1 83-12.2 123.3-4.2 15.3-10.2 30-15.7 45.9 21.7-9.3 38.2-23.4 51-41.7 38-54.8 48.7-115.9 40.1-183.4 2.8 3.2 4.2 4.5 5.2 6.1 22.9 36.2 40.1 74.8 49 116.8C855.1 576.2 857.1 593.2 859.9 609.9\' fill=\'#FF6B35\'/></svg>'">
                    碳水
                </span>
                <span class="diet-nutrition-bar-value" id="dietCarbValue">0g</span>
            </div>
            <div class="diet-nutrition-bar-track">
                <div class="diet-nutrition-bar-fill carb" id="dietCarbBar" style="width: 0%;"></div>
            </div>
        </div>
        <div class="diet-nutrition-bar-item">
            <div class="diet-nutrition-bar-header">
                <span class="diet-nutrition-bar-name">
                    <img src="ui页面设计素材/饮食记录页/杠铃.svg" alt="" width="16" height="16" style="vertical-align: middle; margin-right: 4px;" onerror="this.outerHTML='<svg viewBox=\'0 0 1024 1024\' width=\'16\' height=\'16\' style=\'vertical-align: middle; margin-right: 4px;\'><path d=\'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z\' fill=\'#4FC3F7\'/></svg>'">
                    蛋白质
                </span>
                <span class="diet-nutrition-bar-value" id="dietProteinValue">0g</span>
            </div>
            <div class="diet-nutrition-bar-track">
                <div class="diet-nutrition-bar-fill protein" id="dietProteinBar" style="width: 0%;"></div>
            </div>
        </div>
        <div class="diet-nutrition-bar-item">
            <div class="diet-nutrition-bar-header">
                <span class="diet-nutrition-bar-name">
                    <img src="ui页面设计素材/饮食记录页/水杯.svg" alt="" width="16" height="16" style="vertical-align: middle; margin-right: 4px;" onerror="this.outerHTML='<svg viewBox=\'0 0 1024 1024\' width=\'16\' height=\'16\' style=\'vertical-align: middle; margin-right: 4px;\'><path d=\'M832 448h-68V304c0-87.2-70.8-158-158-158H418c-87.2 0-158 70.8-158 158v144h-68c-17.6 0-32 14.4-32 32v416c0 17.6 14.4 32 32 32h640c17.6 0 32-14.4 32-32V480c0-17.6-14.4-32-32-32z\' fill=\'#FFB74D\'/></svg>'">
                    脂肪
                </span>
                <span class="diet-nutrition-bar-value" id="dietFatValue">0g</span>
            </div>
            <div class="diet-nutrition-bar-track">
                <div class="diet-nutrition-bar-fill fat" id="dietFatBar" style="width: 0%;"></div>
            </div>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-title-row">
        <span class="card-title">
            <img src="ui页面设计素材/饮食记录页/水杯.svg" alt="" width="18" height="18" style="vertical-align: middle; margin-right: 4px;" onerror="this.outerHTML='<svg viewBox=\'0 0 1024 1024\' width=\'18\' height=\'18\' style=\'vertical-align: middle; margin-right: 4px;\'><path d=\'M832 192H192c-35.2 0-64 28.8-64 64v512c0 35.2 28.8 64 64 64h640c35.2 0 64-28.8 64-64V256c0-35.2-28.8-64-64-64z\' fill=\'#4FC3F7\'/></svg>'">
            今日饮水
        </span>
        <span class="card-title-sub" id="waterProgress">0%</span>
    </div>
    <div id="waterCard">
        <div class="loading">加载中</div>
    </div>
</div>

<div class="card">
    <div class="card-title-row">
        <span class="card-title">饮食记录</span>
        <button class="btn-diet-add" onclick="showAddFoodModal()">+ 添加</button>
    </div>
    <div id="dietRecords">
        <div class="loading">加载中</div>
    </div>
</div>

<div class="diet-ai-card" onclick="openCamera()">
    <div class="diet-ai-icon">
        <svg viewBox="0 0 1024 1024" width="28" height="28"><path d="M859.9104 609.92512l0 45.6c-0.67968 2.21952-1.5104 4.4352-1.9648 6.70464-4.66048 24.09984-7.28448 48.82944-14.31552 72.22016-20.84992 69.02016-59.92064 126.53952-114.6944 173.50016-42.24512 36.2496-89.7856 62.36544-144.1344 75.22048-17.87008 4.23552-36.19456 6.73024-54.32064 10.0352l-45.5744 0c-2.21952-0.6848-4.49024-1.72032-6.75456-1.87008-48.12544-2.9952-93.72544-15.52512-136.50048-37.38496-80.86528-41.18528-139.19488-102.5152-165.83552-190.74048-5.67424-18.8544-8.03968-38.62016-11.9744-57.97504l0-43.50976c1.7152-10.69056 3.2-21.47456 5.21984-32.16 8.61952-46.68544 29.36576-88.0256 56.83968-126.19008 25.91488-35.92064 53.44-70.70464 78.016-107.53536 26.56896-39.95008 39.424-84.2944 31.88992-132.9152-1.4848-9.60512-2.87488-19.20896-4.33536-28.76416 0.98048-0.25088 1.9648-0.45056 2.9504-0.73088 59.31008 62.16064 68.96512 138.46528 60.49408 220.92032 2.17088-2.31936 3.98592-3.93472 5.37088-5.79968 50.33984-68.08448 71.96416-143.29984 55.55456-227.54688-10.42944-53.58976-32.99456-101.76512-70.32448-141.81504C369.3056 61.84576 349.69472 47.65568 331.61984 32l18.65472 0c1.536 0.62976 2.976 1.7152 4.53504 1.86496 32.82048 2.81984 63.65056 12.95488 93.02016 27.2 67.17056 32.51584 121.62048 80.58496 167.17056 139.22048 66.9504 86.27968 110.48448 181.99424 119.10528 292.19968 3.30496 42.06976-0.9856 82.95552-12.19968 123.2896-4.23552 15.27552-10.21056 30.04544-15.68 45.94944 21.72544-9.25056 38.24-23.38944 50.9952-41.7152 38.04032-54.77504 48.67456-115.85536 40.05504-183.38048 2.80064 3.24992 4.23552 4.53504 5.21472 6.14528 22.91456 36.19968 40.05504 74.81472 49.0048 116.78464C855.05024 576.17024 857.11488 593.1648 859.9104 609.92512" fill="white"/></svg>
    </div>
    <div class="diet-ai-content">
        <div class="diet-ai-title">AI智能识别</div>
        <div class="diet-ai-desc">拍照即可自动识别食物热量</div>
    </div>
    <div class="diet-ai-arrow">›</div>
</div>
    `,

    chat: () => `
<div class="chat-page-wrapper">
<div class="chat-header">
    <div class="chat-header-bg"></div>
    <div class="chat-header-content">
        <div class="chat-back-btn" onclick="switchPage('weight')">
            <img src="ui页面设计素材/AI聊天页面/返回图标.svg" alt="返回" width="22" height="22" onerror="this.outerHTML='<svg viewBox=\'0 0 1024 1024\' width=\'22\' height=\'22\'><path d=\'M733.470262 941.290345a51.135518 51.135518 0 0 1-80.487306 63.101229L265.529136 510.575876 702.993493 18.44765a51.135518 51.135518 0 1 1 76.396464 67.907968L398.686025 514.666717l334.784237 426.623628z\' fill=\'#ffffff\'/></svg>'">
        </div>
        <div class="chat-assistant-avatar">
            <img src="${aiRoleConfig[currentAiRole].avatar}" alt="头像" onerror="this.style.display='none';this.parentElement.innerHTML='${aiRoleConfig[currentAiRole].fallback}'">
        </div>
        <div class="chat-assistant-info">
            <h1>${aiRoleConfig[currentAiRole].name}</h1>
            <span class="chat-status-dot"></span>
            <span class="chat-status-text">在线</span>
        </div>
        <div class="chat-switch-role" onclick="switchPage('aiRoles')">
            <img src="ui页面设计素材/AI聊天页面/切换角色.svg" alt="切换" width="22" height="22" onerror="this.outerHTML='<svg viewBox=\'0 0 1024 1024\' width=\'22\' height=\'22\'><path d=\'M449.6 927.535H87.8c-44.5-4.4-78.6-41.4-79.2-86.1-0.1-47.6 8.2-94.9 24.6-139.7 37.4-98.1 108.1-180 199.6-231.5-25.3-31.4-43.1-68.3-51.9-107.7-17.6-78.4 1.1-160.6 50.8-223.7l0.3-0.4c20.4-26.3 45.4-48.9 73.6-66.6 41-24.8 87.1-40 134.8-44.5h0.5c8.9-0.8 18-1.3 27-1.3 71.9 0.2 141.6 25.6 196.7 71.8 61 51.2 96.3 126.6 96.7 206.2-0.2 22.2-2.4 44.3-6.8 66-1.6 8.4-3.5 16.2-5.3 22.8-1.1 3.8-2.1 6.9-3.2 9.7-2.3 6.2-5.6 11.9-9.7 17.1-9.3 17.6-20.4 34.2-33 49.7 11.4 6.5 22.5 13.5 33.2 20.9 3.3 2.3 6.4 5 9.1 8 20.9 15.2 40.5 32.1 58.7 50.4 22 22.4 21.7 58.4-0.7 80.4-11.3 11.1-26.6 17-42.4 16.3H758c-131-4.4-242.1 95.7-251.1 226.5-0.7 31.1-26.2 55.9-57.3 55.7z\' fill=\'#ffffff\'/></svg>'">
        </div>
    </div>
</div>

<div class="chat-quick-actions">
    <div class="chat-quick-label">试试问我</div>
    <div class="chat-quick-chips">
        ${aiRoleConfig[currentAiRole].quickActions.map(a => `<button class="chat-chip" onclick="askQuickQuestion('${a.question}')">${a.text}</button>`).join('\n        ')}
    </div>
</div>

<div class="chat-container">
    <div class="chat-messages" id="chatMessages"></div>
    <div class="chat-input-area">
        <div class="chat-input-icons">
            <button class="chat-icon-btn" onclick="toggleVoiceInput()">
                <img src="ui页面设计素材/AI聊天页面/输入栏语言图标.svg" alt="语音" width="22" height="22" onerror="this.outerHTML='<svg viewBox=\'0 0 1024 1024\' width=\'22\' height=\'22\'><path d=\'M512 640c70.7 0 128-57.3 128-128V192c0-70.7-57.3-128-128-128s-128 57.3-128 128v320c0 70.7 57.3 128 128 128z\' fill=\'#999\'/><path d=\'M640 512c0 70.7-57.3 128-128 128s-128-57.3-128-128H320c0 101.5 75.7 185.6 173.7 198.2V832H384v64h256v-64h-109.7V710.2C628.3 697.6 704 613.5 704 512h-64z\' fill=\'#999\'/></svg>'">
            </button>
            <button class="chat-icon-btn" onclick="toggleEmojiPanel()">
                <img src="ui页面设计素材/AI聊天页面/输入栏笑脸图标.svg" alt="表情" width="22" height="22" onerror="this.outerHTML='<svg viewBox=\'0 0 1024 1024\' width=\'22\' height=\'22\'><path d=\'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z\' fill=\'#999\'/></svg>'">
            </button>
            <button class="chat-icon-btn" onclick="addAttachment()">
                <img src="ui页面设计素材/AI聊天页面/输入栏添加图标.svg" alt="添加" width="22" height="22" onerror="this.outerHTML='<svg viewBox=\'0 0 1024 1024\' width=\'22\' height=\'22\'><path d=\'M841 370c3-3 5.3-6.5 7-10.2 1.7-3.7 2.6-7.7 2.8-11.8 0.2-4.1-0.4-8.2-1.7-12.1l0 0c-1.3-3.9-3.4-7.5-6.1-10.6-2.7-3.1-6-5.7-9.7-7.5-3.7-1.8-7.7-2.8-11.9-3-4.1-0.2-8.2 0.4-12.1 1.7-3.9 1.3-7.5 3.4-10.6 6.1L375 756l-135-135c-6.1-6.1-14.3-9.5-22.9-9.5s-16.8 3.4-22.9 9.5-9.5 14.3-9.5 22.9 3.4 16.8 9.5 22.9l158 158c6.1 6.1 14.3 9.5 22.9 9.5s16.8-3.4 22.9-9.5L841 370z\' fill=\'#999\'/></svg>'">
            </button>
        </div>
        <input type="text" id="chatInput" placeholder="输入您的问题..." onkeypress="handleKeyPress(event)">
        <button class="chat-send-btn" onclick="sendMessage()">
            <svg viewBox="0 0 1024 1024" width="20" height="20"><path d="M923.6 112.4L65.8 454.5c-18.9 7.5-18.4 34.6 0.7 41.4l220.8 78.4c7.6 2.7 13.5 8.6 16.2 16.2l78.4 220.8c6.8 19.1 33.9 19.6 41.4 0.7l342.1-857.8c6.8-17.1-11.6-35.5-28.8-28.8z" fill="white"/></svg>
        </button>
    </div>
</div>
</div>
    `,

    recipes: `
<div class="header" style="border-radius: 0 0 24px 24px;">
    <h1>食谱中心</h1>
    <p>健康美味，营养均衡</p>
</div>

<div class="card" style="margin-top: -10px; position: relative; z-index: 10;">
    <div class="recipe-category-grid">
        <div class="recipe-category-item" onclick="loadRecipes('hot')">
            <div class="recipe-category-icon" style="background: linear-gradient(135deg, #ff6b6b, #ff8e8e);">
                <img src="ui页面设计素材/食谱页/restaurant-2-fill.svg" alt="" width="24" height="24" onerror="this.outerHTML='🔥'">
            </div>
            <div class="recipe-category-name">热门食谱</div>
        </div>
        <div class="recipe-category-item" onclick="loadRecipes('selected')">
            <div class="recipe-category-icon" style="background: linear-gradient(135deg, #4ecdc4, #6dd5ed);"><img src="ui页面设计素材/食谱页/hearts-line.svg" alt="" width="24" height="24" onerror="this.outerHTML='⭐'"></div>
            <div class="recipe-category-name">精选食谱</div>
        </div>
        <div class="recipe-category-item" onclick="loadRecipes('ai')">
            <div class="recipe-category-icon" style="background: linear-gradient(135deg, #47D07E, #36C46F);"><img src="ui页面设计素材/详细食谱页/智能.svg" alt="" width="24" height="24" onerror="this.outerHTML='✨'"></div>
            <div class="recipe-category-name">AI智能</div>
        </div>
        <div class="recipe-category-item" onclick="loadRecipes('expert')">
            <div class="recipe-category-icon" style="background: linear-gradient(135deg, #11998e, #38ef7d);"><img src="ui页面设计素材/详细食谱页/专业.svg" alt="" width="24" height="24" onerror="this.outerHTML='🎯'"></div>
            <div class="recipe-category-name">专家食谱</div>
        </div>
    </div>
</div>

<div class="recipe-source-row">
    <div class="recipe-source-item" onclick="loadRecipesBySource('便利店')">
        <img src="ui页面设计素材/食谱页面使用图片/便利店.png" alt="便利店">
        <span>便利店</span>
    </div>
    <div class="recipe-source-item" onclick="loadRecipesBySource('外卖')">
        <img src="ui页面设计素材/食谱页面使用图片/外卖.png" alt="外卖">
        <span>外卖</span>
    </div>
    <div class="recipe-source-item" onclick="loadRecipesBySource('食堂')">
        <img src="ui页面设计素材/食谱页面使用图片/食堂.png" alt="食堂">
        <span>食堂</span>
    </div>
    <div class="recipe-source-item" onclick="loadRecipesBySource('秦昊')">
        <img src="ui页面设计素材/食谱页面使用图片/秦昊.png" alt="秦昊">
        <span>秦昊</span>
    </div>
    <div class="recipe-source-item" onclick="loadRecipesBySource('窦月')">
        <img src="ui页面设计素材/食谱页面使用图片/窦月.png" alt="窦月">
        <span>窦月</span>
    </div>
    <div class="recipe-source-item" onclick="loadRecipesBySource('高碳')">
        <img src="ui页面设计素材/食谱页面使用图片/高碳.png" alt="高碳">
        <span>高碳</span>
    </div>
</div>

<div class="card">
    <div class="card-title" id="recipeTitle">热门食谱</div>
    <div id="recipeList">
        <div class="loading">加载中</div>
    </div>
</div>
    `,

    profile: `
<div class="header" style="border-radius: 0 0 24px 24px;">
    <div style="display: flex; align-items: center; gap: 20px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; font-size: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;" id="userAvatar">
            <img src="ui页面设计素材/AI选择页/底部中间图标（廖米） - 副本.png" alt="头像" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';this.parentElement.innerHTML='😊'">
        </div>
        <div style="flex: 1;">
            <h2 style="font-size: 22px; margin-bottom: 5px;" id="userName">加载中...</h2>
            <p style="opacity: 0.8; font-size: 14px;" id="userSignature">每天进步一点点</p>
        </div>
        <div class="profile-edit-btn" onclick="showEditProfile()">
            <svg viewBox="0 0 1024 1024" width="20" height="20"><path d="M864 170h-60l-3.6-13.2C790.2 128 762.2 106 729.6 106H294.4c-32.6 0-60.6 22-70.8 50.8L220 170h-60c-33.2 0-60 26.8-60 60v628c0 33.2 26.8 60 60 60h704c33.2 0 60-26.8 60-60V230c0-33.2-26.8-60-60-60zM512 714c-111.6 0-202-90.4-202-202s90.4-202 202-202 202 90.4 202 202-90.4 202-202 202z" fill="white"/><circle cx="512" cy="512" r="140" fill="white"/></svg>
        </div>
    </div>
</div>

<div class="card" style="margin-top: -10px; position: relative; z-index: 10;">
    <div class="card-title">今日数据</div>
    <div class="stat-grid" id="userStats">
        <div class="loading">加载中</div>
    </div>
</div>

<div class="profile-warm-card">
    <div class="card-title">健康打卡</div>
    <div style="display: flex; justify-content: space-around; text-align: center; margin-top: 12px;">
        <div class="checkin-item">
            <div class="checkin-icon diet-icon">
                <svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M859.9104 609.92512l0 45.6c-0.67968 2.21952-1.5104 4.4352-1.9648 6.70464-4.66048 24.09984-7.28448 48.82944-14.31552 72.22016-20.84992 69.02016-59.92064 126.53952-114.6944 173.50016-42.24512 36.2496-89.7856 62.36544-144.1344 75.22048-17.87008 4.23552-36.19456 6.73024-54.32064 10.0352l-45.5744 0c-2.21952-0.6848-4.49024-1.72032-6.75456-1.87008-48.12544-2.9952-93.72544-15.52512-136.50048-37.38496-80.86528-41.18528-139.19488-102.5152-165.83552-190.74048-5.67424-18.8544-8.03968-38.62016-11.9744-57.97504l0-43.50976c1.7152-10.69056 3.2-21.47456 5.21984-32.16 8.61952-46.68544 29.36576-88.0256 56.83968-126.19008 25.91488-35.92064 53.44-70.70464 78.016-107.53536 26.56896-39.95008 39.424-84.2944 31.88992-132.9152-1.4848-9.60512-2.87488-19.20896-4.33536-28.76416 0.98048-0.25088 1.9648-0.45056 2.9504-0.73088 59.31008 62.16064 68.96512 138.46528 60.49408 220.92032 2.17088-2.31936 3.98592-3.93472 5.37088-5.79968 50.33984-68.08448 71.96416-143.29984 55.55456-227.54688-10.42944-53.58976-32.99456-101.76512-70.32448-141.81504C369.3056 61.84576 349.69472 47.65568 331.61984 32l18.65472 0c1.536 0.62976 2.976 1.7152 4.53504 1.86496 32.82048 2.81984 63.65056 12.95488 93.02016 27.2 67.17056 32.51584 121.62048 80.58496 167.17056 139.22048 66.9504 86.27968 110.48448 181.99424 119.10528 292.19968 3.30496 42.06976-0.9856 82.95552-12.19968 123.2896-4.23552 15.27552-10.21056 30.04544-15.68 45.94944 21.72544-9.25056 38.24-23.38944 50.9952-41.7152 38.04032-54.77504 48.67456-115.85536 40.05504-183.38048 2.80064 3.24992 4.23552 4.53504 5.21472 6.14528 22.91456 36.19968 40.05504 74.81472 49.0048 116.78464C855.05024 576.17024 857.11488 593.1648 859.9104 609.92512" fill="#FF6B35"/></svg>
            </div>
            <div style="font-size: 12px; color: #6B4226; margin-top: 4px;">饮食</div>
        </div>
        <div class="checkin-item">
            <div class="checkin-icon water-icon">
                <svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M832 192H192c-35.2 0-64 28.8-64 64v512c0 35.2 28.8 64 64 64h640c35.2 0 64-28.8 64-64V256c0-35.2-28.8-64-64-64zM192 768V256h640v512H192z" fill="#4FC3F7"/><path d="M512 640c70.7 0 128-57.3 128-128V192c0-70.7-57.3-128-128-128s-128 57.3-128 128v320c0 70.7 57.3 128 128 128z" fill="#4FC3F7"/></svg>
            </div>
            <div style="font-size: 12px; color: #6B4226; margin-top: 4px;">饮水</div>
        </div>
        <div class="checkin-item">
            <div class="checkin-icon weight-icon">
                <svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M915.406 533.014c-17.129 0-31.017 13.888-31.017 31.017v248.139c0 39.907-32.465 72.374-72.374 72.374h-599.669c-39.907 0-72.374-32.465-72.374-72.374v-248.139c0-17.129-13.888-31.017-31.017-31.017s-31.017 13.888-31.017 31.017v248.139c0 74.116 60.293 134.409 134.409 134.409h599.669c74.116 0 134.409-60.293 134.409-134.409v-248.139c-0.002-17.129-13.89-31.017-31.020-31.017z" fill="#47D07E"/></svg>
            </div>
            <div style="font-size: 12px; color: #6B4226; margin-top: 4px;">体重</div>
        </div>
        <div class="checkin-item">
            <div class="checkin-icon sport-icon">
                <svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M640 192c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zM731.6 528.4l-83.2-83.2c-6.4-6.4-14.4-9.6-22.4-9.6H544l56.8-113.6c10.4-20.8 2-46-18.8-56.4-20.8-10.4-46-2-56.4 18.8L448 435.2V544c0 17.6 14.4 32 32 32h128l70.4 70.4c6.4 6.4 14.4 9.6 22.4 9.6s16-3.2 22.4-9.6l108.4-86.4c12.4-12.4 12.4-32.8 0-45.2-12.4-12.4-32.8-12.4-45.2 0l-54.8 42.4zM384 832c0 35.3 28.7 64 64 64s64-28.7 64-64-28.7-64-64-64-64 28.7-64 64z" fill="#FF9800"/></svg>
            </div>
            <div style="font-size: 12px; color: #6B4226; margin-top: 4px;">运动</div>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-title">功能中心</div>
    <div class="function-grid" style="padding: 0; gap: 15px;">
        <div class="function-item" onclick="switchPage('diet')">
            <div class="function-icon" style="background: linear-gradient(135deg, #ff6b6b, #ff8e8e);">
                <svg viewBox="0 0 1024 1024" width="22" height="22"><path d="M859.9104 609.92512l0 45.6c-0.67968 2.21952-1.5104 4.4352-1.9648 6.70464-4.66048 24.09984-7.28448 48.82944-14.31552 72.22016-20.84992 69.02016-59.92064 126.53952-114.6944 173.50016-42.24512 36.2496-89.7856 62.36544-144.1344 75.22048-17.87008 4.23552-36.19456 6.73024-54.32064 10.0352l-45.5744 0c-2.21952-0.6848-4.49024-1.72032-6.75456-1.87008-48.12544-2.9952-93.72544-15.52512-136.50048-37.38496-80.86528-41.18528-139.19488-102.5152-165.83552-190.74048-5.67424-18.8544-8.03968-38.62016-11.9744-57.97504l0-43.50976c1.7152-10.69056 3.2-21.47456 5.21984-32.16 8.61952-46.68544 29.36576-88.0256 56.83968-126.19008 25.91488-35.92064 53.44-70.70464 78.016-107.53536 26.56896-39.95008 39.424-84.2944 31.88992-132.9152-1.4848-9.60512-2.87488-19.20896-4.33536-28.76416 0.98048-0.25088 1.9648-0.45056 2.9504-0.73088 59.31008 62.16064 68.96512 138.46528 60.49408 220.92032 2.17088-2.31936 3.98592-3.93472 5.37088-5.79968 50.33984-68.08448 71.96416-143.29984 55.55456-227.54688-10.42944-53.58976-32.99456-101.76512-70.32448-141.81504C369.3056 61.84576 349.69472 47.65568 331.61984 32l18.65472 0c1.536 0.62976 2.976 1.7152 4.53504 1.86496 32.82048 2.81984 63.65056 12.95488 93.02016 27.2 67.17056 32.51584 121.62048 80.58496 167.17056 139.22048 66.9504 86.27968 110.48448 181.99424 119.10528 292.19968 3.30496 42.06976-0.9856 82.95552-12.19968 123.2896-4.23552 15.27552-10.21056 30.04544-15.68 45.94944 21.72544-9.25056 38.24-23.38944 50.9952-41.7152 38.04032-54.77504 48.67456-115.85536 40.05504-183.38048 2.80064 3.24992 4.23552 4.53504 5.21472 6.14528 22.91456 36.19968 40.05504 74.81472 49.0048 116.78464C855.05024 576.17024 857.11488 593.1648 859.9104 609.92512" fill="white"/></svg>
            </div>
            <div class="function-name">饮食记录</div>
        </div>
        <div class="function-item">
            <div class="function-icon" style="background: linear-gradient(135deg, #4ecdc4, #6dd5ed);">
                <svg viewBox="0 0 1024 1024" width="22" height="22"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="white"/><path d="M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zM288 421a48.01 48.01 0 0 1 96 0 48.01 48.01 0 0 1-96 0zm224 276c-73.4 0-133.6-48.6-152.6-114.2-4.6-15.8 7.4-31.8 23.8-31.8h257.6c16.4 0 28.4 16 23.8 31.8C645.6 648.4 585.4 697 512 697zm128-228a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z" fill="white"/></svg>
            </div>
            <div class="function-name">健康目标</div>
        </div>
        <div class="function-item">
            <div class="function-icon" style="background: linear-gradient(135deg, #47D07E, #36C46F);">
                <svg viewBox="0 0 1024 1024" width="22" height="22"><path d="M888 760H560c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h328c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-224H560c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h328c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-224H560c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h328c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM136 760h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm0-224h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm0-224h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8z" fill="white"/></svg>
            </div>
            <div class="function-name">营养分析</div>
        </div>
        <div class="function-item">
            <div class="function-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c);">
                <svg viewBox="0 0 1024 1024" width="22" height="22"><path d="M908.1 353.1l-253.9-36.9L541.2 85.8c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L370.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3-12.3 12.7-12.1 32.9 0.6 45.3l183.7 179.1L237.6 841c-1.2 6.9-0.2 14.1 3 20.3 8.2 15.6 27.6 21.7 43.2 13.4L512 760.9l227.1 113.8c6.2 3.1 13.4 4.2 20.3 3 17.4-3 29.1-19.5 26.1-36.8l-43.3-254.2 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27.1-36.2z" fill="white"/></svg>
            </div>
            <div class="function-name">食谱收藏</div>
        </div>
        <div class="function-item" onclick="switchPage('weight')">
            <div class="function-icon" style="background: linear-gradient(135deg, #11998e, #38ef7d);">
                <svg viewBox="0 0 1024 1024" width="22" height="22"><path d="M915.406 533.014c-17.129 0-31.017 13.888-31.017 31.017v248.139c0 39.907-32.465 72.374-72.374 72.374h-599.669c-39.907 0-72.374-32.465-72.374-72.374v-248.139c0-17.129-13.888-31.017-31.017-31.017s-31.017 13.888-31.017 31.017v248.139c0 74.116 60.293 134.409 134.409 134.409h599.669c74.116 0 134.409-60.293 134.409-134.409v-248.139c-0.002-17.129-13.89-31.017-31.020-31.017z" fill="white"/></svg>
            </div>
            <div class="function-name">体重管理</div>
        </div>
        <div class="function-item">
            <div class="function-icon" style="background: linear-gradient(135deg, #fa709a, #fee140);">
                <svg viewBox="0 0 1024 1024" width="22" height="22"><path d="M832 192H192c-35.2 0-64 28.8-64 64v512c0 35.2 28.8 64 64 64h640c35.2 0 64-28.8 64-64V256c0-35.2-28.8-64-64-64zM192 768V256h640v512H192z" fill="white"/><path d="M512 640c70.7 0 128-57.3 128-128V192c0-70.7-57.3-128-128-128s-128 57.3-128 128v320c0 70.7 57.3 128 128 128z" fill="white"/></svg>
            </div>
            <div class="function-name">饮水管理</div>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-title">设置</div>
    <div class="list-item" onclick="showSettings()">
        <div class="list-icon" style="background: #e3f2fd; color: #2196f3;">
            <svg viewBox="0 0 1024 1024" width="18" height="18"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#2196f3"/><path d="M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zM288 421a48.01 48.01 0 0 1 96 0 48.01 48.01 0 0 1-96 0zm224 276c-73.4 0-133.6-48.6-152.6-114.2-4.6-15.8 7.4-31.8 23.8-31.8h257.6c16.4 0 28.4 16 23.8 31.8C645.6 648.4 585.4 697 512 697zm128-228a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z" fill="#2196f3"/></svg>
        </div>
        <div class="list-content">
            <div class="list-title">账户设置</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
    <div class="list-item">
        <div class="list-icon" style="background: #e8f5e9; color: #4caf50;">
            <svg viewBox="0 0 1024 1024" width="18" height="18"><path d="M832 448h-68V304c0-87.2-70.8-158-158-158H418c-87.2 0-158 70.8-158 158v144h-68c-17.6 0-32 14.4-32 32v416c0 17.6 14.4 32 32 32h640c17.6 0 32-14.4 32-32V480c0-17.6-14.4-32-32-32zM544 700v76c0 17.6-14.4 32-32 32s-32-14.4-32-32v-76c-19.2-11.2-32-31.8-32-56 0-35.4 28.6-64 64-64s64 28.6 64 64c0 24.2-12.8 44.8-32 56zm128-252H352V304c0-36.4 29.6-66 66-66h188c36.4 0 66 29.6 66 66v144z" fill="#4caf50"/></svg>
        </div>
        <div class="list-content">
            <div class="list-title">隐私政策</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
    <div class="list-item">
        <div class="list-icon" style="background: #fff3e0; color: #ff9800;">
            <svg viewBox="0 0 1024 1024" width="18" height="18"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#ff9800"/><path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" fill="#ff9800"/></svg>
        </div>
        <div class="list-content">
            <div class="list-title">关于我们</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
    <div class="list-item">
        <div class="list-icon" style="background: #CFFBE0; color: #47D07E;">
            <svg viewBox="0 0 1024 1024" width="18" height="18"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#47D07E"/><path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" fill="#47D07E"/></svg>
        </div>
        <div class="list-content">
            <div class="list-title">意见反馈</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
    <div class="list-item" onclick="handleLogout()">
        <div class="list-icon" style="background: #ffebee; color: #f44336;">
            <svg viewBox="0 0 1024 1024" width="18" height="18"><path d="M880 494H404V270c0-17.6-14.4-32-32-32s-32 14.4-32 32v224c0 17.6 14.4 32 32 32h508c17.6 0 32-14.4 32-32s-14.4-32-32-32z" fill="#f44336"/><path d="M372 238c-12.4 12.4-12.4 32.8 0 45.2l228.8 228.8L372 740.8c-12.4 12.4-12.4 32.8 0 45.2 6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.2 22.6-9.4l251.6-251.6c12.4-12.4 12.4-32.8 0-45.2L417.2 238c-12.4-12.4-32.8-12.4-45.2 0z" fill="#f44336"/></svg>
        </div>
        <div class="list-content">
            <div class="list-title" style="color: #f44336;">退出登录</div>
        </div>
        <span class="list-arrow">→</span>
    </div>
</div>
    `,

    aiRoles: () => `
<div class="ai-roles-page">
    <div class="ai-roles-header">
        <div class="ai-roles-header-bg"></div>
        <div class="ai-roles-header-content">
            <div class="chat-back-btn" onclick="switchPage('chat')">
                <img src="ui页面设计素材/AI聊天页面/返回图标.svg" alt="返回" width="22" height="22" onerror="this.outerHTML='<svg viewBox=\'0 0 1024 1024\' width=\'22\' height=\'22\'><path d=\'M733.470262 941.290345a51.135518 51.135518 0 0 1-80.487306 63.101229L265.529136 510.575876 702.993493 18.44765a51.135518 51.135518 0 1 1 76.396464 67.907968L398.686025 514.666717l334.784237 426.623628z\' fill=\'#ffffff\'/></svg>'">
            </div>
            <h1>AI助手</h1>
            <p>选择您的专属健康助手</p>
        </div>
        <img src="ui页面设计素材/AI选择页/AI人物装饰.png" class="ai-roles-decor" alt="" onerror="this.style.display='none'">
    </div>
    <div class="ai-roles-list">
        <div class="ai-role-card${currentAiRole === 'liaomi' ? ' ai-role-active' : ''}" onclick="selectAiRole('liaomi')">
            <div class="ai-role-avatar">
                <img src="ui页面设计素材/AI选择页/底部中间图标（廖米） - 副本.png" alt="廖米" onerror="this.style.display='none';this.parentElement.innerHTML='🤖'">
            </div>
            <div class="ai-role-info">
                <div class="ai-role-name">廖米</div>
                <div class="ai-role-desc">全能健康助手，贴心陪伴每一天</div>
            </div>
            <div class="ai-role-hot">
                <img src="ui页面设计素材/AI选择页/热度.png" alt="" class="ai-role-hot-icon" onerror="this.style.display='none'">
                <span>热门</span>
            </div>
            ${currentAiRole === 'liaomi' ? '<div class="ai-role-current-badge">当前</div>' : ''}
        </div>
        <div class="ai-role-card${currentAiRole === 'yuezai' ? ' ai-role-active' : ''}" onclick="selectAiRole('yuezai')">
            <div class="ai-role-avatar">
                <img src="ui页面设计素材/AI选择页/跃仔.png" alt="跃仔" onerror="this.style.display='none';this.parentElement.innerHTML='💪'">
            </div>
            <div class="ai-role-info">
                <div class="ai-role-name">跃仔</div>
                <div class="ai-role-desc">运动达人，帮你制定健身计划</div>
            </div>
            <div class="ai-role-hot">
                <img src="ui页面设计素材/AI选择页/热度.png" alt="" class="ai-role-hot-icon" onerror="this.style.display='none'">
                <span>热门</span>
            </div>
            ${currentAiRole === 'yuezai' ? '<div class="ai-role-current-badge">当前</div>' : ''}
        </div>
        <div class="ai-role-card${currentAiRole === 'sasa' ? ' ai-role-active' : ''}" onclick="selectAiRole('sasa')">
            <div class="ai-role-avatar">
                <img src="ui页面设计素材/AI选择页/飒飒.png" alt="飒飒" onerror="this.style.display='none';this.parentElement.innerHTML='🥗'">
            </div>
            <div class="ai-role-info">
                <div class="ai-role-name">飒飒</div>
                <div class="ai-role-desc">营养专家，科学搭配每日饮食</div>
            </div>
            ${currentAiRole === 'sasa' ? '<div class="ai-role-current-badge">当前</div>' : ''}
        </div>
        <div class="ai-role-card${currentAiRole === 'maixiaoxing' ? ' ai-role-active' : ''}" onclick="selectAiRole('maixiaoxing')">
            <div class="ai-role-avatar">
                <img src="ui页面设计素材/AI选择页/麦小星.png" alt="麦小星" onerror="this.style.display='none';this.parentElement.innerHTML='🧘'">
            </div>
            <div class="ai-role-info">
                <div class="ai-role-name">麦小星</div>
                <div class="ai-role-desc">心理导师，帮你缓解压力焦虑</div>
            </div>
            ${currentAiRole === 'maixiaoxing' ? '<div class="ai-role-current-badge">当前</div>' : ''}
        </div>
    </div>
</div>
    `
};

let currentPage = 'weight';
let ws = null;

function switchPage(pageName) {
    const contentArea = document.getElementById('contentArea');
    const pageContent = pages[pageName];
    contentArea.innerHTML = typeof pageContent === 'function' ? pageContent() : pageContent;
    currentPage = pageName;

    const navIconMap = {
        weight: { active: 'ui页面设计素材/导航栏/体重图标（点击）.svg', inactive: 'ui页面设计素材/导航栏/体重 (未点击）.svg' },
        diet: { active: 'ui页面设计素材/导航栏/饮食 (点击).svg', inactive: 'ui页面设计素材/导航栏/饮食（未点击）.svg' },
        recipes: { active: 'ui页面设计素材/导航栏/食谱.svg', inactive: 'ui页面设计素材/导航栏/食谱 (未点击).svg' },
        profile: { active: 'ui页面设计素材/导航栏/我的（点击）.svg', inactive: 'ui页面设计素材/导航栏/我的-copy (未点击).svg' }
    };

    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        const page = item.dataset.page;
        const img = item.querySelector('img.nav-icon, img.nav-icon-active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
            if (img && navIconMap[page]) {
                img.src = navIconMap[page].active;
                img.className = 'nav-icon-active';
            }
        } else {
            if (img && navIconMap[page]) {
                img.src = navIconMap[page].inactive;
                img.className = 'nav-icon';
            }
        }
    });

    const navAssistantIcon = document.getElementById('navAssistantIcon');
    if (navAssistantIcon) {
        navAssistantIcon.src = aiRoleConfig[currentAiRole].navIcon;
    }

    loadPageData(pageName);
}

function loadPageData(pageName) {
    switch (pageName) {
        case 'diet':
            loadDietData();
            break;
        case 'weight':
            loadWeightData();
            break;
        case 'recipes':
            loadRecipes('hot');
            break;
        case 'profile':
            loadProfileData();
            break;
        case 'chat':
            initChat();
            break;
    }
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 6) return '夜深了';
    if (hour < 9) return '早上好';
    if (hour < 12) return '上午好';
    if (hour < 14) return '中午好';
    if (hour < 18) return '下午好';
    if (hour < 22) return '晚上好';
    return '夜深了';
}

function getTodayStr() {
    const d = new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    return `${d.getMonth() + 1}月${d.getDate()}日 周${weekDays[d.getDay()]}`;
}

async function loadWeightData() {
    console.log('[loadWeightData] 开始加载体重数据');
    try {
        const greetingEl = document.getElementById('weightGreeting');
        const dateEl = document.getElementById('weightDate');
        if (greetingEl) greetingEl.textContent = getGreeting();
        if (dateEl) dateEl.textContent = getTodayStr();

        const stat = await getWeightStat();
        console.log('[loadWeightData] 体重统计:', stat);

        if (!stat || !stat.data) {
            throw new Error('体重统计数据格式异常');
        }

        const d = stat.data;
        const currentWeight = d.currentWeight || '--';
        const targetWeight = d.targetWeight || '--';
        const needLose = d.needLoseWeight || '0';

        document.getElementById('weightRingValue').textContent = currentWeight;
        document.getElementById('weightTargetDisplay').textContent = targetWeight + ' kg';
        document.getElementById('weightNeedDisplay').textContent = needLose + ' kg';
        document.getElementById('weightBmi').textContent = d.bmi || '--';
        document.getElementById('weightFat').textContent = (d.bodyFatRate ? d.bodyFatRate + '%' : '--');
        document.getElementById('weightHeight').textContent = d.height || '--';

        const heightInput = document.getElementById('heightInput');
        if (heightInput && d.height) {
            heightInput.placeholder = d.height;
        }

        const targetWeightInput = document.getElementById('targetWeightInput');
        if (targetWeightInput && d.targetWeight) {
            targetWeightInput.placeholder = d.targetWeight;
        }

        renderWeightChart(d.weeklyWeights || []);

    } catch (error) {
        console.error('[loadWeightData] 加载体重数据失败:', error);
        const chartContainer = document.getElementById('weightChartContainer');
        if (chartContainer) {
            chartContainer.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">加载失败</div>';
        }
    }
}

function renderWeightChart(weeklyWeights) {
    const container = document.getElementById('weightChartContainer');
    if (!container) return;

    if (!weeklyWeights || weeklyWeights.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #999; padding: 30px;">暂无趋势数据，记录体重后即可查看</div>';
        return;
    }

    const weights = weeklyWeights.map(w => parseFloat(w.weight) || 0);
    const minW = Math.min(...weights);
    const maxW = Math.max(...weights);
    const range = maxW - minW || 1;
    const chartH = 120;
    const padding = { top: 20, bottom: 30, left: 10, right: 10 };
    const drawW = 400 - padding.left - padding.right;
    const drawH = chartH - padding.top - padding.bottom;

    let pathD = '';
    let areaD = '';
    let dots = '';
    let labels = '';

    weeklyWeights.forEach((w, i) => {
        const x = padding.left + (i / (weeklyWeights.length - 1 || 1)) * drawW;
        const y = padding.top + drawH - ((parseFloat(w.weight) - minW) / range) * drawH;

        if (i === 0) {
            pathD += `M ${x} ${y}`;
            areaD += `M ${x} ${y}`;
        } else {
            const prevX = padding.left + ((i - 1) / (weeklyWeights.length - 1 || 1)) * drawW;
            const prevY = padding.top + drawH - ((parseFloat(weeklyWeights[i - 1].weight) - minW) / range) * drawH;
            const cpx = (prevX + x) / 2;
            pathD += ` C ${cpx} ${prevY}, ${cpx} ${y}, ${x} ${y}`;
            areaD += ` C ${cpx} ${prevY}, ${cpx} ${y}, ${x} ${y}`;
        }

        dots += `<circle cx="${x}" cy="${y}" r="4" fill="#47D07E" stroke="white" stroke-width="2"/>`;

        const dateLabel = w.date ? w.date.substring(5) : '';
        labels += `<text x="${x}" y="${chartH - 5}" text-anchor="middle" fill="#999" font-size="11">${dateLabel}</text>`;
    });

    areaD += ` L ${padding.left + drawW} ${padding.top + drawH} L ${padding.left} ${padding.top + drawH} Z`;

    container.innerHTML = `
        <svg viewBox="0 0 400 ${chartH}" class="weight-chart-svg">
            <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="rgba(71,208,126,0.3)"/>
                    <stop offset="100%" stop-color="rgba(71,208,126,0.02)"/>
                </linearGradient>
            </defs>
            <path d="${areaD}" fill="url(#chartGrad)"/>
            <path d="${pathD}" fill="none" stroke="#47D07E" stroke-width="2.5" stroke-linecap="round"/>
            ${dots}
            ${labels}
        </svg>
        <div class="weight-chart-range">
            <span>${maxW} kg</span>
            <span>${minW} kg</span>
        </div>
    `;
}

async function loadDietData() {
    console.log('[loadDietData] 开始加载饮食数据');
    try {
        const dateEl = document.getElementById('dietDate');
        if (dateEl) dateEl.textContent = getTodayStr();

        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        const stat = await getDietStat(dateStr);
        const records = await getDietRecords();
        const water = await getTodayWater();

        if (!stat || !stat.data) {
            throw new Error('饮食统计数据格式异常');
        }

        const d = stat.data;
        const consumed = d.consumedCalories || 0;
        const recommended = d.recommendedCalories || 2000;
        const remaining = d.remainingCalories || 0;
        const caloriePercent = recommended > 0 ? Math.min(consumed / recommended * 100, 100) : 0;

        document.getElementById('dietRingValue').textContent = consumed;
        document.getElementById('dietRecommended').textContent = recommended + ' kcal';
        document.getElementById('dietRemaining').textContent = remaining + ' kcal';

        const circumference = 2 * Math.PI * 85;
        const ringFill = document.getElementById('dietRingFill');
        if (ringFill) {
            const offset = circumference - (circumference * caloriePercent / 100);
            ringFill.style.strokeDashoffset = offset;
        }

        const carb = d.carbohydrate || 0;
        const protein = d.protein || 0;
        const fat = d.fat || 0;
        const totalNutrient = parseFloat(carb) + parseFloat(protein) + parseFloat(fat) || 1;

        document.getElementById('dietCarbValue').textContent = carb + 'g';
        document.getElementById('dietProteinValue').textContent = protein + 'g';
        document.getElementById('dietFatValue').textContent = fat + 'g';

        document.getElementById('dietCarbBar').style.width = (parseFloat(carb) / totalNutrient * 100) + '%';
        document.getElementById('dietProteinBar').style.width = (parseFloat(protein) / totalNutrient * 100) + '%';
        document.getElementById('dietFatBar').style.width = (parseFloat(fat) / totalNutrient * 100) + '%';

        if (water && water.data) {
            const waterPercent = water.data.progress || 0;
            document.getElementById('waterProgress').textContent = waterPercent + '%';
            document.getElementById('waterCard').innerHTML = `
                <div class="water-track">
                    <div class="water-fill" style="width: ${waterPercent}%;">
                        <div class="water-wave"></div>
                    </div>
                    <div class="water-info">
                        <span class="water-amount">${water.data.todayIntake || 0}</span>
                        <span class="water-goal">/ ${water.data.goal || 2000} ml</span>
                    </div>
                </div>
                <div class="water-actions">
                    <button class="water-btn" onclick="addWater()">+250ml</button>
                    <button class="water-btn" onclick="addWaterCustom()">自定义</button>
                </div>
            `;
        } else {
            document.getElementById('waterCard').innerHTML = '<div style="text-align: center; color: #999; padding: 15px;">加载失败</div>';
        }

        if (records && records.data && Array.isArray(records.data) && records.data.length > 0) {
            const mealGroups = { 1: [], 2: [], 3: [], 4: [] };
            records.data.forEach(r => {
                const mt = r.mealType || 4;
                if (!mealGroups[mt]) mealGroups[mt] = [];
                mealGroups[mt].push(r);
            });

            const mealNames = { 1: '早餐', 2: '午餐', 3: '晚餐', 4: '加餐' };
            const mealIcons = { 1: '<svg viewBox="0 0 1024 1024" width="20" height="20"><path d="M541.2 157.2c-1.2-3.6-3.6-6.4-6.8-8-3.2-1.6-6.8-1.6-10 0-3.2 1.6-5.6 4.4-6.8 8-30.8 92.4-86 176-160.4 240.8-4.4 3.6-5.2 10-2 14.8 3.2 4.8 9.2 6.4 14 3.6 36-20.4 68.4-45.2 96.8-73.6l-0.4 390c0 5.6 4.4 10 10 10h100c5.6 0 10-4.4 10-10l-0.4-390c28.4 28.4 60.8 53.2 96.8 73.6 4.8 2.8 10.8 1.2 14-3.6 3.2-4.8 2.4-11.2-2-14.8-74.4-64.8-129.6-148.4-160.4-240.8z" fill="#ff9800"/></svg>', 2: '<svg viewBox="0 0 1024 1024" width="20" height="20"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#4caf50"/></svg>', 3: '<svg viewBox="0 0 1024 1024" width="20" height="20"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#47D07E"/></svg>', 4: '<svg viewBox="0 0 1024 1024" width="20" height="20"><path d="M797.9 446.3c-10.2-30.5-36.5-51.8-67.5-54.7l-144.8-13.5-55.7-133.8c-11.9-28.6-39.5-47.1-70.4-47.1s-58.5 18.5-70.4 47.1l-55.7 133.8-144.8 13.5c-31 2.9-57.3 24.2-67.5 54.7-10.2 30.5-1.5 63.5 22.2 84.3l109.7 96.2-32.8 142.8c-7 30.5 4.9 62 30.5 80.1 12.8 9 27.7 13.6 42.7 13.6 14.1 0 28.2-4 40.5-12l125.6-81.5 125.6 81.5c12.3 8 26.5 12 40.5 12 15 0 29.9-4.6 42.7-13.6 25.6-18.1 37.5-49.6 30.5-80.1l-32.8-142.8 109.7-96.2c23.7-20.8 32.4-53.8 22.2-84.3z" fill="#e91e63"/></svg>' };
            const mealColors = { 1: '#ff9800', 2: '#4caf50', 3: '#47D07E', 4: '#e91e63' };

            let html = '';
            [1, 2, 3, 4].forEach(mt => {
                const items = mealGroups[mt];
                const mealCal = items.reduce((sum, r) => sum + (parseFloat(r.calorie) || 0), 0);
                html += `
                    <div class="diet-meal-section">
                        <div class="diet-meal-header">
                            <div class="diet-meal-header-left">
                                <span class="diet-meal-icon">${mealIcons[mt]}</span>
                                <span class="diet-meal-name">${mealNames[mt]}</span>
                            </div>
                            <span class="diet-meal-cal" style="color: ${mealColors[mt]};">${mealCal} kcal</span>
                        </div>
                        ${items.length > 0 ? items.map(r => `
                            <div class="diet-meal-item">
                                <span class="diet-meal-item-name">${r.foodName || '未知食物'}</span>
                                <span class="diet-meal-item-detail">${r.calorie || 0} kcal · ${r.amount || 0}g</span>
                            </div>
                        `).join('') : '<div class="diet-meal-empty">暂无记录</div>'}
                    </div>
                `;
            });

            document.getElementById('dietRecords').innerHTML = html;
        } else {
            document.getElementById('dietRecords').innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">暂无饮食记录</div>';
        }

    } catch (error) {
        console.error('[loadDietData] 加载饮食数据失败:', error);
        const dietRecords = document.getElementById('dietRecords');
        if (dietRecords) {
            dietRecords.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">加载失败</div>';
        }
    }
}

async function loadProfileData() {
    console.log('[loadProfileData] 开始加载用户信息');
    try {
        const userInfo = await getUserInfo();
        if (!userInfo || !userInfo.data) {
            throw new Error('用户信息格式异常');
        }

        document.getElementById('userName').textContent = userInfo.data.nickname || '用户';
        document.getElementById('userSignature').textContent = userInfo.data.signature || '每天进步一点点';

        document.getElementById('userStats').innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${userInfo.data.bmi || '-'}</div>
                <div class="stat-label">BMI 指数</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${userInfo.data.todayCalories || '-'}</div>
                <div class="stat-label">今日卡路里</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${userInfo.data.dietDays || 0}</div>
                <div class="stat-label">饮食天数</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${userInfo.data.weight || '-'}</div>
                <div class="stat-label">当前体重</div>
            </div>
        `;
    } catch (error) {
        console.error('[loadProfileData] 加载用户信息失败:', error);
        if (document.getElementById('userName')) {
            document.getElementById('userName').textContent = '加载失败';
        }
        if (document.getElementById('userStats')) {
            document.getElementById('userStats').innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">加载失败</div>';
        }
    }
}

async function loadRecipes(type) {
    try {
        let data;
        let title = '热门食谱';

        switch (type) {
            case 'hot':
                data = await getHotRecipes();
                break;
            case 'selected':
                data = await getSelectedRecipes();
                title = '精选食谱';
                break;
            case 'ai':
                data = await getAiRecipes();
                title = 'AI智能食谱';
                break;
            case 'expert':
                data = await getExpertRecipes();
                title = '专家食谱';
                break;
        }

        document.getElementById('recipeTitle').textContent = title;

        if (data && data.data) {
            document.getElementById('recipeList').innerHTML = data.data.map(recipe => `
                <div class="recipe-card" onclick="showRecipeDetail(${recipe.id})">
                    <div class="recipe-image">${getRecipeIcon(recipe.title)}</div>
                    <div class="recipe-content">
                        <div class="recipe-title">${recipe.title}</div>
                        <div class="recipe-info">
                            <span><svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: -2px;"><path d="M797.9 446.3c-10.2-30.5-36.5-51.8-67.5-54.7l-144.8-13.5-55.7-133.8c-11.9-28.6-39.5-47.1-70.4-47.1s-58.5 18.5-70.4 47.1l-55.7 133.8-144.8 13.5c-31 2.9-57.3 24.2-67.5 54.7-10.2 30.5-1.5 63.5 22.2 84.3l109.7 96.2-32.8 142.8c-7 30.5 4.9 62 30.5 80.1 12.8 9 27.7 13.6 42.7 13.6 14.1 0 28.2-4 40.5-12l125.6-81.5 125.6 81.5c12.3 8 26.5 12 40.5 12 15 0 29.9-4.6 42.7-13.6 25.6-18.1 37.5-49.6 30.5-80.1l-32.8-142.8 109.7-96.2c23.7-20.8 32.4-53.8 22.2-84.3z" fill="#ff6b6b"/></svg> ${recipe.calories || 0} kcal</span>
                            <span><svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: -2px;"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#999"/><path d="M686 496H528V338c0-8.8-7.2-16-16-16s-16 7.2-16 16v158H338c-8.8 0-16 7.2-16 16s7.2 16 16 16h158v158c0 8.8 7.2 16 16 16s16-7.2 16-16V528h158c8.8 0 16-7.2 16-16s-7.2-16-16-16z" fill="none"/><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm293 528H528v277c0 8.8-7.2 16-16 16s-16-7.2-16-16V592H219c-8.8 0-16-7.2-16-16s7.2-16 16-16h277V283c0-8.8 7.2-16 16-16s16 7.2 16 16v277h277c8.8 0 16 7.2 16 16s-7.2 16-16 16z" fill="#999"/></svg> ${recipe.prepTime || 0}分钟</span>
                            <span><img src="ui页面设计素材/详细食谱页/星星.svg" alt="" width="14" height="14" style="vertical-align: -2px;" onerror="this.outerHTML='⭐'"> ${recipe.rating || 4.5}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            document.getElementById('recipeList').innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">暂无数据</div>';
        }
    } catch (error) {
        console.error('加载食谱失败:', error);
        document.getElementById('recipeList').innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">加载失败</div>';
    }
}

function loadRecipesBySource(source) {
    loadRecipes('hot');
    document.getElementById('recipeTitle').textContent = source + '食谱';
}

function initChat() {
    const token = getToken();
    if (!token) {
        document.getElementById('chatMessages').innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">请先登录</div>';
        return;
    }

    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = `
        <div class="message assistant">
            <div class="message-avatar"><img src="${aiRoleConfig[currentAiRole].avatar}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.outerHTML='${aiRoleConfig[currentAiRole].fallback}'"></div>
            <div class="message-content">
                ${aiRoleConfig[currentAiRole].greeting}
            </div>
        </div>
    `;

    if (ws && ws.readyState === WebSocket.OPEN) {
        return;
    }

    ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 2) {
            addMessage(2, message.content);
        }
    };

    ws.onclose = () => {
        console.log('WebSocket 连接关闭');
    };

    ws.onerror = (error) => {
        console.error('WebSocket 错误:', error);
    };
}

function askQuickQuestion(question) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = question;
    }
    sendMessage();
}

function addMessage(type, content) {
    const messagesContainer = document.getElementById('chatMessages');
    const isUser = type === 1;

    messagesContainer.innerHTML += `
        <div class="message ${isUser ? 'user' : 'assistant'}">
            ${isUser ? '' : '<div class="message-avatar"><img src="' + aiRoleConfig[currentAiRole].avatar + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.outerHTML=\'' + aiRoleConfig[currentAiRole].fallback + '\'"></div>'}
            <div class="message-content">${content.replace(/\n/g, '<br>')}</div>
            ${isUser ? '<div class="message-avatar"><img src="ui页面设计素材/AI选择页/底部中间图标（廖米） - 副本.png" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.outerHTML=\'😊\'"></div>' : ''}
        </div>
    `;

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function toggleVoiceInput() {
    alert('语音输入功能开发中...');
}

function toggleEmojiPanel() {
    alert('表情面板功能开发中...');
}

function addAttachment() {
    alert('附件功能开发中...');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
        alert('连接已断开，请刷新页面');
        return;
    }

    ws.send(JSON.stringify({ content: message }));
    addMessage(1, message);
    input.value = '';
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

async function addWater() {
    try {
        const response = await fetch('http://localhost:8080/water/add?amount=250', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (data.code && data.code !== 200) {
            throw new Error(data.message || '请求失败');
        }

        loadDietData();
    } catch (error) {
        console.error('[addWater] 添加饮水失败:', error);
        alert('添加失败: ' + error.message);
    }
}

function addWaterCustom() {
    const amount = prompt('请输入饮水量(ml):', '500');
    if (amount && !isNaN(amount)) {
        fetch(`http://localhost:8080/water/add?amount=${amount}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        }).then(r => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        }).then(data => {
            if (data.code && data.code !== 200) throw new Error(data.message);
            loadDietData();
        }).catch(error => {
            alert('添加失败: ' + error.message);
        });
    }
}

function calcBmi() {
    const weightVal = parseFloat(document.getElementById('weightInput').value);
    const heightVal = parseFloat(document.getElementById('heightInput').value);
    const resultEl = document.getElementById('weightCalcResult');

    if (!weightVal || !heightVal || weightVal <= 0 || heightVal <= 0) {
        if (resultEl) resultEl.style.display = 'none';
        return;
    }

    const heightM = heightVal / 100;
    const bmi = weightVal / (heightM * heightM);
    const bmiRounded = Math.round(bmi * 10) / 10;

    if (resultEl) {
        resultEl.style.display = 'flex';
        document.getElementById('calcBmiValue').textContent = bmiRounded;

        let bmiTag = '', bmiColor = '';
        if (bmi < 18.5) { bmiTag = '偏瘦'; bmiColor = '#2196f3'; }
        else if (bmi < 24) { bmiTag = '正常'; bmiColor = '#35da28'; }
        else if (bmi < 28) { bmiTag = '偏胖'; bmiColor = '#ff9800'; }
        else { bmiTag = '肥胖'; bmiColor = '#f44336'; }

        const bmiTagEl = document.getElementById('calcBmiTag');
        bmiTagEl.textContent = bmiTag;
        bmiTagEl.style.background = bmiColor;
        bmiTagEl.style.color = 'white';
    }
}

async function saveWeight() {
    const weight = document.getElementById('weightInput').value;
    const fatRate = document.getElementById('fatInput').value;
    const height = document.getElementById('heightInput').value;
    const targetWeight = document.getElementById('targetWeightInput').value;

    if (!weight && !height && !targetWeight) {
        alert('请输入体重、身高或目标体重');
        return;
    }

    try {
        if (weight) {
            await addWeightRecord(weight, fatRate || null, null);
        }
        if (height) {
            await updateHeight(height);
        }
        if (targetWeight) {
            await updateTargetWeight(targetWeight);
        }
        loadWeightData();
        document.getElementById('weightInput').value = '';
        document.getElementById('fatInput').value = '';
        document.getElementById('heightInput').value = '';
        document.getElementById('targetWeightInput').value = '';
    } catch (error) {
        console.error('保存失败:', error);
        alert('保存失败');
    }
}

function openCamera() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        showRecognizeResult(file);
    };
    input.click();
}

async function showRecognizeResult(file) {
    const modal = document.getElementById('addFoodModal');
    if (!modal) return;

    modal.style.display = 'flex';
    document.getElementById('foodNameInput').value = '';
    document.getElementById('foodAmountInput').value = '';
    document.getElementById('foodCalorieInput').value = '';
    document.getElementById('foodProteinInput').value = '';
    document.getElementById('foodFatInput').value = '';
    document.getElementById('foodCarbInput').value = '';
    document.querySelectorAll('.meal-type-option').forEach((el, i) => {
        el.classList.toggle('active', i === 0);
    });

    const nameInput = document.getElementById('foodNameInput');
    nameInput.placeholder = '识别中...';
    nameInput.disabled = true;

    try {
        const result = await recognizeFood(file.name);
        if (result && result.data && result.data.length > 0) {
            nameInput.value = result.data[0];
            nameInput.placeholder = '如：米饭、鸡胸肉';
            nameInput.disabled = false;
            showRecognizeSuggestions(result.data);
        } else {
            nameInput.placeholder = '如：米饭、鸡胸肉';
            nameInput.disabled = false;
        }
    } catch (error) {
        console.error('AI识别失败:', error);
        nameInput.placeholder = '如：米饭、鸡胸肉';
        nameInput.disabled = false;
    }
}

function showRecognizeSuggestions(foods) {
    let container = document.getElementById('recognizeSuggestions');
    if (!container) {
        container = document.createElement('div');
        container.id = 'recognizeSuggestions';
        container.className = 'recognize-suggestions';
        const body = document.querySelector('#addFoodModal .modal-body');
        body.insertBefore(container, body.firstChild);
    }
    container.innerHTML = '<div class="recognize-suggestions-title">AI识别结果</div>' +
        foods.map(f => `<div class="recognize-suggestion-item" onclick="selectRecognizedFood('${f}')">${f}</div>`).join('');
    container.style.display = 'block';
}

function selectRecognizedFood(name) {
    document.getElementById('foodNameInput').value = name;
    const container = document.getElementById('recognizeSuggestions');
    if (container) container.style.display = 'none';
}

function showAddFoodModal() {
    const modal = document.getElementById('addFoodModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('foodNameInput').value = '';
        document.getElementById('foodAmountInput').value = '';
        document.getElementById('foodCalorieInput').value = '';
        document.getElementById('foodProteinInput').value = '';
        document.getElementById('foodFatInput').value = '';
        document.getElementById('foodCarbInput').value = '';
        document.querySelectorAll('.meal-type-option').forEach((el, i) => {
            el.classList.toggle('active', i === 0);
        });
        const suggestions = document.getElementById('recognizeSuggestions');
        if (suggestions) suggestions.style.display = 'none';
    }
}

function closeAddFoodModal() {
    const modal = document.getElementById('addFoodModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function selectMealType(el) {
    document.querySelectorAll('.meal-type-option').forEach(opt => opt.classList.remove('active'));
    el.classList.add('active');
}

async function saveDietRecord() {
    const foodName = document.getElementById('foodNameInput').value.trim();
    const mealTypeEl = document.querySelector('.meal-type-option.active');
    const mealType = mealTypeEl ? parseInt(mealTypeEl.dataset.meal) : 1;
    const amount = document.getElementById('foodAmountInput').value;
    const calorie = document.getElementById('foodCalorieInput').value;
    const protein = document.getElementById('foodProteinInput').value;
    const fat = document.getElementById('foodFatInput').value;
    const carbohydrate = document.getElementById('foodCarbInput').value;

    if (!foodName) {
        alert('请输入食物名称');
        return;
    }
    if (!amount || parseFloat(amount) <= 0) {
        alert('请输入有效的食用量');
        return;
    }

    const data = {
        foodName: foodName,
        mealType: mealType,
        amount: parseFloat(amount)
    };
    if (calorie) data.calorie = parseFloat(calorie);
    if (protein) data.protein = parseFloat(protein);
    if (fat) data.fat = parseFloat(fat);
    if (carbohydrate) data.carbohydrate = parseFloat(carbohydrate);

    try {
        await addDietRecord(data);
        closeAddFoodModal();
        loadDietData();
    } catch (error) {
        console.error('添加饮食记录失败:', error);
        alert('添加失败: ' + (error.message || '请重试'));
    }
}

function showRecipeDetail(id) {
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `
<div class="recipe-detail-page">
    <div class="recipe-banner" id="recipeBanner">
        <img src="ui页面设计素材/详细食谱页使用图片/鸡胸肉.png" alt="" class="recipe-banner-img" onerror="this.style.display='none';document.getElementById('recipeBannerEmoji').style.display='block'">
        <span id="recipeBannerEmoji" style="display:none;font-size:60px;">食谱</span>
    </div>
    <div class="recipe-detail-content">
        <div class="recipe-detail-card">
            <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;" id="recipeDetailTitle">加载中...</h2>
            <div style="display: flex; gap: 15px; color: #888; font-size: 13px;">
                <span><svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: -2px;"><path d="M797.9 446.3c-10.2-30.5-36.5-51.8-67.5-54.7l-144.8-13.5-55.7-133.8c-11.9-28.6-39.5-47.1-70.4-47.1s-58.5 18.5-70.4 47.1l-55.7 133.8-144.8 13.5c-31 2.9-57.3 24.2-67.5 54.7-10.2 30.5-1.5 63.5 22.2 84.3l109.7 96.2-32.8 142.8c-7 30.5 4.9 62 30.5 80.1 12.8 9 27.7 13.6 42.7 13.6 14.1 0 28.2-4 40.5-12l125.6-81.5 125.6 81.5c12.3 8 26.5 12 40.5 12 15 0 29.9-4.6 42.7-13.6 25.6-18.1 37.5-49.6 30.5-80.1l-32.8-142.8 109.7-96.2c23.7-20.8 32.4-53.8 22.2-84.3z" fill="#ff6b6b"/></svg> <span id="recipeDetailCal">--</span> kcal</span>
                <span><svg viewBox="0 0 1024 1024" width="14" height="14" style="vertical-align: -2px;"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#999"/><path d="M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372 372-166.6 372-372-166.6-372-372-372zm0 668c-163.3 0-296-132.7-296-296s132.7-296 296-296 296 132.7 296 296-132.7 296-296 296z" fill="#999"/><path d="M512 188c-178.9 0-324 145.1-324 324s145.1 324 324 324 324-145.1 324-324-145.1-324-324-324z" fill="none"/><path d="M536 304h-48v224l196.8 118.2 24-39.4-172.8-102.4z" fill="#999"/></svg> <span id="recipeDetailTime">--</span> 分钟</span>
                <span><img src="ui页面设计素材/详细食谱页/星星.svg" alt="" width="14" height="14" style="vertical-align: -2px;" onerror="this.outerHTML='⭐'"> <span id="recipeDetailRating">--</span></span>
            </div>
        </div>
        <div class="recipe-detail-card">
            <div class="card-title">食材清单</div>
            <div id="recipeDetailIngredients" style="color: #555; font-size: 14px; line-height: 1.8;">
                加载中...
            </div>
        </div>
        <div class="recipe-detail-card">
            <div class="card-title">烹饪步骤</div>
            <div id="recipeDetailSteps" style="color: #555; font-size: 14px; line-height: 1.8;">
                加载中...
            </div>
        </div>
        <div class="recipe-detail-card">
            <div class="card-title">营养信息</div>
            <div id="recipeDetailNutrition" style="color: #555; font-size: 14px;">
                加载中...
            </div>
        </div>
        <div style="text-align: center; padding: 15px;">
            <button class="btn btn-primary" style="width: 80%; padding: 14px; font-size: 16px;" onclick="switchPage('recipes')">
                返回食谱列表
            </button>
        </div>
    </div>
</div>
    `;
    loadRecipeDetail(id);
}

async function loadRecipeDetail(id) {
    try {
        const data = await getRecipeDetail(id);
        if (data && data.data) {
            const recipe = data.data;
            document.getElementById('recipeDetailTitle').textContent = recipe.title || '未知食谱';
            document.getElementById('recipeDetailCal').textContent = recipe.calories || '--';
            document.getElementById('recipeDetailTime').textContent = recipe.prepTime || '--';
            document.getElementById('recipeDetailRating').textContent = recipe.rating || '--';
            document.getElementById('recipeBanner').textContent = getRecipeIcon(recipe.title);

            if (recipe.ingredients) {
                const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : recipe.ingredients.split(',');
                document.getElementById('recipeDetailIngredients').innerHTML = ingredients.map(i => `<div style="padding: 4px 0; border-bottom: 1px solid #f0f0f0;">• ${typeof i === 'string' ? i : i.name + ' ' + (i.amount || '')}</div>`).join('');
            } else {
                document.getElementById('recipeDetailIngredients').textContent = '暂无食材信息';
            }

            if (recipe.steps) {
                const steps = Array.isArray(recipe.steps) ? recipe.steps : recipe.steps.split('\n');
                document.getElementById('recipeDetailSteps').innerHTML = steps.map((s, i) => `<div style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong style="color: #47D07E;">步骤${i + 1}</strong><br>${typeof s === 'string' ? s : s.description || s.content}</div>`).join('');
            } else {
                document.getElementById('recipeDetailSteps').textContent = '暂无步骤信息';
            }

            if (recipe.nutrition) {
                document.getElementById('recipeDetailNutrition').innerHTML = `
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        <div style="background: #f8f9fa; padding: 12px; border-radius: 10px; text-align: center;">
                            <div style="font-size: 18px; font-weight: 600; color: #47D07E;">${recipe.nutrition.carbs || '--'}g</div>
                            <div style="font-size: 12px; color: #888;">碳水化合物</div>
                        </div>
                        <div style="background: #f8f9fa; padding: 12px; border-radius: 10px; text-align: center;">
                            <div style="font-size: 18px; font-weight: 600; color: #ff9800;">${recipe.nutrition.protein || '--'}g</div>
                            <div style="font-size: 12px; color: #888;">蛋白质</div>
                        </div>
                        <div style="background: #f8f9fa; padding: 12px; border-radius: 10px; text-align: center;">
                            <div style="font-size: 18px; font-weight: 600; color: #f44336;">${recipe.nutrition.fat || '--'}g</div>
                            <div style="font-size: 12px; color: #888;">脂肪</div>
                        </div>
                        <div style="background: #f8f9fa; padding: 12px; border-radius: 10px; text-align: center;">
                            <div style="font-size: 18px; font-weight: 600; color: #2196f3;">${recipe.nutrition.fiber || '--'}g</div>
                            <div style="font-size: 12px; color: #888;">膳食纤维</div>
                        </div>
                    </div>
                `;
            } else {
                document.getElementById('recipeDetailNutrition').innerHTML = '<div style="text-align: center; color: #999;">暂无营养信息</div>';
            }
        }
    } catch (error) {
        console.error('加载食谱详情失败:', error);
    }
}

function getMealIcon(type) {
    const icons = { 1: '<svg viewBox="0 0 1024 1024" width="20" height="20"><path d="M541.2 157.2c-1.2-3.6-3.6-6.4-6.8-8-3.2-1.6-6.8-1.6-10 0-3.2 1.6-5.6 4.4-6.8 8-30.8 92.4-86 176-160.4 240.8-4.4 3.6-5.2 10-2 14.8 3.2 4.8 9.2 6.4 14 3.6 36-20.4 68.4-45.2 96.8-73.6l-0.4 390c0 5.6 4.4 10 10 10h100c5.6 0 10-4.4 10-10l-0.4-390c28.4 28.4 60.8 53.2 96.8 73.6 4.8 2.8 10.8 1.2 14-3.6 3.2-4.8 2.4-11.2-2-14.8-74.4-64.8-129.6-148.4-160.4-240.8z" fill="#ff9800"/></svg>', 2: '<svg viewBox="0 0 1024 1024" width="20" height="20"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#4caf50"/></svg>', 3: '<svg viewBox="0 0 1024 1024" width="20" height="20"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" fill="#47D07E"/></svg>', 4: '<svg viewBox="0 0 1024 1024" width="20" height="20"><path d="M797.9 446.3c-10.2-30.5-36.5-51.8-67.5-54.7l-144.8-13.5-55.7-133.8c-11.9-28.6-39.5-47.1-70.4-47.1s-58.5 18.5-70.4 47.1l-55.7 133.8-144.8 13.5c-31 2.9-57.3 24.2-67.5 54.7-10.2 30.5-1.5 63.5 22.2 84.3l109.7 96.2-32.8 142.8c-7 30.5 4.9 62 30.5 80.1 12.8 9 27.7 13.6 42.7 13.6 14.1 0 28.2-4 40.5-12l125.6-81.5 125.6 81.5c12.3 8 26.5 12 40.5 12 15 0 29.9-4.6 42.7-13.6 25.6-18.1 37.5-49.6 30.5-80.1l-32.8-142.8 109.7-96.2c23.7-20.8 32.4-53.8 22.2-84.3z" fill="#e91e63"/></svg>' };
    return icons[type] || '<svg viewBox="0 0 1024 1024" width="20" height="20"><path d="M834.80808 440.235536c-2.707668-17.020652-18.621103-28.635177-35.722596-25.941835-1.290389 0.203638-130.923842 20.465101-286.911522 20.465101-155.991774 0-285.626249-20.261463-286.916639-20.465101-17.050328-2.712785-33.019021 8.922207-35.722596 25.941835-2.697435 17.020652 8.906857 33.013905 25.931602 35.71748 5.456269 0.86367 135.542023 21.237697 296.706609 21.237697 161.15947 0 291.245224-20.374026 296.701492-21.237697C825.902246 473.250464 837.506539 457.256188 834.80808 440.235536z" fill="#999"/></svg>';
}

function getMealIconBg(type) {
    const bgs = { 1: '#fff3e0', 2: '#fff9c4', 3: '#e1f5fe', 4: '#f3e5f5' };
    return bgs[type] || '#f0f0f0';
}

function getRecipeIcon(title) {
    const recipeImages = [
        'ui页面设计素材/详细食谱页使用图片/沙拉.png',
        'ui页面设计素材/详细食谱页使用图片/面.png',
        'ui页面设计素材/详细食谱页使用图片/菌菇汤.png',
        'ui页面设计素材/详细食谱页使用图片/西兰花.png',
        'ui页面设计素材/详细食谱页使用图片/虾仁鸡蛋.png',
        'ui页面设计素材/详细食谱页使用图片/杂粮.png',
        'ui页面设计素材/详细食谱页使用图片/饭团.png',
        'ui页面设计素材/详细食谱页使用图片/三明治.png'
    ];
    const img = recipeImages[title.length % recipeImages.length];
    return `<img src="${img}" alt="${title}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" onerror="this.outerHTML='<div style=\\'width:100%;height:100%;background:linear-gradient(135deg,#35da28,#47D07E);display:flex;align-items:center;justify-content:center;color:white;font-size:24px;\\'>${title.charAt(0)}</div>'">`;
}

function enterApp() {
    console.log('进入应用...');
    document.getElementById('splashScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    switchPage('weight');
}

async function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        await logout();
    }
}

function selectAiRole(role) {
    currentAiRole = role;
    switchPage('chat');
}

function showEditProfile() {
    alert('编辑个人资料\n（实际项目中会打开编辑页面）');
}

function showSettings() {
    alert('账户设置\n（实际项目中会打开设置页面）');
}