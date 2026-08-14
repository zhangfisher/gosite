import type { DrizzleDb } from '@/db';
import type { Content, ContentNodeType } from '../schema';
import DrizzleTreeAdapter from '../utils/treeAdapter';
import { FlexTree, FlexTreeManager } from 'flextree';

/**
 * 内容 CRUD 管理器
 *
 * 基于嵌套集合模型提供对内容表的树形管理
 */
export function getContents(db: DrizzleDb) {
	// 创建适配器实例
    const drizzleTreeAdapter = new DrizzleTreeAdapter({ sqlite:db.$client});

    /**
     * 内容分类树管理器
     *
     */
    const treeManager = new FlexTreeManager<{
        cover:string
        icon:string
        description:string
		keywords:string
		images:string
		content:string
		html:string
		url:string
		stars:number
		clickCount:number
		tags:string
		type:ContentNodeType
		video:string
		createdAt:number
		updatedAt:number
		ref:any
    },{
        leftValue:"left",
        rightValue:"right"
    }>('contents', {
        adapter: drizzleTreeAdapter,
        fields: {
            leftValue: 'left',
            rightValue: 'right'
        },
    });
    return {
        treeManager,
        getTree:()=>{
            return new FlexTree<Content>('contents', {
                adapter: drizzleTreeAdapter,
                fields:{
                    leftValue: 'left',
                    rightValue: 'right'
                },
            })
        }
    }
}
