import { Database } from "lucide-react";
import { Placeholder } from "@/components/admin/layout/placeholder";

export default function ResourcesPage() {
  return (
    <Placeholder
      title="资源管理"
      description="集中管理图片、文件等静态资源库。"
      icon={Database}
    />
  );
}
