"use client";

import * as React from "react";
import { Bell, Trash2 } from "lucide-react";

import type { ToastRecord, ToastType } from "@/modules/app/toastManager";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/utils/cn";

const typeLabel: Record<ToastType, string> = {
  success: "成功",
  error: "错误",
  info: "信息",
  warning: "警告",
  loading: "加载中",
};

const typeStyles: Record<ToastType, string> = {
  success: "text-green-600",
  error: "text-red-600",
  info: "text-blue-600",
  warning: "text-amber-600",
  loading: "text-gray-500",
};

/**
 * 后台顶栏「通知历史」入口
 *
 * 显示在搜索按钮之后：点击弹出对话框，列出 ToastManager 记录的
 * 最近 toast 历史，并支持一键清空。
 */
export function ToastHistoryButton() {
  const [open, setOpen] = React.useState(false);
  const [history, setHistory] = React.useState<ToastRecord[]>([]);

  React.useEffect(() => {
    const sync = () => setHistory([...App.toastManager.history]);
    sync();
    return App.toastManager.subscribe(sync);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8"
            title="通知历史"
          />
        }
      >
        <Bell className="h-4 w-4" />
        {history.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none text-primary-foreground">
            {history.length > 99 ? "99+" : history.length}
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="flex w-[40vw] max-w-[40vw] sm:max-w-[40vw] h-[40vh] min-w-80 flex-col">
        <DialogHeader>
          <DialogTitle>通知历史</DialogTitle>
          <DialogDescription>
            共 {history.length} 条（保留最近 100 条）
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-auto rounded-md border border-border">
          {history.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              暂无通知
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {history.map((record) => (
                <li
                  key={record.id}
                  className="flex flex-col gap-1 p-3 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        typeStyles[record.type],
                      )}
                    >
                      {typeLabel[record.type]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(record.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {record.title && (
                    <p className="font-medium">{record.title}</p>
                  )}
                  {record.description && (
                    <p className="text-muted-foreground">
                      {record.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => App.toastManager.clear()}
            disabled={history.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            清空
          </Button>
          <DialogClose render={<Button variant="ghost" size="sm" />}>
            关闭
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
