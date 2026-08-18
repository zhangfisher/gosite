import { Rocket } from "lucide-react";
import { Placeholder } from "@/components/admin/layout/placeholder";

export default function DeploySettingsPage() {
	return (
		<Placeholder
			title="部署配置"
			description="部署相关的全局配置将在此管理，例如构建命令、环境、域名等。"
			icon={Rocket}
		/>
	);
}
