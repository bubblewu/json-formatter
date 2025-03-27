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
          <button
            onClick={toggleLineNumbers}
            className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {showLineNumbers ? t('lineNumbers.hide') : t('lineNumbers.show')}
          </button>
          <div className="relative">
            <select
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors appearance-none pr-8"
              value={pathname.split('/')[1]}
            >
              {locales.map((locale) => (
                <option key={locale} value={locale}>
                  {locale === 'en' ? 'English' : '中文'}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg 
                className="w-4 h-4 text-gray-800 dark:text-white" 
                fill="none" 
                stroke="currentColor"
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </div>
          </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">
              {t('inputLabel')}
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={formatJson}
                className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                {t('formatBtn')}
              </button>
              <button
                onClick={compressJson}
                className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
              >
                {t('compressBtn')}
              </button>
              <button
                onClick={clearJson}
                className="px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                {t('clearBtn')}
              </button>
              <label className="px-3 py-1.5 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors cursor-pointer">
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
          <div className="h-[400px] border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <Editor
              height="400px"
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
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700 dark:text-gray-300">
              {t('outputLabel')}
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={copyToClipboard}
                disabled={!jsonOutput}
                className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {t('copyBtn')}
              </button>
              <button
                onClick={downloadJson}
                disabled={!jsonOutput}
                className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
              >
                {t('downloadBtn')}
              </button>
            </div>
          </div>
          <div className="h-[400px] border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <Editor
              height="400px"
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
  );
} 