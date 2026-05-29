import { Check, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useLang } from "../i18n";
import { PayPalButton } from "../components/PayPalButton";
import { AuthModal } from "../components/AuthModal";
import { useAuth } from "../contexts/AuthContext";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planType: "basic" | "pro" | "credits_pack";
  planName: string;
  price: string;
  isYearly: boolean;
  onPaymentSuccess?: () => void;
}

function PaymentModal({ isOpen, onClose, planType, planName, price, isYearly, onPaymentSuccess }: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e0a3c", marginBottom: "8px" }}>
          {planName}
        </h3>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          价格: <span style={{ color: "#7c3aed", fontWeight: 700, fontSize: "1.25rem" }}>${price}</span>
          {isYearly && <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>（12个月总计）</span>}
        </p>

        <div style={{ marginBottom: "16px" }}>
          <PayPalButton
            planType={planType}
            amount={price}
            isYearly={isYearly}
            onSuccess={(orderId) => {
              console.log("Payment success:", orderId);
              onPaymentSuccess?.();
              alert("支付成功！积分已到账。");
              onClose();
            }}
            onError={(err) => {
              console.error("Payment error:", err);
              alert("支付失败，请重试");
            }}
            onCancel={() => {
              console.log("Payment cancelled");
            }}
          />
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 rounded-lg"
          style={{
            background: "#f5f3ff",
            border: "1px solid rgba(124,58,237,0.2)",
            color: "#7c3aed",
            cursor: "pointer",
          }}
        >
          取消
        </button>
      </motion.div>
    </div>
  );
}

