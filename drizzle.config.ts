import { defineConfig } from 'drizzle-kit';
import type { Config } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	schema: './src/db/schema/index.ts',
	out: './drizzle',
	dbCredentials: {
		url: './data/data.db',
	},
	strict: true,
} satisfies Config);
