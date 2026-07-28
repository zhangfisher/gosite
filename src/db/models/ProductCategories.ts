import { DrizzleTreeAdapter, type DrizzleDb } from '@/db';
import { FlexTree, FlexTreeManager } from 'flextree';
import { ProductCategory } from '../schema/product_categories';



export function getProductCategories(db:DrizzleDb){
        
    // 创建适配器实例
    const drizzleTreeAdapter = new DrizzleTreeAdapter({ sqlite:db.$client});

    /**
     * 产品分类树管理器
     *
     */
    const treeManager = new FlexTreeManager<{
        cover:string
        icon:string
        description:string
    },{
        leftValue:"left",
        rightValue:"right"
    }>('product_categories', {
        adapter: drizzleTreeAdapter,
        fields: {
            id: 'id',
            name: 'name',
            leftValue: 'left',
            rightValue: 'right',
            level: 'level',
        },
    });


    return {
        treeManager,
        getTree:()=>{
            return new FlexTree<ProductCategory>('product_categories', {
                adapter: drizzleTreeAdapter,
                fields:{
                    id: 'id',
                    name: 'name',
                    leftValue: 'left',
                    rightValue: 'right',
                    level: 'level',
                },
            })
        }
    }

}