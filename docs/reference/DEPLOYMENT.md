# Discovery Agent 部署指南

> **架构变更日期**: 2025-10-10
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
└─ React 18

后端:
├─ Appwrite Database (PostgreSQL)
├─ Appwrite Storage (对象存储 - 未使用)
└─ Appwrite SDK (v21.0.0)

部署:
└─ Appwrite Sites (SSR模式，Node.js 22运行时)
```

### 数据架构

```
Appwrite Database (68e13b5500065b75783e)
└─ Collection: articles
   ├─ 71篇文章（从data/articles.json + data/content/*.md迁移）
   ├─ 包含：title, summary, content, category, tags等
   └─ 支持：三重分类体系（四维+v2.0+PESTEL）
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

创建 `.env` 文件：

```bash
# Appwrite 配置（公开，前端使用）
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://apps.aotsea.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT=68e13aa3003105476671

# Appwrite 管理员密钥（私密，仅服务端脚本使用）
APPWRITE_API_KEY=your_api_key_here

# Appwrite Database 配置
APPWRITE_DATABASE_ID=68e13b5500065b75783e
APPWRITE_COLLECTION_ARTICLES=articles
APPWRITE_COLLECTION_RAW_ARTICLES=raw_articles

# LLM 配置（AI内容生成脚本使用）
LLM_BASE_URL=https://llm.chutes.ai/v1
LLM_API_KEY=your_llm_key_here
MODEL_REASON=deepseek-ai/DeepSeek-R1
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 数据源

**本地开发使用Appwrite Database**（无需本地JSON文件）：
- 文章列表：从 `getArticles()` 获取
- 文章详情：从 `getArticleById(id)` 获取
- Markdown内容：存储在Database的 `content` 字段

**关键文件**：
- `lib/appwrite-client.ts` - Appwrite SDK客户端
- `lib/appwrite-data.ts` - 数据获取函数
- `lib/types.ts` - 数据类型定义

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
source .env

appwrite client \
  --endpoint "$NEXT_PUBLIC_APPWRITE_ENDPOINT" \
  --project-id "$NEXT_PUBLIC_APPWRITE_PROJECT" \
  --key "$APPWRITE_API_KEY"
```

#### 步骤3: 创建临时部署目录

```bash
# 创建临时目录
DEPLOY_DIR="/tmp/discovery-deploy"
mkdir -p "$DEPLOY_DIR"

# 复制源代码（排除大文件）
rsync -av --exclude='node_modules' \
  --exclude='.next' \
  --exclude='.git' \
  --exclude='test-results' \
  --exclude='data/articles.json' \
  --exclude='docs' \
  --exclude='tests' \
  . "$DEPLOY_DIR/"
```

#### 步骤4: 部署

```bash
cd "$DEPLOY_DIR"

appwrite sites create-deployment \
  --site-id discovery-agent \
  --code . \
  --activate true
```

#### 步骤5: 监控构建

```bash
# 获取Deployment ID后
appwrite sites get-deployment \
  --site-id discovery-agent \
  --deployment-id <DEPLOYMENT_ID>
```

---

### 方式3: GitHub自动化部署

> **注意**: 当前仓库在Gitea (gitea.aotsea.com)，需要镜像到GitHub才能使用此方式

#### 步骤1: 连接GitHub仓库

1. 推送代码到GitHub
2. 访问 Appwrite Console → Sites → discovery-agent
3. 点击 "Connect Git Repository"
4. 授权GitHub并选择仓库
5. 配置分支（main）和构建命令

#### 步骤2: 配置环境变量

在Appwrite Sites设置中添加环境变量：
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT`
- `APPWRITE_DATABASE_ID`
- 等

#### 步骤3: 自动部署

每次 `git push` 到main分支时自动触发部署。

---

## 环境变量配置

### 前端环境变量（NEXT_PUBLIC_*）

这些变量会打包到客户端JavaScript中，**可以公开**：

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://apps.aotsea.com/v1
NEXT_PUBLIC_APPWRITE_PROJECT=68e13aa3003105476671
```

### 服务端环境变量

这些变量**仅在服务端和脚本中使用，不会暴露给客户端**：

```bash
# Appwrite管理员密钥（用于数据迁移脚本）
APPWRITE_API_KEY=standard_xxx...

# 数据库配置
APPWRITE_DATABASE_ID=68e13b5500065b75783e
APPWRITE_COLLECTION_ARTICLES=articles

# AI服务配置
LLM_API_KEY=xxx
```

### Appwrite Sites环境变量配置

**方式1: Web控制台**
1. 访问 https://apps.aotsea.com/console
2. 项目 → Sites → discovery-agent → Settings → Variables
3. 添加环境变量

**方式2: CLI命令**
```bash
appwrite sites create-variable \
  --site-id discovery-agent \
  --key "NEXT_PUBLIC_APPWRITE_ENDPOINT" \
  --value "https://apps.aotsea.com/v1"
```

---

## 常见问题

### Q1: 本地开发显示"暂无该分类下的文章"

**原因**: Appwrite数据类型不一致（tags存储为数组但代码尝试JSON.parse）

**解决方案**: 已通过 `safeParse()` 函数修复（lib/appwrite-data.ts:19-32）

---

### Q2: 部署失败：文件过大

**原因**: 项目包含node_modules、.next等大文件（874MB）

**解决方案**:
- 使用部署脚本（自动排除大文件）
- 手动创建临时目录并排除不必要文件

---

### Q3: 部署后环境变量未生效

**检查步骤**:
1. 确认环境变量已在Appwrite Sites设置中配置
2. 重新部署触发构建
3. 检查变量名是否正确（NEXT_PUBLIC_前缀）

---

### Q4: 如何查看部署日志？

**方式1: CLI**
```bash
appwrite sites get-deployment \
  --site-id discovery-agent \
  --deployment-id <DEPLOYMENT_ID>
```

**方式2: Web控制台**
访问: https://apps.aotsea.com/console/project-68e13aa3003105476671/sites/discovery-agent

---

### Q5: 本地开发和生产环境数据不一致

**数据来源**：
- **本地 & 生产** 都使用 Appwrite Database
- 数据库：`68e13b5500065b75783e`
- 集合：`articles`（71篇文章）

**注意**：
- 不再使用 `data/articles.json` 和 `data/content/*.md`
- 数据修改需通过 Appwrite Console 或迁移脚本

---

## 访问地址

- **生产环境**: http://discovery.sites.apps.aotsea.com
- **Appwrite Console**: https://apps.aotsea.com/console
- **项目ID**: 68e13aa3003105476671
- **站点ID**: discovery-agent

---

## 相关文档

- [README.md](./README.md) - 项目概览
- [APPWRITE_MIGRATION_PLAN.md](./docs/APPWRITE_MIGRATION_PLAN.md) - 迁移计划
- [APPWRITE_OPERATIONS.md](./docs/appwrite/APPWRITE_OPERATIONS.md) - 操作手册

---

**最后更新**: 2025-10-10
**维护者**: Discovery Team
