// API 基础配置
const ALIYUN_API_URL = 'http://218.244.155.73:8080';
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : ALIYUN_API_URL;
const WS_URL = window.location.hostname === 'localhost'
    ? 'ws://localhost:8080/ws/chat'
    : 'ws://218.244.155.73:8080/ws/chat';

// 存储的 Token key
const TOKEN_KEY = 'kaban_token';

/**
 * 获取存储的 Token
 */
function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * 保存 Token
 */
function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

/**
 * 清除 Token
 */
function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

/**
 * 检查是否已登录
 */
function isLoggedIn() {
    return !!getToken();
}

/**
 * 通用 API 请求封装
 */
async function apiRequest(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers
        });

        console.log('[API Response]', url, response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[API Error]', response.status, errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('[API Data]', data);

        // 检查业务错误码（后端可能返回 200 但 code 不是 200）
        if (data && typeof data.code === 'number' && data.code !== 200) {
            const errorMsg = data.message || '请求失败';
            console.error('[API Business Error]', data.code, errorMsg);
            throw new Error(`${errorMsg} (code: ${data.code})`);
        }

        return data;
    } catch (error) {
        console.error('[API Exception]', error);
        throw error;
    }
}

/**
 * 登录 API
 */
async function login(phone, verifyCode, loginType = 4) {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, verifyCode, loginType })
    });
}

/**
 * 发送验证码
 */
async function sendVerifyCode(phone) {
    return apiRequest('/auth/verify-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `phone=${phone}`
    });
}

/**
 * 获取用户信息
 */
async function getUserInfo() {
    return apiRequest('/user/info', {
        method: 'GET'
    });
}

/**
 * 获取体重统计
 */
async function getWeightStat() {
    return apiRequest('/weight/stat', {
        method: 'GET'
    });
}

/**
 * 添加体重记录
 */
async function addWeightRecord(weight, bodyFatRate, note) {
    const params = new URLSearchParams({ weight });
    if (bodyFatRate) params.append('bodyFatRate', bodyFatRate);
    if (note) params.append('note', note);

    return apiRequest(`/weight/record?${params.toString()}`, {
        method: 'POST'
    });
}

async function updateHeight(height) {
    return apiRequest(`/weight/height?height=${height}`, {
        method: 'PUT'
    });
}

async function updateTargetWeight(targetWeight) {
    return apiRequest(`/weight/target?targetWeight=${targetWeight}`, {
        method: 'PUT'
    });
}

/**
 * 获取饮食统计
 */
async function getDietStat(dateStr) {
    const url = dateStr ? `/diet/stat/date?date=${dateStr}` : '/diet/stat';
    return apiRequest(url, {
        method: 'GET'
    });
}

// 格式化日期为 yyyy-MM-dd
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 获取今日饮食统计（无参数）
async function getTodayDietStat() {
    const today = formatDate(new Date());
    return apiRequest(`/diet/stat/date?date=${today}`, {
        method: 'GET'
    });
}

/**
 * 获取饮食记录
 */
async function getDietRecords() {
    return apiRequest('/diet/records', {
        method: 'GET'
    });
}

/**
 * 添加饮食记录
 */
async function addDietRecord(data) {
    return apiRequest('/diet/record', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

async function recognizeFood(imageUrl) {
    return apiRequest('/diet/recognize', {
        method: 'POST',
        body: JSON.stringify(imageUrl)
    });
}

/**
 * 获取今日饮水信息
 */
async function getTodayWater() {
    return apiRequest('/water/today', {
        method: 'GET'
    });
}

/**
 * 添加饮水记录
 */
async function addWater(amount) {
    return apiRequest(`/water/add?amount=${amount}`, {
        method: 'POST'
    });
}

/**
 * 获取热门食谱
 */
async function getHotRecipes(limit = 10) {
    return apiRequest(`/recipe/hot?limit=${limit}`, {
        method: 'GET'
    });
}

/**
 * 获取精选食谱
 */
async function getSelectedRecipes(limit = 10) {
    return apiRequest(`/recipe/selected?limit=${limit}`, {
        method: 'GET'
    });
}

/**
 * 获取 AI 智能食谱
 */
async function getAiRecipes(limit = 10) {
    return apiRequest(`/recipe/ai?limit=${limit}`, {
        method: 'GET'
    });
}

/**
 * 获取专家食谱
 */
async function getExpertRecipes(limit = 10) {
    return apiRequest(`/recipe/expert?limit=${limit}`, {
        method: 'GET'
    });
}

/**
 * 搜索食谱
 */
async function searchRecipes(keyword) {
    return apiRequest(`/recipe/search?keyword=${encodeURIComponent(keyword)}`, {
        method: 'GET'
    });
}

async function getRecipeDetail(id) {
    return apiRequest(`/recipe/${id}`, {
        method: 'GET'
    });
}

/**
 * 退出登录
 */
async function logout() {
    try {
        await apiRequest('/auth/logout', {
            method: 'POST'
        });
    } finally {
        clearToken();
        window.location.href = '/';
    }
}