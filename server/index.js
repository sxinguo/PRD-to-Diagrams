import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-diagram', async (req, res) => {
  try {
    const { prd, diagramType = 'sequence' } = req.body;

    const prompt = `你是一个专业的技术文档分析师。请根据以下PRD文档生成${diagramType === 'sequence' ? '时序图' : diagramType === 'flowchart' ? '流程图' : '用户旅程图'}的Mermaid代码。

PRD内容：
${prd}

要求：
1. 只返回纯Mermaid代码，不要有markdown代码块标记
2. 代码必须符合Mermaid语法规范
3. ${diagramType === 'sequence' ? '使用sequenceDiagram关键字开头，清晰展示各个参与者之间的交互流程' : diagramType === 'flowchart' ? '使用flowchart TD开头，展示完整的业务流程' : '使用journey关键字开头，展示用户旅程'}
4. 确保所有参与者、节点和流程都清晰明确
5. 使用中文标注`;

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

    console.log('MinMax API response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.error?.message || 'MinMax API调用失败');
    }

    // 找到text类型的content
    const textContent = data.content?.find(item => item.type === 'text');
    let mermaidCode = textContent?.text?.trim() || '';

    if (!mermaidCode) {
      throw new Error('AI返回内容为空');
    }

    // 移除markdown代码块标记
    mermaidCode = mermaidCode.replace(/```mermaid\n?/g, '').replace(/```\n?$/g, '').trim();

    res.json({ code: mermaidCode });
  } catch (error) {
    console.error('生成图表失败:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
