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

  // 防抖函数
  const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function(this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  };

  const handleInputEditorDidMount: OnMount = (editor, monaco) => {
    inputEditorRef.current = editor;
    monacoRef.current = monaco;
    
    // 优化编辑器性能
    editor.updateOptions({
      renderLineHighlight: 'none', // 禁用行高亮以提高性能
      renderWhitespace: 'none',    // 禁用空白字符渲染
      renderControlCharacters: false,
      guides: { indentation: false }, // 正确的属性名
      scrollBeyondLastLine: false,
      // 大文件处理优化
      largeFileOptimizations: true,
    });
    
    // 设置输入编辑器的默认值
    editor.setValue(jsonInput);
    
    // 使用防抖处理输入变化，避免频繁更新状态
    const debouncedInputChange = debounce((value: string) => {
      setJsonInput(value);
    }, 300);
    
    // 监听输入变化
    editor.onDidChangeModelContent(() => {
      debouncedInputChange(editor.getValue());
    });
  };

  const handleOutputEditorDidMount: OnMount = (editor, monaco) => {
    outputEditorRef.current = editor;
    // 优化性能
    editor.updateOptions({
      readOnly: true,
      renderLineHighlight: 'none',
      renderWhitespace: 'none',
      renderControlCharacters: false,
      guides: { indentation: false },
      scrollBeyondLastLine: false,
      largeFileOptimizations: true,
    });
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
      
      // 提供修复建议
      const fixSuggestion = getFixSuggestion(errorMessage, inputValue, errorPosition);
      const errorWithSuggestion = typeof fixSuggestion === 'string' 
        ? `${t('errors.invalid')}: ${formattedError} - ${t('errors.suggestion')}: ${fixSuggestion}`
        : `${t('errors.invalid')}: ${formattedError} - ${t('errors.suggestion')}: ${fixSuggestion.fixDescription}`;
      
      setError(errorWithSuggestion);
      
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
              message: errorWithSuggestion
            };
            
            // 设置标记到编辑器
            monacoRef.current.editor.setModelMarkers(model, 'owner', [marker]);
            
            // 将视图滚动到错误位置
            editor.revealPositionInCenter({ lineNumber, column });
            
            // 光标定位到错误位置
            editor.setPosition({ lineNumber, column });
            
            // 如果有修复建议且具有autoFix方法，提供辅助标记
            if (typeof fixSuggestion !== 'string' && fixSuggestion.autoFix) {
              // 创建信息标记，显示在错误下方
              const infoMarker = {
                severity: monacoRef.current.MarkerSeverity.Info,
                startLineNumber: lineNumber,
                startColumn: column,
                endLineNumber: lineNumber,
                endColumn: column + 1,
                message: t('errors.autoFixAvailable')
              };
              
              // 添加建议标记
              const markers = [marker, infoMarker];
              monacoRef.current.editor.setModelMarkers(model, 'owner', markers);
              
              // 添加自动修复按钮
              setTimeout(() => {
                setSuccess(`${t('errors.clickToFix')}: ${typeof fixSuggestion !== 'string' ? fixSuggestion.fixDescription : ''}`);
                
                // 添加点击修复按钮
                const fixButton = document.createElement('button');
                fixButton.textContent = t('errors.applyFix');
                fixButton.className = 'px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded ml-2';
                
                // 获取成功消息DOM
                const successMsg = document.querySelector('.bg-green-50.dark\\:bg-green-900\\/20');
                if (successMsg) {
                  const msgContent = successMsg.querySelector('.flex.items-center');
                  if (msgContent) {
                    msgContent.appendChild(fixButton);
                    
                    // 点击修复
                    fixButton.addEventListener('click', () => {
                      if (inputEditorRef.current && typeof fixSuggestion !== 'string' && fixSuggestion.autoFix) {
                        const editor = inputEditorRef.current;
                        const fixedValue = fixSuggestion.autoFix(inputValue);
                        editor.setValue(fixedValue);
                        setJsonInput(fixedValue);
                        setSuccess(t('success.fixApplied'));
                        setError(null);
                        
                        // 清除标记
                        if (monacoRef.current) {
                          const model = editor.getModel();
                          if (model) {
                            monacoRef.current.editor.setModelMarkers(model, 'owner', []);
                          }
                        }
                        
                        // 2秒后清除成功消息
                        setTimeout(() => {
                          setSuccess(null);
                        }, 2000);
                      }
                    });
                  }
                }
              }, 100);
            }
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

  // JSON错误修复建议类型
  interface FixSuggestion {
    fixDescription: string;
    autoFix?: (input: string) => string;
  }

  // JSON错误修复建议生成函数
  const getFixSuggestion = (errorMessage: string, inputValue: string, errorPosition: number): FixSuggestion | string => {
    // 检查常见的错误类型并提供修复建议
    
    // 1. 缺少括号或大括号
    if (errorMessage.includes('Unexpected end of JSON input')) {
      const lastChar = inputValue.trim().slice(-1);
      if (lastChar === '{' || lastChar === '[') {
        return {
          fixDescription: t('suggestions.missingClosingBracket'),
          autoFix: (input: string) => {
            const trimmed = input.trim();
            return lastChar === '{' ? trimmed + '}' : trimmed + ']';
          }
        };
      }
      
      // 检查是否缺少结束引号
      const quoteMatch = /\"([^\"]*)\s*$/.exec(inputValue);
      if (quoteMatch) {
        return {
          fixDescription: t('suggestions.missingClosingQuote'),
          autoFix: (input: string) => input + '"'
        };
      }
      
      return t('suggestions.incompleteJson');
    }
    
    // 2. 属性名没有引号
    if (errorMessage.includes('Unexpected token') && errorPosition > 0) {
      // 查找错误位置前的字符
      const textBeforeError = inputValue.substring(0, errorPosition);
      const lastOpenBrace = textBeforeError.lastIndexOf('{');
      const lastColon = textBeforeError.lastIndexOf(':');
      
      // 如果在大括号和冒号之间有非引号包裹的内容
      if (lastOpenBrace > -1 && (lastColon === -1 || lastColon < lastOpenBrace)) {
        const potentialKey = textBeforeError.substring(lastOpenBrace + 1).trim();
        if (potentialKey && !potentialKey.startsWith('"') && !potentialKey.endsWith('"')) {
          return {
            fixDescription: t('suggestions.missingQuotesAroundKey'),
            autoFix: (input: string) => {
              const before = input.substring(0, lastOpenBrace + 1);
              const after = input.substring(errorPosition);
              return before + ' "' + potentialKey + '"' + after;
            }
          };
        }
      }
    }
    
    // 3. 多余的逗号
    if (errorMessage.includes('Unexpected token') && inputValue.charAt(errorPosition - 1) === ',') {
      const nextChar = inputValue.charAt(errorPosition);
      if (nextChar === '}' || nextChar === ']') {
        return {
          fixDescription: t('suggestions.trailingComma'),
          autoFix: (input: string) => {
            return input.substring(0, errorPosition - 1) + input.substring(errorPosition);
          }
        };
      }
    }
    
    // 4. 缺少逗号
    if (errorMessage.includes('Unexpected token') && errorPosition > 0) {
      const prevChar = inputValue.charAt(errorPosition - 1);
      const errorChar = inputValue.charAt(errorPosition);
      
      // 检查是否在两个值之间缺少逗号
      if ((prevChar === '"' || prevChar === '}' || prevChar === ']' || /\d/.test(prevChar)) && 
          (errorChar === '"' || errorChar === '{' || errorChar === '[' || /\d/.test(errorChar))) {
        return {
          fixDescription: t('suggestions.missingComma'),
          autoFix: (input: string) => {
            return input.substring(0, errorPosition) + ',' + input.substring(errorPosition);
          }
        };
      }
    }
    
    // 5. 使用了单引号而不是双引号
    if (errorMessage.includes('Unexpected token') && errorPosition > 0) {
      const textAround = inputValue.substring(Math.max(0, errorPosition - 20), Math.min(inputValue.length, errorPosition + 20));
      if (textAround.includes("'")) {
        return {
          fixDescription: t('suggestions.singleQuotes'),
          autoFix: (input: string) => {
            // 替换所有单引号为双引号（这是一个简化的实现，可能需要更复杂的逻辑处理嵌套引号）
            return input.replace(/'/g, '"');
          }
        };
      }
    }
    
    // 6. 错误的布尔值或null值（例如首字母大写或拼写错误）
    if (errorMessage.includes('Unexpected token') && errorPosition > 0) {
      const textAround = inputValue.substring(Math.max(0, errorPosition - 20), Math.min(inputValue.length, errorPosition + 20));
      const trueMatch = /\b(True|TRUE|true)\b/.exec(textAround);
      const falseMatch = /\b(False|FALSE|false)\b/.exec(textAround);
      const nullMatch = /\b(Null|NULL|null)\b/.exec(textAround);
      
      if (trueMatch && trueMatch[1] !== 'true') {
        return {
          fixDescription: t('suggestions.booleanCase', { value: 'true' }),
          autoFix: (input: string) => input.replace(new RegExp(`\\b${trueMatch[1]}\\b`, 'g'), 'true')
        };
      }
      
      if (falseMatch && falseMatch[1] !== 'false') {
        return {
          fixDescription: t('suggestions.booleanCase', { value: 'false' }),
          autoFix: (input: string) => input.replace(new RegExp(`\\b${falseMatch[1]}\\b`, 'g'), 'false')
        };
      }
      
      if (nullMatch && nullMatch[1] !== 'null') {
        return {
          fixDescription: t('suggestions.nullCase'),
          autoFix: (input: string) => input.replace(new RegExp(`\\b${nullMatch[1]}\\b`, 'g'), 'null')
        };
      }
    }
    
    // 7. 字符串中未转义的引号
    if (errorMessage.includes('Unexpected token') && errorPosition > 0) {
      const textBeforeError = inputValue.substring(0, errorPosition);
      const lastQuoteIndex = textBeforeError.lastIndexOf('"');
      
      if (lastQuoteIndex > -1) {
        const textBetweenQuotes = textBeforeError.substring(lastQuoteIndex + 1);
        if (textBetweenQuotes.includes('"')) {
          return {
            fixDescription: t('suggestions.unescapedQuote'),
            autoFix: (input: string) => {
              // 替换未转义的引号
              let result = input.substring(0, lastQuoteIndex + 1);
              result += textBetweenQuotes.replace(/"/g, '\\"');
              result += input.substring(errorPosition);
              return result;
            }
          };
        }
      }
    }
    
    // 如果没有识别出特定错误类型，返回通用建议
    return t('suggestions.checkSyntax');
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
          console.error(t('jsonErrors.clearMarkError'), err);
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

  // 处理触摸调整大小（针对移动设备）
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, isInput: boolean) => {
    const startY = e.touches[0].clientY;
    const startHeight = isInput ? 
      (inputEditorRef.current?.getDomNode()?.offsetHeight || 500) :
      (outputContainerRef.current?.offsetHeight || 500);
    
    const handleTouchMove = (moveEvent: TouchEvent) => {
      const newHeight = startHeight + moveEvent.touches[0].clientY - startY;
      if (newHeight > 200) { // 设置最小高度
        if (isInput) {
          inputEditorHeight.current = `${newHeight}px`;
        } else {
          outputEditorHeight.current = `${newHeight}px`;
        }
        setEditorHeight(`${newHeight}px`);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
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

  useEffect(() => {
    // 检测设备类型并调整界面
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // 移动设备上默认设置较小的编辑器高度
      setEditorHeight("400px");
      inputEditorHeight.current = "400px";
      outputEditorHeight.current = "400px";
    }
  }, []);

  // 监听窗口大小变化
  useEffect(() => {
    const handleWindowResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && parseInt(editorHeight) > 400) {
        setEditorHeight("400px");
        inputEditorHeight.current = "400px";
        outputEditorHeight.current = "400px";
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [editorHeight]);

  useEffect(() => {
    // 动态更新页面标题以提高SEO
    document.title = t('title') + ' - ' + t('subtitle');
    
    // 添加动态元描述
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('description'));
    } else {
      const newMetaDescription = document.createElement('meta');
      newMetaDescription.name = 'description';
      newMetaDescription.content = t('description');
      document.head.appendChild(newMetaDescription);
    }
  }, [t]);

  // 添加键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + F 格式化JSON
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        formatJson();
      }
      // Ctrl/Cmd + Shift + C 压缩/解压JSON
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        compressJson();
      }
      // Ctrl/Cmd + Shift + L 切换行号
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        toggleLineNumbers();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
              {/* 历史记录按钮 */}
              <button
                onClick={() => router.push(`/${pathname.split('/')[1]}/history`)}
                className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <svg className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{t('historyBtn')}</span>
              </button>
              
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
                        {t(`languages.${locale}`)}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center">
                  <div className="w-1 h-5 bg-blue-600 rounded-r mr-3"></div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {t('inputLabel')}
                  </h3>
                </div>
                <div className="flex items-center space-x-2 flex-wrap gap-y-1 justify-end">
                  <button
                    onClick={formatJson}
                    className="inline-flex items-center px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 whitespace-nowrap"
                    aria-label={t('formatBtn')}
                    title={`${t('formatBtn')} (Ctrl+Shift+F)`}
                  >
                    <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0L8 8m4-4v12" />
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
              <div style={{ height: inputEditorHeight.current, minHeight: '600px' }}>
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
              <div 
                className="h-1 bg-gray-200 dark:bg-gray-700 cursor-ns-resize hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onMouseDown={(e) => handleResize(e, true)}
                onTouchStart={(e) => handleTouchStart(e, true)}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div 
              ref={outputContainerRef}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 ${isFullScreen ? 'fixed inset-0 z-50' : 'relative'}`}
            >
              <div className="px-4 py-3 bg-green-50 dark:bg-green-900/30 border-b border-green-200 dark:border-green-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center">
                  <div className="w-1 h-5 bg-green-600 rounded-r mr-3"></div>
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                    {t('outputLabel')}
                  </h3>
                </div>
                <div className="flex items-center space-x-2 flex-wrap gap-y-1 justify-end">
                  <button
                    onClick={compressJson}
                    className="inline-flex items-center px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 whitespace-nowrap"
                    aria-label={isCompressed ? t('formatBtn') : t('compressBtn')}
                    title={`${isCompressed ? t('formatBtn') : t('compressBtn')} (Ctrl+Shift+C)`}
                  >
                    <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span className="truncate max-w-[60px] sm:max-w-none">{isCompressed ? t('formatBtn') : t('compressBtn')}</span>
                  </button>
                  <button
                    onClick={toggleLineNumbers}
                    className="inline-flex items-center px-2 py-1 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 whitespace-nowrap"
                    aria-label={showLineNumbers ? t('lineNumbers.hide') : t('lineNumbers.show')}
                    title={`${showLineNumbers ? t('lineNumbers.hide') : t('lineNumbers.show')} (Ctrl+Shift+L)`}
                  >
                    <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate max-w-[60px] sm:max-w-none">{showLineNumbers ? t('lineNumbers.hide') : t('lineNumbers.show')}</span>
                  </button>
                  <button
                    onClick={copyToClipboard}
                    disabled={!jsonOutput}
                    className="inline-flex items-center px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:bg-green-500/50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span className="truncate max-w-[60px] sm:max-w-none">{t('copyBtn')}</span>
                  </button>
                  <button
                    onClick={downloadJson}
                    disabled={!jsonOutput}
                    className="inline-flex items-center px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors disabled:bg-purple-500/50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="truncate max-w-[60px] sm:max-w-none">{t('downloadBtn')}</span>
                  </button>
                  <button
                    onClick={toggleFullScreen}
                    className="inline-flex items-center px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 whitespace-nowrap"
                  >
                    <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {isFullScreen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4H4v5m10-5h5v5M4 14h5v5H4m10 0h5v-5" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      )}
                    </svg>
                    <span className="truncate max-w-[60px] sm:max-w-none">{isFullScreen ? t('exitFullscreenBtn') : t('fullscreenBtn')}</span>
                  </button>
                </div>
              </div>
              <div style={{ height: isFullScreen ? 'calc(100% - 55px)' : outputEditorHeight.current, minHeight: '600px' }}>
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
                  onMouseDown={(e) => handleResize(e, false)}
                  onTouchStart={(e) => handleTouchStart(e, false)}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('footer.copyright')}
        </div>
      </footer>
    </div>
  );
} 