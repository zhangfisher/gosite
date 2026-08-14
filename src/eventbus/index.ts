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
}>;

export const AppBus = new FastLiteEvent<AppEvents>({
    transform: (message:any) => {
        return message.payload;
    },
});

// 将 AppBus 挂载到全局 window 对象上
declare global {
    interface Window {
        AppBus: typeof AppBus;
    }
}

// 仅在开发环境下挂载到 window 对象
if (import.meta.env.DEV) {
    window.AppBus = AppBus;
}
