import { ENV } from '@/config/env';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/private', '/signin'],
      },
    ],
    sitemap: `${ENV.BASE_URL}/sitemap.xml`,
  };
}
