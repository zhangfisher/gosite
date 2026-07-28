# 数据库系统说明

## 概述

本项目使用 Drizzle ORM 和 SQLite（通过 `bun:sqlite` 驱动）进行数据持久化。

## 目录结构

```
src/db/
├── schema/              # 数据库表定义
│   ├── products.ts     # 产品表
│   ├── product_categories.ts  # 产品分类表（嵌套集合模型）
│   ├── product_category_relations.ts  # 产品分类关联表
│   └── index.ts        # Schema 导出
├── utils/              # 数据库工具函数
│   ├── helpers.ts      # 通用辅助工具
│   ├── products.ts     # 产品查询工具
│   └── treeAdapter.ts  # FlexTree Drizzle ORM 适配器
├── tests/              # 数据库测试
│   ├── test-db.ts      # 产品表测试
│   ├── test-categories.ts  # 产品分类树测试
│   └── test-flextree-adapter.ts # FlexTree 适配器测试
├── examples/           # 使用示例
│   └── flextree-usage.ts # FlexTree 使用示例
├── index.ts            # 数据库连接配置和导出
├── productTree.ts      # 产品分类树管理器
├── init.ts             # 数据库初始化脚本
├── verify-schema.ts    # Schema 验证工具
├── verify-all-tables.ts # 完整数据库验证工具
└── README.md           # 本文档
```

## 数据库表结构

### 产品表 (products)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | integer | 自动主键 |
| `name` | text | 英文名称 |
| `title` | text | 中文标题 |
| `description` | text | 产品简要描述 |
| `keywords` | text | 关键词（逗号分隔） |
| `icon` | text | Lucide 图标名称 |
| `cover` | text | 封面图片地址（可选） |
| `images` | text | 上传的图片名称列表（JSON 数组格式） |
| `content` | text | 产品介绍内容（Markdown 格式） |
| `createdAt` | integer | 创建时间 |
| `updatedAt` | integer | 更新时间 |

### 分类表 (categories)

使用嵌套集合模型管理树形结构：

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | integer | 自动主键 |
| `name` | text | 节点名称 |
| `level` | integer | 节点层级（0=根节点，1-N=第N级） |
| `left` | integer | 左值（嵌套集合模型） |
| `right` | integer | 右值（嵌套集合模型） |
| `icon` | text | 图标（可选） |
| `cover` | text | 封面图片地址（可选） |
| `description` | text | 节点完整描述（可选） |
| `createdAt` | integer | 创建时间 |
| `updatedAt` | integer | 更新时间 |

### 产品分类关联表 (product_categories)

多对多关系中间表：

| 字段 | 类型 | 说明 |
|------|------|------|
| `productId` | integer | 产品ID（外键） |
| `categoryId` | integer | 分类ID（外键） |
| `createdAt` | integer | 创建时间 |

**外键约束：**
- `productId` → `products.id`（删除时级联）
- `categoryId` → `categories.id`（删除时级联）

## 数据库配置

- **数据库类型**: SQLite
- **驱动**: `bun:sqlite`
- **数据库文件位置**: `data/data.db`
- **ORM**: Drizzle ORM

## 产品表结构

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | integer | 自动主键 |
| `name` | text | 英文名称 |
| `title` | text | 中文标题 |
| `description` | text | 产品简要描述 |
| `keywords` | text | 关键词（逗号分隔） |
| `icon` | text | Lucide 图标名称 |
| `cover` | text | 封面图片地址（可选） |
| `images` | text | 上传的图片名称列表（JSON 数组格式） |
| `content` | text | 产品介绍内容（Markdown 格式） |
| `createdAt` | integer | 创建时间 |
| `updatedAt` | integer | 更新时间 |

## 使用方法

### 1. 初始化数据库

```bash
bun run db:init
```

这将：
- 创建数据库目录（如果不存在）
- 运行所有迁移
- 创建数据库文件 `data/data.db`

### 2. 生成迁移文件

修改 `src/db/schema/` 中的表定义后，运行：

```bash
bun run db:generate
```

这将生成新的迁移文件到 `drizzle/` 目录。

