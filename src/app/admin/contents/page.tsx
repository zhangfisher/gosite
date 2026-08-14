import { Package } from "lucide-react";
import { Placeholder } from "@/components/admin/layout/placeholder";

export default function ContentsPage() {
  return (
    <Placeholder
      title="内容管理"
      description="管理站点内容：页面、文章、媒体与分类结构。"
      icon={Package}
    />
  );
}
