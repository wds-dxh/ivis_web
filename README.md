# 实验室网站

这是一个简洁、现代的实验室网站模板，使用纯HTML、CSS和JavaScript构建，不依赖任何框架。

## 项目结构

```
ivis_web/
├── index.html                 # 首页
├── css/                       # 样式文件夹
│   ├── style.css              # 主要样式
│   └── navigation.css         # 导航栏样式
├── js/                        # JavaScript文件夹
│   └── main.js                # 主要脚本文件
├── assets/                    # 静态资源文件夹
│   ├── images/                # 图片资源
│   └── videos/                # 视频资源
└── pages/                     # 页面文件夹
    ├── research/              # 科研成果页面
    │   ├── index.html         # 科研成果列表页
    │   ├── achievement1.html  # 单个成果详情页
    │   └── ...                # 其他成果页面
    ├── communication/         # 开放交流页面
    │   ├── index.html         # 开放交流列表页
    │   └── ...                # 其他交流活动页面
    ├── news/                  # 新闻中心页面
    │   ├── index.html         # 新闻列表页
    │   └── ...                # 其他新闻详情页面
    └── directions/            # 研究方向页面
        └── index.html         # 研究方向列表页
```

## 如何使用

1. 本网站使用纯HTML、CSS和JavaScript构建，无需安装任何依赖或框架，可以直接部署到任何Web服务器上。

2. 要在本地预览，只需在浏览器中打开index.html文件，或者使用任何本地服务器（如Live Server、http-server等）。

## 如何更新内容

### 添加新的科研成果

1. 在`pages/research/`文件夹中创建新的HTML文件，可以复制`achievement1.html`并修改内容。
2. 在`pages/research/index.html`的成果列表中添加新的成果卡片，并链接到新创建的HTML文件。
3. 将相关的图片添加到`assets/images/`文件夹，视频添加到`assets/videos/`文件夹。

### 添加新的开放交流活动

1. 在`pages/communication/`文件夹中创建新的HTML文件，描述活动详情。
2. 在`pages/communication/index.html`的相应选项卡下添加新的活动卡片。

### 添加新的新闻

1. 在`pages/news/`文件夹中创建新的HTML文件，描述新闻详情。
2. 在`pages/news/index.html`的新闻列表中添加新的新闻卡片，并链接到新创建的HTML文件。

### 更新研究方向

修改`pages/directions/index.html`文件中的相应部分。如需添加新的研究方向，可复制现有方向块并修改内容。

## 设计细节

- 主题色和其他变量定义在`css/style.css`的`:root`选择器中，可以通过修改这些变量轻松更改整个网站的颜色方案。
- 所有页面都自适应移动设备，通过媒体查询实现响应式设计。
- 导航栏在移动端会折叠为汉堡菜单。

## 兼容性

网站兼容所有现代浏览器，包括Chrome、Firefox、Safari、Edge等。为保证最佳体验，建议使用最新版本的浏览器访问。
