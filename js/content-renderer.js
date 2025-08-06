/**
 * 内容渲染器 - 根据配置文件动态生成页面内容
 * 支持科研动态和开放交流模块的内容渲染
 */
class ContentRenderer {
    constructor() {
        this.configManager = window.configManager || new ConfigManager();
    }

    /**
     * 渲染科研动态项目卡片
     * @param {Object} project - 项目对象
     * @returns {string} HTML字符串
     */
    renderResearchCard(project) {
        const dateDisplay = this.configManager.formatDate(project.date);
        
        return `
            <div class="research-card">
                <div class="research-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="research-content">
                    <h3 class="research-title">${project.title}</h3>
                    <div class="research-meta">
                        <span class="date">${dateDisplay}</span>
                    </div>
                    <p class="research-description">${project.description}</p>
                    <a href="${project.detailPage}" class="btn">查看详情</a>
                </div>
            </div>
        `;
    }

    /**
     * 渲染开放交流活动卡片
     * @param {Object} event - 活动对象
     * @returns {string} HTML字符串
     */
    renderCommunicationCard(event) {
        return `
            <div class="event-card">
                <div class="event-card-content">
                    <div class="event-meta">
                        <div class="event-time">${event.time}</div>
                        <div class="event-venue">${event.venue}</div>
                    </div>
                    <h3>${event.title}</h3>
                    <div class="event-description">
                        <p>${event.description}</p>
                    </div>
                    <div class="event-footer">
                        <a href="${event.detailPage}" class="btn">了解详情</a>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 渲染科研动态页面内容
     * @param {string} containerId - 容器ID
     */
    async renderResearchContent(containerId = 'research-grid') {
        try {
            const config = await this.configManager.loadResearchConfig();
            if (!config) {
                console.error('无法加载科研动态配置');
                return;
            }

            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`容器 ${containerId} 不存在`);
                return;
            }

            // 处理项目数据
            const projects = this.configManager.processItems(
                config.projects, 
                config.displaySettings
            );

            // 生成HTML
            const html = projects.map(project => 
                this.renderResearchCard(project)
            ).join('');

            container.innerHTML = html;

            // 更新页面元信息
            this.updatePageMeta(config.meta);

        } catch (error) {
            console.error('渲染科研动态内容失败:', error);
        }
    }

    /**
     * 渲染开放交流页面内容
     * @param {string} category - 分类ID
     * @param {string} containerId - 容器ID
     */
    async renderCommunicationContent(category = 'upcoming', containerId = null) {
        try {
            const config = await this.configManager.loadCommunicationConfig();
            if (!config) {
                console.error('无法加载开放交流配置');
                return;
            }

            // 确定容器ID
            const targetContainerId = containerId || `${category}-content`;
            const container = document.getElementById(targetContainerId);
            
            if (!container) {
                console.error(`容器 ${targetContainerId} 不存在`);
                return;
            }

            // 获取对应分类的活动
            const events = config.events[category] || [];
            
            // 处理活动数据
            const processedEvents = this.configManager.processItems(
                events, 
                config.displaySettings
            );

            // 生成HTML
            let html = '';
            if (category === 'location') {
                html = this.renderVenueInfo(config.venue);
            } else {
                html = processedEvents.map(event => 
                    this.renderCommunicationCard(event)
                ).join('');
            }

            container.innerHTML = html;

        } catch (error) {
            console.error('渲染开放交流内容失败:', error);
        }
    }

    /**
     * 渲染场地信息
     * @param {Object} venue - 场地信息
     * @returns {string} HTML字符串
     */
    renderVenueInfo(venue) {
        return `
            <div class="location-map-container">
                <div class="map-info">
                    <h3>场地地址</h3>
                    <p><strong>${venue.name}</strong></p>
                    <p>${venue.address}</p>
                    <div class="contact-info">
                        <p><strong>联系电话：</strong>${venue.phone}</p>
                        <p><strong>联系邮箱：</strong>${venue.email}</p>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 更新页面元信息
     * @param {Object} meta - 元信息对象
     */
    updatePageMeta(meta) {
        if (meta.title) {
            const heroTitle = document.querySelector('.hero h1');
            if (heroTitle && !heroTitle.textContent.trim()) {
                heroTitle.textContent = meta.title;
            }
        }

        if (meta.description) {
            const heroDesc = document.querySelector('.hero p');
            if (heroDesc && !heroDesc.textContent.trim()) {
                heroDesc.textContent = meta.description;
            }
        }
    }

    /**
     * 初始化页面内容渲染
     * @param {string} pageType - 页面类型 ('research' 或 'communication')
     */
    async initPageContent(pageType) {
        switch (pageType) {
            case 'research':
                await this.renderResearchContent();
                break;
            case 'communication':
                // 渲染所有分类的内容
                const categories = ['upcoming', 'conferences', 'lectures', 'past'];
                for (const category of categories) {
                    await this.renderCommunicationContent(category);
                }
                // 渲染场地信息
                await this.renderCommunicationContent('location', 'location');
                break;
            default:
                console.warn(`未知的页面类型: ${pageType}`);
        }
    }
}

// 全局内容渲染器实例
window.contentRenderer = new ContentRenderer();

// 导出常用方法
window.renderResearchContent = (containerId) => 
    window.contentRenderer.renderResearchContent(containerId);
window.renderCommunicationContent = (category, containerId) => 
    window.contentRenderer.renderCommunicationContent(category, containerId);
window.initPageContent = (pageType) => 
    window.contentRenderer.initPageContent(pageType);