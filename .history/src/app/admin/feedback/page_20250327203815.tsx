'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import FeedbackList from './FeedbackList';

// 添加动态路由配置
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function FeedbackAdmin() {
  const t = useTranslations();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const response = await fetch('/api/feedback');
        if (response.ok) {
          const data = await response.json();
          setFeedbacks(data);
        }
      } catch (error) {
        console.error('获取反馈失败', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFeedback();
  }, []);

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
            {loading ? (
              <div className="px-4 py-4 sm:px-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">加载中...</p>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="px-4 py-4 sm:px-6 text-center">
                <p className="text-gray-500">暂无反馈</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {feedbacks.map((feedback, index) => (
                  <div key={index} className="px-4 py-4 sm:px-6">
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                      {feedback.content}
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(feedback.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 