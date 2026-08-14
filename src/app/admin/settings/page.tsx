import { Settings } from "lucide-react";
import { Placeholder } from "@/components/admin/layout/placeholder";

export default function SettingsPage() {
  return (
    <Placeholder
      title="设置"
      description="系统级设置：账户、权限、主题与全局配置。"
      icon={Settings}
    />
  );
}
