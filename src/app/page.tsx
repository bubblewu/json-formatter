import { redirect } from 'next/navigation';

// 临时页面不会水合，只会重定向
export default function RootPage() {
  // 如果在服务器上运行，立即重定向到默认语言
  redirect('/en');
}
