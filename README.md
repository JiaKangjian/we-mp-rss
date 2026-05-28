<div align=center>
<img src="static/logo.svg" alt="We-MP-RSS Logo" width="20%">
<h1>WeRSS - 微信公众号 RSS 订阅助手（精选增强版）</h1>

[![Python Version](https://img.shields.io/badge/python-3.13.1+-red.svg)]()
[![License](https://img.shields.io/badge/license-MIT-green.svg)]()

基于 [rachelos/we-mp-rss](https://github.com/rachelos/we-mp-rss) 定制，新增文章精选标记功能。
</div>

---

## 与原项目的区别

本版本在原项目基础上新增了以下功能：

| 功能 | 说明 |
|------|------|
| **精选标记** | 文章列表操作栏新增精选按钮，与已读/收藏/刷新并列 |
| **精选筛选** | 筛选下拉新增"精选"选项，可快速过滤精选文章 |
| **精选栏目** | 左侧"精选文章"栏目统一展示所有精选文章（含手动添加和标记精选） |
| **状态切换** | 支持一键标记/取消精选，精选状态下按钮高亮 |
| **旧数据兼容** | 原有的手动添加精选文章已自动迁移至新精选标记体系 |

---

## 快速部署

> **重要**：本版本必须从源码构建镜像，**不能**使用原作者的 `rachelos/we-mp-rss:latest` 镜像，否则没有精选功能。

### 方式一：Docker 从源码构建（推荐）

```bash
# 1. 克隆本项目
git clone https://github.com/JiaKangjian/we-mp-rss.git
cd we-mp-rss

# 2. 构建自定义镜像（首次构建约 10-20 分钟）
docker build -t we-mp-rss-custom:latest .

# 3. 启动容器
docker run -d \
  --name we-mp-rss \
  -p 8001:8001 \
  -v ./data:/app/data \
  we-mp-rss-custom:latest
```

访问 `http://localhost:8001` 即可使用。

> **关于数据库迁移**：首次启动时，程序会自动执行数据库初始化（创建表结构、同步字段变更、创建默认管理员账号），**无需手动执行任何数据库迁移命令**。启动参数中的 `-init True` 会触发 `DatabaseSynchronizer` 自动完成所有表结构同步，包括新增的 `is_featured` 字段。

### 方式二：Docker Compose

```bash
# 1. 克隆本项目
git clone https://github.com/JiaKangjian/we-mp-rss.git
cd we-mp-rss

# 2. 使用项目内置的 compose 文件构建并启动
docker compose -f compose/docker-compose-sqlite.yaml up -d --build
```

> 首次启动时程序会自动完成数据库初始化，无需手动干预。

### 默认账号

| 项目 | 值 |
|------|-----|
| 用户名 | `admin` |
| 密码 | `admin@123` |

部署后请尽快修改默认密码。

### 版本升级

```bash
cd we-mp-rss
git pull origin main
docker build -t we-mp-rss-custom:latest .
docker stop we-mp-rss
docker rm we-mp-rss
docker run -d \
  --name we-mp-rss \
  -p 8001:8001 \
  -v ./data:/app/data \
  we-mp-rss-custom:latest
```

数据保存在 `./data/` 目录中，不会因容器重建而丢失。

---

## 本地开发部署（不使用 Docker）

### 环境要求

- Python >= 3.13.1
- Node.js >= 20.18.3（仅前端开发需要）
- Git

### 后端启动

```bash
# 1. 克隆项目
git clone https://github.com/JiaKangjian/we-mp-rss.git
cd we-mp-rss

# 2. 安装 Python 依赖
pip install -r requirements.txt

# 3. 复制配置文件
# Windows:
copy config.example.yaml config.yaml
# Linux/macOS:
cp config.example.yaml config.yaml

# 4. 启动服务（-init True 初始化数据库，-job True 启用定时任务）
python main.py -job True -init True
```

服务启动后访问 `http://localhost:8001`。

> 如果需要使用内容采集功能（`gather.content: True`），还需安装 Playwright 浏览器：
> ```bash
> playwright install webkit
> ```

### 前端开发

```bash
cd web_ui
yarn install
yarn dev      # 开发模式，访问 http://localhost:3000
yarn build    # 构建生产版本，产物输出到 static/
```

> 前端修改后需重新 `yarn build`，构建产物在 `static/` 目录中。Dockerfile 不会在构建时编译前端，而是直接使用已有的 `static/` 目录。

---

## 使用说明

1. **登录**：使用默认账号或微信读书扫码登录
2. **添加公众号**：在"订阅管理"中搜索并添加公众号
3. **阅读文章**：点击左侧公众号列表浏览文章
4. **标记精选**：点击文章操作栏的精选按钮即可标记精选，再次点击取消
5. **查看精选**：点击左侧"精选文章"栏目查看所有精选文章，也可在筛选下拉中选择"精选"
6. **RSS 订阅**：在公众号详情中获取 RSS 订阅链接，配合阅读器使用

---

## 精选功能技术实现

### 后端修改

- **`core/models/article.py`**：Article 模型新增 `is_featured` 字段（Integer, 0/1）
- **`apis/article.py`**：
  - 新增 `PUT /wx/articles/{id}/featured?is_featured=true/false` 接口
  - 文章列表接口新增 `only_featured` 查询参数
  - 响应数据新增 `is_featured` 字段

### 前端修改

- **`web_ui/src/api/article.ts`**：新增 `toggleArticleFeaturedStatus` API 函数
- **`web_ui/src/views/article/ArticleListDesktop.vue`**：
  - 操作栏新增精选按钮（已精选时高亮）
  - 筛选下拉新增"精选"选项
  - 左侧"精选文章"栏目使用 `only_featured` 参数统一查询
  - 精选文章页面支持刷新

### 数据库迁移说明

精选功能的 `is_featured` 字段由 `DatabaseSynchronizer` 在首次启动时自动同步，无需手动执行 SQL。如需手动迁移，可参考以下 SQL：

```sql
ALTER TABLE articles ADD COLUMN is_featured INTEGER DEFAULT 0;
CREATE INDEX ix_articles_is_featured ON articles (is_featured);
```

---

## 项目结构

```
├── apis/               # API 路由
├── core/               # 核心逻辑
│   ├── models/         # 数据模型（含 is_featured 字段）
│   ├── wx/             # 微信相关
│   ├── lax/            # Lax 连接
│   ├── notice/         # 通知
│   ├── queue/          # 任务队列
│   └── task/           # 后台任务
├── compose/            # Docker Compose 配置文件
├── driver/             # 驱动层
├── jobs/               # 定时任务
├── migrations/         # 数据库迁移
├── schemas/            # Pydantic Schema
├── static/             # 前端构建产物（已含精选功能）
├── views/              # 视图模板
├── web_ui/             # 前端源码（Vue 3 + Arco Design）
├── qtserver/           # Qt 服务端
├── patch/              # 定制补丁文件
├── main.py             # 应用入口
├── data_sync.py        # 数据库模型自动同步器
├── init_sys.py         # 系统初始化（建表 + 默认账号）
├── Dockerfile          # Docker 构建文件
├── config.example.yaml # 配置文件模板
└── requirements.txt    # Python 依赖
```

---

## 原项目完整功能

继承自 [rachelos/we-mp-rss](https://github.com/rachelos/we-mp-rss) 的所有功能：

- 微信读书扫码登录，免抓包获取公众号授权
- 公众号文章自动抓取与更新
- 生成标准 RSS/Atom 订阅源
- Web UI 管理界面（Vue 3 + Arco Design）
- 文章收藏、已读标记
- 全文搜索
- 多主题支持（13 种主题）
- 导出 md/docx/pdf/json 格式
- 自定义通知渠道（钉钉/微信/飞书/Webhook）
- 级联系统：父子节点架构，智能任务分配
- HTML 内容过滤规则（全局 + 公众号级别）
- 多数据库支持（SQLite 默认，可选 MySQL/PostgreSQL）

---

## 环境变量配置

以下为常用配置项，完整配置请参考 `config.example.yaml`。

| 环境变量 | 默认值 | 说明 |
|----------|--------|------|
| `PORT` | `8001` | API 服务端口 |
| `DB` | `sqlite:///./data/db.db` | 数据库连接字符串 |
| `SECRET_KEY` | `we-mp-rss` | 密钥（生产环境务必修改） |
| `ENABLE_JOB` | `True` | 是否启用定时任务 |
| `DEBUG` | `False` | 调试模式 |
| `MAX_PAGE` | `5` | 首次添加公众号时抓取的页数 |
| `RSS_BASE_URL` | 空 | RSS 域名地址（如 `https://rss.example.com/`） |
| `RSS_PAGE_SIZE` | `30` | RSS 分页大小 |
| `TOKEN_EXPIRE_MINUTES` | `4320` | 登录会话有效期（分钟，默认 3 天） |
| `GATHER.CONTENT` | `False` | 是否采集文章正文内容 |
| `GATHER.MODEL` | `web` | 采集模式：`web`（可采集发布链接）/ `api`（临时链接）/ `app`（最新消息） |
| `USERNAME` | `admin` | 默认管理员用户名 |
| `PASSWORD` | `admin@123` | 默认管理员密码 |

### 数据库连接示例

```yaml
# SQLite（默认）
db: sqlite:///./data/db.db

# MySQL
db: mysql+pymysql://username:password@host:3306/we-rss?charset=utf8mb4

# PostgreSQL
db: postgresql://username:password@host:5432/we-rss
```

---

## 许可证

本项目基于 [rachelos/we-mp-rss](https://github.com/rachelos/we-mp-rss) 修改，遵循原项目 MIT 许可证。

## 致谢

- [rachelos/we-mp-rss](https://github.com/rachelos/we-mp-rss) - 原始项目
- [Arco Design Vue](https://arco.design/vue) - UI 组件库