### 3. 运行迁移

```bash
bun run db:migrate
```

### 4. 开发环境快速推送

在开发环境中，可以直接推送 schema 到数据库：

```bash
bun run db:push
```

**注意**: 此命令仅用于开发环境，会直接修改数据库结构。

### 5. 打开 Drizzle Studio

```bash
bun run db:studio
```

这将打开一个 Web 界面来管理数据库数据。

## 代码示例

### 基础连接

```typescript
import { db, products } from '@/db';

// 获取所有产品
const allProducts = await db.select().from(products);

// 创建产品
const newProduct = await db.insert(products).values({
  name: 'example-product',
  title: '示例产品',
  description: '这是一个示例产品',
  keywords: 'example,sample',
  icon: 'Package',
  cover: '/images/products/example-cover.jpg',
  images: JSON.stringify(['image1.jpg', 'image2.jpg']),
  content: '# 产品介绍\n...',
});
```

### 使用查询工具

#### 产品操作

```typescript
import {
  getAllProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '@/db/utils/products';

// 获取所有产品
const products = await getAllProducts();

// 根据 ID 获取产品
const product = await getProductById(1);

// 搜索产品
const searchResults = await searchProducts('keyword');

// 创建新产品
const newProduct = await createProduct({
  name: 'new-product',
  title: '新产品',
  description: '描述',
  keywords: 'keyword1,keyword2',
  icon: 'Star',
  cover: '/images/products/new-cover.jpg',
  images: JSON.stringify([]),
  content: '# 内容',
});

// 更新产品
await updateProduct(1, { title: '更新后的标题' });

// 删除产品
await deleteProduct(1);
```

#### 产品分类操作

```typescript
import { ProductTree } from '@/db';
import { db, productCategories, products } from '@/db';
import { eq } from 'drizzle-orm';

// ⚠️ 重要：产品分类表使用基于左右值算法的嵌套集合模型
// 所有树的CRUD操作必须且只能通过 FlexTree API 进行
// 严格禁止直接使用数据库操作修改 left/right/level 字段

// 加载树结构
await ProductTree.load();

// 获取根节点
const rootNode = ProductTree.root;

// 查找节点
const node = ProductTree.find((node) => node.name === 'iPhone');

// 根据路径访问节点
const pathNode = ProductTree.getByPath('/电子产品/手机/iPhone');

// 创建新节点
const newNode = await ProductTree.insert('/电子产品/手机', {
  name: 'iPhone 15',
  description: '最新款 iPhone 15',
  icon: 'Smartphone',
});

// 更新节点
await ProductTree.update('/电子产品/手机/iPhone', {
  name: 'iPhone Pro',
  description: '最新款 iPhone Pro 系列'
});

// 删除节点
await ProductTree.remove(nodeId);

// 遍历树
ProductTree.root?.forEach((node) => {
  console.log(`${node.name} (Level: ${node.level})`);
});

// 导出为 JSON
const jsonData = ProductTree.toJson({
  childrenField: 'children',
  fields: ['name', 'description', 'icon'],
  includeKeyFields: false,
  level: 0,
});

// 导出为平铺列表
const flatList = ProductTree.toList({
  pidField: 'parentId',
  fields: ['name', 'description'],
  includeKeyFields: false,
});

// 为产品分配分类（关联表操作可以通过数据库）
await db.insert(productCategories).values({
  productId: productId,
  categoryId: categoryId,
});

// 获取产品的所有分类
const productCategories = await db
  .select()
  .from(productCategories)
  .innerJoin(categories, eq(productCategories.categoryId, categories.id))
  .where(eq(productCategories.productId, productId));

// 获取分类下的所有产品
const categoryProducts = await db
  .select()
  .from(productCategories)
  .innerJoin(products, eq(productCategories.productId, products.id))
  .where(eq(productCategories.categoryId, categoryId));
```

## 嵌套集合模型说明

分类表使用**嵌套集合模型**来管理树形结构，这是一种高效的层级数据存储方式。

### 基本概念

