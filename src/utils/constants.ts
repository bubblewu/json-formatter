// 网站基本配置常量

// 网站URL配置
export const WEBSITE_URL = 'https://jsonformatplus.com';
export const TUTORIALS_URL = `${WEBSITE_URL}/tutorials`;

// 社交媒体分享
export const SOCIAL_SHARE = {
  TWITTER_URL: (url: string, title: string) => 
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  FACEBOOK_URL: (url: string) => 
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  LINKEDIN_URL: (url: string, title: string) => 
    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  TELEGRAM_URL: (url: string, title: string) => 
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  WHATSAPP_URL: (url: string, title: string) => 
    `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`
};

// 元数据常量
export const METADATA = {
  LOGO_URL: `${WEBSITE_URL}/logo.png`,
  IMAGES: {
    JSON_SCHEMA: `${WEBSITE_URL}/images/json-schema.png`,
    JSON_BASICS: `${WEBSITE_URL}/images/json-basics.png`,
    JSON_LOCALSTORAGE: `${WEBSITE_URL}/images/json-localstorage.png`,
    OG_IMAGE: `${WEBSITE_URL}/images/og-image.png`
  }
}; 