'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import LanguageSwitcher from './LanguageSwitcher';

export default function JsonFormatter() {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const formatJson = () => {
    if (!jsonInput.trim()) {
      setError(t('errors.empty'));
      setJsonOutput('');
      return;
    }

    try {
      const parsedJson = JSON.parse(jsonInput);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setJsonOutput(formattedJson);
      setError(null);
      setSuccess(t('success.formatted'));
      
      // 清除成功消息的定时器
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(t('errors.invalid'));
      setJsonOutput('');
    }
  };

  const clearJson = () => {
    setJsonInput('');
    setJsonOutput('');
    setError(null);
    setSuccess(null);
  };

  const copyToClipboard = () => {
    if (!jsonOutput) return;
    
    navigator.clipboard.writeText(jsonOutput).then(() => {
      setSuccess(t('success.copied'));
      
      // 清除成功消息的定时器
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    });
  };

  const downloadJson = () => {
    if (!jsonOutput) return;
    
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted-json.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('subtitle')}
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === 'dark' ? t('theme.light') : t('theme.dark')}
          </button>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder={t('placeholder')}
            className="w-full h-[400px] p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-mono resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <textarea
            ref={outputRef}
            value={jsonOutput}
            readOnly
            className="w-full h-[400px] p-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 mb-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md">
          {success}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={formatJson}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          {t('formatBtn')}
        </button>
        <button
          onClick={clearJson}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
        >
          {t('clearBtn')}
        </button>
        <button
          onClick={copyToClipboard}
          disabled={!jsonOutput}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
        >
          {t('copyBtn')}
        </button>
        <button
          onClick={downloadJson}
          disabled={!jsonOutput}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
        >
          {t('downloadBtn')}
        </button>
        <label className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors cursor-pointer">
          {t('uploadBtn')}
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
} 