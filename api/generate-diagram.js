export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prd } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://aqdrywckvqrpuvaddsxj.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZHJ5d2NrdnFycHV2YWRkc3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzIwNTgsImV4cCI6MjA5NDc0ODA1OH0.mB7voJ7pT1LZ1iL9Rb3g5scm_CypmufPxb47t4sMmQ8';

    // 扣积分
    const deductResp = await fetch(`${supabaseUrl}/rest/v1/rpc/deduct_credits`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        p_amount: 3,
        p_description: '生成图表',
      }),
    });

    if (!deductResp.ok) {
      const error = await deductResp.json();
      console.error('Deduct credits failed:', error);
      return res.status(400).json({ error: error.message || error.hint || '积分不足' });
    }

    // 检测图表类型
    let forcedType = null;
    const prdLower = prd.toLowerCase();

    if (prdLower.includes('体验地图') || prdLower.includes('用户体验') ||
        prdLower.includes('旅程') || prdLower.includes('journey')) {
      forcedType = 'journey';
    } else if (prdLower.includes('时序图') || prdLower.includes('sequence')) {
      forcedType = 'sequenceDiagram';
    } else if (prdLower.includes('状态图') || prdLower.includes('state')) {
      forcedType = 'stateDiagram-v2';
    }

    const prompt = forcedType === 'journey'
      ? `你必须生成 journey 类型的 Mermaid 用户体验地图代码。

严格使用以下格式：
\`\`\`mermaid
journey
    title 用户体验标题
    section 阶段名称
        任务描述: 情绪分数(1-5): 角色名
        任务描述: 情绪分数(1-5): 角色名
\`\`\`

用户需求：${prd}

要求：
1. 必须以 journey 开头
2. 必须包含 title
3. 使用 section 划分阶段
4. 每个任务格式：任务描述: 分数: 角色
5. 只输出代码块，不要有任何解释

现在生成 journey 代码：`
      : `你是 Mermaid 代码生成专家。

用户需求：${prd}

${forcedType ? `必须生成 ${forcedType} 类型的代码。` : '根据需求选择合适的图表类型。'}

只输出 \`\`\`mermaid 代码块，不要有任何解释文字。`;

    // 自动重试逻辑
    let lastError = null;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Attempt ${attempt}/${maxRetries}] Calling MinMax API...`);

        const response = await fetch('https://api.minimaxi.com/anthropic/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': process.env.MINMAX_API_KEY,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 2048,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ]
          })
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('[MinMax API Error]:', data);
          throw new Error(data.error?.message || 'AI service temporarily unavailable');
        }

        const textContent = data.content?.find(item => item.type === 'text');
        let mermaidCode = textContent?.text?.trim() || '';

        if (!mermaidCode) {
          console.error('[Empty Response]:', data);
          throw new Error('AI returned empty response');
        }

        mermaidCode = mermaidCode.replace(/```mermaid\n?/g, '').replace(/```\n?$/g, '').trim();

        console.log(`[Success] Generated code on attempt ${attempt}`);
        return res.status(200).json({ code: mermaidCode });

      } catch (error) {
        lastError = error;
        console.error(`[Attempt ${attempt} failed]:`, error.message);

        if (attempt < maxRetries) {
          const delay = attempt * 1000;
          console.log(`[Retrying in ${delay}ms...]`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Failed after ${maxRetries} attempts. ${lastError?.message || 'Please try again later.'}`);

  } catch (error) {
    console.error('生成图表失败:', error);
    res.status(500).json({ error: error.message });
  }
}
