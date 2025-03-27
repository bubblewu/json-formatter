// 支持的语言列表
export const SUPPORTED_LANGUAGES = ['en', 'zh', 'ja', 'ko', 'es', 'de', 'fr', 'ru'] as const;

// 默认语言
export const DEFAULT_LANGUAGE = 'en';

// 示例 JSONC
export const EXAMPLE_JSONC = `{
  // 这是一个示例JSONC文件
  "name": "JSON Formatter",
  "version": "1.0.0",
  "description": "一个支持JSONC的格式化工具",
  
  /* 这是一个多行注释
   * 可以包含多行内容
   */
  "features": [
    "JSON格式化",
    "JSONC支持",  // 支持单行注释
    "实时验证",
    "错误提示"
  ],
  
  "settings": {
    "indentSize": 2,
    "useSpaces": true,
    "maxLineLength": 80  // 每行最大长度
  }
}`;

// 历史记录存储键
export const HISTORY_STORAGE_KEY = 'json_formatter_history';

// 最大历史记录数
export const MAX_HISTORY_ITEMS = 50; 