import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { contentsI18n } from './contents_i18n';


// 使用 const 断言定义枚举对象，兼顾运行时和类型
export const ContentNodeTypes = {
  CATEGORY: 0,
  CONTENT: 1,
  EXTERNAL_LINK: 2,
} as const;
export type ContentNodeType = typeof ContentNodeTypes[keyof typeof ContentNodeTypes]; // 类型为 0 | 1 | 2

/**
 * 内容表
 *
 * 包含内容的基本信息，包括中英文名称、描述、关键词、图标等
 */

export const contents = sqliteTable('contents', {
	// 自动主键
	id: integer('id').primaryKey(),

	// 英文名称
	name: text('name').notNull(),

	// 中文标题（可空：flextree 内部节点如回收站不填充此字段）
	title: text('title'),

	// 节点层级，0代表根节点，1-N代表第N级节点
	level: integer('level').notNull(),

	// 左值（用于嵌套集合模型）
	left: integer('left').notNull(),

	// 右值（用于嵌套集合模型）
	right: integer('right').notNull(),

	// 内容简要描述
	description: text('description'),

	// 关键词（逗号分隔）
	keywords: text('keywords'),

	// URL地址
	url: text('url'),

	// Lucide 图标名称
	icon: text('icon'),

	// 封面图片地址
	cover: text('cover'),

	// 上传的图片名称列表，使用,分开
	images: text('images'),
	

	// 内容介绍内容（Markdown 格式）
	content: text('content'),

	// 内容来源
	source: text('source'),

	// 标星（0-5，0表示无星）
	stars: integer('stars').notNull().default(0),

	// 节点类型（0-内容分类，1-内容，2-外部链接）
	type: integer('type').notNull().default(0).$type<ContentNodeType>(),

	// 标签（逗号分隔）
	tags: text('tags'),

	// 视频URL,使用,分开
	video: text('video'),

	// 上传的关联文件名称列表，使用,分开
	files: text('files'),

	// 引用内容ID（自引用外键，指向同表的另一个内容ID，用于表示相关内容、替代内容等，可为空）
	ref: integer('ref').references((): any => contents.id, { onDelete: 'restrict' }),

	// 创建时间（可空：flextree 内部节点如回收站不填充此字段）
	createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),

	// 更新时间（可空：flextree 内部节点如回收站不填充此字段）
	updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
export const contentsRelations = relations(contents, ({ many, one }) => {
	return {
		translations: many(contentsI18n),
		// 自引用关系 - 内容可以引用另一个内容
		referencedContent: one(contents, {
			fields: [contents.ref],
			references: [contents.id],
		}),
	};
});

export type Content = typeof contents.$inferSelect;
export type NewContent = typeof contents.$inferInsert;
