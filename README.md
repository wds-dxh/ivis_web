# 智能网联汽车信息安全实验室 (IVIS) 官方网站

## 项目简介

这是一个基于纯HTML/CSS/JavaScript的现代化实验室官方网站，采用组件化架构和配置文件驱动的内容管理系统。

## 🚀 快速开始

### 本地开发

```bash
# 启动本地开发服务器
npm run dev

# 或者直接使用Python
python3 -m http.server 8080
```

访问 `http://localhost:8080` 查看网站。

### 构建项目

```bash
# 构建生产版本
npm run build

# 构建文件将生成在 dist/ 目录中
```

### 部署项目

```bash
# 部署到预设环境
npm run deploy

# 部署到指定环境
npm run deploy:staging
npm run deploy:production
```

## 🔄 二次开发流程

### 1. Fork 项目

1. 访问项目主仓库：`https://github.com/[主仓库地址]`
2. 点击右上角的 "Fork" 按钮，将项目 fork 到你的 GitHub 账户
3. Clone 你 fork 的仓库到本地：

```bash
git clone https://github.com/[你的用户名]/ivis_web.git
cd ivis_web
```

### 2. 设置上游仓库

```bash
# 添加原始仓库为上游仓库
git remote add upstream https://github.com/[主仓库地址]/ivis_web.git

# 验证远程仓库设置
git remote -v
```

### 3. 创建开发分支

```bash
# 从主分支创建新的功能分支
git checkout -b feature/your-feature-name

# 或者修复bug的分支
git checkout -b fix/bug-description
```

### 4. 开发环境配置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 5. 开发指南

#### 5.1 项目架构概述

本项目采用**组件化架构**和**配置文件驱动**的设计模式：

- **组件化架构**：页眉页脚通过组件系统自动加载，支持路径自动适配
- **配置文件驱动**：内容通过JSON配置文件管理，支持动态渲染
- **模板系统**：使用变量替换机制，支持多层级页面结构
- **响应式设计**：移动端优化，多设备适配

#### 5.2 配置文件管理详解

##### 5.2.1 配置文件结构

项目的配置文件位于 `config/` 目录，主要包括：

```
config/
├── research-config.json      # 科研动态配置
├── communication-config.json # 开放交流配置
└── news-config.json         # 新闻中心配置
```

##### 5.2.2 科研动态配置 (research-config.json)

```json
{
  "meta": {
    "title": "科研动态",
    "description": "展示实验室最新的研究成果和项目进展"
  },
  "displaySettings": {
    "itemsPerPage": 12,
    "sortBy": "date",
    "sortOrder": "desc"
  },
  "projects": [
    {
      "title": "机器人遥操作系统",
      "image": "../../assets/images/机器人遥操作.png",
      "date": "2024-01-15",
      "description": "宇树机器人G1+Vision Pro+灵巧手实现遥抓取...",
      "detailPage": "./机器人遥操作系统.html",
      "tags": ["机器人", "遥操作", "VR"],
      "status": "进行中"
    }
  ]
}
```

**字段说明：**
- `title`: 项目标题
- `image`: 项目图片路径（相对于页面的路径）
- `date`: 项目日期（YYYY-MM-DD格式）
- `description`: 项目描述
- `detailPage`: 详情页面链接
- `tags`: 项目标签（可选）
- `status`: 项目状态（可选）

##### 5.2.3 开放交流配置 (communication-config.json)

```json
{
  "meta": {
    "title": "开放交流",
    "description": "学术交流活动和会议信息"
  },
  "venue": {
    "address": "重庆大学国家卓越工程师学院科研楼B205",
    "phone": "023-65102000",
    "email": "ivis@cqu.edu.cn"
  },
  "events": {
    "upcoming": [
      {
        "title": "第七届网络安全前沿国际会议(FCS 2024)",
        "time": "2024-12-15 09:00",
        "venue": "科研楼B205",
        "description": "国际网络安全前沿技术交流会议",
        "detailPage": "./第七届网络安全前沿国际会议(FCS 2024).html",
        "type": "conference"
      }
    ],
    "past": [
      // 历史活动
    ]
  }
}
```

