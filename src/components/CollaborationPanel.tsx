'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

interface CollaborationPanelProps {
  onShareJson: () => string;
}

// 这里我们先模拟协作功能，后续可以集成 Yjs 进行真正的实时协作
export default function CollaborationPanel({ onShareJson }: CollaborationPanelProps) {
  const t = useTranslations('collaboration');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [joinSessionId, setJoinSessionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 客户端挂载检测
  useEffect(() => {
    setMounted(true);
  }, []);

  // 创建新的协作会话
  const createNewSession = () => {
    const newSessionId = nanoid(10);
    setSessionId(newSessionId);
    setJoinSessionId('');
    
    // 可以在这里实现将当前JSON内容存储到协作服务器
    const jsonContent = onShareJson();
    console.log('创建新会话并分享JSON:', jsonContent);
  };

  // 加入现有协作会话
  const joinSession = () => {
    if (joinSessionId.trim()) {
      setSessionId(joinSessionId);
      // 可以在这里实现获取协作会话中的JSON内容
    }
  };

  // 复制会话链接
  const copySessionLink = () => {
    if (!sessionId) return;
    
    const url = `${window.location.origin}/session/${sessionId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // 避免服务端渲染时出现闪烁
  if (!mounted) {
    return <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg h-[200px] animate-pulse"></div>;
  }

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4" suppressHydrationWarning>
        {t('collaborate')}
      </h3>
      
      {!sessionId ? (
        <div className="space-y-4">
          <div>
            <button
              onClick={createNewSession}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span suppressHydrationWarning>{t('newSession')}</span>
            </button>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={joinSessionId}
              onChange={(e) => setJoinSessionId(e.target.value)}
              placeholder="Session ID"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              onClick={joinSession}
              disabled={!joinSessionId.trim()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span suppressHydrationWarning>{t('joinSession')}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-md truncate">
              <span className="font-mono text-sm">{sessionId}</span>
            </div>
            <button
              onClick={copySessionLink}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm focus:outline-none"
            >
              {copied ? <span suppressHydrationWarning>{t('copied')}</span> : <span suppressHydrationWarning>{t('share')}</span>}
            </button>
          </div>
          
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">实时协作已激活</span>
          </div>
          
          <button
            onClick={() => setSessionId(null)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-500"
          >
            离开会话
          </button>
        </div>
      )}
    </div>
  );
} 