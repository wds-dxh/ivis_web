# 部署配置说明

## 服务器配置信息

根据您提供的Caddy配置，服务器部署路径已更新为：

### Caddy配置
- **端口**: 20005
- **根目录**: `/home/wds/workspace/static-site/ivis_web`
- **用户**: wds
- **访问地址**: `http://your-server-ip:20005`

### GitHub Actions部署配置

需要在GitHub仓库的Settings > Secrets中配置以下环境变量：

```
HOST=your-server-ip
USERNAME=wds
PRIVATE_KEY=your-ssh-private-key
PORT=22 (或您的SSH端口)
SITE_URL=http://your-server-ip:20005 (可选，用于健康检查)
```

### 本地部署脚本配置

部署脚本会自动创建 `deploy.config.json` 配置文件，生产环境配置已更新为：

```json
{
  "environments": {
    "production": {
      "type": "ssh",
      "host": "your-server-ip",
      "username": "wds",
      "remotePath": "/home/wds/workspace/static-site/ivis_web",
      "port": 22,
      "privateKeyPath": "~/.ssh/id_rsa"
    }
  }
}
```

### 部署命令

#### 使用GitHub Actions自动部署
推送代码到main分支会自动触发部署：
```bash
git add .
git commit -m "更新网站内容"
git push origin main
```

#### 使用本地部署脚本
```bash
# 构建项目
npm run build

# 部署到生产环境
node scripts/deploy.js production

# 或者使用npm脚本
npm run deploy:prod
```

### 部署流程

1. **构建检查**: 验证dist目录和构建文件
2. **备份创建**: 在服务器上创建当前版本备份
3. **文件传输**: 使用rsync同步文件到服务器
4. **权限设置**: 设置正确的文件权限
5. **服务重启**: 可选择重启Caddy服务器
6. **健康检查**: 验证网站是否正常访问

### 注意事项

1. **SSH密钥配置**: 确保SSH密钥已正确配置并可以无密码登录服务器
2. **目录权限**: 确保wds用户对目标目录有写权限
3. **Caddy配置**: 确保Caddy服务正在运行并监听20005端口
4. **防火墙设置**: 确保20005端口在服务器防火墙中已开放

### 故障排除

#### 部署失败常见原因
1. SSH连接失败 - 检查服务器IP、用户名、SSH密钥
2. 权限不足 - 检查目标目录权限
3. 磁盘空间不足 - 检查服务器磁盘空间
4. Caddy服务未运行 - 检查Caddy服务状态

#### 检查命令
```bash
# 检查Caddy服务状态
sudo systemctl status caddy

# 检查端口监听
sudo netstat -tlnp | grep :20005

# 检查目录权限
ls -la /home/wds/workspace/static-site/

# 测试SSH连接
ssh wds@your-server-ip
```

### 回滚操作

如果部署出现问题，可以快速回滚到备份版本：

```bash
# 在服务器上执行
cd /home/wds/workspace/static-site/
mv ivis_web ivis_web_failed
mv ivis_web_backup ivis_web
sudo systemctl reload caddy
```

---

**配置完成后，您的网站将可以通过 `http://your-server-ip:20005` 访问**