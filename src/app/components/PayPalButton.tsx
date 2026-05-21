import { useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: any) => { render: (selector: string) => void };
    };
  }
}

interface PayPalButtonProps {
  planType: "basic" | "pro" | "credits_pack";
  amount: string;
  credits?: number;
  onSuccess?: (orderId: string) => void;
  onError?: (err: any) => void;
  onCancel?: () => void;
}

const PLAN_CONFIG = {
  basic: {
    name: "入门包",
    description: "100 credits一次性",
    credits: 100,
    price: "9.99",
  },
  pro: {
    name: "专业包",
    description: "500 credits一次性",
    credits: 500,
    price: "29.99",
  },
  credits_pack: {
    name: "积分包",
    description: "100积分一次性",
    credits: 100,
    price: "9.99",
  },
};

export function PayPalButton({ planType, amount, credits = 0, onSuccess, onError, onCancel }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const config = PLAN_CONFIG[planType];
  const { user, session } = useAuth();
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      console.error("PayPal Client ID not configured");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.async = true;
    script.onload = () => {
      if (window.paypal && paypalRef.current) {
        window.paypal
          .Buttons({
            style: {
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "pay",
            },
            createOrder: (_data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: config.description,
                    amount: {
                      value: amount || config.price,
                    },
                  },
                ],
              });
            },
            onApprove: async (_data: any, actions: any) => {
              console.log("=== PayPal onApprove START ===");
              try {
                const order = await actions.order.capture();
                console.log("Payment captured:", order);

                console.log("Current user:", user);
                if (!user) {
                  console.error("No user logged in!");
                  alert("请先登录");
                  return;
                }

                console.log("Sending request to confirm-payment...");
                console.log("URL: https://aqdrywckvqrpuvaddsxj.supabase.co/functions/v1/confirm-payment");
                console.log("Body:", JSON.stringify({
                  order_id: order.id,
                  user_id: user.id,
                  plan_type: planType,
                  credits_granted: credits || config.credits,
                }));

                const resp = await fetch(
                  "https://aqdrywckvqrpuvaddsxj.supabase.co/functions/v1/confirm-payment",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${session?.access_token || ''}`,
                    },
                    body: JSON.stringify({
                      order_id: order.id,
                      user_id: user.id,
                      plan_type: planType,
                      credits_granted: credits || config.credits,
                    }),
                  }
                );
                console.log("Response status:", resp.status);
                console.log("Response ok:", resp.ok);

                const result = await resp.json();
                console.log("Response body:", result);

                if (!resp.ok) {
                  throw new Error(result.error || `Server error: ${resp.status}`);
                }

                console.log("Payment confirmed!");
                onSuccess?.(order.id);
              } catch (error: any) {
                console.error("=== Payment error ===");
                console.error("Error:", error);
                console.error("Error message:", error?.message);
                console.error("Error name:", error?.name);
                alert("支付失败: " + (error?.message || "未知错误"));
                onError?.(error);
              }
              console.log("=== PayPal onApprove END ===");
            },
            onError: (err: any) => {
              console.error("PayPal error:", err);
              onError?.(err);
            },
            onCancel: () => {
              console.log("Payment cancelled");
              onCancel?.();
            },
          })
          .render(paypalRef.current);
      }
    };
    document.body.appendChild(script);

    return () => {
      // cleanup
    };
  }, [amount, config.description, config.price, config.credits, onCancel, onError, onSuccess, planType, user, session, credits]);

  if (!clientId) {
    return (
      <div style={{ color: "red", padding: "20px", textAlign: "center", border: "1px solid red", borderRadius: "8px" }}>
        支付配置错误，请联系管理员
      </div>
    );
  }

  return <div ref={paypalRef} style={{ minWidth: "200px" }} />;
}