import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" },
    });
  }

  try {
    const { order_id, user_id, plan_type, credits_granted } = await req.json();

    const paypalClientId = Deno.env.get("PAYPAL_CLIENT_ID");
    const paypalClientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");

    if (!paypalClientId || !paypalClientSecret) {
      throw new Error("PayPal credentials not configured");
    }

    // 环境判断
    const isProduction = Deno.env.get("PAYPAL_MODE") !== "sandbox";
    const paypalApiBase = isProduction
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

    // Get access token
    const creds = btoa(paypalClientId + ":" + paypalClientSecret);
    const tokenResp = await fetch(`${paypalApiBase}/v1/oauth2/token`, {
      method: "POST",
      headers: { "Authorization": "Basic " + creds, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
    });

    if (!tokenResp.ok) throw new Error("PayPal auth failed");
    const { access_token } = await tokenResp.json();

    // Verify order
    const orderResp = await fetch(`${paypalApiBase}/v2/checkout/orders/${order_id}`, {
      headers: { "Authorization": "Bearer " + access_token, "Content-Type": "application/json" },
    });
    const order = await orderResp.json();

    // 验证金额
    const PLAN_PRICES = {
      basic: "9.99",
      pro: "29.99",
      credits_pack: "9.99",
    };

    const expectedAmount = PLAN_PRICES[plan_type];
    if (!expectedAmount) {
      throw new Error(`Invalid plan type: ${plan_type}`);
    }

    const actualAmount = order.purchase_units?.[0]?.amount?.value;
    if (actualAmount !== expectedAmount) {
      console.error(`Amount mismatch: expected ${expectedAmount}, got ${actualAmount}`);
      throw new Error(`Payment amount verification failed`);
    }

    console.log(`Amount verified: ${actualAmount} matches ${expectedAmount}`);

    // Capture if needed
    let captureId = order.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    if (!captureId && order.status === "APPROVED") {
      const capResp = await fetch(`${paypalApiBase}/v2/checkout/orders/${order_id}/capture`, {
        method: "POST",
        headers: { "Authorization": "Bearer " + access_token, "Content-Type": "application/json" },
      });
      if (capResp.ok) {
        const captured = await capResp.json();
        captureId = captured.purchase_units?.[0]?.payments?.captures?.[0]?.id;
      }
    }
    if (!captureId) captureId = isProduction ? order_id : "SANDBOX_" + order_id;

    // Save to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check duplicate
    const { data: existing } = await supabase.from("payments").select("id").eq("paypal_order_id", order_id).single();

    if (!existing) {
      await supabase.from("payments").insert({
        user_id,
        paypal_order_id: order_id,
        paypal_capture_id: captureId,
        amount: order.purchase_units?.[0]?.amount?.value || "0",
        currency: order.purchase_units?.[0]?.amount?.currency_code || "USD",
        status: "completed",
        plan_type,
        credits_granted,
        completed_at: new Date().toISOString(),
      });
    }

    // Add credits
    console.log("Attempting to add credits:", { user_id, credits_granted });
    const { data: creditData, error: creditErr } = await supabase.rpc("add_credits", { p_user_id: user_id, p_credits: credits_granted });
    console.log("add_credits result:", { creditData, creditErr });

    if (creditErr) {
      console.error("add_credits error:", creditErr);
      throw new Error("Failed to add credits: " + creditErr.message);
    }

    return new Response(JSON.stringify({ success: true, credits: credits_granted }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});