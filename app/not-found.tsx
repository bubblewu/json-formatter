import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-apple-blue-light dark:text-apple-blue-dark mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">页面未找到</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          您访问的页面不存在，或者已被移动。
        </p>
        <Link 
          href="/"
          className="apple-button-primary inline-flex items-center"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
} 