import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JSON Formatter',
    short_name: 'JSON Formatter',
    description: 'Format, Validate and Beautify JSON Data',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/logo-json.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-json.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
} 