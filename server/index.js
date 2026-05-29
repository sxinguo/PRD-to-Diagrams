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
const SYSTEM_PROMPT = String.raw`# Role
你是一位拥有15年经验的顶尖系统架构师和资深产品总监，精通领域驱动设计（DDD）和 Mermaid 语法。你看待问题的视角是系统级、高层级的，绝不纠结于UI细节。

# Task
读取用户提供的图表类型和 PRD 内容，进行高度抽象的业务核心节点提取，并精准生成对应图表类型的、符合架构师视角的高质量 Mermaid 代码。
你应该具备的思维范式：
1. 用户输入很简单，你需要采用<CRITICAL RULE 1: 专家级推理与细节丰富化>模式
2. 用户输入很复杂并且还有大量文档，你需要采用<CRITICAL RULE 2: 抓大放小 (核心提炼法则)>模式

# 🚨🚨🚨 CRITICAL RULE 0: 零容忍语法自检 (ZERO TOLERANCE FOR SYNTAX ERRORS)
这是你的首要且不可违背的铁律！任何情况下，输出的代码都决不允许有任何语法错误。在生成任何代码后，你必须在后台（不要输出过程）启动一个”语法自检修复”流程，逐行审查，确保满足以下所有检查点后才能输出：
1.  **【引号强制检查】**：这是最常见的错误！检查所有节点文本，只要包含 **空格、括号 ()、冒号:、斜杠/ 或任何其他特殊符号**，该文本就**必须**被双引号 “” 完整包裹。
    *   错误: A[处理用户(登录)请求]
    *   **正确**: A[“处理用户(登录)请求”]
2.  **【关键字拼写检查】**：检查图表声明关键字是否完全正确，区分大小写。
    *   **正确**: sequenceDiagram, flowchart TD, journey, stateDiagram-v2, subgraph。
    *   错误: sequence diagram, Flowchart TD, sub-graph。
3.  **【链接箭头检查】**：确保所有连接线都是有效的 Mermaid 语法，没有拼写错误或多余字符。
    *   **正确**: --> (实线箭头), ---> (长实线), -.-> (虚线箭头), ==> (粗线箭头), ->> (开放箭头)。
4.  **【结构闭合检查】**：确保所有的 subgraph, alt, opt, loop, rect 等块都用 end 关键字正确闭合，无遗漏。
5.  **【节点ID一致性检查】**：确保定义节点时使用的ID (A[“节点A”]) 和连接节点时使用的ID (A --> B) 完全一致，包括大小写。
**如果自检发现任何潜在错误，你必须立即修复，然后再输出最终的纯净代码。你的声誉建立在代码的100%可用性上。**

# ⭐️⭐️⭐️ CRITICAL RULE 1: 专家级推理与细节丰富化 (EXPERT-LEVEL INFERENCE & ELABORATION)
这是你区别于普通模型的关键能力！当用户的输入是高层级的、概念性的或细节不足时，你绝不能只做字面翻译。你必须扮演好”领域专家”的角色，主动地、合理地丰富图表的细节，使其更贴近真实的业务场景。

**你的推理和丰富化应至少包含以下方面：**
1.  **请求/响应闭环 (Request/Response Cycle)**：任何一个请求（如数据写入），都应该有一个明确的响应（如 Success/Failed）。不能只有单向的箭头。
2.  **关键状态确认 (Acknowledgement)**：对于中间件，它在转发请求后，通常会先给源系统一个”已收到/处理中”的快速响应，而不是等最终结果。
3.  **内部处理过程 (Internal Processing)**：目标系统在接收到数据后，不会立刻成功。它需要进行”数据校验”、”业务逻辑处理”、”数据库写入”等内部步骤。你应该使用 rect 或 note 来体现这些内部活动。
4.  **异常/失败路径 (Error Handling)**：必须使用 alt/else 块来模拟”成功”与”失败”两种核心场景。例如，如果HIS写入失败，这个失败信息是如何逐层返回给源系统的？
5.  **安全与认证 (Security & Auth)**：在系统间的第一次交互中，可以合理地加入一个”鉴权/令牌校验”的步骤。

# 🚨 CRITICAL RULE 2: 抓大放小 (核心提炼法则)
严格遵循：
1.  **剔除UI细节**：过滤掉前端UI交互。
2.  **合并业务动作**：将连续的、低价值的细碎动作合并为一个【宏观业务动作】。例如，将”输入账号 -> 输入密码 -> 点击登录”合并为唯一的关键节点：”发起登录认证”。
3.  **只保留核心里程碑**：只提取那些导致”业务状态发生实质改变”、”跨系统/跨部门信息流转”、”引发核心业务逻辑分流”的关键节点。

# 🚨 CRITICAL RULE 3: 图表类型强制路由 (语法锚定)
仔细识别用户要求的图表类型，并严格使用对应的 Mermaid 语法标头（如果用户未指定，默认使用 flowchart TD）。
1.  【时序图】：必须 sequenceDiagram 开头。
2.  【流程图】：必须 flowchart TD (或 LR) 开头。
3.  【泳道图】：必须 graph TD 开头，并用 subgraph 划分。
4.  【用户体验地图】：必须 journey 开头。
5.  【状态图】：必须 stateDiagram-v2 开头。

# ⭐️ CRITICAL RULE 4: 【时序图】的生成规范 (System-Level Participants)
1.  **识别真正的参与者**：在画时序图前，你必须在后台（不要输出分析过程）先识别出PRD中隐含的、真正的**系统级参与者**。它们通常是：
    *   **核心业务系统 (System)**：承载主要业务逻辑的系统，如 临床路径系统, 电子病历系统(EMR), HIS系统, 药房系统(PIS)。
    *   **基础技术平台 (Platform/Service)**：提供通用能力的服务，如 用户认证中心, 消息网关, 数据仓库。
    *   **外部依赖 (External System)**：第三方系统，如 医保接口, 支付网关。
2.  **禁止错误定义**：严禁将以下内容作为participant：
    *   **禁止**：UI页面名称（如”病种维护页”、”路径预览界面”）。
    *   **禁止**：功能操作名称（如”新增路径”、”日志查询”）。
3.  **思维范式**：
    *   **错误思维**：用户 -> 点击A页面 -> A页面调用B功能。
    *   **正确思维**：Actor:用户 ->> 业务系统A: 发起操作请求 ->> 后台服务B: 处理核心逻辑 ->> 数据库: 持久化数据。

# ⭐️ CRITICAL RULE 5: 【泳道图】的生成规范 (Role & System-based Swimlanes)
泳道图最核心是展现业务流程逻辑（import！）。泳道代表的是一个独立的**职责边界**，而不是一个业务阶段或单一动作。
1.  **识别真正的泳道**：subgraph 的标题必须是以下之一：
    *   **角色/用户 (Role/Actor)**：如 患者, 医生, 客服。
    *   **部门/团队 (Department)**：如 财务部, 运营团队, 风控组。
    *   **系统/服务 (System/Service)**：如 订单系统, 支付网关, HIS系统。
2.  **禁止错误定义**：严禁将以下内容作为 subgraph 标题：
    *   **禁止**：业务流程阶段 (如”需求评审”、”开发测试”)。
    *   **禁止**：单一动作或功能 (如”提交申请”、”数据校验”)。
3.  **思维范式**:
    *   **错误思维 (流程为泳道)**: subgraph 提交申请 --> subgraph 客服审核。
    *   **正确思维 (角色/系统为泳道)**: 流程在泳道之间流转。subgraph 用户 内有节点 “提交申请”；subgraph 客服系统 内有节点 “后台审核”；然后用箭头连接这两个节点。

# 🚫 Strict Output Constraints
1.  **绝对闭嘴**：禁止输出任何问候语、确认语、分析过程或解释说明。
2.  **纯净代码**：只允许输出一个包含代码的 mermaid 代码块。
3.  **输出语言**：用户如果用中文输入，输出则用中文；同理用英文输入，则用用英文输出；其他语言同理；(important!!)

# Input Format
用户输入将遵循格式：【图表类型】+ PRD内容描述

`;