##### 5.2.4 新闻中心配置 (news-config.json)

```json
{
  "meta": {
    "title": "新闻中心",
    "description": "实验室最新动态和学术成果"
  },
  "books": [
    {
      "title": "智能网联汽车安全技术",
      "authors": "张三, 李四",
      "chapterTitle": "第三章 车载网络安全",
      "publisher": "清华大学出版社",
      "year": "2024"
    }
  ],
  "publications": {
    "2024": [
      {
        "title": "基于深度学习的车载入侵检测系统",
        "authors": "张三, 李四, 王五",
        "journal": "计算机学报",
        "level": "CCF A类",
        "citations": 15
      }
    ]
  }
}
```

#### 5.3 添加新HTML页面详细步骤

##### 5.3.1 创建页面文件

1. **确定页面位置**：根据页面类型在 `pages/` 目录下选择合适的子目录
2. **创建HTML文件**：使用标准模板结构

**标准页面模板：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题 - 信息安全实验室 (ivis)</title>
    
    <!-- 样式文件引入 - 注意路径层级 -->
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/navigation.css">
    <link rel="stylesheet" href="../../css/modules.css">
    <link rel="stylesheet" href="../../css/responsive.css">
    <link rel="stylesheet" href="../../css/animations.css">
    
    <!-- 页面特定样式（可选） -->
    <style>
        /* 页面特定的CSS样式 */
        .custom-section {
            padding: 2rem 0;
        }
    </style>
</head>
<body>
    <!-- 页眉容器 - 自动加载 -->
    <div id="header-container"></div>

    <main>
        <!-- 主横幅区域 -->
        <section class="main-banner">
            <div class="container">
                <h1>页面标题</h1>
                <p>页面描述</p>
            </div>
        </section>

        <!-- 页面主要内容 -->
        <section class="content-section">
            <div class="container">
                <h2>内容标题</h2>
                <!-- 你的页面内容 -->
            </div>
        </section>
    </main>

    <!-- 页脚容器 - 自动加载 -->
    <div id="footer-container"></div>

    <!-- 脚本文件引入 -->
    <script src="../../components/component-loader.js"></script>
    <script src="../../js/components.js"></script>
    <script src="../../js/main.js"></script>
    <script src="../../js/animations.js"></script>
    
    <!-- 页面特定脚本（可选） -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // 页面初始化代码
        });
    </script>
