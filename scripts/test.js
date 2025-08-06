#!/usr/bin/env node

/**
 * 基础功能测试脚本
 * 验证网站的基本功能和配置文件
 */

const fs = require('fs');
const path = require('path');

class WebsiteTester {
    constructor() {
        this.rootDir = path.resolve(__dirname, '..');
        this.errors = [];
        this.warnings = [];
    }

    /**
     * 运行所有测试
     */
    async runTests() {
        console.log('🧪 开始网站功能测试...\n');
        
        try {
            await this.testFileStructure();
            await this.testConfigFiles();
            await this.testHTMLFiles();
            await this.testCSSFiles();
            await this.testJSFiles();
            await this.testAssets();
            
            this.printResults();
            
        } catch (error) {
            console.error('❌ 测试过程中发生错误:', error.message);
            process.exit(1);
        }
    }

    /**
     * 测试文件结构
     */
    async testFileStructure() {
        console.log('📁 测试文件结构...');
        
        const requiredFiles = [
            'index.html',
            'package.json',
            'README.md',
            'css/style.css',
            'css/navigation.css',
            'css/modules.css',
            'css/responsive.css',
            'js/components.js',
            'js/config-manager.js',
            'js/content-renderer.js',
            'js/main.js',
            'components/component-loader.js',
            'templates/header.html',
            'templates/footer.html'
        ];
        
        const requiredDirs = [
            'pages',
            'config',
            'assets',
            'scripts',
            '.github/workflows'
        ];
        
        // 检查必需文件
        for (const file of requiredFiles) {
            const filePath = path.join(this.rootDir, file);
            if (!fs.existsSync(filePath)) {
                this.errors.push(`缺少必需文件: ${file}`);
            } else {
                console.log(`  ✓ ${file}`);
            }
        }
        
        // 检查必需目录
        for (const dir of requiredDirs) {
            const dirPath = path.join(this.rootDir, dir);
            if (!fs.existsSync(dirPath)) {
                this.errors.push(`缺少必需目录: ${dir}`);
            } else {
                console.log(`  ✓ ${dir}/`);
            }
        }
        
        console.log('');
    }

    /**
     * 测试配置文件
     */
    async testConfigFiles() {
        console.log('⚙️ 测试配置文件...');
        
        const configFiles = [
            'config/research-config.json',
            'config/communication-config.json',
            'config/news-config.json'
        ];
        
        for (const configFile of configFiles) {
            const filePath = path.join(this.rootDir, configFile);
            
            if (!fs.existsSync(filePath)) {
                this.errors.push(`配置文件不存在: ${configFile}`);
                continue;
            }
            
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const config = JSON.parse(content);
                
                // 基本结构检查
                if (configFile.includes('research')) {
                    if (!config.projects || !Array.isArray(config.projects)) {
                        this.errors.push(`${configFile}: projects字段缺失或格式错误`);
                    } else {
                        console.log(`  ✓ ${configFile} (${config.projects.length} 个项目)`);
                    }
                } else if (configFile.includes('communication')) {
                    if (!config.events || typeof config.events !== 'object') {
                        this.errors.push(`${configFile}: events字段缺失或格式错误`);
                    } else {
                        const totalEvents = Object.values(config.events).reduce((sum, events) => 
                            sum + (Array.isArray(events) ? events.length : 0), 0);
                        console.log(`  ✓ ${configFile} (${totalEvents} 个活动)`);
                    }
                } else if (configFile.includes('news')) {
                    if (!config.publications || typeof config.publications !== 'object') {
                        this.errors.push(`${configFile}: publications字段缺失或格式错误`);
                    } else {
                        const totalPubs = Object.values(config.publications).reduce((sum, pubs) => 
                            sum + (Array.isArray(pubs) ? pubs.length : 0), 0);
                        console.log(`  ✓ ${configFile} (${totalPubs} 篇论文)`);
                    }
                }
                
            } catch (error) {
                this.errors.push(`${configFile}: JSON格式错误 - ${error.message}`);
            }
        }
        
