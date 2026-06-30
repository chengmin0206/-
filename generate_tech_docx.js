const docx = require('docx');
const fs = require('fs');
const path = require('path');

const {
    Document,
    Paragraph,
    TextRun,
    Heading,
    Table,
    TableCell,
    TableRow,
    AlignmentType,
    WidthType,
    BorderStyle,
    ShadingType,
    convertInchesToTwip,
    PageBreak,
    UnderlineType,
} = docx;

// ========== 颜色常量 ==========
const COLORS = {
    CODE_KEYWORD: '0000FF',    // 关键字蓝色
    CODE_STRING: 'A31515',      // 字符串红色
    CODE_COMMENT: '008000',     // 注释绿色
    CODE_FUNCTION: '795E26',    // 函数名深黄
    CODE_TYPE: '2B91AF',       // 类型青色
    CODE_NUMBER: '0000FF',      // 数字蓝色
    CODE_BG: 'F5F5F5',        // 代码背景灰色
    HEADER_BG: '667EEA',       // 标题背景紫色
    TABLE_HEADER: '764BA2',     // 表头背景深紫
};

// ========== 辅助函数：创建带注释的代码块 ==========
function createCodeBlock(codeLines) {
    // codeLines: Array of {text, comment, highlight}
    const children = [];
    
    codeLines.forEach((line, index) => {
        const runs = [];
        
        if (typeof line === 'string') {
            // 简单文本行
            runs.push(new TextRun({
                text: line,
                font: 'Consolas',
                size: 16,
                break: index < codeLines.length - 1 ? 1 : 0,
            }));
        } else if (line.text) {
            // 带格式的文本
            runs.push(new TextRun({
                text: line.text,
                font: 'Consolas',
                size: 16,
                color: line.color || '000000',
                bold: line.bold || false,
                highlights: line.highlight || false,
            }));
            if (index < codeLines.length - 1) {
                runs.push(new TextRun({ text: '', break: 1 }));
            }
        }
        
        if (runs.length > 0) {
            children.push(new Paragraph({
                children: runs,
                spacing: { after: 0, before: 0 },
                indent: { left: 360 },
            }));
        }
        
        // 添加注释（如果有）
        if (line.comment) {
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: `    // ${line.comment}`,
                        font: 'Consolas',
                        size: 15,
                        color: COLORS.CODE_COMMENT,
                        italics: true,
                    }),
                ],
                spacing: { after: 50, before: 0 },
                indent: { left: 360 },
                shading: {
                    fill: 'F0F8FF',
                    type: ShadingType.CLEAR,
                    color: 'F0F8FF',
                },
            }));
        }
    });
    
    return new Paragraph({
        children: [
            new TextRun({
                text: '─'.repeat(80),
                font: 'Consolas',
                size: 14,
                color: 'CCCCCC',
            }),
        ],
        spacing: { before: 100, after: 50 },
    });
}

// ========== 辅助函数：创建标题 ==========
function createHeading(text, level = 1) {
    const sizes = { 1: 32, 2: 28, 3: 24, 4: 20 };
    return new Paragraph({
        children: [
            new TextRun({
                text,
                bold: true,
                size: sizes[level] || 24,
                color: level <= 2 ? 'FFFFFF' : '333333',
                font: '微软雅黑',
            }),
        ],
        spacing: { before: level <= 2 ? 200 : 150, after: 100 },
        shading: level <= 2 ? {
            fill: COLORS.HEADER_BG,
            type: ShadingType.CLEAR,
            color: COLORS.HEADER_BG,
        } : undefined,
        alignment: AlignmentType.LEFT,
        indent: level <= 2 ? { left: 360 } : undefined,
    });
}

// ========== 辅助函数：创建普通段落 ==========
function createParagraph(text, options = {}) {
    return new Paragraph({
        children: [
            new TextRun({
                text,
                size: options.size || 22,
                color: options.color || '333333',
                bold: options.bold || false,
                font: options.font || '微软雅黑',
            }),
        ],
        spacing: { before: options.before || 50, after: options.after || 50 },
        indent: options.indent,
    });
}

// ========== 辅助函数：创建代码段落 ==========
function createCodeParagraph(lines) {
    const paragraphs = [];
    lines.forEach(line => {
        paragraphs.push(new Paragraph({
            children: [
                new TextRun({
                    text: line,
                    font: 'Consolas',
                    size: 16,
                    color: '333333',
                }),
            ],
            spacing: { before: 0, after: 0 },
            indent: { left: 360 },
            shading: {
                fill: COLORS.CODE_BG,
                type: ShadingType.CLEAR,
                color: COLORS.CODE_BG,
            },
        }));
    });
    
    // 添加代码块边框
    if (paragraphs.length > 0) {
        paragraphs[0].border = {
            left: { color: '667EEA', space: 4, style: BorderStyle.SINGLE, size: 6 },
        };
    }
    
    return paragraphs;
}

// ========== 辅助函数：创建带语法高亮的代码段落 ==========
function createHighlightedCode(lines) {
    // lines: Array of {text, color, bold, italics}
    const paragraphs = [];
    
    lines.forEach(lineParts => {
        const runs = [];
        lineParts.forEach(part => {
            runs.push(new TextRun({
                text: part.text,
                font: 'Consolas',
                size: 16,
                color: part.color || '000000',
                bold: part.bold || false,
                italics: part.italics || false,
            }));
        });
        
        paragraphs.push(new Paragraph({
            children: runs,
            spacing: { before: 0, after: 0 },
            indent: { left: 360 },
        }));
    });
    
    return paragraphs;
}

// ========== 文档内容构建 ==========
const docChildren = [];

