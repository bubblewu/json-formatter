export const runtime = 'edge';

import { NextResponse } from 'next/server';

// 定义反馈数据类型
interface Feedback {
  id: string;
  content: string;
  createdAt: string;
}

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

    // 存储反馈到KV
    await FEEDBACK_KV.put(`feedback:${feedback.id}`, JSON.stringify(feedback));

    // 更新反馈ID列表
    const existingIds = await FEEDBACK_KV.get('feedback_ids', 'json') || [];
    await FEEDBACK_KV.put('feedback_ids', JSON.stringify([feedback.id, ...existingIds]));

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // 获取反馈ID列表
    const feedbackIds = await FEEDBACK_KV.get('feedback_ids', 'json') || [];
    
    // 获取所有反馈
    const feedbacks = await Promise.all(
      feedbackIds.map(async (id: string) => {
        const feedback = await FEEDBACK_KV.get(`feedback:${id}`, 'json');
        return feedback;
      })
    );

    // 过滤掉可能的null值并按时间排序
    const validFeedbacks = feedbacks
      .filter(Boolean)
      .sort((a: Feedback, b: Feedback) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json(validFeedbacks);
  } catch (error) {
    console.error('Error getting feedbacks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 