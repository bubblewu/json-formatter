'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { json } from '@codemirror/lang-json';

export default function JsonFormatter() {
  const t = useTranslations('formatter');
  const inputEditorRef = useRef<HTMLDivElement>(null);
  const outputEditorRef = useRef<HTMLDivElement>(null);
  const [inputView, setInputView] = useState<EditorView | null>(null);
  const [outputView, setOutputView] = useState<EditorView | null>(null);
  const [jsonValid, setJsonValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // 初始化编辑器
  useEffect(() => {
    setMounted(true);
    
    if (inputEditorRef.current && !inputView) {
      const state = EditorState.create({
        doc: '',
        extensions: [
          basicSetup,
          json(),
          EditorView.theme({
            '&': { height: '100%' },
            '.cm-scroller': { 
              overflow: 'auto', 
              fontFamily: '"SF Mono", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace'
            },
            '.cm-content': { padding: '10px' },
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              validateJson(update.state.doc.toString());
            }
          }),
        ],
      });

      const view = new EditorView({
        state,
        parent: inputEditorRef.current,
      });

      setInputView(view);
    }

    if (outputEditorRef.current && !outputView) {
      const state = EditorState.create({
        doc: '',
        extensions: [
          basicSetup,
          json(),
          EditorView.editable.of(false),
          EditorView.theme({
            '&': { height: '100%' },
            '.cm-scroller': { 
              overflow: 'auto', 
              fontFamily: '"SF Mono", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace'
            },
            '.cm-content': { padding: '10px' },
          }),
        ],
      });

      const view = new EditorView({
        state,
        parent: outputEditorRef.current,
      });

      setOutputView(view);
    }

    return () => {
      inputView?.destroy();
      outputView?.destroy();
    };
  }, [inputView, outputView]);

  // 验证JSON
  const validateJson = (jsonStr: string) => {
    if (!jsonStr.trim()) {
      setJsonValid(null);
      setError(null);
      if (outputView) {
        outputView.dispatch({
          changes: { from: 0, to: outputView.state.doc.length, insert: '' },
        });
      }
      return;
    }

    try {
      // 只需要验证JSON是否有效，不需要使用解析后的值
      JSON.parse(jsonStr);
      setJsonValid(true);
      setError(null);
    } catch (e) {
      setJsonValid(false);
      setError((e as Error).message);
    }
  };

  // 格式化JSON
  const formatJson = () => {
    if (!inputView || !outputView) return;

    const inputJson = inputView.state.doc.toString();
    if (!inputJson.trim()) return;

    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, 2);
      outputView.dispatch({
        changes: { from: 0, to: outputView.state.doc.length, insert: formatted },
      });
      setJsonValid(true);
      setError(null);
    } catch (e) {
      setJsonValid(false);
      setError((e as Error).message);
    }
  };

  // 压缩JSON
  const minifyJson = () => {
    if (!inputView || !outputView) return;

    const inputJson = inputView.state.doc.toString();
    if (!inputJson.trim()) return;

    try {
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      outputView.dispatch({
        changes: { from: 0, to: outputView.state.doc.length, insert: minified },
      });
      setJsonValid(true);
      setError(null);
    } catch (e) {
      setJsonValid(false);
      setError((e as Error).message);
    }
  };

  // 清除输入
  const clearInput = () => {
    if (!inputView) return;
    inputView.dispatch({
      changes: { from: 0, to: inputView.state.doc.length, insert: '' },
    });
    if (outputView) {
      outputView.dispatch({
        changes: { from: 0, to: outputView.state.doc.length, insert: '' },
      });
    }
    setJsonValid(null);
    setError(null);
  };

  // 复制输出
  const copyOutput = () => {
    if (!outputView) return;
    const outputJson = outputView.state.doc.toString();
    if (!outputJson.trim()) return;

    navigator.clipboard.writeText(outputJson)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(console.error);
  };
  
  // 下载JSON文件
  const downloadJson = () => {
    if (!outputView) return;
    const outputJson = outputView.state.doc.toString();
    if (!outputJson.trim()) return;

    const blob = new Blob([outputJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 加载示例
  const loadExample = () => {
    if (!inputView) return;

    const example = `{
  "name": "JSON Formatter",
  "version": "1.0.0",
  "description": "A powerful JSON formatting tool",
  "features": [
    "Format JSON",
    "Minify JSON",
    "Validate JSON"
  ],
  "settings": {
    "theme": "auto",
    "indentation": 2,
    "language": "en"
  },
  "active": true,
  "downloads": 12345,
  "lastUpdated": "2024-03-25T12:34:56Z"
}`;

    inputView.dispatch({
      changes: { from: 0, to: inputView.state.doc.length, insert: example },
    });
  };

  if (!mounted) {
    return (
      <div className="flex flex-col h-full animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* 输入区域 */}
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">{t('input')}</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {jsonValid === true && (
                <span className="flex items-center text-sm text-apple-green-light dark:text-apple-green-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('valid')}
                </span>
              )}
              {jsonValid === false && (
                <span className="flex items-center text-sm text-apple-red-light dark:text-apple-red-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {t('invalid')}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden" ref={inputEditorRef}></div>
      </div>

      {/* 输出区域 */}
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">{t('output')}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyOutput}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                copySuccess 
                  ? 'bg-apple-green-light/10 text-apple-green-light dark:bg-apple-green-dark/10 dark:text-apple-green-dark' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {copySuccess ? t('copied') : t('copy')}
            </button>
            <button
              onClick={downloadJson}
              className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {t('download')}
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden" ref={outputEditorRef}></div>
      </div>

      {/* 工具栏 */}
      <div className="lg:col-span-2 flex flex-wrap items-center gap-2">
        <button
          onClick={formatJson}
          className="apple-button-primary"
        >
          {t('format')}
        </button>
        <button
          onClick={minifyJson}
          className="apple-button-secondary"
        >
          {t('minify')}
        </button>
        <button
          onClick={clearInput}
          className="apple-button-secondary"
        >
          {t('clear')}
        </button>
        <button
          onClick={loadExample}
          className="apple-button-secondary"
        >
          {t('example')}
        </button>

        {/* 错误提示 */}
        {jsonValid === false && error && (
          <div className="ml-auto text-apple-red-light dark:text-apple-red-dark text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {t('error')}: {error}
          </div>
        )}
      </div>
    </div>
  );
} 