- **left 值**: 节点的左边界值
- **right 值**: 节点的右边界值
- **层级关系**: 父节点的 left < 子节点的 left，父节点的 right > 子节点的 right

### 示例结构

```
电子产品 (level=0, left=1, right=12)
├── 手机 (level=1, left=2, right=7)
│   ├── iPhone (level=2, left=3, right=4)
│   └── Android (level=2, left=5, right=6)
└── 电脑 (level=1, left=8, right=11)
    ├── 笔记本 (level=2, left=9, right=10)
    └── 台式机 (level=2, left=11, right=12)
```

### 查询优势

- **获取子树**: 只需一次查询即可获取完整子树
- **获取路径**: 高效查询从根到任意节点的路径
- **层级判断**: 通过 level 字段快速确定节点深度

## 验证和测试

### 验证数据库结构

```bash
# 验证产品表结构
bun run src/db/verify-schema.ts

# 验证所有表结构
bun run src/db/verify-all-tables.ts
```

### 运行测试

```bash
# 测试产品表功能
bun run src/db/tests/test-db.ts

# 测试分类系统功能
bun run src/db/tests/test-categories.ts

# 测试 FlexTree 适配器功能
bun run src/db/tests/test-flextree-adapter.ts
```

## 迁移流程

1. **修改 Schema**: 在 `src/db/schema/` 中修改表定义
2. **生成迁移**: `bun run db:generate`
3. **检查迁移**: 检查 `drizzle/` 目录中生成的 SQL
4. **运行迁移**: `bun run db:migrate`

## 注意事项

1. **数据库文件**: `data/data.db` 会被 Git 忽略，不应提交到版本控制
2. **迁移文件**: `drizzle/` 目录中的迁移文件应该提交到版本控制
3. **类型安全**: Drizzle ORM 提供完整的 TypeScript 类型支持
4. **外键支持**: 已启用 SQLite 外键约束支持

## 故障排除

### 数据库锁定

如果遇到数据库锁定问题，确保：
- 没有其他进程正在访问数据库
- 关闭了所有数据库连接
- 重新启动应用程序

### 迁移失败

如果迁移失败：
1. 检查 `drizzle/` 目录中的迁移 SQL 是否正确
2. 确保数据库文件存在且可写
3. 尝试手动执行迁移 SQL

### 类型错误

如果遇到类型错误：
1. 确保 `drizzle-orm` 和 `drizzle-kit` 版本匹配
2. 重新生成类型: `bun run db:generate`

## FlexTree 适配器

### 概述

项目为 FlexTree 库提供了基于 Drizzle ORM 和 SQLite 的数据库适配器，用于管理嵌套集合模型的树形结构。

### FlexTree 适配器功能

FlexTree 适配器实现了 `IFlexTreeAdapter` 接口，提供以下功能：

- ✅ 数据库连接管理
- ✅ SQL 语句执行
- ✅ 查询结果获取
- ✅ 标量值查询
- ✅ 带参数的查询
- ✅ 事务支持
- ✅ 表结构信息获取

### 使用 FlexTree 适配器

#### 1. 使用预配置的适配器实例（推荐）

```typescript
import { FlexTree } from 'flextree';
import { treeAdapter } from '@/db';

// 直接使用预配置的适配器实例
const tree = new FlexTree('categories', {
  adapter: treeAdapter,
  fields: {
    id: 'id',
    name: 'name',
    leftValue: 'left',
    rightValue: 'right',
    level: 'level',
  },
});
```

#### 2. 使用便捷函数创建适配器

```typescript
import { FlexTree } from 'flextree';
import { createFlexTreeAdapter } from '@/db';

// 自动复用现有的数据库连接
const adapter = createFlexTreeAdapter();

```typescript
import { FlexTree } from 'flextree';
import { createFlexTreeAdapter } from '@/db';

// 自动复用现有的数据库连接
const adapter = createFlexTreeAdapter();

