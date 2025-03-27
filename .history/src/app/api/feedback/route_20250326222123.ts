import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { feedback, contact, userId, timestamp } = body;

    // 这里可以添加数据验证
    if (!feedback) {
      return NextResponse.json(
        { error: '反馈内容不能为空' },
        { status: 400 }
      );
    }

    // TODO: 这里可以添加数据库存储逻辑
    // 例如：将反馈保存到数据库或发送到邮件服务等
    
    // 临时：将反馈信息打印到控制台
    console.log('收到反馈:', {
      feedback,
      contact,
      userId,
      timestamp,
    });

    return NextResponse.json(
      { message: '反馈提交成功' },
      { status: 200 }
    );
  } catch (error) {
    console.error('处理反馈时出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 