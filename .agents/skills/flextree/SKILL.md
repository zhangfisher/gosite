---
name: flextree
description: FlexTree树结构管理库 - 基于Nested Set Model(左右值算法)在数据库中存储层级数据。当需要：实现分类树/组织架构/权限菜单/评论回复/文件目录等树结构、查询父子关系/祖先后代/兄弟节点、添加删除移动树节点、为树数据创建REST API、配置SQLite/Prisma/PostgreSQL/MySQL适配器、优化树查询性能、验证修复树结构时使用。支持Node.js/Bun/Deno环境，提供完整TypeScript类型和ORM集成。
---

# FlexTree 技能索引

FlexTree 是基于 Nested Set Model 的树结构管理库。**本文件是索引**，指引你读取 `guide/` 目录下的具体文档。

## 🚀 如何激活本技能

### 自动激活场景
当你在以下情况时，本技能会自动激活：

1. **询问树结构存储**
   - "如何在数据库中存储树结构？"
   - "树结构数据怎么设计？"
   - "如何实现分类树/组织架构/菜单树？"

2. **询问 FlexTree 相关**
   - "FlexTree 怎么用？"
   - "flextree 创建节点"
   - "如何移动树节点？"

3. **树结构操作问题**
   - "查询某个节点的所有子节点"
   - "获取节点路径"
   - "树结构验证"

### 手动激活方式

```bash
# 直接调用技能
/flextree

# 或在对话中提及
"请使用 flextree 技能帮我要实现..."
"根据 flextree 的使用指南..."
```

## 📚 文档索引

### 🎯 快速开始
| 你的需求 | 读取文档 | 说明 |
|---------|---------|------|
| **首次使用/了解概念** | `guide/flextree.md` | FlexTree 概述、算法原理 |
| **快速入门** | `guide/createtree.md` | 5分钟创建第一个树 |
| **配置管理器** | `guide/manager.md` | FlexTreeManager 配置说明 |

### 🌳 核心操作
| 功能 | 读取文档 | 说明 |
|-----|---------|------|
| **添加节点** | `guide/add.md` | 单个/批量添加、位置控制 |
| **删除节点** | `guide/delete.md` | 单个/子树删除、回收站 |
| **移动节点** | `guide/move.md` | 节点移动、跨树移动 |
| **更新节点** | `guide/update.md` | 字段更新、批量更新 |
| **查找节点** | `guide/find.md` | 条件查询、精确查找 |
| **查询操作** | `guide/query.md` | 父子/祖先/后代/兄弟查询 |
| **节点关系** | `guide/relation.md` | 关系判断、路径获取 |

### 🛠️ 高级功能
| 功能 | 读取文档 | 说明 |
|-----|---------|------|
| **复制节点** | `guide/copy.md` | 节点复制、子树复制 |
| **导出数据** | `guide/export.md` | 数据导出、备份 |
| **多根树管理** | `guide/multiroot.md` | 多根树概念和操作 |
| **多根树详细** | `guide/multiroottree.md` | Tree 接口高级用法 |
| **回收站** | `guide/recyclebin.md` | 软删除、恢复机制 |
| **树验证** | `guide/verify.md` | 完整性验证 |
| **树修复** | `guide/repair.md` | 损坏修复 |

### ⚙️ 配置和适配
| 场景 | 读取文档 | 说明 |
|-----|---------|------|
| **数据库适配器** | `guide/adapters.md` | SQLite/Prisma/SQL.js 配置 |
| **自定义字段** | `guide/custom.md` | 字段映射、泛型支持 |
| **多树管理** | `guide/multitree.md` | 单表多树、treeId |
| **TypeScript** | `guide/typescript.md` | 类型定义、泛型 |
| **写操作事务** | `guide/write.md` | 事务处理、批量操作 |

### 🌐 REST API
| 场景 | 读取文档 | 说明 |
|-----|---------|------|
| **REST 概述** | `guide/rest.md` | REST API 简介 |
| **REST 快速开始** | `guide/rest-getting-started.md` | 5分钟搭建 API 服务 |
| **REST API 详细** | `guide/rest-api.md` | 完整 API 端点说明 |
| **框架集成** | `guide/rest-integrations.md` | Hono/Express/Elysia/Next.js |
| **OpenAPI 文档** | `guide/rest-openapi.md` | API 文档自动生成 |

## 🎯 按任务查找文档

### 任务 1：我要创建一个分类树
```
1. guide/flextree.md - 了解基本概念
2. guide/createtree.md - 创建树结构
3. guide/add.md - 添加分类节点
4. guide/query.md - 查询分类
```

### 任务 2：我要实现组织架构管理
```
1. guide/createtree.md - 创建组织树
2. guide/add.md - 添加部门/员工
3. guide/move.md - 调整组织架构
4. guide/query.md - 查询下级部门
```

### 任务 3：我要创建 REST API
```
1. guide/rest-getting-started.md - 快速开始
2. guide/rest-api.md - API 端点设计
3. guide/rest-integrations.md - 选择框架
4. guide/rest-openapi.md - 生成文档
```

### 任务 4：我要迁移现有树数据
```
1. guide/export.md - 了解数据格式
2. guide/adapters.md - 配置数据库
3. guide/write.md - 事务处理
4. guide/verify.md - 验证数据完整性
```

### 任务 5：我要优化树操作性能
```
1. guide/adapters.md - 数据库优化
2. guide/write.md - 批量操作
3. guide/query.md - 查询优化
4. guide/verify.md - 检查树结构
```

## 🔍 快速搜索指南

### 搜索关键词到文档

| 关键词 | 相关文档 |
|-------|---------|
| `createRoot`, `addNodes` | `guide/add.md` |
| `deleteNode`, `clear` | `guide/delete.md` |
| `move`, `moveUp`, `moveDown` | `guide/move.md` |
| `getChildren`, `getParent` | `guide/query.md` |
| `findNode`, `getNodes` | `guide/find.md` |
| `SQLite`, `Prisma`, `adapter` | `guide/adapters.md` |
| `GET /api/`, `POST /api/` | `guide/rest-api.md` |
| `Hono`, `Express`, `Next.js` | `guide/rest-integrations.md` |

## 💡 使用技巧

### 何时读完整文档
- **学习阶段**：第一次使用时，读 `guide/flextree.md` 和 `guide/createtree.md`
- **功能深入**：需要某个功能的完整理解时

### 何时只需参考
- **API 调用**：需要具体方法时，在对应文档中搜索
- **复制代码**：需要示例代码时，直接复制相关章节

### 何时跳读
- **已知概念**：跳过概念说明，直接看 API 使用
- **特定问题**：有明确问题时，搜索关键词直达

## 🆘 遇到问题？

### 按问题类型查找

| 问题类型 | 查看文档 |
|---------|---------|
| **节点操作错误** | `guide/write.md` (事务处理) |
| **查询性能慢** | `guide/adapters.md` (数据库优化) |
| **树结构损坏** | `guide/verify.md` → `guide/repair.md` |
| **API 404 错误** | `guide/rest-api.md` (端点检查) |
| **跨域问题** | `guide/rest-integrations.md` (CORS 配置) |
| **类型错误** | `guide/typescript.md` (类型定义) |

### 项目资源
- **官方文档**：项目 `/docs` 目录
- **测试用例**：`/packages/tests` 目录
- **示例代码**：`/examples` 目录

---

**记住**：本技能激活后，会根据你的具体需求指引你读取 `guide/` 目录下的相应文档，而不是在此处重复所有内容。
