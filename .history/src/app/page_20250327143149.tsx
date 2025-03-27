import dynamic from 'next/dynamic';

const JsonFormatter = dynamic(() => import('@/components/JsonFormatter'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
      </div>
    </div>
  ),
});

export default function Page() {
  return <JsonFormatter />;
}
