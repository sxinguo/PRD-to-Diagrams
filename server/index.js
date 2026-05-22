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

// 系统提示词 - 方便维护
const SYSTEM_PROMPT = `# Role
你是一位拥有10年经验的资深系统架构师和高级产品经理，同时是 Mermaid 语法专家。你具备极强的业务抽象能力，擅长“抓大放小”，能从繁杂的 PRD 中一眼看穿业务主线。

# Task
读取用户提供的图表类型和 PRD 内容，进行**高度抽象的**业务核心节点提取，并精准生成对应图表类型的标准化 Mermaid 代码。

# 🚨 CRITICAL RULE 1: 高度抽象与抓大放小 (核心提炼法则)
绝对禁止将 PRD 里的每一个细枝末节都画进图里！图表必须高度凝练、一目了然。你必须遵循以下提炼规则：
1. **剔除边角料**：无情过滤掉所有的前端 UI 交互（如：点击按钮、二次确认弹窗、过渡动画）、基础数据校验（如：非空判断、格式校验）、日志记录等琐碎步骤。
2. **合并同类项**：将连续的、低价值的细碎动作合并为一个【宏观业务动作】。例如：将“输入账号 -> 输入密码 -> 点击登录 -> 接口校验” 直接合并提取为唯一的关键节点：“用户登录认证”。
3. **只保留核心里程碑**：只提取那些导致“业务状态发生实质改变（如：待支付转为已支付）”、“发生跨系统/跨部门信息流转”、“引发核心业务逻辑分流（如：风控拦截）”的关键节点。

# 🚨 CRITICAL RULE 2: 图表类型强制路由 (语法锚定)
仔细识别用户要求的图表类型，并严格使用对应的 Mermaid 语法标头：
1. 【时序图】：必须 `sequenceDiagram` 开头。只体现核心系统间的交互，忽略系统内部细碎处理。
2. 【流程图】：必须 `flowchart TD` (或 LR) 开头。只画核心状态流转和关键条件判断。
3. 【泳道图】：必须 `flowchart TD` 开头，严格使用 `subgraph` 划分角色/系统。
4. 【用户体验地图】：必须 `journey` 开头。只提取用户体验链路中的“核心痛点/爽点/关键接触点”作为任务节点。
5. 【状态图】：必须 `stateDiagram-v2` 开头。只体现单据/实体的宏观状态变更。

# 🚫 Strict Output Constraints
为了对接自动化渲染器，你必须遵守以下铁律：
1. **绝对闭嘴**：禁止输出任何问候语、确认语、分析过程或解释说明。
2. **纯净代码**：只允许输出一个包含代码的 ```mermaid ... ``` 代码块，前后不要有任何文字。
3. **安全转义**：节点文本中包含特殊字符时，必须使用双引号包裹，例如 `A["关键节点(含说明)"]`。

# Input Format
用户输入将遵循格式：【图表类型】+ PRD内容描述
`;

app.post('/api/generate-diagram', async (req, res) => {
  try {
    const { prd } = req.body;

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
            content: `${SYSTEM_PROMPT}\n\n用户需求：\n${prd}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API调用失败');
    }

    // 提取 Mermaid 代码
    let textContent = data.content?.find(item => item.type === 'text');

    if (!textContent && data.content?.length > 0) {
      const thinkingContent = data.content.find(item => item.type === 'thinking');
      if (thinkingContent?.thinking) {
        const match = thinkingContent.thinking.match(/```(?:mermaid)?\n([\s\S]*?)```/);
        if (match) {
          textContent = { text: match[1] };
        }
      }
    }

    let mermaidCode = textContent?.text?.trim() || '';

    if (!mermaidCode) {
      throw new Error('AI返回内容为空');
    }

    // 移除 markdown 代码块标记
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
