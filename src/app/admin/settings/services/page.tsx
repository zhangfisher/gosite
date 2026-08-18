import { Settings, ADMIN_USER_ID } from "@/lib/settings";
import type { AdminConfig } from "@/types/settings";

import { ServicesSettingsForm } from "@/components/admin/settings/services-form";

export default async function ServicesSettingsPage() {
	const settings = await new Settings<AdminConfig>(ADMIN_USER_ID).load();
	const data = settings.all();

	return (
		<div className="mx-auto max-w-2xl">
			<ServicesSettingsForm initial={data} />
		</div>
	);
}
