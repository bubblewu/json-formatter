import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'JSON格式化工具',
  description = '在线JSON格式化、验证、压缩工具' 
}) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const shareButtonRef = useRef<HTMLDivElement>(null);
  
  // 当在客户端运行时，更新URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      
      // 初始检测设备类型
      checkDeviceType();
      
      // 监听窗口大小变化
      window.addEventListener('resize', checkDeviceType);
      
      // 监听点击外部关闭菜单
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        window.removeEventListener('resize', checkDeviceType);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, []);
  
  // 检测设备类型
  const checkDeviceType = () => {
    setIsMobile(window.innerWidth < 640);
    setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
  };
  
  // 处理点击外部关闭菜单
  const handleClickOutside = (event: MouseEvent) => {
    if (shareButtonRef.current && !shareButtonRef.current.contains(event.target as Node) && isOpen) {
      setIsOpen(false);
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  // 编码分享内容
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  
  // 分享链接
  const shareLinks = [
    {
      name: 'X',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      )
    },
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      )
    },
    {
      name: 'Reddit',
      url: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      )
    }
  ];

  // 动态调整位置，根据设备类型
  const getPositionClasses = () => {
    if (isMobile) {
      return 'bottom-0 right-0 translate-y-0 mb-16 mr-2'; // 移动端底部
    } else if (isTablet) {
      return 'top-1/2 -translate-y-1/2 right-0'; // 平板右侧中间
    } else {
      return 'top-1/2 -translate-y-1/2 right-0'; // 桌面右侧中间
    }
  };

  // 获取按钮尺寸类
  const getButtonSizeClasses = () => {
    if (isMobile) {
      return 'p-2.5 w-10 h-10'; // 移动端小按钮
    } else {
      return 'p-3'; // 桌面端正常尺寸按钮
    }
  };

  // 获取分享项目的尺寸
  const getShareItemClasses = () => {
    if (isMobile) {
      return 'w-9 h-9'; // 移动端更小的分享按钮
    } else {
      return 'w-10 h-10'; // 桌面端标准尺寸
    }
  };

  // 分享菜单的布局
  const getShareMenuLayout = () => {
    if (isMobile) {
      return 'flex-row space-y-0 space-x-2 rounded-t-lg rounded-l-none rounded-r-none'; // 移动端水平布局
    } else {
      return 'flex-col space-y-2 rounded-l-lg'; // 桌面端垂直布局
    }
  };

  // 主按钮位置和显示逻辑
  const getTransformClasses = () => {
    if (isMobile) {
      return isOpen ? 'translate-y-0' : 'translate-y-16'; // 移动端上下移动
    } else {
      return isOpen ? 'translate-x-0' : 'translate-x-12'; // 桌面端左右移动
    }
  };

  return (
    <div 
      ref={shareButtonRef}
      className={`fixed z-30 transition-all duration-300 ${getPositionClasses()} ${getTransformClasses()}`}
    >
      <div className={`flex ${isMobile ? 'flex-col items-center' : 'flex-col items-end'}`}>
        {/* 主分享按钮 */}
        <button
          onClick={toggleOpen}
          className={`${getButtonSizeClasses()} bg-blue-600 hover:bg-blue-700 text-white ${isMobile ? 'rounded-full' : 'rounded-l-lg'} shadow-lg flex items-center ${isMobile ? 'mb-2' : 'mb-2'}`}
          aria-label={isOpen ? t('shareMenu.close') : t('shareMenu.open')}
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen && !isMobile ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {!isOpen && !isMobile && !isTablet && (
            <span className="ml-2 hidden lg:block">
              {t('share')}
            </span>
          )}
        </button>
        
        {/* 社交媒体分享按钮 */}
        <div className={`flex ${getShareMenuLayout()} bg-white dark:bg-gray-800 p-2 shadow-lg transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center ${getShareItemClasses()} rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              aria-label={`${t('shareMenu.title')} ${link.name}`}
              title={`${t('shareMenu.title')} ${link.name}`}
            >
              <div className="text-gray-700 dark:text-gray-300">
                {link.icon}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareButtons; 