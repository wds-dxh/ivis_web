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

## 📞 技术支持

如有技术问题，请联系：

- 邮箱：xiangpengli.cs@gmail.com
- 电话：023-67952817

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

---

© 2024 智能网联汽车信息安全实验室 (IVIS) - 重庆大学国家卓越工程师学院