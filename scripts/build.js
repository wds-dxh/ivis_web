#!/usr/bin/env node

/**
 * 轻量级构建脚本 - 用于优化和准备部署文件
 * 功能：压缩CSS、优化图片、生成部署包
 */

const fs = require('fs');
const path = require('path');

class Builder {
    constructor() {
        this.rootDir = path.resolve(__dirname, '..');
        this.buildDir = path.join(this.rootDir, 'dist');
        this.sourceDir = this.rootDir;
    }

    /**
     * 主构建流程
     */
    async build() {
        console.log('🚀 开始构建项目...');
        
        try {
            // 1. 清理构建目录
            await this.cleanBuildDir();
            
            // 2. 复制文件
            await this.copyFiles();
            
            // 3. 优化CSS文件
            await this.optimizeCSS();
            
            // 4. 生成构建信息
            await this.generateBuildInfo();
            
            console.log('✅ 构建完成！');
            console.log(`📦 构建文件位于: ${this.buildDir}`);
            
        } catch (error) {
            console.error('❌ 构建失败:', error.message);
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
     * 复制文件到构建目录
     */
    async copyFiles() {
        console.log('📁 复制项目文件...');
        
        const filesToCopy = [
            'index.html',
            'pages/',
            'css/',
            'js/',
            'components/',
            'config/',
            'templates/',
            'assets/'
        ];
        
        for (const file of filesToCopy) {
            const sourcePath = path.join(this.sourceDir, file);
            const targetPath = path.join(this.buildDir, file);
            
            if (fs.existsSync(sourcePath)) {
                await this.copyRecursive(sourcePath, targetPath);
                console.log(`  ✓ 复制 ${file}`);
            }
        }
    }

    /**
     * 优化CSS文件
     */
    async optimizeCSS() {
        console.log('🎨 优化CSS文件...');
        
        const cssDir = path.join(this.buildDir, 'css');
        if (!fs.existsSync(cssDir)) return;
        
        const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
        
        for (const file of cssFiles) {
            const filePath = path.join(cssDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            
            // 简单的CSS压缩：移除注释和多余空白
            content = content
                .replace(/\/\*[\s\S]*?\*\//g, '') // 移除注释
                .replace(/\s+/g, ' ') // 压缩空白
                .replace(/;\s*}/g, '}') // 移除最后一个分号
                .replace(/\s*{\s*/g, '{') // 压缩大括号
                .replace(/\s*}\s*/g, '}')
                .replace(/\s*,\s*/g, ',') // 压缩逗号
                .replace(/\s*:\s*/g, ':') // 压缩冒号
                .replace(/\s*;\s*/g, ';') // 压缩分号
                .trim();
            
            fs.writeFileSync(filePath, content);
            console.log(`  ✓ 优化 ${file}`);
        }
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
            files: await this.getFileList(this.buildDir)
        };
        
        fs.writeFileSync(
            path.join(this.buildDir, 'build-info.json'),
            JSON.stringify(buildInfo, null, 2)
        );
        
        console.log(`  ✓ 构建信息已生成`);
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
                // 跳过不需要的文件
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
    const builder = new Builder();
    builder.build();
}

module.exports = Builder;