import { Check, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useLang } from "../i18n";

export function PricingSection() {
  const [yearly, setYearly] = useState(false);
  const { t } = useLang();

  const plans = [
    {
      key: "free",
      name: t.planFree,
      price: { monthly: 0, yearly: 0 },
      desc: t.planFreeDesc,
      badge: null,
      features: [t.f_10, t.f_2x, t.f_general, t.f_5mb, t.f_std_queue],
      cta: t.ctaFree,
      highlight: false,
    },
    {
      key: "pro",
      name: t.planPro,
      price: { monthly: 12, yearly: 8 },
      desc: t.planProDesc,
      badge: t.mostPopular,
      features: [t.f_500, t.f_4x, t.f_all_modes, t.f_25mb, t.f_priority, t.f_batch20, t.f_commercial],
      cta: t.ctaPro,
      highlight: true,
    },
    {
      key: "studio",
      name: t.planStudio,
      price: { monthly: 39, yearly: 28 },
      desc: t.planStudioDesc,
      badge: null,
      features: [t.f_unlimited, t.f_8x, t.f_all_custom, t.f_50mb, t.f_gpu, t.f_batch_unlimited, t.f_api, t.f_team],
      cta: t.ctaStudio,
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="w-full px-4 md:px-8 lg:px-16 py-20"
      style={{ background: "linear-gradient(180deg, #fdf4ff 0%, #f8f7ff 100%)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full text-xs mb-4"
            style={{ background: "#ede9fe", border: "1px solid rgba(124,58,237,0.2)", color: "#7c3aed" }}>
            {t.pricingBadge}
          </div>
          <h2 style={{ color: "#1e0a3c", letterSpacing: "-0.03em", marginBottom: 12 }}>
            {t.pricingH2}
          </h2>
          <p style={{ color: "#9ca3af", maxWidth: 420, margin: "0 auto 24px" }}>{t.pricingDesc}</p>

          {/* Toggle */}
          <div className="inline-flex items-center p-1 rounded-xl"
            style={{ background: "#fff", border: "1.5px solid rgba(124,58,237,0.12)", boxShadow: "0 2px 8px rgba(124,58,237,0.06)" }}>
            {[false, true].map((isYearly) => (
              <button key={String(isYearly)} onClick={() => setYearly(isYearly)}
                className="px-4 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all"
                style={{
                  background: yearly === isYearly ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent",
                  color: yearly === isYearly ? "#fff" : "#9ca3af",
                  border: "none", cursor: "pointer", fontWeight: yearly === isYearly ? 600 : 400,
                }}>
                {isYearly ? t.yearly : t.monthly}
                {isYearly && (
                  <span className="text-xs px-1.5 py-0.5 rounded-md"
                    style={{ background: yearly ? "rgba(255,255,255,0.2)" : "#ede9fe", color: yearly ? "#fff" : "#7c3aed" }}>
                    {t.save}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <motion.div key={p.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex flex-col p-6 rounded-2xl"
              style={{
                background: p.highlight
                  ? "linear-gradient(135deg, #7c3aed08, #a855f708)"
                  : "#fff",
                border: p.highlight ? "2px solid rgba(124,58,237,0.35)" : "1.5px solid rgba(124,58,237,0.1)",
                boxShadow: p.highlight
                  ? "0 8px 40px rgba(124,58,237,0.15)"
                  : "0 2px 16px rgba(124,58,237,0.06)",
              }}
            >
              {p.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", fontWeight: 600, boxShadow: "0 2px 10px rgba(124,58,237,0.3)" }}>
                  {p.badge}
                </div>
              )}

              <div className="mb-5">
                <span className="text-xs mb-1 block"
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
                    <Check size={14} className="mt-0.5 shrink-0"
                      style={{ color: p.highlight ? "#7c3aed" : "#d1d5db" }} />
                    <span style={{ color: "#4b5563" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
                style={{
                  background: p.highlight ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#f5f3ff",
                  border: p.highlight ? "none" : "1.5px solid rgba(124,58,237,0.2)",
                  color: p.highlight ? "#fff" : "#7c3aed",
                  cursor: "pointer", fontWeight: 600,
                  boxShadow: p.highlight ? "0 4px 20px rgba(124,58,237,0.3)" : "none",
                }}>
                {p.highlight && <Zap size={14} />}
                {p.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#c4b5fd" }}>{t.pricingNote}</p>
      </div>
    </section>
  );
}
