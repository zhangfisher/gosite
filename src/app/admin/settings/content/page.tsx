import { FileText } from "lucide-react";
import { Placeholder } from "@/components/admin/layout/placeholder";

export default function ContentSettingsPage() {
	return (
		<Placeholder
			title="内容配置"
			description="站点内容相关的全局配置将在此管理，例如默认分类、媒体策略等。"
			icon={FileText}
		/>
	);
}
