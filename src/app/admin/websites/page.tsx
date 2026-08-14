import { Globe } from "lucide-react";
import { Placeholder } from "@/components/admin/layout/placeholder";

export default function WebsitesPage() {
  return (
    <Placeholder
      title="网站管理"
      description="管理所有站点：创建、配置、启停与站点级设置。"
      icon={Globe}
    />
  );
}
