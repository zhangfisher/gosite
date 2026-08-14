import { Layout } from "lucide-react";
import { Placeholder } from "@/components/admin/layout/placeholder";

export default function TemplatePage() {
  return (
    <Placeholder
      title="模板"
      description="浏览、选用与配置站点模板。"
      icon={Layout}
    />
  );
}
