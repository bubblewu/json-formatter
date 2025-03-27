'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/i18n/request';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

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
  const [isCompressed, setIsCompressed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const outputEditorRef = useRef<any>(null);
  const inputEditorRef = useRef<any>(null);
  const outputContainerRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState("600px");
  const inputEditorHeight = useRef("600px");
  const outputEditorHeight = useRef("600px");
  const monacoRef = useRef<Monaco | null>(null);

  // 生成或获取用户ID
  useEffect(() => {
    let storedUserId = localStorage.getItem('jsonFormatterUserId');
    if (!storedUserId) {
      storedUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('jsonFormatterUserId', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  const handleLanguageChange = (locale: string) => {
    const currentLocale = pathname.split('/')[1];
    // 替换当前语言为新选择的语言
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
  };

  const handleInputEditorDidMount: OnMount = (editor, monaco) => {
    inputEditorRef.current = editor;
    monacoRef.current = monaco;
    // 设置输入编辑器的默认值
    editor.setValue(jsonInput);
    // 监听输入变化
    editor.onDidChangeModelContent(() => {
      setJsonInput(editor.getValue());
    });
  };

  const handleOutputEditorDidMount: OnMount = (editor, monaco) => {
    outputEditorRef.current = editor;
    // 设置输出编辑器为只读
    editor.updateOptions({ readOnly: true });
  };

  const formatJson = () => {
    const inputValue = inputEditorRef.current ? inputEditorRef.current.getValue() : jsonInput;
    
    if (!inputValue.trim()) {
      setError(t('errors.empty'));
      // 5秒后自动清除错误提示
      setTimeout(() => {
        setError(null);
      }, 5000);
      setJsonOutput('');
      return;
    }

    try {
      const parsedJson = JSON.parse(inputValue);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      setJsonOutput(formattedJson);
      setError(null);
      setSuccess(t('success.formatted'));
      
      // 保存到历史记录
      const historyItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        input: inputValue,
        output: formattedJson,
        operation: 'format' as const
      };
      saveToHistory(historyItem);
      
      // 清除编辑器中的错误标记
      if (inputEditorRef.current && monacoRef.current) {
        try {
          const editor = inputEditorRef.current;
          const model = editor.getModel();
          if (model) {
            monacoRef.current.editor.setModelMarkers(model, 'owner', []);
          }
        } catch (err) {
          console.error(t('jsonErrors.clearMarkError'), err);
        }
      }
      
      // 2秒后自动清除成功提示
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    } catch (e: any) {
      // 获取错误信息和位置
      const errorMessage = e.message || t('errors.invalid');
      setJsonOutput('');
      
      // 尝试从错误消息中提取位置信息
      const positionMatch = errorMessage.match(/at position (\d+)/);
      const lineColumnMatch = errorMessage.match(/at line (\d+) column (\d+)/);
      
      let errorPosition = 0;
      if (positionMatch && positionMatch[1]) {
        errorPosition = parseInt(positionMatch[1], 10);
      }
      
      // 设置精确的错误消息
      const formattedError = errorMessage
        .replace('JSON.parse:', '')
        .replace('Unexpected token', t('jsonErrors.unexpectedToken'))
        .replace('Expected', t('jsonErrors.expected'))
        .replace('in JSON at position', t('jsonErrors.inPosition'));
      
      setError(`${t('errors.invalid')}: ${formattedError}`);
      
      // 如果编辑器已初始化，添加错误标记
      if (inputEditorRef.current && monacoRef.current) {
        try {
          const editor = inputEditorRef.current;
          const model = editor.getModel();
          
          if (model) {
            // 计算出错位置的行和列
            let lineNumber = 1;
            let column = 1;
            
            if (lineColumnMatch) {
              lineNumber = parseInt(lineColumnMatch[1], 10);
              column = parseInt(lineColumnMatch[2], 10);
            } else if (errorPosition > 0) {
              // 手动计算行号和列号
              const textUntilPosition = inputValue.substring(0, errorPosition);
              const lines = textUntilPosition.split('\n');
              lineNumber = lines.length;
              column = lines[lines.length - 1].length + 1;
            }
            
            // 创建错误标记
            const marker = {
              severity: monacoRef.current.MarkerSeverity.Error,
              startLineNumber: lineNumber,
              startColumn: column,
              endLineNumber: lineNumber,
              endColumn: column + 1,
              message: formattedError
            };
            
            // 设置标记到编辑器
            monacoRef.current.editor.setModelMarkers(model, 'owner', [marker]);
            
            // 将视图滚动到错误位置
            editor.revealPositionInCenter({ lineNumber, column });
            
            // 光标定位到错误位置
            editor.setPosition({ lineNumber, column });
          }
        } catch (err) {
          console.error(t('jsonErrors.clearMarkError'), err);
        }
      }
      
      // 5秒后自动清除错误提示
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const compressJson = () => {
    const inputValue = inputEditorRef.current ? inputEditorRef.current.getValue() : jsonInput;
    
    if (!inputValue.trim()) {
      setError(t('errors.empty'));
      // 5秒后自动清除错误提示
      setTimeout(() => {
        setError(null);
      }, 5000);
      setJsonOutput('');
      return;
    }

    try {
      const parsedJson = JSON.parse(inputValue);
      
      if (isCompressed) {
        // 如果当前是压缩状态，则恢复格式化
        const formattedJson = JSON.stringify(parsedJson, null, 2);
        setJsonOutput(formattedJson);
        setError(null);
        setSuccess(t('success.formatted'));
        
        // 保存到历史记录
        const historyItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          input: inputValue,
          output: formattedJson,
          operation: 'format' as const
        };
        saveToHistory(historyItem);
      } else {
        // 如果当前是格式化状态，则进行压缩
        const compressedJson = JSON.stringify(parsedJson);
        setJsonOutput(compressedJson);
        setError(null);
        setSuccess(t('success.compressed'));
        
        // 保存到历史记录
        const historyItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          input: inputValue,
          output: compressedJson,
          operation: 'compress' as const
        };
        saveToHistory(historyItem);
      }
      
      setIsCompressed(!isCompressed);
      
      // 清除编辑器中的错误标记
      if (inputEditorRef.current && monacoRef.current) {
        try {
          const editor = inputEditorRef.current;
          const model = editor.getModel();
          if (model) {
            monacoRef.current.editor.setModelMarkers(model, 'owner', []);
          }
        } catch (err) {
          console.error(t('jsonErrors.clearMarkError'), err);
        }
      }
      
      // 2秒后自动清除成功提示
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    } catch (e: any) {
      // 获取错误信息和位置
      const errorMessage = e.message || t('errors.invalid');
      setJsonOutput('');
      
      // 尝试从错误消息中提取位置信息
      const positionMatch = errorMessage.match(/at position (\d+)/);
      const lineColumnMatch = errorMessage.match(/at line (\d+) column (\d+)/);
      
      let errorPosition = 0;
      if (positionMatch && positionMatch[1]) {
        errorPosition = parseInt(positionMatch[1], 10);
      }
      
      // 设置精确的错误消息
      const formattedError = errorMessage
        .replace('JSON.parse:', '')
        .replace('Unexpected token', t('jsonErrors.unexpectedToken'))
        .replace('Expected', t('jsonErrors.expected'))
        .replace('in JSON at position', t('jsonErrors.inPosition'));
      
      setError(`${t('errors.invalid')}: ${formattedError}`);
      
      // 如果编辑器已初始化，添加错误标记
      if (inputEditorRef.current && monacoRef.current) {
        try {
          const editor = inputEditorRef.current;
          const model = editor.getModel();
          
          if (model) {
            // 计算出错位置的行和列
            let lineNumber = 1;
            let column = 1;
            
            if (lineColumnMatch) {
              lineNumber = parseInt(lineColumnMatch[1], 10);
              column = parseInt(lineColumnMatch[2], 10);
            } else if (errorPosition > 0) {
              // 手动计算行号和列号
              const textUntilPosition = inputValue.substring(0, errorPosition);
              const lines = textUntilPosition.split('\n');
              lineNumber = lines.length;
              column = lines[lines.length - 1].length + 1;
            }
            
            // 创建错误标记
            const marker = {
              severity: monacoRef.current.MarkerSeverity.Error,
              startLineNumber: lineNumber,
              startColumn: column,
              endLineNumber: lineNumber,
              endColumn: column + 1,
              message: formattedError
            };
            
            // 设置标记到编辑器
            monacoRef.current.editor.setModelMarkers(model, 'owner', [marker]);
            
            // 将视图滚动到错误位置
            editor.revealPositionInCenter({ lineNumber, column });
            
            // 光标定位到错误位置
            editor.setPosition({ lineNumber, column });
          }
        } catch (err) {
          console.error(t('jsonErrors.setMarkError'), err);
        }
      }
      
      // 5秒后自动清除错误提示
      setTimeout(() => {
        setError(null);
      }, 5000);
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

  const removeEscapeChars = () => {
    const inputValue = inputEditorRef.current ? inputEditorRef.current.getValue() : jsonInput;
    
    if (!inputValue.trim()) {
      setError(t('errors.empty'));
      // 5秒后自动清除错误提示
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }

    try {
      // 首先尝试解析为JSON
      let parsedJson = JSON.parse(inputValue);
      
      // 如果是字符串，则尝试去除转义字符
      if (typeof parsedJson === 'string') {
        try {
          // 尝试再次解析字符串，去除转义
          const unescapedJson = JSON.parse(parsedJson);
          
          // 检查是否实际需要转义
          const reStringifiedOriginal = JSON.stringify(parsedJson);
          const needsUnescaping = reStringifiedOriginal !== `"${parsedJson}"` || 
                                  parsedJson.includes('\\\"') || 
                                  parsedJson.includes('\\\\') ||
                                  parsedJson.includes('\\n') ||
                                  parsedJson.includes('\\t') ||
                                  parsedJson.includes('\\r');
          
          if (!needsUnescaping) {
            setError(null);
            setSuccess(t('success.noEscapeNeeded'));
            setTimeout(() => {
              setSuccess(null);
            }, 2000);
            return;
          }
          
          // 如果解析成功，将其重新格式化为字符串
          if (typeof unescapedJson === 'object' && unescapedJson !== null) {
            const formattedJson = JSON.stringify(unescapedJson, null, 2);
            if (inputEditorRef.current) {
              inputEditorRef.current.setValue(formattedJson);
            }
            setJsonInput(formattedJson);
            setError(null);
            setSuccess(t('success.unescaped'));
            
            // 保存到历史记录
            const historyItem = {
              id: Date.now().toString(),
              timestamp: Date.now(),
              input: inputValue,
              output: formattedJson,
              operation: 'unescape' as const
            };
            saveToHistory(historyItem);
          } else {
            // 如果不是对象，直接显示
            if (inputEditorRef.current) {
              inputEditorRef.current.setValue(String(unescapedJson));
            }
            setJsonInput(String(unescapedJson));
            setError(null);
            setSuccess(t('success.unescaped'));
            
            // 保存到历史记录
            const historyItem = {
              id: Date.now().toString(),
              timestamp: Date.now(),
              input: inputValue,
              output: String(unescapedJson),
              operation: 'unescape' as const
            };
            saveToHistory(historyItem);
          }
        } catch (e) {
          // 如果再次解析失败，保持原始字符串
          setError(t('errors.invalidEscape'));
          // 5秒后自动清除错误提示
          setTimeout(() => {
            setError(null);
          }, 5000);
        }
      } else {
        // 如果不是字符串，提示用户
        setError(t('errors.notString'));
        // 5秒后自动清除错误提示
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    } catch (e) {
      setError(t('errors.invalid'));
      // 5秒后自动清除错误提示
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const copyToClipboard = () => {
    if (!jsonOutput) return;
    
    navigator.clipboard.writeText(jsonOutput).then(() => {
      setSuccess(t('success.copied'));
      
      // 2秒后自动清除成功提示
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
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
        console.error(`${t('jsonErrors.fullscreenError')}: ${err.message}`);
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
  const handleResize = (e: React.MouseEvent<HTMLDivElement>, isInput: boolean) => {
    const startY = e.clientY;
    const startHeight = isInput ? 
      (inputEditorRef.current?.getDomNode()?.offsetHeight || 500) :
      (outputContainerRef.current?.offsetHeight || 500);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newHeight = startHeight + moveEvent.clientY - startY;
      if (newHeight > 200) { // 设置最小高度
        if (isInput) {
          inputEditorHeight.current = `${newHeight}px`;
        } else {
          outputEditorHeight.current = `${newHeight}px`;
        }
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

  // 保存历史记录
  const saveToHistory = (item: {
    id: string;
    timestamp: number;
    input: string;
    output: string;
    operation: 'format' | 'compress' | 'unescape';
  }) => {
    try {
      const historyKey = `jsonFormatterHistory_${userId}`;
      const savedHistory = localStorage.getItem(historyKey);
      const history = savedHistory ? JSON.parse(savedHistory) : [];
      
      // 限制历史记录数量为100条
      const newHistory = [item, ...history].slice(0, 100);
      
      localStorage.setItem(historyKey, JSON.stringify(newHistory));
    } catch (error) {
      console.error(t('jsonErrors.saveHistoryError'), error);
    }
  };

  // 获取历史记录
  const getHistory = () => {
    try {
      const historyKey = `jsonFormatterHistory_${userId}`;
      const savedHistory = localStorage.getItem(historyKey);
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error(t('jsonErrors.getHistoryError'), error);
      return [];
    }
  };

  // 清除历史记录
  const clearHistory = () => {
    try {
      const historyKey = `jsonFormatterHistory_${userId}`;
      localStorage.removeItem(historyKey);
    } catch (error) {
      console.error(t('jsonErrors.clearHistoryError'), error);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <header className="px-4 py-4 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('subtitle')}</p>
      </header>

      <div className="p-4">
        {/* 工具栏 */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {/* 主题切换 */}
            <div className="flex items-center space-x-2">
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
            </div>
            {/* 行号切换 */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleLineNumbers}
                className="inline-flex items-center px-2 py-1 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="truncate max-w-[60px] sm:max-w-none">{showLineNumbers ? t('lineNumbers.hide') : t('lineNumbers.show')}</span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={formatJson}
              className="inline-flex items-center px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17l6-6" />
              </svg>
              <span className="truncate max-w-[60px] sm:max-w-none">{t('formatBtn')}</span>
            </button>
            <button
              onClick={removeEscapeChars}
              className="inline-flex items-center px-2 py-1 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span className="truncate max-w-[60px] sm:max-w-none">{t('removeEscapeBtn')}</span>
            </button>
            <button
              onClick={clearJson}
              className="inline-flex items-center px-2 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="truncate max-w-[60px] sm:max-w-none">{t('clearBtn')}</span>
            </button>
            <label className="inline-flex items-center px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 cursor-pointer whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="truncate max-w-[60px] sm:max-w-none">{t('uploadBtn')}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* 错误和成功消息 */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg overflow-hidden shadow-sm">
            <div className="px-4 py-3 flex items-center justify-between bg-red-100 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-red-800 dark:text-red-300">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-4 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg overflow-hidden shadow-sm">
            <div className="px-4 py-3 flex items-center justify-between bg-green-100 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-green-800 dark:text-green-300">{success}</span>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="ml-4 text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* 编辑器容器 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" ref={outputContainerRef}>
          {/* 输入编辑器 */}
          <div className="relative">
            <label htmlFor="input-editor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('inputLabel')}
            </label>
            <div id="input-editor" aria-label={t('inputLabel')} style={{ height: editorHeight }} className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
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

          {/* 输出编辑器 */}
          <div className="relative">
            <label htmlFor="output-editor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('outputLabel')}
            </label>
            <div id="output-editor" aria-label={t('outputLabel')} style={{ height: editorHeight }} className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
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
          </div>
        </div>
      </div>
    </section>
  );
} 