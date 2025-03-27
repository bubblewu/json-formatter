import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { feedback, contact, userId, timestamp } = data;

    // 创建反馈对象
    const feedbackData = {
      id: Date.now().toString(),
      feedback,
      contact,
      userId,
      timestamp,
    };

    // 确保data/feedback目录存在
    const feedbackDir = path.join(process.cwd(), 'data', 'feedback');
    if (!fs.existsSync(feedbackDir)) {
      fs.mkdirSync(feedbackDir, { recursive: true });
    }

    // 生成文件名（使用时间戳）
    const fileName = `${Date.now()}.json`;
    const filePath = path.join(feedbackDir, fileName);

    // 将反馈数据写入文件
    fs.writeFileSync(filePath, JSON.stringify(feedbackData, null, 2), 'utf8');

    return NextResponse.json({ 
      success: true, 
      message: '反馈已保存',
      filePath 
    });
  } catch (error) {
    console.error('保存反馈时出错:', error);
    return NextResponse.json(
      { success: false, message: '保存反馈失败' },
      { status: 500 }
    );
  }
}

// 获取所有反馈
export async function GET() {
  try {
    const feedbackDir = path.join(process.cwd(), 'data', 'feedback');
    
    // 确保目录存在
    if (!fs.existsSync(feedbackDir)) {
      return NextResponse.json({ feedbacks: [] });
    }

    // 读取所有反馈文件
    const files = fs.readdirSync(feedbackDir);
    const feedbacks = files
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filePath = path.join(feedbackDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ feedbacks });
  } catch (error) {
    console.error('获取反馈时出错:', error);
    return NextResponse.json(
      { success: false, message: '获取反馈失败' },
      { status: 500 }
    );
  }
} 