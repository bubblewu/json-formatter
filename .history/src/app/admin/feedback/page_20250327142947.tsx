'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface Feedback {
  id: string;
  feedback: string;
  contact: string;
  userId: string;
  timestamp: string;
}

export default function FeedbackAdmin() {
  const t = useTranslations();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      if (data.success === false) {
        throw new Error(data.message);
      }
      setFeedbacks(data.feedbacks);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取反馈失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600 dark:text-red-400">
            错误: {error}
          </div>
        </div>
      </div>
    );
  }

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
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {feedbacks.map((feedback) => (
                <li key={feedback.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(feedback.timestamp).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {feedback.userId}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {feedback.feedback}
                    </p>
                    {feedback.contact && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        联系方式: {feedback.contact}
                      </p>
                    )}
                  </div>
                </li>
              ))}
              {feedbacks.length === 0 && (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400">
                  暂无反馈
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 