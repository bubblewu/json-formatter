export const SUPPORTED_LANGUAGES = ['zh', 'en', 'ja', 'ko', 'es', 'de', 'fr', 'ru'] as const;
export const DEFAULT_LANGUAGE = 'zh' as const;

export const HISTORY_STORAGE_KEY = 'jsonFormatterHistory';
export const MAX_HISTORY_ITEMS = 10;

export const EXAMPLE_JSONC = `{
  // 这是一个示例JSONC文件
  "name": "JSON格式化工具",
  "version": "1.0.0",
  "description": "一个在线JSON格式化、验证和美化工具",
  "features": [
    "JSON格式化",
    "JSON验证",
    "JSON压缩",
    "JSON转义"
  ],
  "author": {
    "name": "开发者",
    "email": "developer@example.com"
  },
  "settings": {
    "theme": "auto",
    "fontSize": 14,
    "tabSize": 2,
    "useSpaces": true
  }
}`; 