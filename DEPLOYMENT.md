# GECOM智能成本助手 部署指南

> **架构日期**: 2025-11-07
> **当前架构**: Next.js 14 + Appwrite BaaS + Appwrite Sites (SSR)

---

## 📋 目录

1. [架构概览](#架构概览)
2. [本地开发](#本地开发)
3. [部署到Appwrite Sites](#部署到appwrite-sites)
4. [环境变量配置](#环境变量配置)
5. [常见问题](#常见问题)

---

## 架构概览

### 技术栈

```
前端:
├─ Next.js 14 (App Router + Server Components)
├─ TypeScript (严格模式)
├─ Tailwind CSS + shadcn/ui
└─ React 18 + Recharts

后端:
├─ Appwrite Database (PostgreSQL)
├─ Appwrite Storage (对象存储 - 备用)
└─ Appwrite SDK (v21.0.0+)

AI服务:
├─ DeepSeek-R1 (推理对话)
└─ DeepSeek-V3 (工具调用)

部署:
└─ Appwrite Sites (SSR模式，Node.js 22运行时)
```

### 数据架构

```
Appwrite Database (690d4fdd0035c2f63f20)
├─ Collection: projects
│  ├─ 用户项目基本信息
│  └─ 字段: id, userId, name, industry, targetCountry, salesChannel
│
└─ Collection: calculations
   ├─ 成本计算结果存储
   └─ 字段: id, projectId, scope (json), costResult (json), version
```

---

## 本地开发

### 前置要求

- Node.js 18+
- npm 或 pnpm
- Appwrite账号（https://apps.aotsea.com）

### 安装依赖

```bash
npm install
```

### 环境变量配置

创建 `.env.local` 文件：

```bash
# 复制示例配置
cp .env.example .env.local
```

**最小配置**（仅AI功能）：
```bash
LLM_BASE_URL=https://llm.chutes.ai/v1
LLM_API_KEY=cpk_513bbeacccc54947a01e753e42a9e5f3.0ff351163a135c8687662b0c073a786a.vhDBL1gTsrSjlsAiWQjdf3bxOHAhXv8h
MODEL_REASON=deepseek-ai/DeepSeek-R1
LLM_PROVIDER=deepseek
```

**完整配置**（包含数据持久化）：
```bash
# AI服务
LLM_BASE_URL=https://llm.chutes.ai/v1
LLM_API_KEY=cpk_513bbeacccc54947a01e753e42a9e5f3.0ff351163a135c8687662b0c073a786a.vhDBL1gTsrSjlsAiWQjdf3bxOHAhXv8h
MODEL_REASON=deepseek-ai/DeepSeek-R1
MODEL_TOOLCALL=deepseek-ai/DeepSeek-V3
LLM_PROVIDER=deepseek

# Appwrite配置（前端）
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://apps.aotsea.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT=690d4f580002dcbcb575
NEXT_PUBLIC_APPWRITE_DATABASE=690d4fdd0035c2f63f20
NEXT_PUBLIC_APPWRITE_COLLECTION_PROJECTS=projects
NEXT_PUBLIC_APPWRITE_COLLECTION_CALCULATIONS=calculations

# Appwrite配置（服务端）
APPWRITE_API_KEY=standard_050c6ae6a2d7e3bd394a10b68d447bef450f076cf508d2f8ea42dff322a7f56b92674cf4ffbc6cac352606a22f647aa35db8434b485dead73e569e7c6a62feb228443c5dc5d57ac44549654450e34cfa5984536455474573f3c34a9bcd1c4eae596fc1b91287c7dbc56c26dcd3ce6d57f58d22baec52bf90baff0b947e37cece
APPWRITE_DATABASE_ID=690d4fdd0035c2f63f20
APPWRITE_COLLECTION_PROJECTS_ID=projects
APPWRITE_COLLECTION_CALCULATIONS_ID=calculations
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 数据源

**使用Appwrite Database作为数据源**：
- 项目列表：从 `getProjects()` 获取
- 项目详情：从 `getProjectById(id)` 获取
- 计算结果：存储在Database的 `calculations` collection

**关键文件**：
- `lib/appwrite-client.ts` - Appwrite SDK客户端
- `lib/appwrite-data.ts` - 数据获取函数
- `types/gecom.ts` - 数据类型定义

---

## 部署到Appwrite Sites

### 方式1: 自动化脚本部署（推荐）

```bash
# 运行部署脚本
./scripts/deploy-to-appwrite.sh
```

**脚本功能**：
1. ✅ 检查环境变量
2. ✅ 配置Appwrite CLI
3. ✅ 创建临时部署目录（排除node_modules、.next等）
4. ✅ 上传代码到Appwrite
5. ✅ 监控构建状态
6. ✅ 自动清理临时文件

**预计时间**: 3-5分钟（包含npm install + npm run build）

---

### 方式2: 手动CLI部署

#### 步骤1: 安装Appwrite CLI

```bash
npm install -g appwrite
```

#### 步骤2: 配置CLI

```bash
source .env.local

appwrite client \
  --endpoint "$NEXT_PUBLIC_APPWRITE_ENDPOINT" \
  --project-id "$NEXT_PUBLIC_APPWRITE_PROJECT" \
  --key "$APPWRITE_API_KEY"
```

#### 步骤3: 创建临时部署目录

```bash
# 创建临时目录
DEPLOY_DIR="/tmp/gecom-deploy-$(date +%s)"
mkdir -p "$DEPLOY_DIR"

# 复制源代码（排除大文件）
rsync -av --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='test-results' \
  --exclude='.env.local' \
  --exclude='docs/reference' \
  --exclude='docs/archive' \
  . "$DEPLOY_DIR/"

echo "✅ 临时部署目录创建完成: $DEPLOY_DIR"
```

#### 步骤4: 部署

```bash
cd "$DEPLOY_DIR"

appwrite sites create-deployment \
  --site-id gecom-assistant \
  --code . \
  --activate true
```

**输出示例**：
```
✓ Deployment created successfully
  Deployment ID: 673d2e8a002f1c8e3d9b
  Status: Building
  URL: https://gecom-assistant.apps.aotsea.com
```

#### 步骤5: 监控构建

```bash
# 获取Deployment ID后
appwrite sites get-deployment \
  --site-id gecom-assistant \
  --deployment-id <DEPLOYMENT_ID>
```

**构建状态**：
- `building` - 正在构建
- `ready` - 部署成功
- `failed` - 部署失败

---

### 方式3: GitHub自动化部署

> **注意**: 当前仓库在Gitea，需要镜像到GitHub才能使用此方式

#### 步骤1: 连接GitHub仓库

1. 推送代码到GitHub
2. 访问 Appwrite Console → Sites → gecom-assistant
3. 点击 "Connect Git Repository"
4. 授权GitHub并选择仓库
5. 配置分支（main或claude/xxx）和构建命令

#### 步骤2: 配置环境变量

在Appwrite Sites设置中添加环境变量：
- `LLM_BASE_URL`
- `LLM_API_KEY`
- `MODEL_REASON`
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT`
- 等

#### 步骤3: 自动部署

每次 `git push` 到配置分支时自动触发部署。

---

## 环境变量配置

### 前端环境变量（NEXT_PUBLIC_*）

这些变量会打包到客户端JavaScript中，**可以公开**：

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://apps.aotsea.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT=690d4f580002dcbcb575
NEXT_PUBLIC_APPWRITE_DATABASE=690d4fdd0035c2f63f20
NEXT_PUBLIC_APPWRITE_COLLECTION_PROJECTS=projects
NEXT_PUBLIC_APPWRITE_COLLECTION_CALCULATIONS=calculations
```

### 服务端环境变量

这些变量**仅在服务端使用，不会暴露给客户端**：

```bash
# DeepSeek AI服务
LLM_BASE_URL=https://llm.chutes.ai/v1
LLM_API_KEY=cpk_513bbeacccc54947a01e753e42a9e5f3...
MODEL_REASON=deepseek-ai/DeepSeek-R1
MODEL_TOOLCALL=deepseek-ai/DeepSeek-V3
LLM_PROVIDER=deepseek

# Appwrite管理员密钥（用于服务端操作）
APPWRITE_API_KEY=standard_050c6ae6a2d7e3bd394a10b68d447bef...
APPWRITE_DATABASE_ID=690d4fdd0035c2f63f20
APPWRITE_COLLECTION_PROJECTS_ID=projects
APPWRITE_COLLECTION_CALCULATIONS_ID=calculations

# 可选配置
UNSPLASH_ACCESS_KEY=b8xl0xVUL9DH2xbOOq0szT6bFZqUZbqp98HXvdv-h6E
```

### Appwrite Sites环境变量配置

**方式1: Web控制台**
1. 访问 https://apps.aotsea.com/console
2. 项目 → Sites → gecom-assistant → Settings → Variables
3. 添加环境变量

**方式2: CLI命令**
```bash
appwrite sites create-variable \
  --site-id gecom-assistant \
  --key "LLM_API_KEY" \
  --value "cpk_513bbeacccc54947a01e753e42a9e5f3..."
```

---

## 常见问题

### Q1: 本地开发时AI助手无响应

**原因**: DeepSeek API配置错误或网络问题

**解决方案**:
1. 检查 `.env.local` 中的 `LLM_BASE_URL` 和 `LLM_API_KEY`
2. 验证网络连接：
   ```bash
   curl -X POST https://llm.chutes.ai/v1/chat/completions \
     -H "Authorization: Bearer $LLM_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"deepseek-ai/DeepSeek-R1","messages":[{"role":"user","content":"test"}]}'
   ```
3. 查看浏览器控制台错误日志

---

### Q2: 部署失败：文件过大

**原因**: 项目包含node_modules、.next等大文件

**解决方案**:
- 使用部署脚本（自动排除大文件）
- 手动创建临时目录并使用rsync排除：
  ```bash
  rsync -av --exclude='node_modules' --exclude='.next' --exclude='.git' . /tmp/deploy/
  ```

---

### Q3: 部署后环境变量未生效

**检查步骤**:
1. 确认环境变量已在Appwrite Sites设置中配置
2. 重新部署触发构建（环境变量变更需要重新构建）
3. 检查变量名是否正确（`NEXT_PUBLIC_`前缀）
4. 查看构建日志确认环境变量加载

**验证方法**:
```bash
# 在部署后的应用中查看（仅NEXT_PUBLIC_变量）
console.log(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
```

---

### Q4: 如何查看部署日志？

**方式1: CLI**
```bash
appwrite sites get-deployment \
  --site-id gecom-assistant \
  --deployment-id <DEPLOYMENT_ID>
```

**方式2: Web控制台**
访问: https://apps.aotsea.com/console/project-690d4f580002dcbcb575/sites/gecom-assistant

---

### Q5: Appwrite Database连接错误

**原因**: Database ID或Collection ID配置错误

**解决方案**:
1. 确认Database ID: `690d4fdd0035c2f63f20`
2. 确认Collection存在：
   - `projects`
   - `calculations`
3. 验证API Key权限（需要Database读写权限）
4. 查看Appwrite Console → Database → Collections

---

### Q6: 构建失败：TypeScript错误

**常见原因**:
- 类型定义缺失
- Appwrite SDK版本不兼容

**解决方案**:
```bash
# 安装最新依赖
npm install appwrite@latest

# 检查类型错误
npm run build

# 查看详细错误
npx tsc --noEmit
```

---

### Q7: 如何回滚到上一个版本？

**CLI方式**:
```bash
# 列出所有部署
appwrite sites list-deployments --site-id gecom-assistant

# 激活旧版本
appwrite sites update-deployment \
  --site-id gecom-assistant \
  --deployment-id <OLD_DEPLOYMENT_ID> \
  --activate true
```

**Web控制台方式**:
1. 访问 Sites → gecom-assistant → Deployments
2. 找到目标版本
3. 点击 "Activate"

---

## 部署脚本示例

创建 `scripts/deploy-to-appwrite.sh`：

```bash
#!/bin/bash
set -e

echo "🚀 开始部署GECOM智能成本助手到Appwrite Sites"

# 检查环境变量
if [ ! -f ".env.local" ]; then
  echo "❌ 错误: .env.local 文件不存在"
  exit 1
fi

source .env.local

# 检查必需变量
if [ -z "$APPWRITE_API_KEY" ]; then
  echo "❌ 错误: APPWRITE_API_KEY 未设置"
  exit 1
fi

# 配置Appwrite CLI
echo "📝 配置Appwrite CLI"
appwrite client \
  --endpoint "$NEXT_PUBLIC_APPWRITE_ENDPOINT" \
  --project-id "$NEXT_PUBLIC_APPWRITE_PROJECT" \
  --key "$APPWRITE_API_KEY"

# 创建临时目录
DEPLOY_DIR="/tmp/gecom-deploy-$(date +%s)"
echo "📦 创建临时部署目录: $DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# 复制文件（排除大文件）
echo "📂 复制项目文件"
rsync -av \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='test-results' \
  --exclude='.env.local' \
  --exclude='docs/reference' \
  --exclude='docs/archive' \
  . "$DEPLOY_DIR/"

# 进入临时目录
cd "$DEPLOY_DIR"

# 部署
echo "🚀 开始部署"
DEPLOYMENT_ID=$(appwrite sites create-deployment \
  --site-id gecom-assistant \
  --code . \
  --activate true \
  --json | jq -r '.$id')

echo "✅ 部署已创建"
echo "   Deployment ID: $DEPLOYMENT_ID"
echo "   监控地址: https://apps.aotsea.com/console"

# 清理临时文件
echo "🧹 清理临时文件"
cd -
rm -rf "$DEPLOY_DIR"

echo "✅ 部署完成！"
```

---

## 访问地址

- **生产环境**: https://gecom-assistant.apps.aotsea.com
- **Appwrite Console**: https://apps.aotsea.com/console
- **项目ID**: 690d4f580002dcbcb575
- **数据库ID**: 690d4fdd0035c2f63f20
- **站点ID**: gecom-assistant

---

## 相关文档

- [README.md](./README.md) - 项目概览
- [.env.example](./.env.example) - 环境变量配置说明
- [Appwrite文档](https://appwrite.io/docs)
- [DeepSeek API文档](https://platform.deepseek.com/docs)

---

**最后更新**: 2025-11-07
**维护者**: GECOM Team
**部署版本**: v1.0 (MVP)
