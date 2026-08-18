import { Settings, ADMIN_USER_ID } from "@/lib/settings";
import type { AdminConfig } from "@/types/settings";

import { AiSettingsForm } from "@/components/admin/settings/ai-form";

export default async function AiSettingsPage() {
	const settings = await new Settings<AdminConfig>(ADMIN_USER_ID).load();
	const data = settings.all();

	return (
		<div className="mx-auto max-w-3xl">
			<AiSettingsForm initial={data} />
		</div>
	);
}
