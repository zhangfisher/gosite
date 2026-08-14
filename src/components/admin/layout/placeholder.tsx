import { type LucideIcon, Construction } from "lucide-react";

/**
 * 后台占位页
 *
 * 用于尚未实现的模块：展示模块标题、描述与"建设中"提示。
 * 待各模块逐步填充真实内容时替换即可。
 */
export function Placeholder({
  title,
  description,
  icon: Icon = Construction,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="h-8 w-8 stroke-[1px]" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          <Construction className="h-3.5 w-3.5" />
          建设中 · 占位页面
        </span>
      </div>
    </div>
  );
}
