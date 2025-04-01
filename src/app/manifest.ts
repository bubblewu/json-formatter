import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JSON Format Plus',
    short_name: 'JSON Format Plus',
    description: '格式化、验证和转换JSON数据的在线工具',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      }
    ],
    categories: ['developer tools', 'utilities', 'productivity'],
    screenshots: [
      {
        src: '/images/screenshot-1.png',
        sizes: '1280x720',
        type: 'image/png'
      }
    ],
    shortcuts: [
      {
        name: '格式化JSON',
        short_name: '格式化',
        description: '格式化JSON数据',
        url: '/zh/beautify',
        icons: [{ src: '/file.svg', sizes: '96x96' }]
      },
      {
        name: '转换为XML',
        short_name: 'JSON到XML',
        description: '将JSON转换为XML',
        url: '/zh/json-to-xml',
        icons: [{ src: '/file.svg', sizes: '96x96' }]
      },
      {
        name: '转换为CSV',
        short_name: 'JSON到CSV',
        description: '将JSON转换为CSV',
        url: '/zh/json-to-csv',
        icons: [{ src: '/file.svg', sizes: '96x96' }]
      },
      {
        name: '转换为代码',
        short_name: 'JSON到代码',
        description: '将JSON转换为编程语言代码',
        url: '/zh/json-to-java',
        icons: [{ src: '/file.svg', sizes: '96x96' }]
      }
    ]
  };
} 