export const PROMPTS = {
  sequence: `你是一个专业的技术文档分析师。请根据以下PRD文档生成时序图的Mermaid代码。

PRD内容：
{prd}

要求：
1. 只返回纯Mermaid代码，不要有markdown代码块标记
2. 代码必须符合Mermaid语法规范
3. 使用sequenceDiagram关键字开头，清晰展示各个参与者之间的交互流程
4. 确保所有参与者、节点和流程都清晰明确
5. 使用中文标注`,

  flowchart: `你是一个专业的技术文档分析师。请根据以下PRD文档生成流程图的Mermaid代码。

PRD内容：
{prd}

要求：
1. 只返回纯Mermaid代码，不要有markdown代码块标记
2. 代码必须符合Mermaid语法规范
3. 使用flowchart TD开头，展示完整的业务流程
4. 确保所有参与者、节点和流程都清晰明确
5. 使用中文标注`,

  journey: `你是一个专业的技术文档分析师。请根据以下PRD文档生成用户旅程图的Mermaid代码。

PRD内容：
{prd}

要求：
1. 只返回纯Mermaid代码，不要有markdown代码块标记
2. 代码必须符合Mermaid语法规范
3. 使用journey关键字开头，展示用户旅程
4. 确保所有参与者、节点和流程都清晰明确
5. 使用中文标注`
};
