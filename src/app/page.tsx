import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/request';

// 根页面简单重定向到默认语言路径
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
