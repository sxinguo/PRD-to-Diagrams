/**
 * deduct_credits 函数测试
 * 验证扣积分功能是否正常工作
 */

const SUPABASE_URL = "https://aqdrywckvqrpuvaddsxj.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZHJ5d2NrdnFycHV2YWRkc3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzIwNTgsImV4cCI6MjA5NDc0ODA1OH0.mB7voJ7pT1LZ1iL9Rb3g5scm_CypmufPxb47t4sMmQ8";

// 测试用户 ID
const TEST_USER_ID = "1e054134-0530-4891-9304-739a8ec9f3b4";

async function testDeductCredits() {
  console.log("=== 测试 deduct_credits 函数 ===\n");

  // 1. 获取当前积分
  console.log("1. 获取当前积分...");
  const profileResp = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${TEST_USER_ID}&select=credits_remaining`,
    {
      headers: {
        "apikey": ANON_KEY,
        "Authorization": `Bearer ${ANON_KEY}`,
      },
    }
  );
  const profiles = await profileResp.json();
  const beforeCredits = profiles[0]?.credits_remaining || 0;
  console.log(`   当前积分: ${beforeCredits}\n`);

  // 2. 调用 deduct_credits
  console.log("2. 调用 deduct_credits 扣除 3 积分...");
  const deductResp = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/deduct_credits`,
    {
      method: "POST",
      headers: {
        "apikey": ANON_KEY,
        "Authorization": `Bearer ${ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: TEST_USER_ID,
        amount: 3,
        description: "测试扣积分",
      }),
    }
  );

  console.log(`   HTTP Status: ${deductResp.status}`);
  const deductResult = await deductResp.text();
  console.log(`   Response: ${deductResult}\n`);

  if (deductResp.status !== 200) {
    console.error("❌ 扣积分失败!");
    return false;
  }

  // 3. 验证积分是否减少
  console.log("3. 验证积分是否减少...");
  const afterProfileResp = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${TEST_USER_ID}&select=credits_remaining`,
    {
      headers: {
        "apikey": ANON_KEY,
        "Authorization": `Bearer ${ANON_KEY}`,
      },
    }
  );
  const afterProfiles = await afterProfileResp.json();
  const afterCredits = afterProfiles[0]?.credits_remaining || 0;
  console.log(`   扣除后积分: ${afterCredits}`);
  console.log(`   预期积分: ${beforeCredits - 3}`);

  if (afterCredits === beforeCredits - 3) {
    console.log("\n✅ 测试通过! 积分扣除成功");
    return true;
  } else {
    console.log("\n❌ 测试失败! 积分未正确扣除");
    return false;
  }
}

// 运行测试
testDeductCredits().catch(console.error);
