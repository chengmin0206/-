const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  TabStopType, TabStopPosition
} = require("docx");

// ===== Color & Style Constants =====
const COLOR_PRIMARY = "5B2C87";      // Deep purple
const COLOR_ACCENT = "667EEA";       // Light purple-blue
const COLOR_TEXT = "333333";
const COLOR_LIGHT = "F5F0FA";
const COLOR_TABLE_HEADER = "5B2C87";
const COLOR_WHITE = "FFFFFF";
const COLOR_GRAY = "666666";
const COLOR_LIGHTGRAY = "E8E8E8";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
};

// US Letter content width with 1" margins
const CONTENT_WIDTH = 9360;

// ===== Helper Functions =====
function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, color: COLOR_PRIMARY, font: "Microsoft YaHei" })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 160 },
    children: [new TextRun({ text, bold: true, size: 26, color: COLOR_ACCENT, font: "Microsoft YaHei" })]
  });
}

function bodyText(text, options = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
    children: [new TextRun({ text, size: 22, color: COLOR_TEXT, font: "Microsoft YaHei", ...options })]
  });
}

function bodyTextBold(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 360 },
    children: [new TextRun({ text, size: 22, color: COLOR_TEXT, font: "Microsoft YaHei", bold: true })]
  });
}

function bulletItem(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 30, after: 30, line: 340 },
    children: [new TextRun({ text, size: 22, color: COLOR_TEXT, font: "Microsoft YaHei" })]
  });
}

function numItem(text) {
  return new Paragraph({
    numbering: { reference: "numbers", level: 0 },
    spacing: { before: 30, after: 30, line: 340 },
    children: [new TextRun({ text, size: 22, color: COLOR_TEXT, font: "Microsoft YaHei" })]
  });
}

function emptyPara() {
  return new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: "" })] });
}

function makeTable(headers, rows, colWidths) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  const headerCells = headers.map((h, i) =>
    new TableCell({
      borders,
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: COLOR_TABLE_HEADER, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      verticalAlign: "center",
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: h, bold: true, size: 22, color: COLOR_WHITE, font: "Microsoft YaHei" })]
      })]
    })
  );

  const dataRows = rows.map((row, ri) =>
    new TableRow({
      children: row.map((cell, ci) =>
        new TableCell({
          borders,
          width: { size: colWidths[ci], type: WidthType.DXA },
          shading: ri % 2 === 0
            ? { fill: COLOR_LIGHT, type: ShadingType.CLEAR }
            : { fill: COLOR_WHITE, type: ShadingType.CLEAR },
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
          verticalAlign: "center",
          children: [new Paragraph({
            children: [new TextRun({ text: String(cell), size: 20, color: COLOR_TEXT, font: "Microsoft YaHei" })]
          })]
        })
      )
    })
  );

  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [new TableRow({ tableHeader: true, children: headerCells }), ...dataRows]
  });
}

