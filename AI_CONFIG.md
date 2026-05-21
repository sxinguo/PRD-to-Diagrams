# AI 配置说明

## MinMax API 配置

1. 访问 [MinMax 官网](https://www.minimaxi.com/) 注册账号
2. 在控制台获取 API Key 和 Group ID
3. 复制 `.env.example` 为 `.env`
4. 填入你的 API 密钥：

```bash
MINMAX_API_KEY=your_actual_api_key
MINMAX_GROUP_ID=your_actual_group_id
```

## 启动服务

### 1. 启动后端服务
```bash
cd server
npm install
npm start
```

后端服务将运行在 `http://localhost:3001`

### 2. 启动前端服务
```bash
npm install
npm run dev
```

前端服务将运行在 `http://localhost:5173`

## API 接口

### POST /api/generate-diagram

生成 Mermaid 图表代码

**请求体：**
```json
{
  "prd": "产品需求文档内容",
  "diagramType": "sequence" // 可选: sequence, flowchart, journey
}
```

**响应：**
```json
{
  "code": "sequenceDiagram\n    participant A\n    ..."
}
```
