import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations();

  return (
    <div className="container-apple py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        {t('nav.about')}
      </h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg">
          JSON Formatter 是一个易于使用的在线工具，专为开发人员、数据分析师和任何需要处理 JSON 数据的人设计。
          我们的目标是提供一个简单、高效、美观的界面，让您能够轻松地格式化、验证和处理 JSON 数据。
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">主要功能</h2>
        <ul>
          <li>JSON 格式化 - 将压缩/混乱的 JSON 转换为易于阅读的格式</li>
          <li>JSON 压缩 - 减小 JSON 文件大小</li>
          <li>JSON 验证 - 确保您的 JSON 符合规范</li>
          <li>暗色模式 - 保护您的眼睛，适合长时间编码</li>
          <li>多语言支持 - 目前支持英文和中文</li>
          <li>响应式设计 - 在任何设备上都能完美工作</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">技术栈</h2>
        <p>
          本工具使用现代Web技术构建：
        </p>
        <ul>
          <li>Next.js - React框架</li>
          <li>TypeScript - 类型安全</li>
          <li>Tailwind CSS - 实用优先的CSS框架</li>
          <li>CodeMirror - 强大的代码编辑器</li>
          <li>next-intl - 国际化支持</li>
          <li>next-themes - 主题切换管理</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">联系我们</h2>
        <p>
          如有任何问题、建议或反馈，请随时与我们联系。
        </p>
      </div>
    </div>
  );
} 