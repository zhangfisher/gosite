`use client`
import { FastLiteEvent} from "fastevent/lite";
import { type TransformedEvents } from "fastevent";

export type AppEvents = TransformedEvents<{
    /**
     * 当切换主菜单路由时
     */
    "route:update": {
        title: string;
        url: string;
    };
    /**
     * 进入某个模块时触发，key 格式：modules/<模块名称>/enter
     * 例：modules/contents/enter、modules/home/enter
     */
    "modules/*/enter": {
        module: string;
    };
    /**
     * 离开某个模块时触发，key 格式：modules/<模块名称>/leave
     * 例：modules/contents/leave、modules/home/leave
     */
    "modules/*/leave": {
        module: string;
    };
}>;

export const AppBus = new FastLiteEvent<AppEvents>({
    transform: (message:any) => {
        return message.payload;
    },
});
 