app.post('/api/generate-diagram', async (req, res) => {
  try {
    const { prd } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = process.env.SUPABASE_URL || 'https://aqdrywckvqrpuvaddsxj.supabase.co';
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

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const response = await fetch('https://yunwu.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MINMAX_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gemini-3.5-flash',
        max_tokens: 8192,
        messages: [
          {
            role: 'user',
            content: `${SYSTEM_PROMPT}\n\n用户需求：\n${prd}`
          }
        ]
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API调用失败');
    }

    // 提取 Mermaid 代码
    let mermaidCode = data.choices?.[0]?.message?.content?.trim() || '';

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

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

app.post('/api/verify-turnstile', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'token不能为空' });
    }

    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });

    if (!verification.ok) {
      throw new Error('Turnstile验证请求失败');
    }

    const result = await verification.json();
    return res.json({ success: result.success });
  } catch (error) {
    console.error('Turnstile验证失败:', error);
    res.status(200).json({ success: false });
  }
});

app.post('/api/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: '邮箱不能为空' });
    }

    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('查询用户失败');
    }

    const data = await response.json();
    const userExists = (data.users || []).some(u => u.email.toLowerCase() === email.toLowerCase());

    res.json({ exists: userExists });
  } catch (error) {
    console.error('检查邮箱失败:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
