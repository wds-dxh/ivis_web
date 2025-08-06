/*
 * @Author: wds-mac wdsnpshy@163.com
 * @Date: 2025-08-07 00:48:58
 * @Description: 
 * Copyright (c) 2025 by ${wds-mac}, All Rights Reserved. 
 */
/**
 * 组件管理器 - 简化版本，用于向后兼容
 * 这个文件提供了一个更简单的接口来使用组件系统
 */

/**
 * 简单的组件加载函数
 * @param {string} containerId - 容器ID
 * @param {string} componentType - 组件类型 ('header' 或 'footer')
 */
async function loadComponent(containerId, componentType) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`容器 ${containerId} 不存在`);
        return;
    }

    try {
        const loader = window.componentLoader || new ComponentLoader();
        
        if (componentType === 'header') {
            await loader.loadHeader();
        } else if (componentType === 'footer') {
            await loader.loadFooter();
        }
    } catch (error) {
        console.error(`加载组件失败: ${componentType}`, error);
    }
}

/**
 * 批量加载所有组件
 */
async function loadAllComponents() {
    if (window.componentLoader) {
        await window.componentLoader.init();
    } else {
        const loader = new ComponentLoader();
        await loader.init();
    }
}

// 导出函数供其他脚本使用
window.loadComponent = loadComponent;
window.loadAllComponents = loadAllComponents;