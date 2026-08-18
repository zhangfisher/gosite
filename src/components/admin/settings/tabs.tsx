"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	User,
	Globe,
	FileText,
	Rocket,
	Sparkles,
	Users,
	Plug,
	type LucideIcon,
} from "lucide-react";

import { cn } from "@/utils/cn";

const TABS: {
	value: string;
	label: string;
	href: string;
	icon: LucideIcon;
}[] = [
	{ value: "general", label: "常规", href: "/admin/settings/general", icon: User },
	{ value: "website", label: "网站", href: "/admin/settings/website", icon: Globe },
	{ value: "content", label: "内容", href: "/admin/settings/content", icon: FileText },
	{ value: "deploy", label: "部署", href: "/admin/settings/deploy", icon: Rocket },
	{ value: "ai", label: "AI", href: "/admin/settings/ai", icon: Sparkles },
	{ value: "users", label: "用户管理", href: "/admin/settings/users", icon: Users },
	{
		value: "services",
		label: "第三方服务",
		href: "/admin/settings/services",
		icon: Plug,
	},
];

export function SettingsTabs() {
	const pathname = usePathname();

	return (
		<div className="flex gap-1 overflow-x-auto border-b border-border pb-px">
			{TABS.map((tab) => {
				const isActive = pathname === tab.href;
				const Icon = tab.icon;
				return (
					<Link
						key={tab.value}
						href={tab.href}
						className={cn(
							"inline-flex shrink-0 items-center gap-1.5 rounded-t-lg border-b-2 px-3 py-2 text-sm font-medium transition-colors",
							isActive
								? "border-primary text-foreground"
								: "border-transparent text-muted-foreground hover:text-foreground",
						)}
					>
						<Icon className="size-4" />
						{tab.label}
					</Link>
				);
			})}
		</div>
	);
}
