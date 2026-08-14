import { Home } from "lucide-react";
import { Placeholder } from "@/components/admin/layout/placeholder";

export default function AdminHomePage() {
  return (
    <Placeholder
      title="首页"
      description="后台首页概览，展示站点关键数据与快捷入口。"
      icon={Home}
    />
  );
}
