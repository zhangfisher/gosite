import { SettingsTabs } from "@/components/admin/settings/tabs";

/**
 * 设置区域布局
 *
 * 顶部为配置组页签（子路由切换），下方渲染对应子路由内容。
 * Toaster 由 AdminShell 统一挂载，此处不再重复。
 */
export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-4 p-0">
      <SettingsTabs />
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
