/**
 * 组件加载器 - 用于动态加载页眉页脚组件
 * 支持路径自动适配和导航状态管理
 */
class ComponentLoader {
    constructor() {
        this.baseUrl = this.calculateBaseUrl();
        this.currentPage = this.getCurrentPage();
    }

    /**
     * 计算基础URL路径
     */
    calculateBaseUrl() {
        const path = window.location.pathname;
        
        // 判断当前页面的层级
        if (path === '/' || (path.endsWith('/index.html') && !path.includes('/pages/'))) {
            // 根目录页面
            return './';
        } else if (path.includes('/pages/')) {
            // pages下的页面，统一返回到根目录
            return '../../';
        }
        
        // 默认返回根目录
        return './';
    }

    /**
     * 获取当前页面类型
     */
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('/research/')) return 'research';
        if (path.includes('/communication/')) return 'communication';
        if (path.includes('/news/')) return 'news';
        if (path.includes('/directions/')) return 'directions';
        return 'home';
    }

    /**
     * 获取导航激活状态
     */
    getNavActiveStates() {
        return {
            homeActive: this.currentPage === 'home' ? 'active' : '',
            researchActive: this.currentPage === 'research' ? 'active' : '',
            communicationActive: this.currentPage === 'communication' ? 'active' : '',
            newsActive: this.currentPage === 'news' ? 'active' : '',
            directionsActive: this.currentPage === 'directions' ? 'active' : ''
        };
    }

    /**
     * 替换模板变量
     */
    replaceTemplateVariables(template) {
        const variables = {
            baseUrl: this.baseUrl,
            ...this.getNavActiveStates()
        };

        let result = template;
        Object.keys(variables).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            result = result.replace(regex, variables[key]);
        });

        return result;
    }

    /**
     * 加载组件模板
     */
    async loadTemplate(templatePath) {
        try {
            const response = await fetch(templatePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`加载模板失败: ${templatePath}`, error);
            return '';
        }
    }

    /**
     * 加载并插入页眉
     */
    async loadHeader() {
        const templatePath = `${this.baseUrl}templates/header.html`;
        const template = await this.loadTemplate(templatePath);
        
        if (template) {
            const processedTemplate = this.replaceTemplateVariables(template);
            const headerContainer = document.getElementById('header-container');
            
            if (headerContainer) {
                headerContainer.innerHTML = processedTemplate;
            } else {
                // 如果没有容器，直接插入到body开头
                document.body.insertAdjacentHTML('afterbegin', processedTemplate);
            }
        }
    }

    /**
     * 加载并插入页脚
     */
    async loadFooter() {
        const templatePath = `${this.baseUrl}templates/footer.html`;
        const template = await this.loadTemplate(templatePath);
        
        if (template) {
            const processedTemplate = this.replaceTemplateVariables(template);
            const footerContainer = document.getElementById('footer-container');
            
            if (footerContainer) {
                footerContainer.innerHTML = processedTemplate;
            } else {
                // 如果没有容器，直接插入到body末尾
                document.body.insertAdjacentHTML('beforeend', processedTemplate);
            }
        }
    }

    /**
     * 初始化组件加载
     */
    async init() {
        await Promise.all([
            this.loadHeader(),
            this.loadFooter()
        ]);

        // 加载完成后初始化导航功能
        this.initNavigation();
        
        // 延迟应用蓝色横幅样式修复
        setTimeout(() => {
            this.forceStyleReapplication();
        }, 100);
    }

    /**
     * 强制重新应用样式
     */
    forceStyleReapplication() {
        const mainBanner = document.querySelector('.main-banner');
        if (mainBanner) {
            // 临时移除并重新添加类名来强制重新渲染
            const className = mainBanner.className;
            mainBanner.className = '';
            // 强制重排
            mainBanner.offsetHeight;
            mainBanner.className = className;
        }
    }

    /**
     * 初始化导航功能
     */
    initNavigation() {
        // 调用全局的导航初始化函数
        if (typeof window.initNavigationFeatures === 'function') {
            window.initNavigationFeatures();
        }
    }
}

// 全局组件加载器实例
window.componentLoader = new ComponentLoader();

// DOM加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    window.componentLoader.init();
});
