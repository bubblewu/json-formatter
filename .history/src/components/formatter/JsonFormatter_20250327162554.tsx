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