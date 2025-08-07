/*
 * @Author: wds-mac wdsnpshy@163.com
 * @Date: 2025-08-04 17:03:15
 * @Description: 
 * Copyright (c) 2025 by ${wds-mac}, All Rights Reserved. 
 */

/**
 * 确保CSS样式完全加载
 */
function ensureStylesLoaded() {
    return new Promise((resolve) => {
        const checkStyles = () => {
            const styleSheets = document.styleSheets;
            let allLoaded = true;
            
            for (let i = 0; i < styleSheets.length; i++) {
                try {
                    const rules = styleSheets[i].cssRules || styleSheets[i].rules;
                    if (!rules) {
                        allLoaded = false;
                        break;
                    }
                } catch (e) {
                    allLoaded = false;
                    break;
                }
            }
            
            if (allLoaded) {
                resolve();
            } else {
                setTimeout(checkStyles, 50);
            }
        };
        
        if (document.readyState === 'complete') {
            setTimeout(checkStyles, 100);
        } else {
            window.addEventListener('load', () => setTimeout(checkStyles, 100));
        }
    });
}

/**
 * 初始化主横幅样式
 */
function initMainBannerStyles() {
    const mainBanner = document.querySelector('.main-banner');
    if (mainBanner) {
        // 确保样式正确应用
        mainBanner.style.background = 'linear-gradient(135deg, rgba(30, 64, 175, 0.95) 0%, rgba(30, 58, 138, 0.9) 50%, rgba(59, 130, 246, 0.85) 100%)';
        mainBanner.style.color = '#ffffff';
        mainBanner.style.textAlign = 'center';
        mainBanner.style.padding = '8rem 2rem';
        mainBanner.style.marginBottom = '4rem';
        mainBanner.style.position = 'relative';
        mainBanner.style.overflow = 'hidden';
        
        // 强制重新渲染
        mainBanner.offsetHeight;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // 确保样式完全加载后再初始化
    ensureStylesLoaded().then(() => {
        // 初始化导航功能（如果页面已有导航栏）
        initNavigationFeatures();
        
        // 确保主横幅样式正确应用
        initMainBannerStyles();
        
        // 平滑滚动到锚点
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    });
});

/**
 * 初始化导航功能
 * 这个函数可以被组件加载器调用，也可以在页面直接加载时调用
 */
function initNavigationFeatures() {
    // 获取导航栏元素
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    
    // 创建移动端导航切换按钮（如果不存在）
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;
    
    const existingToggle = navContainer.querySelector('.menu-toggle');
    if (!existingToggle) {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.setAttribute('aria-label', '切换导航菜单');
        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            menuToggle.appendChild(span);
        }
        navContainer.appendChild(menuToggle);
        
        // 移动端导航切换功能
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            menuToggle.addEventListener('click', function() {
                navLinks.classList.toggle('open');
                menuToggle.classList.toggle('open');
                document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
            });
            
            // 点击导航链接后关闭菜单
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.classList.remove('open');
                    menuToggle.classList.remove('open');
                    document.body.style.overflow = '';
                });
            });
        }
    }
    
    // 滚动监听，添加导航栏样式变化
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
}

// 导出函数供组件加载器使用
window.initNavigationFeatures = initNavigationFeatures;
window.ensureStylesLoaded = ensureStylesLoaded;
window.initMainBannerStyles = initMainBannerStyles;