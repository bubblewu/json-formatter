'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/config';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import Feedback from '@/components/Feedback/Feedback';
import { debounce, getFixSuggestion } from '@/lib/utils';
import { EXAMPLE_JSONC, HISTORY_STORAGE_KEY, MAX_HISTORY_ITEMS } from '@/lib/constants';

interface HistoryItem {
  input: string;
  output: string;
  timestamp: number;
}

export default function JsonFormatter() {
  const t = useTranslations();
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [outputValue, setOutputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userId] = useState(() => Math.random().toString(36).substring(7));
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const inputEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const outputEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // 从本地存储加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
  }, []);

  // 保存历史记录到本地存储
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    }
  }, [history]);

  // 处理输入变化
  const handleInputChange = debounce((value: string | undefined) => {
    if (!value) {
      setInputValue('');
      setOutputValue('');
      setError(null);
      setIsValid(true);
      return;
    }

    setInputValue(value);
    try {
      // 尝试解析JSONC
      const jsonString = value.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutputValue(formatted);
      setError(null);
      setIsValid(true);

      // 添加到历史记录
      setHistory(prev => {
        const newHistory = [
          { input: value, output: formatted, timestamp: Date.now() },
          ...prev
        ].slice(0, MAX_HISTORY_ITEMS);
        return newHistory;
      });
    } catch (e) {
      const error = e as Error;
      const errorMessage = error.message;
      const errorPosition = parseInt(errorMessage.match(/position (\d+)/)?.[1] || '0');
      
      // 提供修复建议
      const fixSuggestion = getFixSuggestion(errorMessage, value, errorPosition, t);
      const errorWithSuggestion = typeof fixSuggestion === 'string' 
        ? `${t('errors.invalid')}: ${errorMessage} - ${t('errors.suggestion')}: ${fixSuggestion}`
        : `${t('errors.invalid')}: ${errorMessage} - ${t('errors.suggestion')}: ${fixSuggestion.fixDescription}`;
      
      setError(errorWithSuggestion);
      setIsValid(false);
      setOutputValue('');
    }
  }, 500);

  // 处理编辑器挂载
  const handleInputEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    inputEditorRef.current = editor;

    // 配置编辑器支持JSONC
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [],
      enableSchemaRequest: false,
      allowComments: true
    });

    // 设置初始值
    if (inputValue) {
      editor.setValue(inputValue);
    }
  };

  const handleOutputEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    outputEditorRef.current = editor;
    if (outputValue) {
      editor.setValue(outputValue);
    }
  };

  // 处理语言切换
  const handleLanguageChange = (newLocale: string) => {
    const currentPath = pathname;
    const newPath = currentPath.replace(/^\/[^\/]+/, `/${newLocale}`);
    router.push(newPath);
  };

  // 处理历史记录项点击
  const handleHistoryItemClick = (item: HistoryItem) => {
    setInputValue(item.input);
    setOutputValue(item.output);
    setError(null);
    setIsValid(true);
    if (inputEditorRef.current) {
      inputEditorRef.current.setValue(item.input);
    }
    if (outputEditorRef.current) {
      outputEditorRef.current.setValue(item.output);
    }
    setShowHistory(false);
  };

  // 处理示例按钮点击
  const handleDemoClick = () => {
    if (showDemo) {
      setInputValue('');
      setOutputValue('');
      setError(null);
      setIsValid(true);
      if (inputEditorRef.current) {
        inputEditorRef.current.setValue('');
      }
      if (outputEditorRef.current) {
        outputEditorRef.current.setValue('');
      }
    } else {
      setInputValue(EXAMPLE_JSONC);
      try {
        const jsonString = EXAMPLE_JSONC.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        const parsed = JSON.parse(jsonString);
        const formatted = JSON.stringify(parsed, null, 2);
        setOutputValue(formatted);
        if (inputEditorRef.current) {
          inputEditorRef.current.setValue(EXAMPLE_JSONC);
        }
        if (outputEditorRef.current) {
          outputEditorRef.current.setValue(formatted);
        }
      } catch (e) {
        console.error('Failed to parse example:', e);
      }
    }
    setShowDemo(!showDemo);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4">
        {/* 语言选择器 */}
        <div className="flex justify-end space-x-2">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {locale.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 标题和描述 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('description')}</p>
        </div>

        {/* 编辑器容器 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 输入编辑器 */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{t('input.title')}</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleDemoClick}
                  className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                >
                  {showDemo ? t('hideDemoBtn') : t('showDemoBtn')}
                </button>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {t('history.title')}
                </button>
              </div>
            </div>
            <div className="relative flex-1">
              <Editor
                height="500px"
                defaultLanguage="jsonc"
                theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                onChange={handleInputChange}
                onMount={handleInputEditorDidMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  folding: true,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: 'all',
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible',
                    useShadows: false,
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                    arrowSize: 30
                  }
                }}
              />
            </div>
          </div>

          {/* 输出编辑器 */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">{t('output.title')}</h2>
            <div className="relative flex-1">
              <Editor
                height="500px"
                defaultLanguage="json"
                theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                value={outputValue}
                onMount={handleOutputEditorDidMount}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  folding: true,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: 'all',
                  scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible',
                    useShadows: false,
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                    arrowSize: 30
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
            {error}
          </div>
        )}

        {/* 历史记录面板 */}
        {showHistory && history.length > 0 && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <h3 className="text-lg font-semibold mb-2">{t('history.title')}</h3>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleHistoryItemClick(item)}
                  className="p-2 bg-white dark:bg-gray-700 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                  <div className="truncate">{item.input}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 反馈按钮 */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowFeedback(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {t('feedback.button')}
          </button>
        </div>
      </div>

      {/* 反馈对话框 */}
      {showFeedback && (
        <Feedback
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          userId={userId}
        />
      )}
    </div>
  );
} 