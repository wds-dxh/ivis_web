/**
 * 配置管理器 - 用于加载和管理JSON配置文件
 * 支持科研动态和开放交流模块的配置驱动
 */
class ConfigManager {
    constructor() {
        this.baseUrl = this.calculateBaseUrl();
        this.cache = new Map();
    }

    /**
     * 计算基础URL路径
     */
    calculateBaseUrl() {
        const path = window.location.pathname;
        
        if (path === '/' || (path.endsWith('/index.html') && !path.includes('/pages/'))) {
            return './';
        } else if (path.includes('/pages/')) {
            return '../../';
        }
        
        return './';
    }

    /**
     * 加载配置文件
     * @param {string} configName - 配置文件名（不含扩展名）
     * @returns {Promise<Object>} 配置对象
     */
    async loadConfig(configName) {
        // 检查缓存
        if (this.cache.has(configName)) {
            return this.cache.get(configName);
        }

        try {
            const configPath = `${this.baseUrl}config/${configName}.json`;
            const response = await fetch(configPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const config = await response.json();
            
            // 缓存配置
            this.cache.set(configName, config);
            
            return config;
        } catch (error) {
            console.error(`加载配置文件失败: ${configName}`, error);
            return null;
        }
    }

    /**
     * 加载科研动态配置
     * @returns {Promise<Object>} 科研动态配置
     */
    async loadResearchConfig() {
        return await this.loadConfig('research-config');
    }

    /**
     * 加载开放交流配置
     * @returns {Promise<Object>} 开放交流配置
     */
    async loadCommunicationConfig() {
        return await this.loadConfig('communication-config');
    }

    /**
     * 格式化日期显示
     * @param {string} dateStr - 日期字符串
     * @returns {string} 格式化后的日期
     */
    formatDate(dateStr) {
        if (!dateStr) return '';
        
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateStr;
        }
    }

    /**
     * 加载新闻中心配置
     * @returns {Promise<Object>} 新闻中心配置
     */
    async loadNewsConfig() {
        return await this.loadConfig('news-config');
    }

    /**
     * 过滤和排序项目
     * @param {Array} items - 项目数组
     * @param {Object} settings - 显示设置
     * @returns {Array} 处理后的项目数组
     */
    processItems(items, settings = {}) {
        if (!Array.isArray(items)) return [];
        
        let processedItems = [...items];
        
        // 简单的日期排序（如果有date字段）
        if (processedItems.length > 0 && processedItems[0].date) {
            processedItems.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA; // 降序排列
            });
        }
        
        return processedItems;
    }

    /**
     * 清除缓存
     * @param {string} configName - 配置名称，不传则清除所有缓存
     */
    clearCache(configName = null) {
        if (configName) {
            this.cache.delete(configName);
        } else {
            this.cache.clear();
        }
    }

    /**
     * 重新加载配置
     * @param {string} configName - 配置文件名
     * @returns {Promise<Object>} 新的配置对象
     */
    async reloadConfig(configName) {
        this.clearCache(configName);
        return await this.loadConfig(configName);
    }
}

// 全局配置管理器实例
window.configManager = new ConfigManager();

// 导出常用方法
window.loadResearchConfig = () => window.configManager.loadResearchConfig();
window.loadCommunicationConfig = () => window.configManager.loadCommunicationConfig();
window.loadNewsConfig = () => window.configManager.loadNewsConfig();
