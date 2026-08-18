import { SettingsTabs } from "@/components/admin/settings/tabs";
import { Toaster } from "@/components/ui/sonner";

/**
 * 设置区域布局
 *
 * 顶部为配置组页签（子路由切换），下方渲染对应子路由内容。
 */
export default function SettingsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col gap-4 p-6">
			<SettingsTabs />
			<div className="min-h-0 flex-1">{children}</div>
			<Toaster />
		</div>
	);
}
