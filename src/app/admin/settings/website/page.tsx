import { Settings, ADMIN_USER_ID } from "@/lib/settings";
import type { AdminConfig } from "@/types/settings";

import { WebsiteSettingsForm } from "@/components/admin/settings/website-form";

export default async function WebsiteSettingsPage() {
	const settings = await new Settings<AdminConfig>(ADMIN_USER_ID).load();
	const data = settings.all();

	return (
		<div className="mx-auto max-w-2xl">
			<WebsiteSettingsForm initial={data} />
		</div>
	);
}
