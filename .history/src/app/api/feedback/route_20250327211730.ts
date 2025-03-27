import { NextRequest, NextResponse } from 'next/server';
import type { KVNamespace } from '@cloudflare/workers-types';

// 定义反馈数据类型
interface Feedback {
  id: string;
  content: string;
  createdAt: string;
}

// 内存存储，用于本地开发
let localFeedbacks: any[] = [];
const isLocalDev = process.env.NODE_ENV !== 'production' || typeof process.env.FEEDBACK_KV_ID === 'undefined';

// 获取KV绑定
declare global {
  const FEEDBACK_KV: KVNamespace;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const feedback = {
      id: crypto.randomUUID(),
      content,
      createdAt: new Date().toISOString()
    };

    // 本地开发环境使用内存存储
    if (isLocalDev) {
      localFeedbacks.push(feedback);
      return NextResponse.json({ success: true, feedback });
    }

    // 生产环境不处理，由 Cloudflare Worker 接管
    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 本地开发环境使用内存存储
    if (isLocalDev) {
      // 按创建时间排序
      return NextResponse.json(
        localFeedbacks.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    }

    // 生产环境不处理，由 Cloudflare Worker 接管
    return NextResponse.json([]);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 