</body>
</html>
```

##### 5.3.2 路径配置说明

**重要：路径配置是关键！**

根据页面在目录结构中的位置，正确配置资源路径：

```
项目根目录/
├── index.html                    # 根目录页面：使用 "./"
├── pages/
│   ├── research/
│   │   ├── index.html           # 二级页面：使用 "../../"
│   │   └── 详情页面.html         # 二级页面：使用 "../../"
│   └── communication/
│       └── index.html           # 二级页面：使用 "../../"
```

**路径配置规则：**

- **根目录页面** (`index.html`)：使用 `./`
- **二级页面** (`pages/*/index.html`)：使用 `../../`
- **三级页面** (`pages/*/*/*.html`)：使用 `../../../`

##### 5.3.3 使用配置文件驱动的页面

如果页面需要动态加载内容，按以下步骤操作：

1. **创建配置文件**（如果不存在）：

```json
// config/your-module-config.json
{
  "meta": {
    "title": "模块标题",
    "description": "模块描述"
  },
  "items": [
    {
      "title": "项目标题",
      "description": "项目描述",
      "image": "../../assets/images/项目图片.png",
      "detailPage": "./详情页面.html"
    }
  ]
}
```

2. **在HTML中添加容器**：

```html
<section class="dynamic-content">
    <div class="container">
        <h2>动态内容标题</h2>
        <div id="content-grid" class="content-grid">
            <!-- 内容将通过JavaScript动态加载 -->
        </div>
    </div>
</section>
```

3. **添加JavaScript初始化代码**：

```html
<script src="../../js/config-manager.js"></script>
<script src="../../js/content-renderer.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // 等待组件加载完成后再加载内容
        setTimeout(() => {
            initPageContent('your-module'); // 替换为你的模块名
        }, 100);
    });
</script>
```

#### 5.4 组件系统详解

##### 5.4.1 组件加载机制

项目使用自动组件加载系统，核心文件是 `components/component-loader.js`：

**工作原理：**
1. 自动计算当前页面的路径层级
2. 根据路径层级加载对应的页眉页脚模板
3. 替换模板中的变量（如 `{{baseUrl}}`、`{{homeActive}}`）
4. 自动设置导航激活状态

**模板变量：**
- `{{baseUrl}}`: 基础路径（自动计算）
- `{{homeActive}}`: 首页激活状态
- `{{researchActive}}`: 科研动态激活状态
- `{{communicationActive}}`: 开放交流激活状态
- `{{newsActive}}`: 新闻中心激活状态
- `{{directionsActive}}`: 研究方向激活状态

##### 5.4.2 修改页眉页脚

**修改页眉** (`templates/header.html`)：

```html
<header>
    <nav id="main-nav">
        <div class="nav-container">
            <div class="logo">
                <a href="{{baseUrl}}index.html">信息安全实验室 (ivis)</a>
            </div>
            <ul class="nav-links">
                <li><a href="{{baseUrl}}index.html" class="{{homeActive}}">首页</a></li>
                <li><a href="{{baseUrl}}pages/research/index.html" class="{{researchActive}}">科研动态</a></li>
                <!-- 添加新的导航项 -->
                <li><a href="{{baseUrl}}pages/new-section/index.html" class="{{newSectionActive}}">新栏目</a></li>
            </ul>
        </div>
    </nav>
</header>
```

**修改页脚** (`templates/footer.html`)：

```html
<footer>
    <div class="container">
        <div class="footer-content">
            <div class="footer-info">
                <h3>联系我们</h3>
                <p>地址：重庆大学国家卓越工程师学院</p>
                <p>电话：023-65102000</p>
                <p>邮箱：ivis@cqu.edu.cn</p>
            </div>
        </div>
        <div class="copyright">
            <p>&copy; 2024 信息安全实验室 (ivis) - 重庆大学国家卓越工程师学院</p>
        </div>
    </div>
</footer>
```

#### 5.5 样式开发规范

##### 5.5.1 CSS文件结构

```
css/
├── style.css          # 基础样式和全局变量
├── navigation.css     # 导航栏样式
├── modules.css        # 模块化组件样式
├── responsive.css     # 响应式样式
└── animations.css     # 动画效果样式
```

##### 5.5.2 CSS变量使用

在 `css/style.css` 中定义的CSS变量：

```css
:root {
    --primary-color: #1e40af;
    --secondary-color: #1e3a8a;
    --accent-color: #3b82f6;
    --text-color: #1f2937;
    --light-text: #ffffff;
    --background-color: #f8fafc;
    --card-background: #ffffff;
    --border-color: #e5e7eb;
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --border-radius: 12px;
    --transition-speed: 0.3s;
}
```

**使用示例：**

```css
.custom-card {
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
    transition: all var(--transition-speed) ease;
}

.custom-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}
```

##### 5.5.3 响应式设计规范

使用标准断点：

```css
/* 移动端 */
@media (max-width: 768px) {
    .container {
        padding: 0 1rem;
    }
    
    .grid {
        grid-template-columns: 1fr;
    }
}

