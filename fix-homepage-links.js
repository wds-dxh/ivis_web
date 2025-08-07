/*
 * @Author: wds-mac wdsnpshy@163.com
 * @Date: 2025-08-08 02:37:23
 * @Description: 
 * Copyright (c) 2025 by ${wds-mac}, All Rights Reserved. 
 */
const fs = require('fs');
const path = require('path');

// 需要修复的文件列表
const filesToFix = [
    'pages/research/智慧聊天Agent系统.html',
    'pages/research/专业领域咨询Agent系统.html',
    'pages/research/智能会议大模型系统.html',
    'pages/communication/卓工面对面.html',
    'pages/communication/第七届网络安全前沿国际会议(FCS 2024).html'
];

function fixHomepageLinks(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 修复导航中的首页链接
        content = content.replace(
            /<a href="\.\.\/\.\.\/index\.html">信息安全实验室 \(ivis\)<\/a>/g,
            '<a href="../../">信息安全实验室 (ivis)</a>'
        );
        
        // 修复导航菜单中的首页链接
        content = content.replace(
            /<li><a href="\.\.\/\.\.\/index\.html">首页<\/a><\/li>/g,
            '<li><a href="../../">首页</a></li>'
        );
        
        // 修复footer中的首页链接
        content = content.replace(
            /<li><a href="\.\.\/\.\.\/index\.html">首页<\/a><\/li>/g,
            '<li><a href="../../">首页</a></li>'
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 已修复: ${filePath}`);
        
    } catch (error) {
        console.error(`❌ 修复失败 ${filePath}:`, error.message);
    }
}

console.log('开始批量修复首页链接...\n');

filesToFix.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        fixHomepageLinks(filePath);
    } else {
        console.log(`⚠️  文件不存在: ${filePath}`);
    }
});

console.log('\n🎉 批量修复完成！');