export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 处理 API 请求
    if (pathname.startsWith('/api/feedback')) {
      if (request.method === 'POST') {
        try {
          const { content } = await request.json();
          if (!content) {
            return new Response(JSON.stringify({ error: 'Content is required' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const feedback = {
            id: crypto.randomUUID(),
            content,
            createdAt: new Date().toISOString()
          };

          // 存储反馈
          await env.FEEDBACK_KV.put(`feedback:${feedback.id}`, JSON.stringify(feedback));

          // 获取现有的反馈 ID 列表
          let feedbackIds = [];
          const storedIds = await env.FEEDBACK_KV.get('feedback_ids');
          if (storedIds) {
            feedbackIds = JSON.parse(storedIds);
          }

          // 添加新 ID 并保存
          feedbackIds.push(feedback.id);
          await env.FEEDBACK_KV.put('feedback_ids', JSON.stringify(feedbackIds));

          return new Response(JSON.stringify({ success: true, feedback }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      } else if (request.method === 'GET') {
        try {
          // 获取所有反馈 ID
          const storedIds = await env.FEEDBACK_KV.get('feedback_ids');
          if (!storedIds) {
            return new Response(JSON.stringify([]), {
              headers: { 'Content-Type': 'application/json' }
            });
          }

          const feedbackIds = JSON.parse(storedIds);
          
          // 获取所有反馈数据
          const feedbackPromises = feedbackIds.map(id => 
            env.FEEDBACK_KV.get(`feedback:${id}`).then(data => data ? JSON.parse(data) : null)
          );
          
          let feedbacks = await Promise.all(feedbackPromises);
          
          // 过滤掉 null 值并按创建时间排序
          feedbacks = feedbacks.filter(Boolean).sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          return new Response(JSON.stringify(feedbacks), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }

    // 对于其他请求，交给静态资源处理
    return env.ASSETS.fetch(request);
  }
}; 