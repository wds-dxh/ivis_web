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

#### 5.1 配置文件管理

项目采用配置文件驱动的内容管理系统，主要配置文件位于 `config/` 目录：

- `research-config.json` - 科研动态配置
- `communication-config.json` - 开放交流配置  
- `news-config.json` - 新闻中心配置

**修改配置文件示例：**

```json
// config/research-config.json
{
  "projects": [
    {
      "title": "新项目标题",
      "image": "../../assets/images/new-project.png",
      "date": "2024-01-15",
      "description": "项目简介描述",
      "detailPage": "./新项目详情.html"
    }
  ]
}
```

#### 5.2 添加新组件

1. 在 `components/` 目录下创建新组件文件：

```javascript
// components/new-component.js
class NewComponent {
    constructor(container) {
        this.container = container;
        this.init();
    }
    
    init() {
        this.render();
        this.bindEvents();
    }
    
    render() {
        // 组件渲染逻辑
    }
    
    bindEvents() {
        // 事件绑定逻辑
    }
}

// 导出组件
window.NewComponent = NewComponent;
```

2. 在需要使用的页面中引入组件：

```html
<script src="../components/new-component.js"></script>
<script>
    // 初始化组件
    const newComponent = new NewComponent(document.getElementById('container'));
</script>
```

#### 5.3 添加新页面

1. 在 `pages/` 对应目录下创建新页面
2. 使用标准页面模板结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题 - IVIS实验室</title>
    
    <!-- 引入样式文件 -->
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/navigation.css">
    <link rel="stylesheet" href="../../css/modules.css">
    <link rel="stylesheet" href="../../css/responsive.css">
</head>
<body>
    <!-- 页眉组件容器 -->
    <div id="header-container"></div>
    
    <!-- 主要内容 -->
    <main>
        <!-- 你的页面内容 -->
    </main>
    
    <!-- 页脚组件容器 -->
    <div id="footer-container"></div>
    
    <!-- 引入脚本文件 -->
    <script src="../../components/component-loader.js"></script>
    <script src="../../js/main.js"></script>
</body>
</html>
```

#### 5.4 样式开发规范

- 基础样式：`css/style.css`
- 导航样式：`css/navigation.css`
- 模块样式：`css/modules.css`
- 响应式样式：`css/responsive.css`

使用CSS变量保持样式一致性：

```css
:root {
    --primary-color: #2c5aa0;
    --secondary-color: #f8f9fa;
    --text-color: #333;
    --border-color: #e9ecef;
}
```

### 6. 提交代码

```bash
# 添加修改的文件
git add .

# 提交代码（使用清晰的提交信息）
git commit -m "feat: 添加新的研究项目展示组件"

# 推送到你的fork仓库
git push origin feature/your-feature-name
```

### 7. 创建 Pull Request

1. 访问你的 fork 仓库页面
2. 点击 "Compare & pull request" 按钮
3. 填写 PR 标题和详细描述：

```markdown
## 变更类型
- [ ] 新功能 (feature)
- [ ] 修复bug (fix)
- [ ] 文档更新 (docs)
- [ ] 样式调整 (style)
- [ ] 重构 (refactor)

## 变更描述
简要描述你的修改内容...

## 测试说明
- [ ] 本地测试通过
- [ ] 响应式设计测试
- [ ] 浏览器兼容性测试

## 截图（如适用）
添加相关截图...
```

### 8. 代码审查与合并

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

## 🔧 技术特性

### 组件化架构
- 页眉页脚组件复用
- 自动路径计算
- 模板系统支持

### 配置文件驱动
- JSON配置文件管理内容
- 动态内容渲染
- 易于维护和更新

### 响应式设计
- 移动端优化
- 多设备适配
- 深色模式支持

### 自动化部署
- GitHub Actions集成
- 多环境部署支持
- 自动构建优化

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