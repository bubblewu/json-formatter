export const runtime = 'edge';

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { feedback } = await request.json();
    // 在Edge环境中，我们可以使用Cloudflare D1或KV存储
    // 这里暂时返回成功响应
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 获取所有反馈
export async function GET() {
  try {
    // 在Edge环境中，我们可以使用Cloudflare D1或KV存储
    // 这里暂时返回空数组
    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 