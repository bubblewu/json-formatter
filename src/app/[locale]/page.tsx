import JsonEditor from '@/components/JsonEditor';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getStaticMessages } from '@/i18n';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 w-full py-6 md:py-12">
        <div className="max-container">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500">
            JSON格式化与验证工具
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            专业的开发工具，提供JSON格式化、压缩、验证和分析功能。支持实时协作与自动保存。
          </p>
          <div className="mt-4">
            <JsonEditor />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// 使用静态消息生成元数据
export function generateMetadata({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const messages = getStaticMessages(locale);
  
  return {
    title: messages.app.title,
    description: messages.app.description,
  };
} 