import { createRequire } from 'module';
import { route, routeOperation, TypedNextResponse } from 'next-rest-framework';
import { z } from 'zod';

const require = createRequire(import.meta.url);
const { version } = require('../../../../package.json') as { version: string };

const versionSchema = z.object({
  version: z.string(),
});

export const { GET } = route({
  getVersion: routeOperation({
    method: 'GET',
  })
    .outputs([
      {
        status: 200,
        contentType: 'application/json',
        body: versionSchema,
      },
    ])
    .handler(() => {
      return TypedNextResponse.json({ version }, { status: 200 });
    }),
});
