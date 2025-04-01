'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Breadcrumb() {
  const pathname = usePathname();
  const t = useTranslations();
  const [isMobile, setIsMobile] = useState(false);
  // 延迟加载,以避免出现闪烁和水合错误
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 移除语言前缀 (确保处理静态资源路径等特殊情况)
  if (!pathname || pathname.includes('.') || pathname.startsWith('/_next')) {
    return null; // 不显示面包屑导航在静态资源或Next.js内部路径
  }
  
  const path = pathname.replace(/^\/[a-z]{2}/, '');
  
  // 分割路径
  const segments = path.split('/').filter(Boolean);
  
  // 生成面包屑项（确保键的安全）
  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    let label = '';
    
    // 检查是否为图片资源路径
    if (segment.endsWith('.png') || segment.endsWith('.ico') || segment.endsWith('.svg')) {
      try {
        // 将文件名转换为 images 下的键名
        const key = segment.replace(/[-.]/g, '_').replace(/_png$|_ico$|_svg$/, '');
        label = t(`breadcrumb.images.${key}`);
      } catch (error) {
        // 如果找不到对应的翻译，就使用默认值
        label = segment.split('.')[0];
      }
    } else {
      try {
        label = t(`breadcrumb.${segment}`);
      } catch (error) {
        // 如果翻译找不到，直接使用段名
        label = segment;
      }
    }
    
    return {
      href,
      label,
      isLast: index === segments.length - 1,
    };
  });

  // 如果没有面包屑项或还没有客户端渲染,返回null
  if (breadcrumbs.length === 0 || !isClient) {
    return null;
  }

  // 移动端只显示最后一个面包屑
  const displayBreadcrumbs = isMobile 
    ? breadcrumbs.slice(-1)
    : breadcrumbs;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm mb-4">
      <Link 
        href="/"
        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
        aria-label={t('breadcrumb.home')}
      >
        <HomeIcon className="h-4 w-4 mr-1" />
        <span>{t('breadcrumb.home')}</span>
      </Link>
      
      {displayBreadcrumbs.map((crumb, idx) => (
        <div key={idx} className="flex items-center">
          <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
          {crumb.isLast ? (
            <span className="text-blue-600 dark:text-blue-400 font-medium" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link 
              href={crumb.href} 
              className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
} 