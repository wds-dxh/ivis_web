/*
 * @Author: wds-mac wdsnpshy@163.com
 * @Date: 2025-08-04 17:03:15
 * @Description: 
 * Copyright (c) 2025 by ${wds-mac}, All Rights Reserved. 
 */
document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航功能（如果页面已有导航栏）
    initNavigationFeatures();
    
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