        console.log('');
    }

    /**
     * 测试HTML文件
     */
    async testHTMLFiles() {
        console.log('📄 测试HTML文件...');
        
        const htmlFiles = this.findFiles(this.rootDir, '.html');
        
        for (const htmlFile of htmlFiles) {
            const relativePath = path.relative(this.rootDir, htmlFile);
            
            try {
                const content = fs.readFileSync(htmlFile, 'utf8');
                
                // 基本HTML结构检查
                if (!content.includes('<!DOCTYPE html>')) {
                    this.warnings.push(`${relativePath}: 缺少DOCTYPE声明`);
                }
                
                if (!content.includes('<html lang="zh-CN">')) {
                    this.warnings.push(`${relativePath}: 缺少中文语言声明`);
                }
                
                if (!content.includes('<meta charset="UTF-8">')) {
                    this.warnings.push(`${relativePath}: 缺少UTF-8编码声明`);
                }
                
                if (!content.includes('<meta name="viewport"')) {
                    this.warnings.push(`${relativePath}: 缺少viewport元标签`);
                }
                
                // 检查是否使用了组件系统
                if (relativePath !== 'templates/header.html' && relativePath !== 'templates/footer.html') {
                    if (!content.includes('component-loader.js')) {
                        this.warnings.push(`${relativePath}: 未使用组件系统`);
                    }
                }
                
                console.log(`  ✓ ${relativePath}`);
                
            } catch (error) {
                this.errors.push(`${relativePath}: 读取失败 - ${error.message}`);
            }
        }
        
        console.log('');
    }

    /**
     * 测试CSS文件
     */
    async testCSSFiles() {
        console.log('🎨 测试CSS文件...');
        
        const cssFiles = this.findFiles(path.join(this.rootDir, 'css'), '.css');
        
        for (const cssFile of cssFiles) {
            const relativePath = path.relative(this.rootDir, cssFile);
            
            try {
                const content = fs.readFileSync(cssFile, 'utf8');
                
                // 检查CSS变量使用
                if (content.includes('var(--') && !content.includes(':root')) {
                    this.warnings.push(`${relativePath}: 使用了CSS变量但未定义根变量`);
                }
                
                // 检查响应式设计
                if (!content.includes('@media')) {
                    this.warnings.push(`${relativePath}: 缺少响应式媒体查询`);
                }
                
                console.log(`  ✓ ${relativePath}`);
                
            } catch (error) {
                this.errors.push(`${relativePath}: 读取失败 - ${error.message}`);
            }
        }
        
        console.log('');
    }

    /**
     * 测试JavaScript文件
     */
    async testJSFiles() {
        console.log('📜 测试JavaScript文件...');
        
        const jsFiles = this.findFiles(path.join(this.rootDir, 'js'), '.js')
            .concat(this.findFiles(path.join(this.rootDir, 'components'), '.js'))
            .concat(this.findFiles(path.join(this.rootDir, 'scripts'), '.js'));
        
        for (const jsFile of jsFiles) {
            const relativePath = path.relative(this.rootDir, jsFile);
            
            try {
                const content = fs.readFileSync(jsFile, 'utf8');
                
                // 基本语法检查（简单）
                const openBraces = (content.match(/{/g) || []).length;
                const closeBraces = (content.match(/}/g) || []).length;
                
                if (openBraces !== closeBraces) {
                    this.warnings.push(`${relativePath}: 大括号不匹配`);
                }
                
                // 检查是否有基本的错误处理
                if (content.includes('fetch(') && !content.includes('catch')) {
                    this.warnings.push(`${relativePath}: fetch请求缺少错误处理`);
                }
                
                console.log(`  ✓ ${relativePath}`);
                
            } catch (error) {
                this.errors.push(`${relativePath}: 读取失败 - ${error.message}`);
            }
        }
        
        console.log('');
    }

    /**
     * 测试静态资源
     */
    async testAssets() {
        console.log('🖼️ 测试静态资源...');
        
        const assetsDir = path.join(this.rootDir, 'assets');
        if (!fs.existsSync(assetsDir)) {
            this.warnings.push('assets目录不存在');
            return;
        }
        
        const imageFiles = this.findFiles(path.join(assetsDir, 'images'), '.png')
            .concat(this.findFiles(path.join(assetsDir, 'images'), '.jpg'))
            .concat(this.findFiles(path.join(assetsDir, 'images'), '.jpeg'));
        
        const videoFiles = this.findFiles(path.join(assetsDir, 'video'), '.mp4');
        
        console.log(`  ✓ 图片文件: ${imageFiles.length} 个`);
        console.log(`  ✓ 视频文件: ${videoFiles.length} 个`);
        
        // 检查文件大小
        for (const file of [...imageFiles, ...videoFiles]) {
            const stats = fs.statSync(file);
            const sizeInMB = stats.size / (1024 * 1024);
            
            if (sizeInMB > 10) {
                this.warnings.push(`${path.relative(this.rootDir, file)}: 文件过大 (${sizeInMB.toFixed(2)}MB)`);
            }
        }
        
        console.log('');
    }

    /**
     * 递归查找文件
     */
    findFiles(dir, extension) {
        const files = [];
        
        if (!fs.existsSync(dir)) {
            return files;
        }
        
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const itemPath = path.join(dir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                files.push(...this.findFiles(itemPath, extension));
            } else if (item.endsWith(extension)) {
                files.push(itemPath);
            }
        }
        
        return files;
    }

    /**
     * 打印测试结果
     */
    printResults() {
        console.log('📊 测试结果汇总:');
        console.log('================');
        
        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log('🎉 所有测试通过！网站功能正常。');
        } else {
            if (this.errors.length > 0) {
                console.log(`\n❌ 发现 ${this.errors.length} 个错误:`);
                this.errors.forEach((error, index) => {
                    console.log(`  ${index + 1}. ${error}`);
                });
            }
            
            if (this.warnings.length > 0) {
                console.log(`\n⚠️ 发现 ${this.warnings.length} 个警告:`);
                this.warnings.forEach((warning, index) => {
                    console.log(`  ${index + 1}. ${warning}`);
                });
            }
            
            if (this.errors.length > 0) {
                console.log('\n请修复错误后重新测试。');
                process.exit(1);
            } else {
                console.log('\n✅ 基本功能正常，建议处理警告项以提升质量。');
            }
        }
    }
}

// 运行测试
if (require.main === module) {
    const tester = new WebsiteTester();
    tester.runTests();
}

module.exports = WebsiteTester;