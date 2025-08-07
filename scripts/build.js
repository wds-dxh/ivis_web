#!/usr/bin/env node

/**
 * 静态化构建脚本 - 解决动态组件加载问题
 * 功能：预渲染模板、优化资源、生成纯静态部署包
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class StaticBuilder {
    constructor() {
        this.rootDir = path.resolve(__dirname, '..');
        this.buildDir = path.join(this.rootDir, 'dist');
        this.sourceDir = this.rootDir;
        this.templates = {};
        this.fileHashes = new Map();
    }

    /**
     * 主构建流程
     */
    async build() {
        console.log('🚀 开始静态化构建...');
        
        try {
            // 1. 清理构建目录
            await this.cleanBuildDir();
            
            // 2. 加载模板文件
            await this.loadTemplates();
            
            // 3. 复制静态资源
            await this.copyStaticAssets();
            
            // 4. 处理CSS/JS文件（添加哈希）
            await this.processAssets();
            
            // 5. 预渲染HTML文件
            await this.prerenderHtmlFiles();
            
            // 6. 生成构建信息
            await this.generateBuildInfo();
            
            console.log('✅ 静态化构建完成！');
            console.log(`📦 构建文件位于: ${this.buildDir}`);
            console.log('🌐 可直接部署到nginx等静态服务器');
            
        } catch (error) {
            console.error('❌ 构建失败:', error.message);
            console.error(error.stack);
            process.exit(1);
        }
    }

    /**
     * 清理构建目录
     */
    async cleanBuildDir() {
        console.log('🧹 清理构建目录...');
        
        if (fs.existsSync(this.buildDir)) {
            await this.removeDir(this.buildDir);
        }
        
        fs.mkdirSync(this.buildDir, { recursive: true });
    }

    /**
     * 加载模板文件
     */
    async loadTemplates() {
        console.log('📄 加载模板文件...');
        
        const templateDir = path.join(this.sourceDir, 'templates');
        if (!fs.existsSync(templateDir)) {
            throw new Error('模板目录不存在: templates/');
        }

        // 加载页眉模板
        const headerPath = path.join(templateDir, 'header.html');
        if (fs.existsSync(headerPath)) {
            this.templates.header = fs.readFileSync(headerPath, 'utf8');
            console.log('  ✓ 加载 header.html');
        }

        // 加载页脚模板
        const footerPath = path.join(templateDir, 'footer.html');
        if (fs.existsSync(footerPath)) {
            this.templates.footer = fs.readFileSync(footerPath, 'utf8');
            console.log('  ✓ 加载 footer.html');
        }
    }

    /**
     * 复制静态资源
     */
    async copyStaticAssets() {
        console.log('📁 复制静态资源...');
        
        const assetDirs = ['assets', 'config'];
        
        for (const dir of assetDirs) {
            const sourcePath = path.join(this.sourceDir, dir);
            const targetPath = path.join(this.buildDir, dir);
            
            if (fs.existsSync(sourcePath)) {
                await this.copyRecursive(sourcePath, targetPath);
                console.log(`  ✓ 复制 ${dir}/`);
            }
        }
    }

    /**
     * 处理CSS/JS资源文件
     */
    async processAssets() {
        console.log('🎨 处理CSS/JS资源...');
        
        // 处理CSS文件
        await this.processCssFiles();
        
        // 处理JS文件
        await this.processJsFiles();
    }

    /**
     * 处理CSS文件
     */
    async processCssFiles() {
        const cssSourceDir = path.join(this.sourceDir, 'css');
        const cssTargetDir = path.join(this.buildDir, 'css');
        
        if (!fs.existsSync(cssSourceDir)) return;
        
        fs.mkdirSync(cssTargetDir, { recursive: true });
        
        const cssFiles = fs.readdirSync(cssSourceDir).filter(file => file.endsWith('.css'));
        
        for (const file of cssFiles) {
            const sourcePath = path.join(cssSourceDir, file);
            let content = fs.readFileSync(sourcePath, 'utf8');
            
            // 压缩CSS
            content = this.minifyCss(content);
            
            // 生成文件哈希
            const hash = this.generateFileHash(content);
            const fileName = file.replace('.css', `.${hash.substring(0, 8)}.css`);
            const targetPath = path.join(cssTargetDir, fileName);
            
            fs.writeFileSync(targetPath, content);
            this.fileHashes.set(`css/${file}`, `css/${fileName}`);
            
            console.log(`  ✓ 处理 ${file} -> ${fileName}`);
        }
    }

    /**
     * 处理JS文件
     */
    async processJsFiles() {
        const jsSourceDir = path.join(this.sourceDir, 'js');
        const jsTargetDir = path.join(this.buildDir, 'js');
        
        if (!fs.existsSync(jsSourceDir)) return;
        
        fs.mkdirSync(jsTargetDir, { recursive: true });
        
        const jsFiles = fs.readdirSync(jsSourceDir).filter(file => file.endsWith('.js'));
        
        for (const file of jsFiles) {
            const sourcePath = path.join(jsSourceDir, file);
            let content = fs.readFileSync(sourcePath, 'utf8');
            
            // 简单的JS压缩（移除注释和多余空白）
            content = this.minifyJs(content);
            
            // 生成文件哈希
            const hash = this.generateFileHash(content);
            const fileName = file.replace('.js', `.${hash.substring(0, 8)}.js`);
            const targetPath = path.join(jsTargetDir, fileName);
            
            fs.writeFileSync(targetPath, content);
            this.fileHashes.set(`js/${file}`, `js/${fileName}`);
            
            console.log(`  ✓ 处理 ${file} -> ${fileName}`);
        }

        // 复制components目录（但不添加哈希，因为构建后不再需要动态加载）
        const componentsSourceDir = path.join(this.sourceDir, 'components');
        const componentsTargetDir = path.join(this.buildDir, 'components');
        
        if (fs.existsSync(componentsSourceDir)) {
            await this.copyRecursive(componentsSourceDir, componentsTargetDir);
            console.log('  ✓ 复制 components/ (备用)');
        }
    }

    /**
     * 预渲染HTML文件
     */
    async prerenderHtmlFiles() {
        console.log('🔄 预渲染HTML文件...');
        
        // 处理根目录的index.html
        await this.prerenderHtmlFile('index.html', './');
        
        // 处理pages目录下的HTML文件
        const pagesDir = path.join(this.sourceDir, 'pages');
        if (fs.existsSync(pagesDir)) {
            await this.prerenderPagesDirectory(pagesDir, 'pages');
        }
    }

    /**
     * 递归处理pages目录
     */
    async prerenderPagesDirectory(sourceDir, relativePath) {
        const items = fs.readdirSync(sourceDir);
        
        for (const item of items) {
            const itemPath = path.join(sourceDir, item);
            const itemRelativePath = path.join(relativePath, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                // 创建目标目录
                const targetDir = path.join(this.buildDir, itemRelativePath);
                fs.mkdirSync(targetDir, { recursive: true });
                
                // 递归处理子目录
                await this.prerenderPagesDirectory(itemPath, itemRelativePath);
            } else if (item.endsWith('.html')) {
                // 预渲染HTML文件
                await this.prerenderHtmlFile(itemRelativePath, this.calculateBaseUrl(itemRelativePath));
            } else {
                // 复制其他文件
                const targetPath = path.join(this.buildDir, itemRelativePath);
                fs.copyFileSync(itemPath, targetPath);
            }
        }
    }

    /**
     * 预渲染单个HTML文件
     */
    async prerenderHtmlFile(relativePath, baseUrl) {
        const sourcePath = path.join(this.sourceDir, relativePath);
        const targetPath = path.join(this.buildDir, relativePath);
        
        if (!fs.existsSync(sourcePath)) return;
        
        let content = fs.readFileSync(sourcePath, 'utf8');
        
        // 确保目标目录存在
        const targetDir = path.dirname(targetPath);
        fs.mkdirSync(targetDir, { recursive: true });
        
        // 获取页面类型（用于导航激活状态）
        const pageType = this.getPageType(relativePath);
        
        // 替换页眉容器
        if (this.templates.header) {
            const processedHeader = this.processTemplate(this.templates.header, baseUrl, pageType);
            content = content.replace(
                /<div id="header-container"><\/div>/g,
                processedHeader
            );
        }
        
        // 替换页脚容器
        if (this.templates.footer) {
            const processedFooter = this.processTemplate(this.templates.footer, baseUrl, pageType);
            content = content.replace(
                /<div id="footer-container"><\/div>/g,
                processedFooter
            );
        }
        
        // 更新资源文件路径（应用哈希）
        content = this.updateAssetPaths(content, baseUrl);
        
        // 移除动态加载相关的脚本引用
        content = this.removeComponentLoaderScripts(content);
        
        fs.writeFileSync(targetPath, content);
        console.log(`  ✓ 预渲染 ${relativePath}`);
    }

    /**
     * 处理模板变量
     */
    processTemplate(template, baseUrl, pageType) {
        const navStates = this.getNavActiveStates(pageType);
        
        let processed = template;
        
        // 替换baseUrl
        processed = processed.replace(/\{\{baseUrl\}\}/g, baseUrl);
        
        // 替换导航激活状态
        Object.keys(navStates).forEach(key => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            processed = processed.replace(regex, navStates[key]);
        });
        
        return processed;
    }

    /**
     * 计算基础URL路径
     */
    calculateBaseUrl(relativePath) {
        if (relativePath === 'index.html' || relativePath === '') {
            return './';
        }
        
        const depth = relativePath.split('/').length - 1;
        return '../'.repeat(depth);
    }

    /**
     * 获取页面类型
     */
    getPageType(relativePath) {
        if (relativePath.includes('/research/')) return 'research';
        if (relativePath.includes('/communication/')) return 'communication';
        if (relativePath.includes('/news/')) return 'news';
        if (relativePath.includes('/directions/')) return 'directions';
        return 'home';
    }

    /**
     * 获取导航激活状态
     */
    getNavActiveStates(pageType) {
        return {
            homeActive: pageType === 'home' ? 'active' : '',
            researchActive: pageType === 'research' ? 'active' : '',
            communicationActive: pageType === 'communication' ? 'active' : '',
            newsActive: pageType === 'news' ? 'active' : '',
            directionsActive: pageType === 'directions' ? 'active' : ''
        };
    }

    /**
     * 更新资源文件路径
     */
    updateAssetPaths(content, baseUrl) {
        // 更新CSS文件路径 - 处理相对路径
        this.fileHashes.forEach((hashedPath, originalPath) => {
            if (originalPath.startsWith('css/')) {
                const fileName = path.basename(originalPath);
                // 处理不同的路径格式
                const patterns = [
                    new RegExp(`href="css/${fileName}"`, 'g'),
                    new RegExp(`href="../../css/${fileName}"`, 'g'),
                    new RegExp(`href="\\.\\.?/css/${fileName}"`, 'g')
                ];
                
                patterns.forEach(regex => {
                    content = content.replace(regex, `href="${baseUrl}${hashedPath}"`);
                });
            }
        });
        
        // 更新JS文件路径 - 处理相对路径
        this.fileHashes.forEach((hashedPath, originalPath) => {
            if (originalPath.startsWith('js/')) {
                const fileName = path.basename(originalPath);
                // 处理不同的路径格式
                const patterns = [
                    new RegExp(`src="js/${fileName}"`, 'g'),
                    new RegExp(`src="../../js/${fileName}"`, 'g'),
                    new RegExp(`src="\\.\\.?/js/${fileName}"`, 'g')
                ];
                
                patterns.forEach(regex => {
                    content = content.replace(regex, `src="${baseUrl}${hashedPath}"`);
                });
            }
        });
        
        return content;
    }

    /**
     * 移除组件加载器相关脚本
     */
    removeComponentLoaderScripts(content) {
        // 移除组件加载器脚本引用
        content = content.replace(/<script src="[^"]*component-loader\.js"><\/script>\s*/g, '');
        
        // 保留其他必要的脚本，但更新路径
        return content;
    }

    /**
     * 压缩CSS
     */
    minifyCss(content) {
        return content
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
            .replace(/\s+/g, ' ') // 压缩空白
            .replace(/;\s*}/g, '}') // 移除最后一个分号
            .replace(/\s*{\s*/g, '{') // 压缩大括号
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*,\s*/g, ',') // 压缩逗号
            .replace(/\s*:\s*/g, ':') // 压缩冒号
            .replace(/\s*;\s*/g, ';') // 压缩分号
            .trim();
    }

    /**
     * 简单的JS压缩
     */
    minifyJs(content) {
        return content
            .replace(/\/\*[\s\S]*?\*\//g, '') // 移除块注释
            .replace(/\/\/.*$/gm, '') // 移除行注释
            .replace(/\s+/g, ' ') // 压缩空白
            .replace(/\s*([{}();,])\s*/g, '$1') // 压缩操作符周围空白
            .trim();
    }

    /**
     * 生成文件哈希
     */
    generateFileHash(content) {
        return crypto.createHash('md5').update(content).digest('hex');
    }

    /**
     * 生成构建信息
     */
    async generateBuildInfo() {
        console.log('📋 生成构建信息...');
        
        const buildInfo = {
            buildTime: new Date().toISOString(),
            version: '1.0.0',
            environment: 'production',
            type: 'static',
            features: [
                '预渲染模板组件',
                '资源文件哈希',
                'CSS/JS压缩',
                '静态部署优化'
            ],
            files: await this.getFileList(this.buildDir),
            assetHashes: Object.fromEntries(this.fileHashes)
        };
        
        fs.writeFileSync(
            path.join(this.buildDir, 'build-info.json'),
            JSON.stringify(buildInfo, null, 2)
        );
        
        console.log('  ✓ 构建信息已生成');
    }

    /**
     * 递归复制文件/目录
     */
    async copyRecursive(source, target) {
        const stat = fs.statSync(source);
        
        if (stat.isDirectory()) {
            if (!fs.existsSync(target)) {
                fs.mkdirSync(target, { recursive: true });
            }
            
            const files = fs.readdirSync(source);
            for (const file of files) {
                if (this.shouldSkipFile(file)) continue;
                
                await this.copyRecursive(
                    path.join(source, file),
                    path.join(target, file)
                );
            }
        } else {
            fs.copyFileSync(source, target);
        }
    }

    /**
     * 递归删除目录
     */
    async removeDir(dir) {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            
            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                
                if (stat.isDirectory()) {
                    await this.removeDir(filePath);
                } else {
                    fs.unlinkSync(filePath);
                }
            }
            
            fs.rmdirSync(dir);
        }
    }

    /**
     * 获取文件列表
     */
    async getFileList(dir, fileList = []) {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                await this.getFileList(filePath, fileList);
            } else {
                fileList.push(path.relative(this.buildDir, filePath));
            }
        }
        
        return fileList;
    }

    /**
     * 判断是否跳过文件
     */
    shouldSkipFile(filename) {
        const skipPatterns = [
            '.DS_Store',
            'Thumbs.db',
            '.git',
            'node_modules',
            '.vscode',
            '.idea',
            '*.log',
            '*.tmp'
        ];
        
        return skipPatterns.some(pattern => {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace('*', '.*'));
                return regex.test(filename);
            }
            return filename === pattern;
        });
    }
}

// 运行构建
if (require.main === module) {
    const builder = new StaticBuilder();
    builder.build();
}

module.exports = StaticBuilder;