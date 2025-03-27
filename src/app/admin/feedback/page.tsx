import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import FeedbackList from './FeedbackList';

// 添加动态路由配置
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'edge';

export default function FeedbackAdmin() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              反馈列表
            </h2>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <Suspense fallback={
              <div className="px-4 py-4 sm:px-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">加载中...</p>
              </div>
            }>
              <FeedbackList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 