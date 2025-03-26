'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { json } from '@codemirror/lang-json';
import CollaborationPanel from './CollaborationPanel';
import HistoryPanel, { HistoryPanelRef } from './HistoryPanel';

export default function JsonEditor() {
  const t = useTranslations('editor');
  const inputEditorRef = useRef<HTMLDivElement>(null);
  const outputEditorRef = useRef<HTMLDivElement>(null);
  const [inputView, setInputView] = useState<EditorView | null>(null);
  const [outputView, setOutputView] = useState<EditorView | null>(null);
  const [jsonValid, setJsonValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const historyPanelRef = useRef<HistoryPanelRef>(null);
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
            '&': { height: '100%', minHeight: '300px' },
            '.cm-scroller': { overflow: 'auto', fontFamily: '"JetBrains Mono", "Fira Code", monospace' },
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
            '&': { height: '100%', minHeight: '300px' },
            '.cm-scroller': { overflow: 'auto', fontFamily: '"JetBrains Mono", "Fira Code", monospace' },
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
      JSON.parse(jsonStr);
      setJsonValid(true);
      setError(null);
    } catch (e) {
      setJsonValid(false);
      setError((e as Error).message);
      if (outputView) {
        outputView.dispatch({
          changes: { from: 0, to: outputView.state.doc.length, insert: '' },
        });
      }
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
      
      // 保存到历史记录
      if (historyPanelRef.current?.saveToHistory) {
        historyPanelRef.current.saveToHistory(inputJson, '已格式化的JSON');
      }
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
      
      // 保存到历史记录
      if (historyPanelRef.current?.saveToHistory) {
        historyPanelRef.current.saveToHistory(inputJson, '已压缩的JSON');
      }
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
    a.download = 'formatted-json.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // 设置编辑器内容
  const setEditorContent = (content: string) => {
    if (!inputView) return;
    
    inputView.dispatch({
      changes: { from: 0, to: inputView.state.doc.length, insert: content },
    });
  };

  // 加载示例
  const loadExample = () => {
    const exampleJson = `{
  "name": "JSON Formatter",
  "version": "1.0.0",
  "description": "A powerful JSON formatting tool",
  "features": [
    "Format JSON",
    "Minify JSON",
    "Validate JSON",
    "Save History"
  ],
  "settings": {
    "theme": "auto",
    "indentation": 2,
    "saveHistory": true
  }
}`;
    setEditorContent(exampleJson);
  };

  if (!mounted) {
    return <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>;
  }

  return (
    <div className="w-full">
      <div className="toolbar mb-6 flex justify-between items-center flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={formatJson}
            className="btn btn-primary"
            disabled={jsonValid === false}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span suppressHydrationWarning>{t('format')}</span>
          </button>
          <button
            onClick={minifyJson}
            className="btn btn-secondary"
            disabled={jsonValid === false}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span suppressHydrationWarning>{t('minify')}</span>
          </button>
          <button
            onClick={loadExample}
            className="btn btn-outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <span suppressHydrationWarning>{t('example')}</span>
          </button>
        </div>
        <div>
          <button
            onClick={clearInput}
            className="btn btn-outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span suppressHydrationWarning>{t('clear')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="editor-container">
          <div className="editor-header">
            <h2 className="editor-title" suppressHydrationWarning>{t('input')}</h2>
            <div className="status-indicator">
              {jsonValid === true && (
                <span className="text-green-500 flex items-center" suppressHydrationWarning>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('valid')}
                </span>
              )}
              {jsonValid === false && (
                <span className="text-red-500 flex items-center" suppressHydrationWarning>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {t('invalid')}
                </span>
              )}
            </div>
          </div>
          <div className="editor-content" ref={inputEditorRef}></div>
        </div>

        <div className="editor-container">
          <div className="editor-header">
            <h2 className="editor-title" suppressHydrationWarning>{t('output')}</h2>
            <div className="flex space-x-2">
              <button
                onClick={copyOutput}
                className="btn btn-outline py-1 px-2 text-xs flex items-center"
              >
                {copySuccess ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span suppressHydrationWarning className="text-green-500">{t('copied')}</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                      <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                    </svg>
                    <span suppressHydrationWarning>{t('copy')}</span>
                  </>
                )}
              </button>
              <button
                onClick={downloadJson}
                className="btn btn-outline py-1 px-2 text-xs flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span suppressHydrationWarning>{t('download')}</span>
              </button>
            </div>
          </div>
          <div className="editor-content" ref={outputEditorRef}></div>
        </div>
      </div>

      {jsonValid === false && error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          <strong suppressHydrationWarning>{t('errorTitle')}: </strong>
          <span suppressHydrationWarning>{t('error', { message: error })}</span>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">历史与协作</h2>
        </div>
        <div className="lg:col-span-2">
          <HistoryPanel ref={historyPanelRef} onSelectHistory={setEditorContent} />
        </div>
        <div>
          <CollaborationPanel onShareJson={() => inputView?.state.doc.toString() || ''} />
        </div>
      </div>
    </div>
  );
} 