export function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    type: "basic" | "pro" | "credits_pack";
    name: string;
    price: string;
    isYearly: boolean;
  } | null>(null);
  const { t, lang } = useLang();
  const { user, refreshProfile } = useAuth();

  const plans = [
    {
      key: "free",
      name: t.planFree,
      price: { monthly: 0, yearly: 0 },
      desc: t.planFreeDesc,
      badge: null,
      features: [t.f_6credits, t.f_3perGen, t.f_dailyBonus, t.f_allDiagrams],
      cta: t.ctaFree,
      highlight: false,
    },
    {
      key: "starter",
      name: t.planStarter,
      price: { monthly: "9.99", yearly: "8" },
      desc: t.planStarterDesc,
      badge: null,
      features: [t.f_100credits, t.f_3perGen, t.f_allDiagrams, t.f_priorityQueue, t.f_noExpiry],
      cta: t.ctaStarter,
      highlight: false,
      type: "basic" as const,
    },
    {
      key: "pro",
      name: t.planPro,
      price: { monthly: "29.99", yearly: "24" },
      desc: t.planProDesc,
      badge: t.mostPopular,
      features: [t.f_500credits, t.f_3perGen, t.f_allDiagrams, t.f_priorityQueue, t.f_noExpiry, t.f_emailSupport, t.f_commercial],
      cta: t.ctaPro,
      highlight: true,
      type: "pro" as const,
    },
  ];

  const handleSelectPlan = (plan: typeof plans[0]) => {
    if (plan.key === "free") return;
    if (!user) {
      setShowAuth(true);
      return;
    }
    const monthlyPrice = yearly ? parseFloat(plan.price.yearly) : parseFloat(plan.price.monthly);
    const yearlyTotal = yearly ? (monthlyPrice * 12).toFixed(2) : plan.price.monthly;
    setSelectedPlan({
      type: (plan as any).type || "credits_pack",
      name: plan.name,
      price: String(yearlyTotal),
      isYearly: yearly,
    });
    setShowPayment(true);
  };

  return (
    <div style={{ background: "linear-gradient(160deg,#f8f7ff 0%,#fdf4ff 60%,#f0f4ff 100%)", minHeight: "100vh", paddingTop: 64 }}>
      {/* Hero banner */}
      <div className="relative overflow-hidden py-20 px-4 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(167,139,250,0.15) 0%, transparent 65%)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(124,58,237,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full text-xs mb-5"
            style={{ background: "#ede9fe", border: "1px solid rgba(124,58,237,0.2)", color: "#7c3aed" }}>
            {t.pricingBadge}
          </div>
          <h1 style={{ color: "#1e0a3c", letterSpacing: "-0.04em", margin: "0 0 14px", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 800, lineHeight: 1.15 }}>
            {t.pricingH2}
          </h1>
          <p style={{ color: "#9ca3af", maxWidth: 420, margin: "0 auto 28px" }}>{t.pricingDesc}</p>

          {/* Toggle */}
          <div className="inline-flex items-center p-1 rounded-xl"
            style={{ background: "#fff", border: "1.5px solid rgba(124,58,237,0.12)", boxShadow: "0 2px 8px rgba(124,58,237,0.06)" }}>
            {[false, true].map((isYearly) => (
              <button key={String(isYearly)} onClick={() => setYearly(isYearly)}
                className="px-5 py-2 rounded-lg text-sm flex items-center gap-2"
                style={{
                  background: yearly === isYearly ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "transparent",
                  color: yearly === isYearly ? "#fff" : "#9ca3af",
                  border: "none", cursor: "pointer", fontWeight: yearly === isYearly ? 600 : 400, transition: "all 0.18s",
                }}>
                {isYearly ? t.yearly : t.monthly}
                {isYearly && (
                  <span className="text-xs px-1.5 py-0.5 rounded-md"
                    style={{ background: yearly ? "rgba(255,255,255,0.22)" : "#ede9fe", color: yearly ? "#fff" : "#7c3aed" }}>
                    {t.save}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <motion.div key={p.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative flex flex-col p-6 rounded-2xl"
              style={{
                background: p.highlight ? "linear-gradient(160deg,rgba(124,58,237,0.06),rgba(168,85,247,0.04))" : "#fff",
                border: p.highlight ? "2px solid rgba(124,58,237,0.35)" : "1.5px solid rgba(124,58,237,0.1)",
                boxShadow: p.highlight ? "0 8px 40px rgba(124,58,237,0.13)" : "0 2px 16px rgba(124,58,237,0.06)",
              }}>
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", fontWeight: 600, boxShadow: "0 2px 10px rgba(124,58,237,0.3)" }}>
                  {p.badge}
                </div>
              )}

              <div className="mb-5">
                <span className="text-xs block mb-1"
                  style={{ color: p.highlight ? "#7c3aed" : "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
                  {p.name}
                </span>
                <div className="flex items-end gap-1 mb-1">
                  <span style={{ color: "#1e0a3c", fontWeight: 800, fontSize: "2.2rem", letterSpacing: "-0.04em" }}>
                    ${yearly ? p.price.yearly : p.price.monthly}
                  </span>
                  {p.price.monthly > 0 && (
                    <span className="text-sm mb-2" style={{ color: "#9ca3af" }}>{t.perMonth}</span>
                  )}
                </div>
                <p className="text-sm" style={{ color: "#9ca3af" }}>{p.desc}</p>
              </div>

              <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check size={14} className="mt-0.5 shrink-0" style={{ color: p.highlight ? "#7c3aed" : "#d1d5db" }} />
                    <span style={{ color: "#4b5563" }}>{f}</span>
                  </li>
                ))}
              </ul>

              {p.key !== "free" && (
                <button
                  onClick={() => handleSelectPlan(p)}
                  className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
                  style={{
                    background: p.highlight ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "#f5f3ff",
                    border: p.highlight ? "none" : "1.5px solid rgba(124,58,237,0.2)",
                    color: p.highlight ? "#fff" : "#7c3aed",
                    cursor: "pointer", fontWeight: 600,
                    boxShadow: p.highlight ? "0 4px 20px rgba(124,58,237,0.3)" : "none",
                  }}>
                  {p.highlight && <Zap size={14} />}
                  {p.cta}
                </button>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "#c4b5fd" }}>{t.pricingNote}</p>

        {/* FAQ */}
        <div className="mt-16">
          <h3 className="text-center mb-8" style={{ color: "#1e0a3c" }}>
            {lang === "zh" ? "常见问题" : "Frequently Asked Questions"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(lang === "zh" ? [
              { q: "积分是如何计算的？", a: "每次生成图表消耗 3 积分。注册即送 12 积分，每天用完后可再领 3 积分。" },
              { q: "积分会过期吗？", a: "购买的积分永不过期，可随时使用。免费赠送的积分每个月初重置。" },
              { q: "如何获得更多积分？", a: "购买积分包即可获得更多积分，购买的积分永久有效。" },
              { q: "支持哪些支付方式？", a: "目前支持 PayPal 支付，信用卡也可通过 PayPal 完成付款。" },
            ] : [
              { q: "How are credits calculated?", a: "Each diagram generation costs 3 credits. Sign up for 12 free credits, and earn 3 more daily after you use them." },
              { q: "Do credits expire?", a: "Purchased credits never expire. Free daily credits reset at the start of each month." },
              { q: "How to get more credits?", a: "Purchase a credit pack anytime. Purchased credits are valid permanently." },
              { q: "What payment methods are supported?", a: "Currently PayPal is supported. Credit cards can also be used via PayPal." },
            ]).map((faq) => (
              <div key={faq.q} className="p-5 rounded-2xl"
                style={{ background: "#fff", border: "1.5px solid rgba(124,58,237,0.09)", boxShadow: "0 2px 12px rgba(124,58,237,0.05)" }}>
                <p style={{ color: "#1e0a3c", fontWeight: 600, margin: "0 0 8px", fontSize: "0.92rem" }}>{faq.q}</p>
                <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.85rem", lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          planType={selectedPlan.type}
          planName={selectedPlan.name}
          price={selectedPlan.price}
          isYearly={selectedPlan.isYearly}
          onPaymentSuccess={() => refreshProfile()}
        />
      )}

      {showAuth && (
        <AuthModal
          isOpen={true}
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}