// ===== Cover Page =====
const coverChildren = [
  new Paragraph({ spacing: { before: 2400 }, children: [new TextRun({ text: "" })] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text: "\u{1F4D8}", size: 80, font: "Segoe UI Emoji" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text: "卡伴日记", bold: true, size: 56, color: COLOR_PRIMARY, font: "Microsoft YaHei" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 400 },
    children: [new TextRun({ text: "Kaban Diary", size: 28, color: COLOR_GRAY, font: "Arial" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text: "系 统 软 件 作 品 说 明 文 档", bold: true, size: 36, color: COLOR_ACCENT, font: "Microsoft YaHei" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 200 },
    children: [new TextRun({ text: "健康饮食与体重管理系统", size: 24, color: COLOR_GRAY, font: "Microsoft YaHei" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1200, after: 60 },
    children: [new TextRun({ text: "版本：V1.0", size: 22, color: COLOR_GRAY, font: "Microsoft YaHei" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: "日期：2026年6月", size: 22, color: COLOR_GRAY, font: "Microsoft YaHei" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text: "团队：卡伴日记小组", size: 22, color: COLOR_GRAY, font: "Microsoft YaHei" })]
  }),
  new Paragraph({ children: [new PageBreak()] })
];

// ===== Section 1: 需求背景 =====
const section1 = [
  heading1("一、需求背景"),
  bodyText("随着社会经济发展和生活节奏加快，年轻人群的健康管理意识逐渐增强，但普遍面临\"没时间记录、不知怎么吃、难以坚持\"的困境。据调研，18-35岁的年轻白领和大学生群体中，超过60%的人有减肥或健康饮食需求，但能长期坚持记录和管理的不足20%。"),
  bodyText("市面上已有的健康管理类应用（如薄荷健康、轻卡日记、Keep等）功能完善但存在以下不足：部分应用过于复杂、学习成本高；有的应用过度商业化，广告和付费内容影响体验；还有的应用缺乏个性化AI辅助，用户难以获得针对性的健康建议。"),
  bodyText("基于以上背景，卡伴日记应运而生。我们希望打造一款简洁易用、AI赋能的健康管理工具，通过饮食记录、体重追踪、AI健康助手、食谱推荐等核心功能，帮助用户科学管理身体，养成健康的生活习惯。"),
  heading2("1.1 市场调研"),
  bodyText("团队在项目启动前对3款主流竞品（薄荷健康、轻卡日记、Keep）进行了调研分析，梳理了用户对健康管理软件的核心需求："),
  bulletItem("便捷的饮食记录方式（支持手动输入和拍照识别）"),
  bulletItem("直观的数据可视化（热量、营养、体重趋势）"),
  bulletItem("个性化的健康建议和食谱推荐"),
  bulletItem("简洁清爽的界面设计和交互体验"),
  heading2("1.2 方案调整说明"),
  bodyText("原计划使用微信小程序作为开发平台，实践过程中因以下原因调整为H5 + Java后端架构："),
  bulletItem("技术限制：微信小程序对AI调用的限制较多，功能实现受限"),
  bulletItem("部署问题：小程序发布审核周期长，影响演示进度"),
  bulletItem("学习成本：团队成员更熟悉Web开发技术栈"),
  bodyText("调整后采用前后端分离架构，前端使用HTML5 + CSS3 + JavaScript开发移动端Web应用，后端使用Spring Boot框架提供RESTful API，部署更灵活，也更容易实现AI功能对接。"),
];

// ===== Section 2: 目标用户 =====
const section2 = [
  new Paragraph({ children: [new PageBreak()] }),
  heading1("二、目标用户"),
  heading2("2.1 用户画像"),
  makeTable(
    ["维度", "描述"],
    [
      ["年龄范围", "18-35岁"],
      ["职业特征", "年轻白领、大学生、职场新人"],
      ["健康状态", "有减肥需求或健康饮食意识，但缺乏科学管理方法"],
      ["行为习惯", "高频使用手机，习惯移动端操作，注重效率"],
      ["消费能力", "中等消费水平，愿意为健康产品付费"],
      ["心理特征", "追求品质生活，关注自我提升，但容易半途而废"]
    ],
    [2000, 7360]
  ),
  emptyPara(),
  heading2("2.2 核心用户场景"),
  numItem("减脂塑形场景：用户希望通过控制饮食热量摄入、追踪体重变化来实现减脂目标，需要热量计算、营养分析和食谱推荐功能。"),
  numItem("日常健康场景：用户希望养成健康饮食习惯，记录每日饮食和饮水量，获取健康小贴士，需要便捷的记录和提醒功能。"),
  numItem("健康咨询场景：用户对营养知识、减肥方法有疑问，希望通过AI助手获取专业、个性化的健康建议。"),
];

// ===== Section 3: 产品结构 =====
const section3 = [
  new Paragraph({ children: [new PageBreak()] }),
  heading1("三、产品结构"),
  bodyText("卡伴日记采用前后端分离架构，整体产品结构如下："),
  heading2("3.1 系统架构"),
  makeTable(
    ["层次", "技术栈", "说明"],
    [
      ["前端展示层", "HTML5 + CSS3 + JavaScript", "移动端Web应用，单页应用（SPA）架构，底部导航栏切换5个功能模块"],
      ["后端服务层", "Spring Boot 2.7.18 + MyBatis Plus 3.5.3.1", "提供RESTful API，处理业务逻辑，JWT身份认证"],
      ["数据存储层", "MySQL 8.0 + HikariCP连接池", "11张数据表，支持utf8mb4字符集，逻辑删除机制"],
      ["AI服务层", "有道QAnything大模型API", "WebSocket实时通信，健康对话问答，AI食谱推荐"],
      ["实时通信层", "WebSocket", "AI健康助手实时聊天，在线用户管理，消息持久化"]
    ],
    [1800, 3200, 4360]
  ),
  emptyPara(),
  heading2("3.2 前端页面结构"),
  bodyText("前端共4个核心页面，采用移动端优先设计："),
  makeTable(
    ["页面", "文件", "功能说明"],
    [
      ["启动页", "main.html", "紫色渐变背景，动态呼吸动画的日记图标，点击\"开始使用\"进入应用"],
      ["账户创建页", "zhanghu.html", "提供手机号注册、微信登录、QQ登录、访客访问4种入口"],
      ["手机号登录页", "SJHdenglu.html", "本机号码一键登录、验证码登录，60秒倒计时防重复发送"],
      ["主应用页面", "main.html (SPA)", "底部导航栏切换5个功能Tab：饮食、体重、助手、食谱、我的"]
    ],
    [1600, 2400, 5360]
  ),
  emptyPara(),
  heading2("3.3 后端模块结构"),
  bodyText("后端采用标准的三层架构（Controller-Service-Mapper），主要模块包括："),
  makeTable(
    ["模块", "Controller", "Service", "核心功能"],
    [
      ["用户认证", "AuthController", "UserServiceImpl", "手机号注册/登录、验证码发送、JWT令牌管理"],
      ["用户信息", "UserController", "UserServiceImpl", "用户信息查询、昵称/签名修改"],
      ["饮食管理", "DietController", "DietServiceImpl", "饮食记录增删查、营养统计、AI食物识别"],
      ["体重管理", "WeightController", "WeightServiceImpl", "体重记录、BMI计算、趋势图、目标设置"],
      ["饮水管理", "WaterController", "WaterServiceImpl", "饮水量记录、目标追踪、进度展示"],
      ["食谱管理", "RecipeController", "RecipeServiceImpl", "食谱分类浏览、搜索、收藏、AI推荐"],
      ["AI聊天", "ChatWebSocketHandler", "QAnythingService", "WebSocket实时聊天、AI健康问答"],
      ["首页路由", "IndexController", "-", "页面路由、API文档、QAnything接口测试"]
    ],
    [1400, 2200, 2000, 3760]
  ),
  emptyPara(),
  heading2("3.4 数据库设计"),
  bodyText("数据库共设计11张数据表，使用utf8mb4字符集，支持中文和表情符号，合理的索引设计提高查询效率，外键关联保证数据一致性，软删除机制确保数据可恢复。"),
  makeTable(
    ["表名", "说明"],
    [
      ["user", "用户基本信息表（手机号、密码、昵称、登录方式等）"],
      ["user_profile", "用户健康资料表（身高、体重、体脂率、目标体重、活动水平等）"],
      ["weight_record", "体重记录表（体重、体脂率、BMI、备注、记录日期）"],
      ["food", "食物营养成分表（名称、分类、热量、蛋白质、脂肪、碳水、纤维）"],
      ["diet_record", "饮食记录表（食物、餐次、食用量、营养成分、记录时间）"],
      ["water_record", "饮水记录表（饮水量、记录日期、记录时间）"],
      ["exercise_record", "运动记录表（运动类型、时长、消耗热量、备注）"],
      ["recipe", "食谱表（标题、描述、分类、食材、步骤、热量、营养、评分）"],
      ["recipe_collection", "食谱收藏表（用户与食谱的关联关系）"],
      ["health_goal", "健康目标表（目标类型、目标值、当前值、状态）"],
      ["chat_message", "聊天消息表（用户ID、会话ID、消息类型、内容）"],
      ["diet_method", "热门减肥法表（标题、描述、难度、周期、热量限制）"],
      ["user_feedback", "用户反馈表（反馈内容、联系方式、处理状态、回复）"]
    ],
    [2400, 6960]
  ),
];

// ===== Section 4: 核心功能 =====
const section4 = [
  new Paragraph({ children: [new PageBreak()] }),
  heading1("四、核心功能"),
  heading2("4.1 用户认证模块"),
  bodyText("支持4种登录方式，满足不同用户的使用习惯："),
  bulletItem("手机号+验证码登录：支持手机号格式验证、60秒验证码倒计时防重复发送"),
  bulletItem("本机号码一键登录：调用运营商SDK实现快速登录"),
  bulletItem("第三方登录：微信登录、QQ登录（需申请开放平台权限）"),
  bulletItem("访客访问：无需注册即可体验基本功能（功能受限）"),
  bodyText("认证采用JWT（JSON Web Token）机制，使用HS512算法签发Token，有效期24小时，前端请求时在Header中携带Authorization: Bearer {token}，后端解析Token获取用户身份。"),
  heading2("4.2 饮食记录模块"),
  bodyText("帮助用户便捷记录每日饮食，自动计算营养摄入："),
  bulletItem("支持按餐次（早餐、午餐、晚餐、加餐）记录"),
  bulletItem("自动计算热量、蛋白质、脂肪、碳水化合物、膳食纤维"),
  bulletItem("今日热量概览：已摄入/目标热量、还可摄入量、进度条展示"),
  bulletItem("营养成分四宫格：碳水、蛋白质、脂肪、膳食纤维占比可视化"),
  bulletItem("AI拍照识别食物（接口已预留，待接入图像识别API）"),
  heading2("4.3 体重管理模块"),
  bodyText("追踪体重变化，科学评估身体状况："),
  bulletItem("体重记录：支持记录体重、体脂率、备注，自动计算BMI指数"),
  bulletItem("趋势可视化：最近7天体重变化柱状图，渐变色展示"),
  bulletItem("目标管理：设置目标体重，展示还需减重、进度百分比"),
  bulletItem("数据统计：当前体重、目标体重、BMI、体脂率一览"),
  heading2("4.4 饮水管理模块"),
  bodyText("帮助用户养成科学饮水习惯："),
  bulletItem("一键添加饮水量（ml），支持自定义每次饮水量"),
  bulletItem("今日饮水概览：已饮量、目标量、剩余量、进度百分比"),
  bulletItem("饮水记录历史查询"),
  heading2("4.5 AI健康助手模块"),
  bodyText("基于有道QAnything大模型，提供智能健康问答服务："),
  bulletItem("WebSocket实时聊天：用户发送消息后，AI异步处理并返回回复"),
  bodyTextBold("主要能力包括："),
  bulletItem("制定个性化饮食计划"),
  bulletItem("推荐适合的健康食谱"),
  bulletItem("解答营养健康问题"),
  bulletItem("分析用户饮食习惯"),
  bodyText("AI服务采用容错设计：当QAnything API调用失败时，自动降级为本地关键词匹配回复（覆盖减肥、食谱、体重等常见话题），确保用户体验不中断。"),
  heading2("4.6 食谱中心模块"),
  bodyText("提供丰富的健康食谱资源，支持个性化推荐："),
  bulletItem("食谱分类：热门食谱、精选食谱、AI智能推荐、专家食谱"),
  bulletItem("食谱详情：食材列表、制作步骤、营养信息、小贴士"),
  bulletItem("食谱搜索：支持关键词搜索"),
  bulletItem("食谱收藏：收藏喜欢的食谱，方便后续查看"),
  bulletItem("热门减肥法介绍：16+8间歇性断食、低碳水饮食法、5+2轻断食法等"),
  heading2("4.7 个人中心模块"),
  bodyText("展示用户信息和应用功能入口："),
  bulletItem("用户信息：昵称、头像、个性签名、BMI、今日卡路里、饮食天数、当前体重"),
  bulletItem("功能入口：修改昵称、修改签名、健康目标设置、意见反馈"),
  heading2("4.8 可视化组件"),
  bodyText("实现了6种核心UI组件，提升数据展示效果："),
  makeTable(
    ["组件名称", "应用场景", "效果说明"],
    [
      ["进度条组件", "热量摄入、饮水、体重目标", "渐变色填充，百分比显示"],
      ["营养成分四宫格", "碳水/蛋白质/脂肪/膳食纤维", "不同颜色区分，进度条显示占比"],
      ["体重趋势柱状图", "最近7天体重变化", "渐变色柱状，自动标注日期"],
      ["食谱卡片", "食谱列表展示", "图片、标题、热量、时间、评分"],
      ["消息气泡", "AI健康助手对话", "左右分布，不同颜色区分用户和AI"],
      ["功能网格", "个人中心快捷入口", "6宫格布局，图标+文字"]
    ],
    [2000, 3000, 4360]
  ),
];

// ===== Section 5: 使用工具 =====
const section5 = [
  new Paragraph({ children: [new PageBreak()] }),
  heading1("五、使用工具"),
  heading2("5.1 开发工具"),
  makeTable(
    ["工具", "版本", "用途", "使用程度"],
    [
      ["VS Code", "最新版", "前端代码编辑（HTML/CSS/JS）", "全程使用"],
      ["IntelliJ IDEA", "最新版", "后端Java代码开发", "全程使用"],
      ["MySQL Workbench", "最新版", "数据库设计与可视化操作", "中期使用"],
      ["Git", "最新版", "版本控制与团队协作", "部分使用"],
      ["Apache Maven", "3.6+", "Java项目构建与依赖管理", "全程使用"],
      ["Postman", "最新版", "API接口测试与调试", "全程使用"]
    ],
    [2000, 1200, 4160, 2000]
  ),
  emptyPara(),
  heading2("5.2 技术框架与依赖"),
  makeTable(
    ["类别", "技术/框架", "版本", "用途"],
    [
      ["后端框架", "Spring Boot", "2.7.18", "Web服务、自动配置、依赖注入"],
      ["ORM框架", "MyBatis Plus", "3.5.3.1", "数据库操作、分页、逻辑删除、自动填充"],
      ["数据库", "MySQL", "8.0", "数据持久化存储"],
      ["连接池", "HikariCP", "内置", "数据库连接池管理"],
      ["认证", "JWT (jjwt)", "0.11.5", "用户身份认证与令牌管理"],
      ["实时通信", "Spring WebSocket", "内置", "AI健康助手实时聊天"],
      ["工具库", "Hutool", "5.8.24", "Java工具类库"],
      ["简化代码", "Lombok", "内置", "简化Java POJO代码"],
      ["参数校验", "Spring Validation", "内置", "JSR-303参数校验"],
      ["前端技术", "HTML5 + CSS3 + JavaScript", "-", "移动端Web应用开发"]
    ],
    [1600, 2200, 1400, 4160]
  ),
  emptyPara(),
  heading2("5.3 平台服务"),
  makeTable(
    ["服务", "用途", "状态"],
    [
      ["MySQL数据库", "数据存储，11张数据表", "已配置"],
      ["WebSocket服务", "AI健康助手实时通信", "已配置"],
      ["有道QAnything AI", "大模型健康对话问答", "已对接"],
      ["JWT认证服务", "用户身份认证", "已实现"],
      ["HikariCP连接池", "数据库连接管理", "已配置"]
    ],
    [2400, 4960, 2000]
  ),
];

// ===== Section 6: AI使用 =====
const section6 = [
  new Paragraph({ children: [new PageBreak()] }),
  heading1("六、AI使用"),
  heading2("6.1 AI使用概况"),
  bodyText("本项目在开发过程中充分使用了AI辅助工具，主要应用于代码生成、内容创作、问题解决三个方面。所有AI生成的内容均经过小组成员人工审核和修改后才投入使用。"),
  heading2("6.2 AI编程工具使用"),
  heading2("6.2.1 代码生成"),
  makeTable(
    ["生成内容", "AI工具", "提示词", "人工修改"],
    [
      ["后端框架代码", "Claude", "生成Spring Boot项目结构（Controller/Service/Mapper）", "微调包名、类名、注释"],
      ["数据库SQL脚本", "Claude", "生成健康管理应用的数据库设计（11张表）", "调整字段类型、索引设计"],
      ["实体类代码", "Claude", "根据数据库表生成MyBatis Plus实体类", "添加字段注释、调整注解"],
      ["WebSocket配置", "Claude", "提供WebSocket配置和聊天处理器代码", "适配业务逻辑，添加JWT验证"],
      ["前端样式优化", "Claude", "提供CSS优化建议和响应式布局方案", "微调颜色值、间距、动画参数"]
    ],
    [1800, 1200, 4160, 2200]
  ),
  emptyPara(),
  heading2("6.2.2 内容生成"),
  makeTable(
    ["生成内容", "AI工具", "提示词", "人工修改"],
    [
      ["6个食谱内容", "Claude", "生成健康减肥食谱（含食材、步骤、营养数据）", "补充营养数据、核实热量"],
      ["3种减肥法介绍", "Claude", "介绍16+8间歇性断食、低碳水饮食、5+2轻断食", "核实科学性、补充注意事项"],
      ["3条健康小贴士", "Claude", "生成健康饮水、饮食小贴士", "修改表达方式、调整语气"],
      ["AI对话样例", "Claude", "生成AI健康助手对话场景", "调整语气、增加表情符号"]
    ],
    [1800, 1200, 4160, 2200]
  ),
  emptyPara(),
  heading2("6.2.3 技术咨询"),
  makeTable(
    ["问题", "AI工具", "获取的解决方案", "是否采纳"],
    [
      ["WebSocket配置与JWT验证", "Claude", "提供WebSocket连接时携带Token的方案", "采纳"],
      ["前端样式优化", "Claude", "提供CSS渐变色和动画优化建议", "采纳"],
      ["数据库索引设计", "Claude", "提供复合索引设计建议", "采纳"],
      ["MyBatis Plus逻辑删除配置", "Claude", "提供@TableLogic注解使用方法", "采纳"],
      ["QAnything API认证方式", "Claude", "提供多种认证方式测试方案", "采纳"]
    ],
    [2400, 1200, 4160, 1600]
  ),
  emptyPara(),
  heading2("6.3 AI功能集成"),
  bodyText("产品本身集成了有道QAnything大语言模型API，实现AI健康助手功能："),
  bulletItem("AI健康助手：用户通过WebSocket发送健康相关问题，后端调用QAnything API获取智能回复，支持饮食建议、食谱推荐、营养解答等场景"),
  bulletItem("容错降级机制：当AI服务不可用时，自动降级为本地关键词匹配回复，覆盖减肥、食谱、体重等常见话题，确保服务不中断"),
  bulletItem("AI食谱推荐：根据用户健康数据（BMI、目标体重等）智能推荐适合的食谱"),
  bulletItem("AI拍照识别（预留）：饮食模块预留了图像识别接口，后续可接入阿里云或百度图像识别API"),
  heading2("6.4 人工审核与责任"),
  bodyText("所有AI生成的内容均经过严格的人工审核流程："),
  makeTable(
    ["审核维度", "具体措施", "责任人"],
    [
      ["代码质量", "小组2人以上共同审查AI生成的代码", "全体成员"],
      ["健康信息准确性", "重要健康数据查阅专业资料核实", "内容组"],
      ["内容表达", "修改AI生成内容的语言风格，确保自然", "内容组"],
      ["安全性", "检查AI生成代码是否存在安全漏洞", "技术组"]
    ],
    [2000, 5360, 2000]
  ),
];

// ===== Section 7: 数据或素材来源 =====
const section7 = [
  new Paragraph({ children: [new PageBreak()] }),
  heading1("七、数据或素材来源"),
  heading2("7.1 竞品调研数据"),
  bodyText("团队对市面上3款主流健康管理应用进行了调研："),
  bulletItem("薄荷健康：功能全面，食物数据库丰富，但界面较复杂"),
  bulletItem("轻卡日记：主打饮食记录，界面简洁，但缺少AI辅助"),
  bulletItem("Keep：以运动健身为主，饮食管理为辅"),
  bodyText("通过调研确定了卡伴日记的差异化定位：简洁易用 + AI赋能 + 专注饮食健康。"),
  heading2("7.2 食物营养数据"),
  bodyText("食物营养数据来源于公开的营养数据库和食品包装标签信息，目前已录入10种常见食物的营养成分："),
  makeTable(
    ["食物名称", "分类", "热量(kcal/100g)", "蛋白质(g)", "脂肪(g)", "碳水(g)"],
    [
      ["鸡蛋", "蛋白质", "144", "13.3", "8.8", "2.8"],
      ["鸡胸肉", "蛋白质", "118", "31.0", "1.2", "0"],
      ["牛奶", "饮品", "54", "3.0", "3.2", "4.7"],
      ["全麦面包", "主食", "250", "9.5", "2.5", "50"],
      ["米饭", "主食", "116", "2.6", "0.3", "25.9"],
      ["苹果", "水果", "52", "0.3", "0.2", "13.8"],
      ["牛油果", "水果", "160", "2.0", "15.0", "8.5"],
      ["三文鱼", "蛋白质", "208", "20.0", "13.0", "0"],
      ["燕麦", "主食", "389", "16.9", "6.9", "66"],
      ["豆腐", "蛋白质", "76", "8.1", "4.8", "1.9"]
    ],
    [1800, 1400, 2000, 1400, 1200, 1560]
  ),
  emptyPara(),
  heading2("7.3 食谱数据"),
  bodyText("食谱内容由AI生成框架后人工补充营养数据和制作细节，目前已录入6个食谱："),
  bulletItem("鸡胸肉牛油果沙拉（328 kcal）- 高蛋白低脂肪"),
  bulletItem("荞麦面蔬菜汤（256 kcal）- 低热量饱腹"),
  bulletItem("燕麦蓝莓碗（298 kcal）- 营养丰富早餐"),
  bulletItem("牛油果吐司（245 kcal）- 简单快手早餐"),
  bulletItem("三文鱼沙拉（380 kcal）- Omega-3丰富"),
  bulletItem("蔬菜豆腐汤（168 kcal）- 清爽低热量"),
  heading2("7.4 减肥法资料"),
  bodyText("减肥法介绍内容由AI生成后人工核实科学性，目前已录入3种："),
  bulletItem("16+8间歇性断食：每天8小时进食窗口，16小时禁食"),
  bulletItem("低碳水饮食法：减少碳水摄入，快速燃脂"),
  bulletItem("5+2轻断食法：每周5天正常饮食，2天限制热量"),
  heading2("7.5 UI设计素材"),
  bulletItem("SVG图标：所有功能图标均为团队自行设计，使用SVG矢量格式"),
  bulletItem("渐变色配色方案：主色调紫色渐变（#667eea → #764ba2），参考Material Design设计规范"),
  bulletItem("组件样式规范：制定了统一的卡片、按钮、进度条、消息气泡等组件样式标准"),
  bulletItem("高保真模型：使用设计工具制作了12张页面高保真原型图（存于kaban-diary/页面高保真模型/目录）"),
  heading2("7.6 审核机制"),
  bodyText("已建立三层审核机制确保数据准确性和内容质量："),
  numItem("AI生成内容审核：小组2人以上共同审核AI生成的所有内容"),
  numItem("健康信息核实：重要健康数据（如营养指标、减肥法原理）查阅专业资料核实"),
  numItem("用户反馈收集：通过user_feedback表收集用户反馈，定期处理和回复"),
];

// ===== Section 8: 测试反馈 =====
const section8 = [
  new Paragraph({ children: [new PageBreak()] }),
  heading1("八、测试反馈"),
  heading2("8.1 测试方法"),
  bodyText("项目采用多层次的测试策略，确保功能正确性和系统稳定性："),
  bulletItem("单元测试：后端Service层逻辑测试，验证业务逻辑正确性"),
  bulletItem("接口测试：使用Postman和PowerShell脚本测试所有RESTful API接口"),
  bulletItem("WebSocket测试：验证AI健康助手的实时通信功能"),
  bulletItem("前端测试：浏览器手动测试页面交互、导航切换、数据展示"),
  bulletItem("集成测试：前后端联调测试，验证数据流通和功能完整性"),
  heading2("8.2 测试脚本"),
  bodyText("团队编写了3个PowerShell测试脚本，用于自动化接口测试："),
  makeTable(
    ["脚本文件", "测试内容", "状态"],
    [
      ["test-api.ps1", "测试核心API接口（认证、饮食、体重、饮水、食谱）", "已使用"],
      ["test-endpoints.ps1", "测试所有后端端点的连通性和响应格式", "已使用"],
      ["test-qa.ps1", "测试QAnything AI接口连通性和回复质量", "已使用"]
    ],
    [2400, 5360, 1600]
  ),
  emptyPara(),
  heading2("8.3 测试结果"),
  heading2("8.3.1 已通过测试的功能"),
  makeTable(
    ["功能模块", "测试结果", "备注"],
    [
      ["用户注册/登录", "通过", "手机号注册、验证码登录、JWT认证正常"],
      ["饮食记录增删查", "通过", "添加、删除、查询饮食记录功能正常"],
      ["营养统计计算", "通过", "热量、蛋白质、脂肪、碳水计算准确"],
      ["体重记录与BMI", "通过", "体重记录、BMI自动计算、趋势图展示正常"],
      ["饮水记录", "通过", "饮水添加、今日饮水量、进度展示正常"],
      ["食谱浏览与搜索", "通过", "分类浏览、关键词搜索功能正常"],
      ["食谱收藏", "通过", "收藏、取消收藏功能正常"],
      ["WebSocket连接", "通过", "实时连接建立、消息收发正常"],
      ["AI健康对话", "通过", "QAnything API调用成功，回复内容合理"],
      ["AI降级回复", "通过", "API失败时本地关键词回复正常触发"],
      ["数据初始化", "通过", "应用启动自动插入测试数据功能正常"],
      ["跨域请求", "通过", "CORS配置正确，前端可正常调用后端API"]
    ],
    [2000, 1200, 6160]
  ),
  emptyPara(),
  heading2("8.3.2 待完善功能"),
  makeTable(
    ["功能", "当前状态", "待办事项"],
    [
      ["AI拍照识别", "接口已预留", "接入阿里云/百度图像识别API"],
      ["第三方登录", "UI已完成", "申请微信/QQ开放平台权限并接入SDK"],
      ["运动记录", "数据库表已建", "开发Controller和Service层"],
      ["用户反馈功能", "数据库表已建", "开发反馈提交和处理接口"]
    ],
    [2000, 2400, 4960]
  ),
  emptyPara(),
  heading2("8.4 用户反馈"),
  bodyText("当前阶段主要通过以下方式收集反馈："),
  bulletItem("团队成员内部体验测试：每位成员体验全部功能并提交问题反馈"),
  bulletItem("课堂演示反馈：在实践课上向同学和老师演示，收集改进建议"),
  bodyText("已收到的主要反馈及处理情况："),
  makeTable(
    ["反馈内容", "来源", "处理情况"],
    [
      ["界面配色美观，紫色渐变很有辨识度", "同学反馈", "已确认保持现有设计"],
      ["希望增加更多食物数据", "同学反馈", "已列入后续计划，目标100种"],
      ["AI助手回复速度可以接受", "同学反馈", "已确认500ms延迟模拟效果良好"],
      ["体重趋势图很直观", "老师反馈", "已确认设计方向正确"],
      ["建议增加运动记录功能", "老师反馈", "数据库表已建，后续开发"]
    ],
    [3200, 1600, 4560]
  ),
];

// ===== Section 9: 分工 =====
const section9 = [
  new Paragraph({ children: [new PageBreak()] }),
  heading1("九、分工"),
  bodyText("卡伴日记小组根据成员技能特长进行分工，各司其职、协同推进："),
  heading2("9.1 角色分工"),
  makeTable(
    ["角色", "负责模块", "主要职责"],
    [
      ["组长", "项目管理与协调", "需求把控、进度管理、任务分配、汇报材料"],
      ["后端开发组", "后端服务开发", "Spring Boot框架搭建、API开发、数据库设计、JWT认证"],
      ["前端开发组", "前端页面开发", "HTML/CSS/JS页面开发、交互逻辑、UI组件实现"],
      ["AI开发组", "AI功能对接", "QAnything API对接、WebSocket聊天、AI降级方案"],
      ["内容组", "数据与内容", "食物营养数据录入、食谱内容编写、减肥法资料整理"],
      ["测试组", "测试与质量", "接口测试、功能测试、Bug跟踪、测试报告"]
    ],
    [1600, 2000, 5760]
  ),
  emptyPara(),
  heading2("9.2 各阶段任务安排"),
  makeTable(
    ["阶段", "时间", "主要任务", "负责人"],
    [
      ["需求分析与设计", "第1-2周", "需求调研、竞品分析、数据库设计、UI原型设计", "全体成员"],
      ["前端页面开发", "第3-4周", "4个核心页面开发、UI组件实现、交互逻辑", "前端开发组"],
      ["后端框架搭建", "第3-4周", "Spring Boot项目搭建、数据库初始化、基础API开发", "后端开发组"],
      ["AI功能对接", "第5-6周", "QAnything API接入、WebSocket聊天、AI降级方案", "AI开发组"],
      ["前后端联调", "第5-6周", "API对接、数据流通测试、Bug修复", "后端+前端"],
      ["内容数据录入", "第5-6周（并行）", "食物数据、食谱内容、减肥法资料", "内容组"],
      ["测试与优化", "第7周", "功能测试、性能优化、用户测试、演示准备", "测试组+全体"],
      ["期末提交", "第7周末", "最终打包、文档整理、汇报材料", "全体成员"]
    ],
    [2000, 1400, 4360, 1600]
  ),
  emptyPara(),
  heading2("9.3 协作方式"),
  bulletItem("版本控制：使用Git进行代码版本管理，分分支开发，合并时进行Code Review"),
  bulletItem("沟通协作：通过线上群组进行日常沟通，定期线下开会同步进度"),
  bulletItem("文档管理：项目开发文档统一维护，确保信息同步"),
  bulletItem("代码规范：统一命名规范、注释规范，确保代码可读性"),
];

// ===== Section 10: 反思 =====
const section10 = [
  new Paragraph({ children: [new PageBreak()] }),
  heading1("十、反思"),
  heading2("10.1 项目收获"),
  bodyText("通过卡伴日记项目的开发，团队成员在以下方面获得了显著成长："),
  numItem("技术能力提升：深入掌握了Spring Boot + MyBatis Plus后端开发技术栈，实践了前后端分离架构、JWT认证、WebSocket实时通信等技术方案。"),
  numItem("AI应用实践：成功对接有道QAnything大语言模型API，理解了AI服务集成的完整流程，包括API调用、响应解析、容错降级等关键环节。"),
  numItem("产品设计思维：从需求调研、竞品分析到原型设计、功能迭代，完整体验了产品开发的全流程，培养了用户中心的设计思维。"),
  numItem("团队协作能力：通过分工合作、定期同步、代码审查等实践，提升了团队协作和项目管理能力。"),
  numItem("AI工具运用：学会了合理使用AI辅助编程工具（Claude），在代码生成、内容创作、问题解决等方面提高了开发效率，同时建立了AI内容审核意识。"),
  heading2("10.2 存在的不足"),
  bodyText("回顾整个开发过程，仍存在以下不足之处："),
  numItem("前后端联调不够及时：前期前后端并行开发，但联调启动较晚，导致部分接口问题发现较迟，增加了返工成本。后续应更早建立联调机制，采用Mock数据先行验证。"),
  numItem("数据内容不够丰富：食物数据库仅录入10种（目标100种），食谱仅6个（目标50个），内容厚度不足以支撑完整用户体验。需要在后续阶段加大内容建设力度。"),
  numItem("AI功能深度不足：当前AI健康助手仅实现了基础问答功能，尚未实现AI拍照识别、个性化食谱推荐等深度功能，AI能力的发挥还有很大空间。"),
  numItem("运动记录模块缺失：虽然数据库表已设计完成，但运动记录的Controller和Service层尚未开发，功能模块不完整。"),
  numItem("测试覆盖不够全面：目前主要依赖手动测试和接口测试脚本，缺少自动化单元测试，测试覆盖率和效率有待提升。"),
  numItem("用户反馈机制不完善：虽然数据库表已设计，但用户反馈的提交入口和处理流程尚未完全实现。"),
  heading2("10.3 改进方向"),
  bodyText("针对以上不足，团队制定了以下改进方向："),
  numItem("完善数据内容：计划补充食物数据至100种、食谱至50个、减肥法至10种，并采购或拍摄真实食谱图片替代当前的表情符号占位。"),
  numItem("深化AI功能：接入图像识别API实现拍照识别食物功能；优化AI健康助手的对话能力，增加上下文理解和个性化推荐。"),
  numItem("补全功能模块：开发运动记录模块、用户反馈模块、健康目标设定模块、营养分析报告功能。"),
  numItem("加强测试体系：引入JUnit单元测试框架，编写自动化测试用例，提升测试覆盖率和回归测试效率。"),
  numItem("优化用户体验：根据用户反馈持续优化界面交互，增加数据导出、消息通知等实用功能。"),
  numItem("部署上线：将应用部署到云服务器，实现公网访问，进行真实用户测试和数据收集。"),
  heading2("10.4 总结"),
  bodyText("卡伴日记项目从需求调研到中期开发，团队克服了技术选型调整、AI接口对接、前后端联调等挑战，完成了4个核心页面、8大功能模块的设计与开发，建立了11张数据表的完整数据库，成功集成了有道QAnything大语言模型实现AI健康助手功能。"),
  bodyText("项目当前处于中期开发阶段，前端UI和页面基本完成，后端框架和数据库设计完成，AI健康助手已可正常使用。后续将按计划推进前后端数据打通、AI功能深化、内容数据完善和功能补全等工作，预计在第7周末完成全部开发任务，按时提交期末成品。"),
  bodyText("通过本项目，团队不仅掌握了健康管理系统开发的完整技术栈，更培养了产品思维、AI应用能力和团队协作精神，为今后的学习和工作打下了坚实基础。"),
];

// ===== Assemble Document =====
const allChildren = [
  ...coverChildren,
  ...section1,
  ...section2,
  ...section3,
  ...section4,
  ...section5,
  ...section6,
  ...section7,
  ...section8,
  ...section9,
  ...section10
];

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Microsoft YaHei", size: 22 } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Microsoft YaHei", color: COLOR_PRIMARY },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Microsoft YaHei", color: COLOR_ACCENT },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "卡伴日记 - 系统软件作品说明文档", size: 18, color: COLOR_GRAY, font: "Microsoft YaHei" })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "第 ", size: 18, color: COLOR_GRAY, font: "Microsoft YaHei" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: COLOR_GRAY, font: "Microsoft YaHei" }),
            new TextRun({ text: " 页", size: 18, color: COLOR_GRAY, font: "Microsoft YaHei" })
          ]
        })]
      })
    },
    children: allChildren
  }]
});

Packer.toBuffer(doc).then(buffer => {
  const outputPath = "c:\\Users\\HUAWEI\\Desktop\\KBRJ\\卡伴日记-系统软件作品说明文档.docx";
  fs.writeFileSync(outputPath, buffer);
  console.log("DOCX generated successfully: " + outputPath);
}).catch(err => {
  console.error("Error generating DOCX:", err);
  process.exit(1);
});
