import { Rocket } from "lucide-react";
import { Placeholder } from "@/components/admin/layout/placeholder";

export default function DeployPage() {
  return (
    <Placeholder
      title="部署"
      description="发布站点到生产环境，查看部署历史与状态。"
      icon={Rocket}
    />
  );
}
