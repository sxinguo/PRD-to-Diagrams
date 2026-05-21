# Bug 修复总结：deduct_credits 函数调用失败

## 问题描述
点击生成按钮时报错：
```
POST https://aqdrywckvqrpuvaddsxj.supabase.co/rest/v1/rpc/deduct_credits 404 (Not Found)
错误信息：Could not find the function public.deduct_credits
```

## 根本原因
1. **参数名称不匹配**：代码中使用了错误的参数名（`p_amount`, `p_description`, `p_user_id`），但数据库函数定义的参数名是 `user_id`, `amount`, `description`
2. **缺少 Authorization header**：未使用用户的 JWT token 进行身份验证

## 数据库函数签名
通过查询数据库确认实际函数签名：
```sql
deduct_credits(user_id uuid, amount integer, description text) RETURNS boolean
```

## 修复方案
在 `src/app/pages/Editor.tsx` 中的两个函数进行修复：

### 1. handleGenerate 函数
```typescript
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token || ANON_KEY;

const resp = await fetch(
  `${SUPABASE_URL}/rest/v1/rpc/deduct_credits`,
  {
    method: "POST",
    headers: {
      "apikey": ANON_KEY,
      "Authorization": `Bearer ${token}`,  // 添加用户 token
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: user.id,      // 正确的参数名
      amount: 3,             // 正确的参数名
      description: "AI生成图表",  // 正确的参数名
    }),
    signal: controller.signal,
  }
);
```

### 2. handleAIGenerate 函数
同样的修复应用到 AI 生成函数。

## 测试验证
创建了测试文件 `src/tests/deduct_credits.test.ts`，测试结果：
```
✅ 测试通过! 积分扣除成功
- 扣除前积分: 626
- 扣除后积分: 623
- 扣除金额: 3
```

## 关键要点
1. PostgREST RPC 调用时，JSON body 中的参数名必须与数据库函数定义完全匹配
2. 需要使用用户的 JWT token 作为 Authorization header 进行身份验证
3. 参数顺序在 JSON 中不重要，但参数名必须精确匹配
