/**
 * use_credits API 集成测试
 * 验证 deduct_credits 函数（重命名后）是否能正常通过 Supabase REST API 调用
 * 运行方式: 直接在浏览器控制台或 Node.js 环境中执行
 */

const SUPABASE_URL = "https://aqdrywckvqrpuvaddsxj.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZHJ5d2NrdnFycHV2YWRkc3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzIwNTgsImV4cCI6MjA5NDc0ODA1OH0.mB7voJ7pT1LZ1iL9Rb3g5scm_CypmufPxb47t4sMmQ8";

// 测试用例：验证 deduct_credits 函数
async function testDeductCredits(userId, amount, description) {
  console.log(`[TEST] deduct_credits(user=${userId}, amount=${amount}, desc=${description})`);

  const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/deduct_credits`, {
    method: "POST",
    headers: {
      "apikey": ANON_KEY,
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({ user_id: userId, amount, description }),
  });

  const status = resp.status;
  const text = await resp.text();

  console.log(`[TEST] HTTP Status: ${status}`);
  console.log(`[TEST] Response: ${text}`);

  if (status === 200 && text === "true") {
    console.log("✅ deduct_credits 调用成功!");
    return true;
  } else {
    console.log("❌ deduct_credits 调用失败!");
    return false;
  }
}

// 模拟 Editor.tsx 中的 handleGenerate 调用方式
async function testEditorStyleCall(userId) {
  console.log("\n[TEST] 模拟 Editor.tsx handleGenerate 调用风格...");
  return testDeductCredits(userId, 3, "AI生成图表");
}

// 手动运行测试（如果有 userId，替换下面的占位符）
const TEST_USER_ID = "1e054134-0530-4891-9304-739a8ec9f3b4"; // 可用测试账号

(async () => {
  console.log("=== 开始 use_credits API 集成测试 ===\n");

  const result = await testEditorStyleCall(TEST_USER_ID);

  console.log("\n=== 测试完成 ===");
  console.log(result ? "所有测试通过!" : "测试失败，请检查函数配置");
})();