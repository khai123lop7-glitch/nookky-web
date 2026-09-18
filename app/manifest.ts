import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nook Ký',
    short_name: 'Nook Ký',
    description: 'Xây một góc nhỏ, giữ một ký ức riêng.',
    start_url: '/',
    display: 'standalone',
    background_color: '#2e1407',
    theme_color: '#2e1407',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
