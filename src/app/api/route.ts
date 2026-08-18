import { docsRoute } from 'next-rest-framework';

export const { GET } = docsRoute({
  openApiJsonPath: '/api/openapi.json',
  openApiObject: {
    info: {
      title: 'GoSite API',
      version: '0.1.0',
      description: 'GoSite OpenAPI service',
    },
  },
  docsConfig: {
    provider: 'redoc',
    title: 'PSite API',
    logoUrl: '',
  },
});
