'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';

export default function HistoryClient() {
  const t = useTranslations();
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('jsonHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('jsonHistory');
    setHistory([]);
  };

  const handleItemClick = (item: string) => {
    router.push(`/?json=${encodeURIComponent(item)}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t('history.title')}</h1>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">{t('history.description')}</p>
        <button
          onClick={handleClearHistory}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          {t('history.clearButton')}
        </button>
      </div>
      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-gray-500">{t('history.empty')}</p>
        ) : (
          history.map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(item)}
              className="cursor-pointer p-4 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <pre className="whitespace-pre-wrap break-all">
                {item.length > 200 ? `${item.slice(0, 200)}...` : item}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 