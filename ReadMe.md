# we-mp-rss 📡

> 基于 [rachelos/we-mp-rss](https://github.com/rachelos/we-mp-rss) 的定制版本，新增文章精选标记功能。

微信公众号 RSS 订阅器，支持通过微信读书授权登录，自动抓取公众号文章并生成 RSS 订阅源。

## ✨ 功能特性

### 基础功能（继承自原项目）

- 🔐 微信读书扫码登录，免抓包获取公众号授权
- 📰 公众号文章自动抓取与更新
- 📡 生成标准 RSS/Atom 订阅源
- 🌐 Web UI 管理界面（Vue 3 + Arco Design）
- 📥 文章收藏、已读标记
- 🔍 全文搜索
- 🐳 Docker 一键部署

### 定制功能

- 👍 **文章精选标记**：在文章列表中直接点击👍按钮标记精选，与已读/收藏/刷新操作并列
- 📋 **精选文章筛选**：支持按精选状态筛选文章，左侧"精选文章"栏目统一展示所有精选文章
- 🔄 **精选状态切换**：支持一键标记/取消精选
- 🏷️ **旧数据兼容**：原有的手动添加精选文章（通过虚拟公众号方式）已自动迁移至新的精选标记体系

## 🚀 快速部署

### Docker 部署（推荐）

```bash
# 拉取镜像
docker pull docker.1ms.run/rachelos/we-mp-rss:latest

# 启动容器
docker run -d \
  --name we-mp-rss \
  -p 8001:8001 \
  -v $(pwd)/data:/app/data \
  docker.1ms.run/rachelos/we-mp-rss:latest
```

访问 `http://localhost:8001` 即可使用。

### Docker Compose 部署

```bash
# 使用项目自带的 compose 配置
cd compose/
docker compose up -d
```

### 默认账号

- 用户名：`admin`
- 密码：`admin@123`

⚠️ 部署后请尽快修改默认密码。

## 📖 使用说明

1. **登录**：使用默认账号或微信读书扫码登录
2. **添加公众号**：在"订阅管理"中搜索并添加公众号
3. **阅读文章**：点击左侧公众号列表浏览文章
4. **标记精选**：点击文章操作栏的👍按钮即可标记精选
5. **查看精选**：点击左侧"精选文章"栏目查看所有精选文章，也可在筛选下拉中选择"精选"
6. **RSS 订阅**：在公众号详情中获取 RSS 订阅链接

## 🔧 定制功能详情

### 精选标记功能

本版本对原项目进行了以下修改：

#### 后端修改

- **`core/models/article.py`**：Article 模型新增 `is_featured` 字段（Integer, 0/1）
- **`apis/article.py`**：
  - 新增 `PUT /wx/articles/{id}/featured?is_featured=true/false` 接口
  - 文章列表接口新增 `only_featured` 查询参数
  - 响应数据新增 `is_featured` 字段

#### 前端修改

- **`api/article.ts`**：新增 `toggleArticleFeaturedStatus` API 调用函数
- **`ArticleListDesktop.vue`**：
  - 操作栏新增👍精选按钮（已精选时高亮显示）
  - 筛选下拉新增"精选"选项
  - 左侧"精选文章"栏目使用 `only_featured` 参数统一查询
  - 支持刷新精选文章列表

#### 数据库迁移

```sql
ALTER TABLE articles ADD COLUMN is_featured INTEGER DEFAULT 0;
CREATE INDEX ix_articles_is_featured ON articles (is_featured);
-- 迁移旧的精选文章数据
UPDATE articles SET is_featured=1 WHERE mp_id='MP_WXS_FEATURED_ARTICLES';
```

### 应用补丁

如果已有原项目部署，可通过 `patch/` 目录下的文件手动应用修改：

```bash
# 将补丁文件复制到容器中对应位置
docker cp patch/article.py we-mp-rss:/app/core/models/article.py
docker cp patch/apis_article.py we-mp-rss:/app/apis/article.py
# ... 其他文件
```

⚠️ 前端修改需要重新构建（容器内无 Node.js，需通过临时 Node 容器构建）。

## 📁 项目结构

```
├── apis/               # API 路由
├── core/               # 核心逻辑
│   ├── models/         # 数据模型
│   ├── wx/             # 微信相关
│   ├── lax/            # Lax 连接
│   ├── notice/         # 通知
│   ├── queue/          # 任务队列
│   └── task/           # 后台任务
├── driver/             # 驱动层
├── jobs/               # 定时任务
├── migrations/         # 数据库迁移
├── schemas/            # Pydantic Schema
├── static/             # 前端构建产物
├── views/              # 视图模板
├── web_ui/             # 前端源码（Vue 3 + Arco Design）
├── qtserver/           # Qt 服务端
├── patch/              # 定制补丁文件
├── main.py             # 应用入口
├── Dockerfile          # Docker 构建文件
└── requirements.txt    # Python 依赖
```

## ⚙️ 配置说明

复制 `config.example.yaml` 为 `config.yaml`，按需修改：

```yaml
# 基础配置
app:
  host: 0.0.0.0
  port: 8001

# 数据库
database:
  path: ./data/db.db
```

完整配置项请参考 `config.example.yaml`。

## 🛠️ 开发

### 前端开发

```bash
cd web_ui
yarn install
yarn dev      # 开发模式
yarn build    # 构建
```

### 后端开发

```bash
pip install -r requirements.txt
python main.py
```

## 📄 许可证

本项目基于原项目 [rachelos/we-mp-rss](https://github.com/rachelos/we-mp-rss) 修改，遵循原项目许可证。

## 🙏 致谢

- [rachelos/we-mp-rss](https://github.com/rachelos/we-mp-rss) - 原始项目
- [Arco Design Vue](https://arco.design/vue) - UI 组件库
