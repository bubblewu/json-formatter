'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';
import { useLocale } from 'next-intl';

// 历史记录项目类型
type HistoryItem = {
  id: string;
  timestamp: number;
  content: string;
  name: string;
};

// 暴露的方法
export interface HistoryPanelRef {
  saveToHistory: (content: string, name?: string) => void;
}

interface HistoryPanelProps {
  onSelectHistory: (content: string) => void;
}

const HistoryPanel = forwardRef<HistoryPanelRef, HistoryPanelProps>(({ onSelectHistory }, ref) => {
  const locale = useLocale();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // 加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('json-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    saveToHistory: (content: string, name = '未命名') => {
      if (!content.trim()) return;

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        content,
        name,
      };

      const newHistory = [newItem, ...history.slice(0, 19)]; // 只保留最近20条
      setHistory(newHistory);
      localStorage.setItem('json-history', JSON.stringify(newHistory));
    }
  }));

  // 清除全部历史
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('json-history');
  };

  // 删除单条历史
  const deleteHistoryItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('json-history', JSON.stringify(newHistory));
  };

  // 获取格式化的时间
  const getFormattedTime = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { 
      addSuffix: true,
      locale: locale === 'zh' ? zhCN : enUS
    });
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">历史记录</h3>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            清除全部
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          暂无历史记录
        </div>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {history.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <button
                className="flex-1 text-left truncate"
                onClick={() => onSelectHistory(item.content)}
              >
                <div className="font-medium text-sm">{item.name || '未命名'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getFormattedTime(item.timestamp)}
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHistoryItem(item.id);
                }}
                className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

HistoryPanel.displayName = 'HistoryPanel';

export default HistoryPanel; 