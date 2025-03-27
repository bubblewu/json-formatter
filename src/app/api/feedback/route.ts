export const runtime = 'edge';

import { NextResponse } from 'next/server';
import type { KVNamespace } from '@cloudflare/workers-types';

// 定义反馈数据类型
interface Feedback {
  id: string;
  content: string;
  createdAt: string;
}

// 本地存储
let localFeedbacks: Feedback[] = [];

// 获取KV绑定
declare global {
  const FEEDBACK_KV: KVNamespace;
}

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const feedback: Feedback = {
      id: Date.now().toString(),
      content,
      createdAt: new Date().toISOString(),
    };

    // 在本地开发环境中使用内存存储
    if (process.env.NODE_ENV === 'development') {
      localFeedbacks.unshift(feedback);
      return NextResponse.json({ success: true, feedback });
    }

    // 生产环境使用 KV 存储
    await FEEDBACK_KV.put(`feedback:${feedback.id}`, JSON.stringify(feedback));
    const existingIds: string[] = await FEEDBACK_KV.get('feedback_ids', 'json') || [];
    await FEEDBACK_KV.put('feedback_ids', JSON.stringify([feedback.id, ...existingIds]));

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 在本地开发环境中使用内存存储
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(localFeedbacks);
    }

    // 生产环境使用 KV 存储
    const feedbackIds: string[] = await FEEDBACK_KV.get('feedback_ids', 'json') || [];
    const feedbacks = await Promise.all(
      feedbackIds.map(async (id: string) => {
        const feedback = await FEEDBACK_KV.get(`feedback:${id}`, 'json') as Feedback | null;
        return feedback;
      })
    );

    const validFeedbacks = feedbacks
      .filter((feedback): feedback is Feedback => feedback !== null)
      .sort((a: Feedback, b: Feedback) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json(validFeedbacks);
  } catch (error) {
    console.error('Error getting feedbacks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 