// ---- 封面 ----
docChildren.push(
    new Paragraph({
        children: [
            new TextRun({
                text: '卡伴日记',
                bold: true,
                size: 48,
                color: '667EEA',
                font: '微软雅黑',
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 2400, after: 200 },
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: '技术实现文档',
                bold: true,
                size: 36,
                color: '333333',
                font: '微软雅黑',
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: 'Key Code with Comments & Technical Documentation',
                size: 20,
                color: '666666',
                font: 'Arial',
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: '版本：v1.0.0',
                size: 20,
                color: '999999',
                font: '微软雅黑',
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: '日期：2026年6月',
                size: 20,
                color: '999999',
                font: '微软雅黑',
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: '© 2026 卡伴日记 All Rights Reserved',
                size: 18,
                color: '999999',
                font: '微软雅黑',
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
    }),
    new Paragraph({ children: [new TextRun({ text: '', pageBreakBefore: true })] })
);

// ---- 目录 ----
docChildren.push(
    createHeading('目录', 1),
    createParagraph('1. 项目概述 ....................................................... 3'),
    createParagraph('2. 前端代码详解 ............................................... 4'),
    createParagraph('   2.1 启动页与登录流程 .................................... 4'),
    createParagraph('   2.2 主应用核心逻辑（main.js）................. 6'),
    createParagraph('   2.3 样式系统（styles.css）....................... 10'),
    createParagraph('3. 后端代码详解 ............................................. 12'),
    createParagraph('   3.1 用户认证模块 ...................................... 12'),
    createParagraph('   3.2 饮食记录模块 ...................................... 16'),
    createParagraph('   3.3 体重管理模块 ...................................... 19'),
    createParagraph('   3.4 AI健康助手模块 ................................ 22'),
    createParagraph('   3.5 JWT工具与权限控制 ........................ 26'),
    createParagraph('4. 数据库设计 ............................................... 28'),
    createParagraph('5. 总结 ........................................................... 30'),
    new Paragraph({ children: [new TextRun({ text: '', pageBreakBefore: true })] })
);

// ============================================================
// 第1章：项目概述
// ============================================================
docChildren.push(createHeading('1. 项目概述', 1));

docChildren.push(
    createParagraph('卡伴日记是一款面向年轻人群的健康管理工具，通过饮食记录、体重追踪、AI健康助手等功能，帮助用户养成健康的生活习惯。'),
    createParagraph('本项目采用前后端分离架构：'),
    createParagraph('• 前端：HTML5 + CSS3 + JavaScript（原生，无框架依赖）'),
    createParagraph('• 后端：Spring Boot + MyBatis Plus + MySQL'),
    createParagraph('• 认证：JWT（JSON Web Token）'),
    createParagraph('• 实时通信：WebSocket（AI聊天功能）'),
    createParagraph(''),
    createParagraph('技术栈一览：'),
);

// 技术栈表格
docChildren.push(
    new Table({
        rows: [
            new TableRow({
                children: [
                    new TableCell({ children: [createParagraph('分层', { bold: true, color: 'FFFFFF' })] }),
                    new TableCell({ children: [createParagraph('技术', { bold: true, color: 'FFFFFF' })] }),
                    new TableCell({ children: [createParagraph('说明', { bold: true, color: 'FFFFFF' })] }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({ children: [createParagraph('前端')] }),
                    new TableCell({ children: [createParagraph('HTML5, CSS3, JavaScript')] }),
                    new TableCell({ children: [createParagraph('响应式设计，单页应用')] }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({ children: [createParagraph('后端')] }),
                    new TableCell({ children: [createParagraph('Spring Boot 2.x')] }),
                    new TableCell({ children: [createParagraph('RESTful API设计')] }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({ children: [createParagraph('ORM')] }),
                    new TableCell({ children: [createParagraph('MyBatis Plus')] }),
                    new TableCell({ children: [createParagraph('简化数据库操作')] }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({ children: [createParagraph('数据库')] }),
                    new TableCell({ children: [createParagraph('MySQL 8.0')] }),
                    new TableCell({ children: [createParagraph('13张数据表')] }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({ children: [createParagraph('认证')] }),
                    new TableCell({ children: [createParagraph('JWT')] }),
                    new TableCell({ children: [createParagraph('无状态认证机制')] }),
                ],
            }),
            new TableRow({
                children: [
                    new TableCell({ children: [createParagraph('实时通信')] }),
                    new TableCell({ children: [createParagraph('WebSocket')] }),
                    new TableCell({ children: [createParagraph('AI聊天功能')] }),
                ],
            }),
        ],
    })
);

docChildren.push(new Paragraph({ children: [new TextRun({ text: '', pageBreakBefore: true })] }));

// ============================================================
// 第2章：前端代码详解
// ============================================================
docChildren.push(createHeading('2. 前端代码详解', 1));

// ---- 2.1 启动页与登录流程 ----
docChildren.push(createHeading('2.1 启动页与登录流程', 2));
docChildren.push(
    createParagraph('启动页（main.html）是用户进入应用的第一个页面。它负责检查登录状态，决定是直接进入应用还是跳转到登录页面。'),
    createParagraph(''),
    createParagraph('【关键代码 1】登录状态检查（main.js）：', { bold: true }),
);

// 登录状态检查代码
const loginCheckCode = [
    { text: '// ========== 检查登录状态 ==========' },
    { text: 'function checkLoginStatus() {' },
    { text: '    // 从 localStorage 读取登录状态标记' },
    { text: '    const isLoggedIn = localStorage.getItem(\'isLoggedIn\');' },
    { text: '    if (isLoggedIn === \'true\') {' },
    { text: '        // 已登录：隐藏启动页，显示主应用，并跳转到饮食页面' },
    { text: '        document.getElementById(\'splashScreen\').style.display = \'none\';' },
    { text: '        document.getElementById(\'mainApp\').style.display = \'block\';' },
    { text: '        switchPage(\'diet\');  // 切换到"今日饮食"页面' },
    { text: '    } else {' },
    { text: '        // 未登录：显示启动页，等待用户点击"开始使用"' },
    { text: '        document.getElementById(\'splashScreen\').style.display = \'flex\';' },
    { text: '        document.getElementById(\'mainApp\').style.display = \'none\';' },
    { text: '    }' },
    { text: '}' },
    { text: '' },
    { text: '// ========== 页面加载时自动检查登录状态 ==========' },
    { text: 'window.onload = function() {' },
    { text: '    checkLoginStatus();  // 自动执行登录状态检查' },
    { text: '};' },
];

loginCheckCode.forEach(line => {
    docChildren.push(new Paragraph({
        children: [
            new TextRun({
                text: line.text,
                font: 'Consolas',
                size: 16,
                color: line.text.trim().startsWith('//') ? COLORS.CODE_COMMENT : '000000',
            }),
        ],
        spacing: { before: 0, after: 0 },
        indent: { left: 360 },
    }));
});

docChildren.push(
    createParagraph(''),
    createParagraph('【代码说明】', { bold: true }),
    createParagraph('• localStorage 是 HTML5 提供的本地存储 API，用于在前端保存用户的登录状态。'),
    createParagraph('• 当用户登录成功后，会将 isLoggedIn 设置为 "true"。'),
    createParagraph('• 每次页面加载时，都会自动检查登录状态，实现"记住登录"的效果。'),
    createParagraph(''),
    createParagraph('【关键代码 2】进入应用（main.js）：', { bold: true }),
);

// 进入应用代码
const enterAppCode = [
    { text: '// ========== 点击"开始使用"按钮时触发 ==========' },
    { text: 'function enterApp() {' },
    { text: '    // 再次检查登录状态（防止状态过期）' },
    { text: '    const isLoggedIn = localStorage.getItem(\'isLoggedIn\');' },
    { text: '' },
    { text: '    if (isLoggedIn === \'true\') {' },
    { text: '        // 已登录：直接进入主应用' },
    { text: '        document.getElementById(\'splashScreen\').style.display = \'none\';' },
    { text: '        document.getElementById(\'mainApp\').style.display = \'block\';' },
    { text: '        switchPage(\'diet\');' },
    { text: '    } else {' },
    { text: '        // 未登录：跳转到账户创建页面（zhanghu.html）' },
    { text: '        window.location.href = \'zhanghu.html\';' },
    { text: '    }' },
    { text: '}' },
];

enterAppCode.forEach(line => {
    docChildren.push(new Paragraph({
        children: [
            new TextRun({
                text: line.text,
                font: 'Consolas',
                size: 16,
                color: line.text.trim().startsWith('//') ? COLORS.CODE_COMMENT : '000000',
            }),
        ],
        spacing: { before: 0, after: 0 },
        indent: { left: 360 },
    }));
});

docChildren.push(
    createParagraph(''),
    createParagraph('【关键代码 3】手机号登录验证码倒计时（SJHdenglu.html）：', { bold: true }),
);

// 验证码倒计时代码
const verifyCodeCode = [
    { text: '// ========== 发送验证码 ==========' },
    { text: 'function sendVerifyCode() {' },
    { text: '    const phone = document.getElementById(\'phone\').value;' },
    { text: '    // 手机号格式验证正则表达式' },
    { text: '    const phoneRegex = /^1[3-9]\\d{9}$/;' },
    { text: '' },
    { text: '    if (!phoneRegex.test(phone)) {' },
    { text: '        alert(\'请输入正确的手机号码\');' },
    { text: '        return;  // 验证失败，退出函数' },
    { text: '    }' },
    { text: '' },
    { text: '    const btn = document.getElementById(\'verifyBtn\');' },
    { text: '    btn.disabled = true;  // 禁用按钮，防止重复点击' },
    { text: '    countdown = 60;        // 设置倒计时初始值（60秒）' },
    { text: '' },
    { text: '    // 使用 setInterval 实现倒计时' },
    { text: '    countdownTimer = setInterval(() => {' },
    { text: '        countdown--;' },
    { text: '        btn.textContent = `${countdown}秒后重发`;' },
    { text: '        if (countdown <= 0) {' },
    { text: '            clearInterval(countdownTimer);  // 清除定时器' },
    { text: '            btn.disabled = false;             // 恢复按钮' },
    { text: '            btn.textContent = \'获取验证码\';' },
    { text: '        }' },
    { text: '    }, 1000);  // 每1000毫秒（1秒）执行一次' },
    { text: '}' },
];

verifyCodeCode.forEach(line => {
    docChildren.push(new Paragraph({
        children: [
            new TextRun({
                text: line.text,
                font: 'Consolas',
                size: 16,
                color: line.text.trim().startsWith('//') ? COLORS.CODE_COMMENT : '000000',
            }),
        ],
        spacing: { before: 0, after: 0 },
        indent: { left: 360 },
    }));
});

docChildren.push(new Paragraph({ children: [new TextRun({ text: '', pageBreakBefore: true })] }));

// ---- 2.2 主应用核心逻辑（main.js）----
docChildren.push(createHeading('2.2 主应用核心逻辑（main.js）', 2));
docChildren.push(
    createParagraph('main.js 是主应用的核心 JavaScript 文件，负责页面切换、数据展示和交互逻辑。'),
    createParagraph(''),
    createParagraph('【关键代码 4】单页应用页面切换：', { bold: true }),
);

// 页面切换代码
const pageSwitchCode = [
    { text: '// ========== 页面内容模板（核心数据） ==========' },
    { text: 'const pages = {' },
    { text: '    diet: `...`,      // 今日饮食页面 HTML 模板' },
    { text: '    weight: `...`,    // 体重管理页面 HTML 模板' },
    { text: '    chat: `...`,      // 健康助手页面 HTML 模板' },
    { text: '    recipes: `...`,   // 食谱中心页面 HTML 模板' },
    { text: '    profile: `...`    // 个人中心页面 HTML 模板' },
    { text: '};' },
    { text: '' },
    { text: '// ========== 页面切换函数 ==========' },
    { text: 'function switchPage(pageName) {' },
    { text: '    // 获取内容区域 DOM 元素' },
    { text: '    const contentArea = document.getElementById(\'contentArea\');' },
    { text: '    // 将对应页面的 HTML 模板注入到内容区域' },
    { text: '    contentArea.innerHTML = pages[pageName];' },
    { text: '    currentPage = pageName;  // 更新当前页面标记' },
    { text: '' },
    { text: '    // 更新底部导航栏的激活状态' },
    { text: '    document.querySelectorAll(\'.nav-item\').forEach(item => {' },
    { text: '        item.classList.remove(\'active\');' },
    { text: '        if (item.dataset.page === pageName) {' },
    { text: '            item.classList.add(\'active\');  // 高亮当前页面对应的导航项' },
    { text: '        }' },
    { text: '    });' },
    { text: '' },
    { text: '    // 切换页面时滚动到顶部' },
    { text: '    window.scrollTo(0, 0);' },
    { text: '}' },
];

pageSwitchCode.forEach(line => {
    docChildren.push(new Paragraph({
        children: [
            new TextRun({
                text: line.text,
                font: 'Consolas',
                size: 16,
                color: line.text.trim().startsWith('//') ? COLORS.CODE_COMMENT : '000000',
            }),
        ],
        spacing: { before: 0, after: 0 },
        indent: { left: 360 },
    }));
});

docChildren.push(
    createParagraph(''),
    createParagraph('【代码说明】', { bold: true }),
    createParagraph('• 本项目采用"单页应用"（SPA）模式，所有页面共享同一个 HTML 文件。'),
    createParagraph('• 页面内容以模板字符串的形式存储在 pages 对象中。'),
    createParagraph('• 切换页面时，只需将对应的 HTML 模板注入到内容区域即可。'),
    createParagraph(''),
    createParagraph('【关键代码 5】AI 聊天消息发送：', { bold: true }),
);

// AI聊天代码
const chatCode = [
    { text: '// ========== 发送消息函数 ==========' },
    { text: 'function sendMessage() {' },
    { text: '    const input = document.getElementById(\'chatInput\');' },
    { text: '    const message = input.value.trim();  // 获取输入内容并去除首尾空格' },
    { text: '' },
    { text: '    if (!message) return;  // 空消息不发送' },
    { text: '' },
    { text: '    const messagesContainer = document.getElementById(\'chatMessages\');' },
    { text: '' },
    { text: '    // 1. 添加用户消息到聊天界面' },
    { text: '    messagesContainer.innerHTML += `' },
    { text: '        <div class="message user">' },
    { text: '            <div class="message-content">${message}</div>' },
    { text: '            <div class="message-avatar">😊</div>' },
    { text: '        </div>`;' },
    { text: '' },
    { text: '    input.value = \'\';  // 清空输入框' },
    { text: '    // 滚动到最新消息' },
    { text: '    messagesContainer.scrollTop = messagesContainer.scrollHeight;' },
    { text: '' },
    { text: '    // 2. 模拟AI回复（实际项目中会调用后端API）' },
    { text: '    setTimeout(() => {' },
    { text: '        messagesContainer.innerHTML += `' },
    { text: '            <div class="message assistant">' },
    { text: '                <div class="message-avatar">🤖</div>' },
    { text: '                <div class="message-content">' },
    { text: '                    收到您的问题：${message}<br><br>' },
    { text: '                    让我来为您解答...' },
    { text: '                </div>' },
    { text: '            </div>`;' },
    { text: '        messagesContainer.scrollTop = messagesContainer.scrollHeight;' },
    { text: '    }, 1000);  // 延迟1秒，模拟AI思考时间' },
    { text: '}' },
];

chatCode.forEach(line => {
    docChildren.push(new Paragraph({
        children: [
            new TextRun({
                text: line.text,
                font: 'Consolas',
                size: 15,
                color: line.text.trim().startsWith('//') ? COLORS.CODE_COMMENT : '000000',
            }),
        ],
        spacing: { before: 0, after: 0 },
        indent: { left: 360 },
    }));
});

docChildren.push(new Paragraph({ children: [new TextRun({ text: '', pageBreakBefore: true })] }));

// ---- 2.3 样式系统（styles.css）----
docChildren.push(createHeading('2.3 样式系统（styles.css）', 2));
docChildren.push(
    createParagraph('styles.css 定义了整个应用的视觉风格，采用 CSS 变量和模块化设计，确保样式一致性和可维护性。'),
    createParagraph(''),
    createParagraph('【关键代码 6】CSS 变量与主题色：', { bold: true }),
);

// CSS变量代码
const cssVarCode = [
    { text: '/* ========== 全局样式 ========== */' },
    { text: '* {' },
    { text: '    margin: 0;' },
    { text: '    padding: 0;' },
    { text: '    box-sizing: border-box;  /* 边框盒模型，方便布局 */' },
    { text: '}' },
    { text: '' },
    { text: 'body {' },
    { text: '    font-family: -apple-system, BlinkMacSystemFont, sans-serif;' },
    { text: '    background: #f5f5f5;       /* 页面背景灰色 */' },
    { text: '    color: #333;               /* 默认文字颜色 */' },
    { text: '    min-height: 100vh;        /* 最小高度为整个视口 */' },
    { text: '}' },
    { text: '' },
    { text: '/* ========== 主色系（紫色渐变） ========== */' },
    { text: '.header {' },
    { text: '    /* 使用紫色到深紫的渐变作为品牌色 */' },
    { text: '    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' },
    { text: '    padding: 20px;' },
    { text: '    color: white;' },
    { text: '}' },
    { text: '' },
    { text: '/* ========== 卡片样式 ========== */' },
    { text: '.card {' },
    { text: '    background: white;' },
    { text: '    border-radius: 16px;      /* 圆角 */' },
    { text: '    padding: 20px;' },
    { text: '    margin: 15px;' },
    { text: '    box-shadow: 0 2px 10px rgba(0,0,0,0.05);  /* 轻微阴影 */' },
    { text: '}' },
];

cssVarCode.forEach(line => {
    docChildren.push(new Paragraph({
        children: [
            new TextRun({
                text: line.text,
                font: 'Consolas',
                size: 16,
                color: line.text.trim().startsWith('/*') || line.text.trim().startsWith('*') ? COLORS.CODE_COMMENT : '000000',
            }),
        ],
        spacing: { before: 0, after: 0 },
        indent: { left: 360 },
    }));
});

docChildren.push(
    createParagraph(''),
    createParagraph('【代码说明】', { bold: true }),
    createParagraph('• 本项目使用 #667eea 到 #764ba2 的紫色渐变作为品牌主色。'),
    createParagraph('• 所有交互元素（按钮、卡片、导航）都遵循统一的设计规范。'),
    createParagraph('• 采用响应式设计，适配不同尺寸的手机屏幕。'),
);

docChildren.push(new Paragraph({ children: [new TextRun({ text: '', pageBreakBefore: true })] }));

// ============================================================
// 第3章：后端代码详解
// ============================================================
docChildren.push(createHeading('3. 后端代码详解', 1));

// ---- 3.1 用户认证模块 ----
docChildren.push(createHeading('3.1 用户认证模块', 2));
docChildren.push(
    createParagraph('用户认证模块负责处理用户注册、登录、验证码校验等功能。采用 JWT 实现无状态认证。'),
    createParagraph(''),
    createParagraph('【关键代码 7】用户登录服务实现（UserServiceImpl.java）：', { bold: true }),
);

// 用户登录代码
const userLoginCode = [
    { text: '/**' },
    { text: ' * 用户登录服务实现' },
    { text: ' * 支持多种登录方式：验证码登录、密码登录、第三方登录、访客登录' },
    { text: ' */' },
    { text: '@Override' },
    { text: '@Transactional(rollbackFor = Exception.class)  // 事务注解：失败时自动回滚' },
    { text: 'public String login(LoginDTO loginDTO) {' },
    { text: '    User user;' },
    { text: '' },
    { text: '    if (loginDTO.getLoginType() == null || loginDTO.getLoginType() == 1) {' },
    { text: '        // 【方式1】手机验证码登录' },
    { text: '        // 1. 验证验证码是否正确' },
    { text: '        String cacheCode = getVerifyCode(loginDTO.getPhone());' },
    { text: '        if (cacheCode == null || !cacheCode.equals(loginDTO.getVerifyCode())) {' },
    { text: '            throw new BusinessException("验证码错误或已过期");' },
    { text: '        }' },
    { text: '' },
    { text: '        // 2. 查找用户（如果不存在则自动注册）' },
    { text: '        user = userMapper.selectOne(new LambdaQueryWrapper<User>()' },
    { text: '                .eq(User::getPhone, loginDTO.getPhone()));' },
    { text: '' },
    { text: '        if (user == null) {' },
    { text: '            // 自动注册新用户' },
    { text: '            user = new User();' },
    { text: '            user.setPhone(loginDTO.getPhone());' },
    { text: '            user.setNickname("卡伴用户" + RandomUtil.randomNumbers(4));' },
    { text: '            userMapper.insert(user);' },
    { text: '' },
    { text: '            // 创建用户健康资料（默认值）' },
    { text: '            UserProfile profile = new UserProfile();' },
    { text: '            profile.setUserId(user.getId());' },
    { text: '            profile.setDailyCalorieGoal(2000);  // 默认每日热量目标2000kcal' },
    { text: '            profile.setDailyWaterGoal(2000);    // 默认每日饮水目标2000ml' },
    { text: '            userProfileMapper.insert(profile);' },
    { text: '        }' },
    { text: '    }' },
    { text: '    // ... 其他登录方式（密码、第三方、访客）' },
    { text: '' },
    { text: '    // 3. 生成JWT Token并返回' },
    { text: '    return jwtUtil.generateToken(user.getId(), user.getPhone());' },
    { text: '}' },
];

userLoginCode.forEach(line => {
    docChildren.push(new Paragraph({
        children: [
            new TextRun({
                text: line.text,
                font: 'Consolas',
                size: 15,
                color: line.text.trim().startsWith('//') || line.text.trim().startsWith('/**') || line.text.trim().startsWith('*') ? COLORS.CODE_COMMENT : '000000',
            }),
        ],
        spacing: { before: 0, after: 0 },
        indent: { left: 360 },
    }));
});

docChildren.push(
    createParagraph(''),
    createParagraph('【代码说明】', { bold: true }),
    createParagraph('• 登录支持多种方式：手机验证码（默认）、密码、微信/QQ第三方、访客模式。'),
    createParagraph('• 使用 @Transactional 注解确保数据一致性：注册用户和创建资料要么同时成功，要么同时失败。'),
    createParagraph('• 登录成功后返回 JWT Token，后续请求需要在 Header 中携带此 Token 进行认证。'),
);

docChildren.push(new Paragraph({ children: [new TextRun({ text: '', pageBreakBefore: true })] }));

// ---- 3.2 饮食记录模块 ----
docChildren.push(createHeading('3.2 饮食记录模块', 2));
docChildren.push(
    createParagraph('饮食记录模块负责处理用户的饮食数据，包括添加记录、查询统计、删除记录等功能。'),
    createParagraph(''),
    createParagraph('【关键代码 8】饮食记录控制器（DietController.java）：', { bold: true }),
);

// 饮食记录代码
const dietCode = [
    { text: '/**' },
    { text: ' * 饮食管理控制器' },
    { text: ' * 处理饮食记录相关的 HTTP 请求' },
    { text: ' */' },
    { text: '@RestController' },
    { text: '@RequestMapping("/diet")  // 基础路径：/api/diet' },
    { text: 'public class DietController {' },
    { text: '' },
    { text: '    @Resource' },
    { text: '    private DietService dietService;' },
    { text: '' },
    { text: '    /**' },
    { text: '     * 获取今日饮食统计' },
    { text: '     * GET /api/diet/stat' },
    { text: '     */' },
    { text: '    @GetMapping("/stat")' },
    { text: '    public Result<DietStatDTO> getTodayStat(' },
    { text: '            @RequestHeader("Authorization") String token) {' },
    { text: '        // 1. 从 JWT Token 中解析用户ID' },
    { text: '        Long userId = jwtUtil.getUserIdFromToken(token);' },
    { text: '        // 2. 调用服务层获取统计数' },
    { text: '        DietStatDTO stat = dietService.getDietStat(userId, LocalDate.now());' },
    { text: '        // 3. 返回统一格式的响应' },
    { text: '        return Result.success(stat);' },
    { text: '    }' },
    { text: '' },
    { text: '    /**' },
    { text: '     * 添加饮食记录' },
    { text: '     * POST /api/diet/record' },
    { text: '     */' },
    { text: '    @PostMapping("/record")' },
    { text: '    public Result<Void> addDietRecord(' },
    { text: '            @RequestHeader("Authorization") String token,' },
    { text: '            @Valid @RequestBody DietRecordDTO dto) {' },
    { text: '        Long userId = jwtUtil.getUserIdFromToken(token);' },
    { text: '        dietService.addDietRecord(userId, dto);' },
    { text: '        return Result.success();' },
    { text: '    }' },
    { text: '}' },
];

dietCode.forEach(line => {
    docChildren.push(new Paragraph({
        children: [
            new TextRun({
                text: line.text,
                font: 'Consolas',
                size: 15,
                color: line.text.trim().startsWith('//') || line.text.trim().startsWith('/**') || line.text.trim().startsWith('*') ? COLORS.CODE_COMMENT : '000000',
            }),
        ],
        spacing: { before: 0, after: 0 },
        indent: { left: 360 },
    }));
});

docChildren.push(
    createParagraph(''),
    createParagraph('【代码说明】', { bold: true }),
    createParagraph('• @RequestMapping("/diet") 定义了控制器的基础路径，所有接口都以 /api/diet 开头。'),
    createParagraph('• @RequestHeader("Authorization") 用于获取请求头中的 Token，实现权限验证。'),
    createParagraph('• @Valid 注解用于自动校验请求参数的合法性（如非空、格式等）。'),
    createParagraph('• Result<T> 是统一响应封装类，确保所有接口返回格式一致。'),
);

docChildren.push(new Paragraph({ children: [new TextRun({ text: '', pageBreakBefore: true })] }));

// ---- 3.3 体重管理模块 ----
docChildren.push(createHeading('3.3 体重管理模块', 2));
docChildren.push(
    createParagraph('体重管理模块负责处理用户的体重数据，包括记录体重、查询趋势、设置目标等功能。'),
    createParagraph(''),
    createParagraph('【关键代码 9】体重记录控制器（WeightController.java）：', { bold: true }),
);

// 体重管理代码
const weightCode = [
    { text: '/**' },
    { text: ' * 体重管理控制器' },
    { text: ' */' },
    { text: '@RestController' },
    { text: '@RequestMapping("/weight")' },
    { text: '@Validated  // 启用参数校验' },
    { text: 'public class WeightController {' },
    { text: '' },
    { text: '    /**' },
    { text: '     * 添加体重记录' },
    { text: '     * POST /api/weight/record' },
    { text: '     */' },
    { text: '    @PostMapping("/record")' },
    { text: '    public Result<Void> addWeightRecord(' },
    { text: '            @RequestHeader("Authorization") String token,' },
    { text: '            @RequestParam @NotNull @DecimalMin("0") BigDecimal weight,' },
    { text: '            @RequestParam(required = false) BigDecimal bodyFatRate,' },
    { text: '            @RequestParam(required = false) String note) {' },
    { text: '        // @NotNull：体重不能为空' },
    { text: '        // @DecimalMin("0")：体重必须大于0' },
    { text: '        // required = false：体脂率和备注为可选参数' },
    { text: '        Long userId = jwtUtil.getUserIdFromToken(token);' },
    { text: '        weightService.addWeightRecord(userId, weight, bodyFatRate, note);' },
    { text: '        return Result.success();' },
    { text: '    }' },
    { text: '' },
    { text: '    /**' },
    { text: '     * 获取体重记录列表（最近N天）' },
    { text: '     * GET /api/weight/records?days=30' },
    { text: '     */' },
    { text: '    @GetMapping("/records")' },
    { text: '    public Result<List<WeightRecord>> getWeightRecords(' },
    { text: '            @RequestHeader("Authorization") String token,' },
    { text: '            @RequestParam(defaultValue = "30") int days) {' },
    { text: '        // defaultValue = "30"：默认查询最近30天' },
    { text: '        Long userId = jwtUtil.getUserIdFromToken(token);' },
    { text: '        List<WeightRecord> records = weightService.getWeightRecords(userId, days);' },
    { text: '        return Result.success(records);' },
    { text: '    }' },
    { text: '}' },
];

weightCode.forEach(line => {
    docChildren.push(new Paragraph({
        children: [
            new TextRun({
                text: line.text,
                font: 'Consolas',
                size: 15,
                color: line.text.trim().startsWith('//') || line.text.trim().startsWith('/**') || line.text.trim().startsWith('*') ? COLORS.CODE_COMMENT : '000000',
            }),
        ],
        spacing: { before: 0, after: 0 },
        indent: { left: 360 },
    }));
});

docChildren.push(
    createParagraph(''),
    createParagraph('【代码说明】', { bold: true }),
    createParagraph('• 使用 Bean Validation 注解（@NotNull、@DecimalMin）对参数进行校验，减少手动校验代码。'),
    createParagraph('• 体重记录支持可选参数：体脂率（bodyFatRate）和备注（note）。'),
    createParagraph('• 查询记录时支持自定义天数，默认返回最近30天的数据。'),
);

docChildren.push(new Paragraph({ children: [new TextRun({ text: '', pageBreakBefore: true })] }));

// ---- 3.4 AI健康助手模块 ----
docChildren.push(createHeading('3.4 AI健康助手模块', 2));
docChildren.push(
    createParagraph('AI健康助手模块通过 WebSocket 实现实时聊天功能，支持用户与AI进行健康咨询对话。'),
    createParagraph(''),
    createParagraph('【关键代码 10】WebSocket 聊天处理器（ChatWebSocketHandler.java）：', { bold: true }),
);

// WebSocket代码
const websocketCode = [
    { text: '/**' },
    { text: ' * 聊天WebSocket处理器' },
    { text: ' * 处理客户端的WebSocket连接和消息' },
    { text: ' */' },
    { text: '@Component' },
    { text: 'public class ChatWebSocketHandler extends TextWebSocketHandler {' },
    { text: '' },
    { text: '    // 存储用户会话（用于推送消息）' },
    { text: '    // Key: 用户ID, Value: WebSocketSession' },
    { text: '    private final Map<Long, WebSocketSession> userSessions = new ConcurrentHashMap<>();' },
    { text: '' },
    { text: '    /**' },
    { text: '     * 连接建立时触发' },
    { text: '     */' },
    { text: '    @Override' },
    { text: '    public void afterConnectionEstablished(WebSocketSession session) {' },
    { text: '        // 1. 从URL中提取Token进行认证' },
    { text: '        String token = extractToken(session.getUri().toString());' },
    { text: '        if (token == null || !jwtUtil.validateToken(token)) {' },
    { text: '            session.close();  // Token无效，拒绝连接' },
    { text: '            return;' },
    { text: '        }' },
    { text: '' },
    { text: '        // 2. 认证成功，保存用户会话' },
    { text: '        Long userId = jwtUtil.getUserIdFromToken(token);' },
    { text: '        userSessions.put(userId, session);' },
    { text: '' },
    { text: '        // 3. 发送欢迎消息' },
    { text: '        sendMessage(userId, createMessage(MESSAGE_TYPE_AI,' },
    { text: '            "你好！我是您的健康助手小伴 🌟\\n\\n我可以帮您..."));' },
    { text: '    }' },
    { text: '' },
    { text: '    /**' },
    { text: '     * 收到消息时触发（核心处理逻辑）' },
    { text: '     */' },
    { text: '    @Override' },
    { text: '    protected void handleTextMessage(WebSocketSession session, TextMessage message) {' },
    { text: '        // 1. 解析客户端发送的消息（JSON格式）' },
    { text: '        JsonNode jsonNode = objectMapper.readTree(message.getPayload());' },
    { text: '        String content = jsonNode.get("content").asText();' },
    { text: '' },
    { text: '        // 2. 保存用户消息到数据库' },
    { text: '        saveMessage(userId, MESSAGE_TYPE_USER, content);' },
    { text: '' },
    { text: '        // 3. 使用异步线程生成AI回复（不阻塞WebSocket线程）' },
    { text: '        asyncExecutor.execute(() -> {' },
    { text: '            // 调用AI服务获取回复' },
    { text: '            String aiResponse = qAnythingService.healthChat(content);' },
    { text: '            // 发送AI回复给客户端' },
    { text: '            sendMessage(userId, createMessage(MESSAGE_TYPE_AI, aiResponse));' },
    { text: '        });' },
    { text: '    }' },
    { text: '}' },
];

websocketCode.forEach(line => {
    docChildren.push(new Paragraph({
        children: [
            new TextRun({
                text: line.text,
                font: 'Consolas',
                size: 14,
                color: line.text.trim().startsWith('//') || line.text.trim().startsWith('/**') || line.text.trim().startsWith('*') ? COLORS.CODE_COMMENT : '000000',
            }),
        ],
        spacing: { before: 0, after: 0 },
        indent: { left: 360 },
    }));
});

docChildren.push(
    createParagraph(''),
    createParagraph('【代码说明】', { bold: true }),
    createParagraph('• WebSocket 连接建立时需要进行 Token 认证，确保只有登录用户才能使用聊天功能。'),
    createParagraph('• 使用 ConcurrentHashMap 存储用户会话，支持并发访问。'),
    createParagraph('• AI 回复使用异步线程处理，避免阻塞 WebSocket 线程，提高并发性能。'),
    createParagraph('• 消息会保存到数据库，支持历史聊天记录查询。'),
);

docChildren.push(new Paragraph({ children: [new TextRun({ text: '', pageBreakBefore: true })] }));

// ---- 3.5 JWT工具与权限控制 ----
docChildren.push(createHeading('3.5 JWT工具与权限控制', 2));
docChildren.push(
    createParagraph('JWT（JSON Web Token）是用于前后端分离项目的轻量级认证方案。Token 包含用户身份信息，后端通过签名验证 Token 的合法性。'),
    createParagraph(''),
    createParagraph('【关键代码 11】JWT 工具类（JwtUtil.java）：', { bold: true }),
);

// JWT代码
const jwtCode = [
    { text: '/**' },
    { text: ' * JWT工具类' },
    { text: ' * 负责生成、解析、验证Token' },
    { text: ' */' },
    { text: '@Component' },
    { text: 'public class JwtUtil {' },
    { text: '' },
    { text: '    @Value("${jwt.secret}")  // 从配置文件读取密钥' },
    { text: '    private String secret;' },
    { text: '' },
    { text: '    /**' },
    { text: '     * 生成Token' },
    { text: '     * @param userId  用户ID（存入Token载荷）' },
    { text: '     * @param phone   手机号（作为Token主题）' },
    { text: '     */' },
    { text: '    public String generateToken(Long userId, String phone) {' },
    { text: '        Map<String, Object> claims = new HashMap<>();' },
    { text: '        claims.put("userId", userId);  // 自定义载荷数据' },
    { text: '        claims.put("phone", phone);' },
    { text: '        return createToken(claims, phone);' },
    { text: '    }' },
    { text: '' },
    { text: '    /**' },
    { text: '     * 创建Token（内部方法）' },
    { text: '     */' },
    { text: '    private String createToken(Map<String, Object> claims, String subject) {' },
    { text: '        Date now = new Date();' },
    { text: '        // 设置过期时间（从配置文件读取）' },
    { text: '        Date expiryDate = new Date(now.getTime() + expiration);' },
    { text: '' },
    { text: '        return Jwts.builder()' },
    { text: '                .setClaims(claims)       // 设置自定义载荷' },
    { text: '                .setSubject(subject)      // 设置主题（手机号）' },
    { text: '                .setIssuedAt(now)        // 设置签发时间' },
    { text: '                .setExpiration(expiryDate)  // 设置过期时间' },
    { text: '                .signWith(getSignKey(), SignatureAlgorithm.HS512)  // 使用HS512算法签名' },
    { text: '                .compact();' },
    { text: '    }' },
    { text: '' },
    { text: '    /**' },
    { text: '     * 验证Token是否有效' },
    { text: '     */' },
    { text: '    public boolean validateToken(String token) {' },
    { text: '        try {' },
    { text: '            // 使用密钥解析Token，如果解析失败会抛出异常' },
    { text: '            Jwts.parserBuilder()' },
    { text: '                 .setSigningKey(getSignKey())' },
    { text: '                 .build()' },
    { text: '                 .parseClaimsJws(token);' },
    { text: '            return true;  // Token合法' },
    { text: '        } catch (JwtException | IllegalArgumentException e) {' },
    { text: '            return false; // Token不合法（过期、篡改等）' },
    { text: '        }' },
    { text: '    }' },
    { text: '}' },
];

jwtCode.forEach(line => {
    docChildren.push(new Paragraph({
        children: [
            new TextRun({
                text: line.text,
                font: 'Consolas',
                size: 14,
                color: line.text.trim().startsWith('//') || line.text.trim().startsWith('/**') || line.text.trim().startsWith('*') ? COLORS.CODE_COMMENT : '000000',
            }),
        ],
        spacing: { before: 0, after: 0 },
        indent: { left: 360 },
    }));
});

docChildren.push(
    createParagraph(''),
    createParagraph('【代码说明】', { bold: true }),
    createParagraph('• JWT Token 由三部分组成：Header（头部）、Payload（载荷）、Signature（签名）。'),
    createParagraph('• 使用 HS512 对称加密算法进行签名，只有持有密钥的服务器才能验证 Token 合法性。'),
    createParagraph('• Token 过期后会自动失效，需要用户重新登录获取新 Token。'),
);

docChildren.push(new Paragraph({ children: [new TextRun({ text: '', pageBreakBefore: true })] }));

// ============================================================
// 第4章：数据库设计
// ============================================================
docChildren.push(createHeading('4. 数据库设计', 1));
docChildren.push(
    createParagraph('本项目使用 MySQL 8.0 作为数据库，共设计了 13 张数据表，覆盖用户、饮食、体重、运动、食谱等核心业务数据。'),
    createParagraph(''),
    createParagraph('【核心数据表结构】', { bold: true }),
);

// 数据库表结构
const dbTables = [
    ['user', '用户信息表', '存储用户基本信息（手机号、昵称、头像等）'],
    ['user_profile', '用户健康资料表', '存储身高、体重、目标等健康数据'],
    ['weight_record', '体重记录表', '存储用户每次记录的体重数据'],
    ['diet_record', '饮食记录表', '存储用户的每餐饮食记录'],
    ['food', '食物营养成分表', '存储食物的热量、营养成分等数据'],
    ['water_record', '饮水记录表', '存储用户的每日饮水记录'],
    ['exercise_record', '运动记录表', '存储用户的运动数据'],
    ['recipe', '食谱表', '存储食谱的详细信息'],
    ['recipe_collection', '食谱收藏表', '存储用户收藏的食谱'],
    ['chat_message', '聊天消息表', '存储用户与AI的聊天记录'],
    ['health_goal', '健康目标表', '存储用户的健康目标'],
    ['diet_method', '减肥法表', '存储各种减肥法的介绍'],
    ['user_feedback', '用户反馈表', '存储用户的反馈意见'],
];

const dbRows = [
    new TableRow({
        children: [
            new TableCell({ children: [createParagraph('表名', { bold: true, color: 'FFFFFF' })] }),
            new TableCell({ children: [createParagraph('说明', { bold: true, color: 'FFFFFF' })] }),
            new TableCell({ children: [createParagraph('详细描述', { bold: true, color: 'FFFFFF' })] }),
        ],
    }),
    ...dbTables.map(([name, desc, detail]) => new TableRow({
        children: [
            new TableCell({ children: [createParagraph(name)] }),
            new TableCell({ children: [createParagraph(desc)] }),
            new TableCell({ children: [createParagraph(detail)] }),
        ],
    })),
];

docChildren.push(new Table({ rows: dbRows }));

docChildren.push(
    createParagraph(''),
    createParagraph('【关键SQL】数据库初始化脚本示例：', { bold: true }),
);

// SQL代码
const sqlCode = [
    { text: '-- ========== 创建用户表 ==========' },
    { text: 'CREATE TABLE `user` (' },
    { text: '  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT \'用户ID\',' },
    { text: '  `phone` VARCHAR(20) UNIQUE COMMENT \'手机号\',' },
    { text: '  `nickname` VARCHAR(50) COMMENT \'昵称\',' },
    { text: '  `avatar` VARCHAR(255) COMMENT \'头像URL\',' },
    { text: '  `login_type` INT DEFAULT 1 COMMENT \'登录方式（1=验证码，2=微信，3=QQ，4=访客）\',' },
    { text: '  `status` INT DEFAULT 1 COMMENT \'状态（1=正常，0=禁用）\',' },
    { text: '  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT \'创建时间\',' },
    { text: '  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT \'更新时间\'' },
    { text: ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT=\'用户信息表\';' },
    { text: '' },
    { text: '-- ========== 创建体重记录表 ==========' },
    { text: 'CREATE TABLE `weight_record` (' },
    { text: '  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,' },
    { text: '  `user_id` BIGINT NOT NULL COMMENT \'用户ID\',' },
    { text: '  `weight` DECIMAL(5,2) NOT NULL COMMENT \'体重（kg）\',' },
    { text: '  `body_fat_rate` DECIMAL(5,2) COMMENT \'体脂率（%）\',' },
    { text: '  `record_date` DATE NOT NULL COMMENT \'记录日期\',' },
    { text: '  `note` VARCHAR(255) COMMENT \'备注\',' },
    { text: '  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,' },
    { text: '  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)  -- 外键关联' },
    { text: ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;' },
];

sqlCode.forEach(line => {
    docChildren.push(new Paragraph({
        children: [
            new TextRun({
                text: line.text,
                font: 'Consolas',
                size: 16,
                color: line.text.trim().startsWith('--') ? COLORS.CODE_COMMENT : '000000',
            }),
        ],
        spacing: { before: 0, after: 0 },
        indent: { left: 360 },
    }));
});

docChildren.push(new Paragraph({ children: [new TextRun({ text: '', pageBreakBefore: true })] }));

// ============================================================
// 第5章：总结
// ============================================================
docChildren.push(createHeading('5. 总结', 1));
docChildren.push(
    createParagraph('本文档详细介绍了"卡伴日记"项目的核心技术实现，包括前端和后端的关键代码，并配有详细的中文注释和说明。'),
    createParagraph(''),
    createParagraph('【技术亮点总结】', { bold: true }),
    createParagraph('1. 前端采用原生 JavaScript 实现单页应用，无需依赖第三方框架，加载速度快。'),
    createParagraph('2. 使用 localStorage 实现登录状态管理，用户体验良好。'),
    createParagraph('3. 后端采用 Spring Boot + MyBatis Plus 架构，开发效率高。'),
    createParagraph('4. 使用 JWT 实现无状态认证，适合前后端分离项目。'),
    createParagraph('5. 使用 WebSocket 实现实时聊天功能，AI 回复采用异步处理，性能好。'),
    createParagraph('6. 数据库设计合理，表结构清晰，支持未来功能扩展。'),
    createParagraph(''),
    createParagraph('【后续优化方向】', { bold: true }),
    createParagraph('• 对接真实的 AI 大模型 API（如通义千问、文心一言）。'),
    createParagraph('• 实现食物图片识别功能（接入图像识别 API）。'),
    createParagraph('• 增加数据可视化图表（使用 ECharts 等库）。'),
    createParagraph('• 优化移动端体验（增加 PWA 支持，可安装到手机桌面）。'),
    createParagraph(''),
    createParagraph('---'),
    createParagraph('文档版本：v1.0.0'),
    createParagraph('生成日期：' + new Date().toISOString().split('T')[0]),
    createParagraph('© 2026 卡伴日记 All Rights Reserved'),
);

// ========== 生成文档 ==========
const doc = new Document({
    sections: [{
        properties: {},
        children: docChildren,
    }],
});

console.log('正在生成技术文档 DOCX...');

docx.Packer.toBuffer(doc).then(buffer => {
    const outputPath = path.join(__dirname, '卡伴日记-技术实现文档.docx');
    fs.writeFileSync(outputPath, buffer);
    console.log('✅ 技术文档已生成：' + outputPath);
}).catch(err => {
    console.error('❌ 生成失败：', err);
});
