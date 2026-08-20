export type ContentNodeType = 0 | 1 | 2;

export interface ContentNode {
	id: number;
	name: string;
	title: string;
	description?: string | null;
	keywords?: string | null;
	url?: string | null;
	icon?: string | null;
	cover?: string | null;
	source?: string | null;
	stars?: number | null;
	type?: ContentNodeType | null;
	tags?: string | null;
	video?: string | null;
	images?: string | null;
	files?: string | null;
	content?: string | null;
	ref?: number | null;
	level?: number;
	left?: number;
	right?: number;
	createdAt?: string | number | Date | null;
	updatedAt?: string | number | Date | null;
}

export const CONTENT_NODE_TYPE_LABELS: Record<ContentNodeType, string> = {
	0: "分类",
	1: "内容",
	2: "外链",
};
