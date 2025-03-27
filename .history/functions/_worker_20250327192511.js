export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 处理 API 请求
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env, ctx);
    }

    // 处理静态文件
    try {
      const response = await env.ASSETS.fetch(request);
      return response;
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  }
};

async function handleApiRequest(request, env, ctx) {
  const url = new URL(request.url);
  
  // 处理反馈 API
  if (url.pathname === '/api/feedback') {
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
          id: Date.now().toString(),
          content,
          createdAt: new Date().toISOString(),
        };

        await env.FEEDBACK_KV.put(`feedback:${feedback.id}`, JSON.stringify(feedback));
        const existingIds = await env.FEEDBACK_KV.get('feedback_ids', 'json') || [];
        await env.FEEDBACK_KV.put('feedback_ids', JSON.stringify([feedback.id, ...existingIds]));

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
        const feedbackIds = await env.FEEDBACK_KV.get('feedback_ids', 'json') || [];
        const feedbacks = await Promise.all(
          feedbackIds.map(async (id) => {
            const feedback = await env.FEEDBACK_KV.get(`feedback:${id}`, 'json');
            return feedback;
          })
        );

        const validFeedbacks = feedbacks
          .filter(Boolean)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return new Response(JSON.stringify(validFeedbacks), {
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

  return new Response('Not Found', { status: 404 });
} 