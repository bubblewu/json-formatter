'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/request';
import Editor from '@monaco-editor/react';

export default function JsonFormatter() {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [jsonInput, setJsonInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const outputEditorRef = useRef<any>(null);
  const inputEditorRef = useRef<any>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const outputContainerRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState("500px");

  const handleLanguageChange = (locale: string) => {
    const currentLocale = pathname.split('/')[1];
    // 替换当前语言为新选择的语言
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
  };

  const handleInputEditorDidMount = (editor: any) => {
    inputEditorRef.current = editor;
    // 设置输入编辑器的默认值
    editor.setValue(jsonInput);
    // 监听输入变化
    editor.onDidChangeModelContent(() => {
      setJsonInput(editor.getValue());
    });
  };

  const handleOutputEditorDidMount = (editor: any) => {
    outputEditorRef.current = editor;
    // 设置输出编辑器为只读
    editor.updateOptions({ readOnly: true });
  };

  const formatJson = () => {
    const inputValue = inputEditorRef.current ? inputEditorRef.current.getValue() : jsonInput;
    
    if (!inputValue.trim()) {
      setError(t('errors.empty'));
      setJsonOutput('');
      return;
    }

    try {
      const parsedJson = JSON.parse(inputValue);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setJsonOutput(formattedJson);
      setError(null);
      setSuccess(t('success.formatted'));
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch {
      setError(t('errors.invalid'));
      setJsonOutput('');
    }
  };

  const compressJson = () => {
    const inputValue = inputEditorRef.current ? inputEditorRef.current.getValue() : jsonInput;
    
    if (!inputValue.trim()) {
      setError(t('errors.empty'));
      setJsonOutput('');
      return;
    }

    try {
      const parsedJson = JSON.parse(inputValue);
      const compressedJson = JSON.stringify(parsedJson);
      setJsonOutput(compressedJson);
      setError(null);
      setSuccess(t('success.compressed'));
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch {
      setError(t('errors.invalid'));
      setJsonOutput('');
    }
  };

  const clearJson = () => {
    if (inputEditorRef.current) {
      inputEditorRef.current.setValue('');
    }
    setJsonInput('');
    setJsonOutput('');
    setError(null);
    setSuccess(null);
  };

  const copyToClipboard = () => {
    if (!jsonOutput) return;
    
    navigator.clipboard.writeText(jsonOutput).then(() => {
      setSuccess(t('success.copied'));
      
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
      if (inputEditorRef.current) {
        inputEditorRef.current.setValue(content);
      }
      setJsonInput(content);
    };
    reader.readAsText(file);
  };

  const toggleLineNumbers = () => {
    setShowLineNumbers(!showLineNumbers);
  };

  const toggleFullScreen = () => {
    if (!outputContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      outputContainerRef.current.requestFullscreen().catch(err => {
        console.error(`全屏模式出错: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };
  
  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // 监听调整大小
  const handleResize = (e: React.MouseEvent<HTMLDivElement>) => {
    const startY = e.clientY;
    const startHeight = outputContainerRef.current?.offsetHeight || 500;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newHeight = startHeight + moveEvent.clientY - startY;
      if (newHeight > 200) { // 设置最小高度
        setEditorHeight(`${newHeight}px`);
      }
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* 导航栏 */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm mt-0 pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {/* Logo和站点标题 */}
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg shadow-md">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 5H20V19H4V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 9H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 15H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('title')}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('subtitle')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* 右侧导航项目 */}
            <div className="flex items-center space-x-4">
              {/* 主题切换按钮 */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              {/* 语言切换下拉菜单 */}
              <div className="relative">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <svg className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <select
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="appearance-none bg-transparent focus:outline-none text-gray-700 dark:text-gray-300 pr-8"
                    value={pathname.split('/')[1]}
                  >
                    {locales.map((locale) => (
                      <option key={locale} value={locale}>
                        {locale === 'en' ? 'English' : '中文'}
                      </option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 ml-1 text-gray-500 dark:text-gray-400 pointer-events-none absolute right-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg overflow-hidden shadow-sm">
            <div className="px-4 py-3 flex items-center bg-red-100 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800">
              <svg className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-red-800 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg overflow-hidden shadow-sm">
            <div className="px-4 py-3 flex items-center bg-green-100 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800">
              <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium text-green-800 dark:text-green-300">{success}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-1 h-5 bg-blue-600 rounded-r mr-3"></div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {t('inputLabel')}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={formatJson}
                    className="inline-flex items-center px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17l6-6" />
                    </svg>
                    {t('formatBtn')}
                  </button>
                  <button
                    onClick={clearJson}
                    className="inline-flex items-center px-3 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  >
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {t('clearBtn')}
                  </button>
                  <label className="inline-flex items-center px-3 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 cursor-pointer">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
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
              <div className="h-[500px]">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  defaultValue={jsonInput}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                  onMount={handleInputEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    lineNumbers: showLineNumbers ? 'on' : 'off',
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    automaticLayout: true,
                    folding: true,
                    foldingHighlight: true,
                    foldingStrategy: 'auto',
                    showFoldingControls: 'always',
                    tabSize: 2,
                    padding: { top: 12, bottom: 12 },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div 
              ref={outputContainerRef}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 ${isFullScreen ? 'fixed inset-0 z-50' : 'relative'}`}
            >
              <div className="px-4 py-3 bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-1 h-5 bg-green-600 rounded-r mr-3"></div>
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                    {t('outputLabel')}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={compressJson}
                    className="inline-flex items-center px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  >
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {t('compressBtn')}
                  </button>
                  <button
                    onClick={toggleLineNumbers}
                    className="inline-flex items-center px-3 py-1 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                  >
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {showLineNumbers ? t('lineNumbers.hide') : t('lineNumbers.show')}
                  </button>
                  <button
                    onClick={copyToClipboard}
                    disabled={!jsonOutput}
                    className="inline-flex items-center px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:bg-green-500/50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {t('copyBtn')}
                  </button>
                  <button
                    onClick={downloadJson}
                    disabled={!jsonOutput}
                    className="inline-flex items-center px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors disabled:bg-purple-500/50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  >
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t('downloadBtn')}
                  </button>
                  <button
                    onClick={toggleFullScreen}
                    className="inline-flex items-center px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {isFullScreen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4H4v5m10-5h5v5M4 14h5v5H4m10 0h5v-5" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      )}
                    </svg>
                    {isFullScreen ? '退出全屏' : '全屏'}
                  </button>
                </div>
              </div>
              <div style={{ height: isFullScreen ? 'calc(100% - 55px)' : editorHeight }}>
                <Editor
                  height="100%"
                  language="json"
                  value={jsonOutput}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                  onMount={handleOutputEditorDidMount}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    lineNumbers: showLineNumbers ? 'on' : 'off',
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    automaticLayout: true,
                    folding: true,
                    foldingHighlight: true,
                    foldingStrategy: 'auto',
                    showFoldingControls: 'always',
                    tabSize: 2,
                    padding: { top: 12, bottom: 12 },
                    bracketPairColorization: {
                      enabled: true,
                      independentColorPoolPerBracketType: true,
                    },
                  }}
                />
              </div>
              {!isFullScreen && (
                <div 
                  className="h-1 bg-gray-200 dark:bg-gray-700 cursor-ns-resize hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  onMouseDown={handleResize}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          © 2023 JSON格式化工具 | 使用Monaco编辑器构建
        </div>
      </footer>
    </div>
  );
} 