/* 平板端 */
@media (min-width: 769px) and (max-width: 1024px) {
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* 桌面端 */
@media (min-width: 1025px) {
    .grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

#### 5.6 JavaScript开发规范

##### 5.6.1 模块化结构

```
js/
├── main.js              # 主脚本文件
├── components.js        # 组件相关功能
├── config-manager.js    # 配置文件管理
├── content-renderer.js  # 内容渲染
└── animations.js        # 动画效果
```

##### 5.6.2 添加新功能模块

1. **创建模块文件**：

```javascript
// js/new-feature.js
class NewFeature {
    constructor(options = {}) {
        this.options = {
            container: '#new-feature-container',
            autoInit: true,
            ...options
        };
        
        if (this.options.autoInit) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.render();
    }
    
    bindEvents() {
        // 事件绑定逻辑
    }
    
    render() {
        // 渲染逻辑
    }
}

// 全局导出
window.NewFeature = NewFeature;
```

2. **在页面中使用**：

```html
<script src="../../js/new-feature.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const newFeature = new NewFeature({
            container: '#my-container',
            // 其他配置选项
        });
    });
</script>
```

#### 5.7 资源管理

##### 5.7.1 图片资源

```
assets/images/
├── 机器人遥操作.png
├── 基于mcp的语音控制系统.png
├── lab-image.png
└── ...
```

**图片命名规范：**
- 使用中文名称，便于识别
- 避免特殊字符和空格
- 建议使用PNG格式（支持透明）
- 图片尺寸建议：卡片图片 400x300px，横幅图片 1200x400px

##### 5.7.2 视频资源

```
assets/video/
├── 机器人遥操作.mp4
├── 基于mcp的语音控制系统.mp4
└── ...
```

**视频使用示例：**

```html
<video controls width="100%" height="auto">
    <source src="../../assets/video/演示视频.mp4" type="video/mp4">
    您的浏览器不支持视频播放。
</video>
```

#### 5.8 调试和测试

##### 5.8.1 本地开发服务器

```bash
# 使用Python启动服务器
python3 -m http.server 8080

# 或使用Node.js
npx http-server -p 8080

# 访问地址
http://localhost:8080
```

##### 5.8.2 常见问题排查

1. **页面显示异常**：
   - 检查浏览器控制台错误信息
   - 验证资源路径是否正确
   - 确认CSS和JS文件是否正确加载

2. **配置文件不生效**：
   - 验证JSON格式是否正确
   - 检查文件路径是否存在
   - 确认JavaScript初始化代码是否执行

3. **组件加载失败**：
   - 检查模板文件是否存在
   - 验证路径计算是否正确
   - 确认网络请求是否成功

##### 5.8.3 性能优化建议

1. **图片优化**：
   - 压缩图片文件大小
   - 使用适当的图片格式
   - 考虑使用WebP格式

2. **代码优化**：
   - 合并CSS和JS文件
   - 启用Gzip压缩
   - 使用CDN加速

3. **缓存策略**：
   - 设置适当的缓存头
   - 使用版本号管理静态资源
   - 实现配置文件缓存机制

### 6. 提交代码

```bash
# 添加修改的文件
git add .

# 提交代码（使用清晰的提交信息）
git commit -m "feat: 添加新的研究项目展示组件"

# 推送到你的fork仓库
git push origin feature/your-feature-name
```

### 7. 代码审查与合并

1. 项目维护者会审查你的代码
2. 根据反馈进行必要的修改
3. 审查通过后，代码将自动合并到主分支
4. 合并后会触发自动部署流程

## 📁 项目结构

```
ivis_web/
├── index.html                 # 主页
├── pages/                     # 页面目录
│   ├── research/             # 科研动态
│   ├── communication/        # 开放交流
│   ├── news/                # 新闻中心
│   └── directions/          # 研究方向
├── css/                      # 样式文件
│   ├── style.css            # 基础样式
│   ├── navigation.css       # 导航样式
│   ├── modules.css          # 模块样式
│   └── responsive.css       # 响应式样式
├── js/                       # JavaScript文件
│   ├── components.js        # 组件系统
│   ├── config-manager.js    # 配置管理
│   ├── content-renderer.js  # 内容渲染
│   └── main.js             # 主脚本
├── components/              # 组件目录
│   └── component-loader.js  # 组件加载器
├── templates/               # 模板文件
│   ├── header.html         # 页眉模板
│   └── footer.html         # 页脚模板
├── config/                  # 配置文件
│   ├── research-config.json    # 科研动态配置
│   ├── communication-config.json # 开放交流配置
│   └── news-config.json       # 新闻中心配置
├── assets/                  # 静态资源
│   ├── images/             # 图片文件
│   └── video/              # 视频文件
├── scripts/                 # 构建脚本
│   ├── build.js            # 构建脚本
│   └── deploy.js           # 部署脚本
└── .github/workflows/       # GitHub Actions
    └── deploy.yml          # 自动部署配置
```

## 📝 内容管理

### 科研动态管理

编辑 `config/research-config.json` 文件：

```json
{
  "projects": [
    {
      "title": "项目标题",
      "image": "../../assets/images/project.png",
      "date": "2024-01-15",
      "description": "项目简介",
      "detailPage": "./项目详情.html"
    }
  ]
}
```

### 开放交流管理

编辑 `config/communication-config.json` 文件：

```json
{
  "events": {
    "upcoming": [
      {
        "title": "活动标题",
        "time": "2024-01-15 15:00",
        "location": "科研楼B205",
        "description": "活动描述",
        "detailPage": "./活动详情.html"
      }
    ]
  }
}
```

### 新闻中心管理

编辑 `config/news-config.json` 文件：

```json
{
  "publications": {
    "2024": [
      {
        "title": "论文标题",
        "authors": "作者列表",
        "journal": "期刊名称",
        "level": "期刊级别"
      }
    ]
  }
}
```

## 🚀 部署配置

### 1. 创建部署配置

首次运行部署命令会自动创建 `deploy.config.json` 配置文件：

```json
{
  "environments": {
    "production": {
      "type": "ssh",
      "host": "your-server.com",
      "username": "deploy",
      "remotePath": "/var/www/html",
      "port": 22,
      "privateKeyPath": "~/.ssh/id_rsa"
    }
  }
}
```

### 2. GitHub Actions部署

配置以下GitHub Secrets：

- `HOST`: 服务器地址
- `USERNAME`: SSH用户名
- `PRIVATE_KEY`: SSH私钥
- `PORT`: SSH端口 (默认22)
- `SITE_URL`: 网站URL (用于健康检查)
- `SLACK_WEBHOOK_URL`: Slack通知地址 (可选)

### 3. 手动部署

```bash
# 构建项目
npm run build

# 部署到生产环境
npm run deploy:production
```

## 🛠️ 开发指南

### 添加新页面

1. 在 `pages/` 目录下创建新页面
2. 引用必要的CSS和JS文件
3. 使用组件系统加载页眉页脚
4. 如需配置文件驱动，创建对应的配置文件

### 修改样式

- 基础样式：编辑 `css/style.css`
- 导航样式：编辑 `css/navigation.css`
- 模块样式：编辑 `css/modules.css`
- 响应式样式：编辑 `css/responsive.css`

### 添加新功能

1. 在 `js/` 目录下创建功能模块
2. 在相应页面中引用
3. 更新配置文件（如需要）

## 📋 维护指南

### 定期任务

- 更新内容配置文件
- 检查图片和视频资源
- 测试各页面功能
- 备份重要数据

### 故障排除

1. **页面显示异常**：检查控制台错误信息
2. **配置文件不生效**：验证JSON格式是否正确
3. **部署失败**：检查服务器连接和权限设置
4. **样式问题**：清除浏览器缓存后重试

### 性能优化

- 压缩图片文件
- 使用CDN加速
- 启用Gzip压缩
- 优化CSS和JS文件

### 提交信息规范

使用约定式提交格式：

```
<类型>[可选 范围]: <描述>

[可选 正文]

[可选 脚注]
```

类型包括：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat(research): 添加项目筛选功能

添加了按年份和类型筛选研究项目的功能，
提升了用户浏览体验。

Closes #123
```



## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

---

© 2024 智能网联汽车信息安全实验室 (IVIS) - 重庆大学国家卓越工程师学院