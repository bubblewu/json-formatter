export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const feedback = {
      content,
      createdAt: new Date().toISOString(),
    };

    await kv.lpush('feedbacks', feedback);

    return NextResponse.json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const feedbacks = await kv.lrange('feedbacks', 0, -1);
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Error getting feedbacks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 