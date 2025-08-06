#!/usr/bin/env node

/**
 * 部署脚本 - 用于将构建后的文件部署到服务器
 * 支持多种部署方式：SSH、FTP、本地复制等
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class Deployer {
    constructor() {
        this.rootDir = path.resolve(__dirname, '..');
        this.buildDir = path.join(this.rootDir, 'dist');
        this.configFile = path.join(this.rootDir, 'deploy.config.json');
        this.config = this.loadConfig();
    }

    /**
     * 加载部署配置
     */
    loadConfig() {
        if (!fs.existsSync(this.configFile)) {
            console.log('📝 创建默认部署配置文件...');
            this.createDefaultConfig();
        }
        
        try {
            const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
            return config;
        } catch (error) {
            console.error('❌ 读取部署配置失败:', error.message);
            process.exit(1);
        }
    }

    /**
     * 创建默认配置文件
     */
    createDefaultConfig() {
        const defaultConfig = {
            "environments": {
                "production": {
                    "type": "ssh",
                    "host": "your-server.com",
                    "username": "deploy",
                    "remotePath": "/var/www/html",
                    "port": 22,
                    "privateKeyPath": "~/.ssh/id_rsa"
                },
                "staging": {
                    "type": "local",
                    "targetPath": "../staging-deploy"
                }
            },
            "defaultEnvironment": "staging",
            "excludeFiles": [
                "*.log",
                "*.tmp",
                ".DS_Store",
                "Thumbs.db"
            ],
            "backupBeforeDeploy": true,
            "deployHooks": {
                "beforeDeploy": [],
                "afterDeploy": []
            }
        };
        
        fs.writeFileSync(this.configFile, JSON.stringify(defaultConfig, null, 2));
        console.log(`✅ 默认配置已创建: ${this.configFile}`);
        console.log('请根据实际情况修改配置文件后重新运行部署命令');
    }

    /**
     * 主部署流程
     */
    async deploy(environment = null) {
        const env = environment || this.config.defaultEnvironment;
        const envConfig = this.config.environments[env];
        
        if (!envConfig) {
            console.error(`❌ 未找到环境配置: ${env}`);
            process.exit(1);
        }
        
        console.log(`🚀 开始部署到 ${env} 环境...`);
        
        try {
            // 1. 检查构建文件
            await this.checkBuildFiles();
            
            // 2. 执行部署前钩子
            await this.runHooks('beforeDeploy');
            
            // 3. 备份（如果需要）
            if (this.config.backupBeforeDeploy) {
                await this.createBackup(envConfig);
            }
            
            // 4. 执行部署
            await this.performDeploy(envConfig);
            
            // 5. 执行部署后钩子
            await this.runHooks('afterDeploy');
            
            console.log('✅ 部署完成！');
            
        } catch (error) {
            console.error('❌ 部署失败:', error.message);
            process.exit(1);
        }
    }

    /**
     * 检查构建文件
     */
    async checkBuildFiles() {
        console.log('📋 检查构建文件...');
        
        if (!fs.existsSync(this.buildDir)) {
            console.error('❌ 构建目录不存在，请先运行构建命令');
            process.exit(1);
        }
        
        const buildInfo = path.join(this.buildDir, 'build-info.json');
        if (fs.existsSync(buildInfo)) {
            const info = JSON.parse(fs.readFileSync(buildInfo, 'utf8'));
            console.log(`  ✓ 构建版本: ${info.version}`);
            console.log(`  ✓ 构建时间: ${info.buildTime}`);
            console.log(`  ✓ 文件数量: ${info.files.length}`);
        }
    }

    /**
     * 执行部署钩子
     */
    async runHooks(hookType) {
        const hooks = this.config.deployHooks[hookType] || [];
        
        if (hooks.length === 0) return;
        
        console.log(`🔧 执行 ${hookType} 钩子...`);
        
        for (const hook of hooks) {
            try {
                console.log(`  执行: ${hook}`);
                execSync(hook, { cwd: this.rootDir, stdio: 'inherit' });
            } catch (error) {
                console.error(`  ❌ 钩子执行失败: ${hook}`);
                throw error;
            }
        }
    }

    /**
     * 创建备份
     */
    async createBackup(envConfig) {
        console.log('💾 创建备份...');
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `backup-${timestamp}`;
        
        if (envConfig.type === 'local') {
            const backupPath = path.join(path.dirname(envConfig.targetPath), backupName);
            if (fs.existsSync(envConfig.targetPath)) {
                await this.copyRecursive(envConfig.targetPath, backupPath);
                console.log(`  ✓ 本地备份已创建: ${backupPath}`);
            }
        } else if (envConfig.type === 'ssh') {
            // SSH备份逻辑
            console.log('  ✓ SSH备份功能需要根据具体服务器环境实现');
        }
    }

    /**
     * 执行部署
     */
    async performDeploy(envConfig) {
        console.log('📤 开始文件传输...');
        
        switch (envConfig.type) {
            case 'local':
                await this.deployLocal(envConfig);
                break;
            case 'ssh':
                await this.deploySSH(envConfig);
                break;
            case 'ftp':
                await this.deployFTP(envConfig);
                break;
            default:
                throw new Error(`不支持的部署类型: ${envConfig.type}`);
        }
    }

    /**
     * 本地部署
     */
    async deployLocal(envConfig) {
        console.log('📁 执行本地部署...');
        
        const targetPath = path.resolve(this.rootDir, envConfig.targetPath);
        
        // 清理目标目录
        if (fs.existsSync(targetPath)) {
            await this.removeDir(targetPath);
        }
        
        // 复制文件
        await this.copyRecursive(this.buildDir, targetPath);
        
        console.log(`  ✓ 文件已复制到: ${targetPath}`);
    }

    /**
     * SSH部署
     */
    async deploySSH(envConfig) {
        console.log('🔐 执行SSH部署...');
        
        const { host, username, remotePath, port = 22, privateKeyPath } = envConfig;
        
        try {
            // 使用rsync进行文件同步
            const rsyncCmd = [
                'rsync',
                '-avz',
                '--delete',
                `-e "ssh -p ${port} -i ${privateKeyPath}"`,
                `${this.buildDir}/`,
                `${username}@${host}:${remotePath}/`
            ].join(' ');
            
            console.log(`  执行命令: ${rsyncCmd}`);
            execSync(rsyncCmd, { stdio: 'inherit' });
            
            console.log(`  ✓ 文件已同步到: ${username}@${host}:${remotePath}`);
            
        } catch (error) {
            console.error('  ❌ SSH部署失败，请检查：');
            console.error('    - SSH密钥配置是否正确');
            console.error('    - 服务器连接是否正常');
            console.error('    - rsync命令是否可用');
            throw error;
        }
    }

    /**
     * FTP部署
     */
    async deployFTP(envConfig) {
        console.log('📡 FTP部署功能需要安装额外依赖包');
        console.log('请运行: npm install ftp --save-dev');
        throw new Error('FTP部署功能暂未实现');
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
                if (this.shouldExcludeFile(file)) continue;
                
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
     * 判断是否排除文件
     */
    shouldExcludeFile(filename) {
        const excludePatterns = this.config.excludeFiles || [];
        
        return excludePatterns.some(pattern => {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace('*', '.*'));
                return regex.test(filename);
            }
            return filename === pattern;
        });
    }
}

// 命令行参数处理
if (require.main === module) {
    const args = process.argv.slice(2);
    const environment = args[0];
    
    const deployer = new Deployer();
    deployer.deploy(environment);
}

module.exports = Deployer;