// 创建 FlexTree 实例
const tree = new FlexTree('categories', {
  adapter: adapter,
  fields: {
    id: 'id',
    name: 'name',
    leftValue: 'left',
    rightValue: 'right',
    level: 'level',
  },
});
```

#### 3. 手动创建适配器实例

```typescript
import { FlexTree } from 'flextree';
import { DrizzleTreeAdapter } from '@/db';
import { sqlite } from '@/db';

// 使用现有的 SQLite 连接
const adapter = new DrizzleTreeAdapter({
  sqlite: sqlite,
});

// 创建 FlexTree 实例
const tree = new FlexTree('categories', {
  adapter: adapter,
  fields: {
    id: 'id',
    name: 'name',
    leftValue: 'left',
    rightValue: 'right',
    level: 'level',
  },
});
```

#### 3. 加载和操作树

```typescript
// 加载树结构
await tree.load();

// 获取根节点
const rootNode = tree.root;

// 获取节点路径
const path = tree.getByPath('/电子产品/手机/iPhone');

// 更新节点
await tree.update('/电子产品/手机/iPhone', {
  name: 'iPhone Pro',
  description: '最新款 iPhone Pro 系列'
});

// 同步树结构
await tree.sync();
```

### FlexTree API 示例

#### 节点遍历

```typescript
// 深度优先遍历
tree.root.forEach((node) => {
  console.log(node.name);
}, { mode: 'dfs' });

// 广度优先遍历
tree.root.forEach((node) => {
  console.log(node.name);
}, { mode: 'bfs' });
```

#### 查找节点

```typescript
// 根据 ID 查找
const node = tree.get(1);

// 根据条件查找
const node = tree.find((node) => node.name === 'iPhone');

// 查找所有匹配的节点
const nodes = tree.findAll((node) => node.level > 2);
```

#### 导出数据

```typescript
// 导出为 JSON 树结构
const jsonTree = tree.toJson({
  childrenField: 'children',
  fields: ['name', 'description', 'icon'],
  includeKeyFields: false,
  level: 0,
});

// 导出为平铺列表
const flatList = tree.toList({
  pidField: 'parentId',
  fields: ['name', 'description'],
  includeKeyFields: false,
});
```

### 适配器测试

运行 FlexTree 适配器测试：

```bash
bun run src/db/test-flextree-adapter.ts
```

测试覆盖：
- ✅ 数据库连接管理
- ✅ FlexTree 实例创建
- ✅ 基本 SQL 查询功能
- ✅ 标量查询功能
- ✅ SQL 执行功能
- ✅ 带参数的查询
- ✅ 表结构信息获取
- ✅ FlexTree 集成功能

### 适配器特性

#### Bun SQLite 适配

适配器专门为 Bun 的 SQLite 驱动进行了优化，解决了与 better-sqlite3 API 的兼容性问题：

- 正确处理标量查询结果
- 支持参数化查询
- 事务管理
- 错误处理

#### 类型安全

适配器提供完整的 TypeScript 类型支持：

```typescript
import type { DrizzleTreeAdapterConfig } from '@/db/utils/treeAdapter';
import { sqlite } from '@/db';

const config: DrizzleTreeAdapterConfig = {
  sqlite: sqlite,
};

const adapter = new DrizzleTreeAdapter(config);
```

#### 灵活配置

适配器支持灵活的配置选项：

```typescript
interface DrizzleTreeAdapterConfig {
  // 底层 SQLite 连接（必需）
  sqlite: Database;
}
```

### FlexTree 优势

使用 FlexTree 而不是直接操作分类表的优势：

1. **高级 API**: 提供更高级的树形结构操作 API
2. **类型安全**: 完整的 TypeScript 类型支持
3. **便捷操作**: 简化节点移动、复制、删除等操作
4. **缓存机制**: 内置缓存提高查询性能
5. **事件系统**: 支持树结构变更事件监听
6. **导出功能**: 支持多种数据导出格式

### 注意事项

1. **字段映射**: 确保 FlexTree 的字段映射与数据库表结构一致
2. **连接管理**: 使用完毕后记得关闭适配器连接
3. **并发控制**: FlexTree 内置写入锁机制，避免并发修改
4. **错误处理**: FlexTree 操作可能抛出特定错误类型，需要适当处理
