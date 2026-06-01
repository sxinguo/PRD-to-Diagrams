import { useState } from "react";
import { motion } from "motion/react";
import { useLang } from "../i18n";

type Category = "all" | "sequence" | "flowchart" | "journey";

const showcaseImages: Record<Category, string> = {
  all: "/showcase/sequence-1.png",
  sequence: "/showcase/sequence-1.png",
  flowchart: "/showcase/flowchart-1.png",
  journey: "/showcase/journey-1.png",
};

export function ShowcaseSection() {
  const { lang } = useLang();
  const [active, setActive] = useState<Category>("all");

  const tabs: { id: Category; label: string }[] = [
    { id: "all", label: lang === "zh" ? "全部" : "All" },
    { id: "sequence", label: lang === "zh" ? "时序图" : "Sequence" },
    { id: "flowchart", label: lang === "zh" ? "流程图" : "Flowchart" },
    { id: "journey", label: lang === "zh" ? "旅程图" : "Journey" },
  ];

  return (
    <section id="showcase" className="w-full px-4 md:px-8 lg:px-16 py-16" style={{ background: "#fff" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs mb-4"
            style={{ background: "#ede9fe", border: "1px solid rgba(124,58,237,0.2)", color: "#7c3aed" }}
          >
            {lang === "zh" ? "图表演示" : "Diagram Showcase"}
          </div>
          <h2 style={{ color: "#1e0a3c", letterSpacing: "-0.03em", marginBottom: 10, fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800 }}>
            {lang === "zh" ? (
              <>从 PRD 到专业图表，<span style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>一键生成</span></>
            ) : (
              <>From PRD to Professional Diagrams, <span style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>One Click</span></>
            )}
          </h2>
          <p style={{ color: "#9ca3af", maxWidth: 460, margin: "0 auto", fontSize: "0.95rem" }}>
            {lang === "zh"
              ? "支持时序图、流程图、用户旅程地图等多种图表类型"
              : "Support for sequence diagrams, flowcharts, user journey maps and more"}
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex justify-center mb-8">
          <div
            className="flex gap-1.5 p-1 rounded-xl"
            style={{ background: "#f5f3ff", border: "1.5px solid rgba(124,58,237,0.12)" }}
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className="px-5 py-1.5 rounded-lg text-sm transition-all"
                style={{
                  background: active === tab.id ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "transparent",
                  color: active === tab.id ? "#fff" : "#9ca3af",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: active === tab.id ? 600 : 400,
                  boxShadow: active === tab.id ? "0 2px 8px rgba(124,58,237,0.28)" : "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Browser mockup + screenshot */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-xl overflow-hidden group cursor-pointer"
          style={{
            border: "1.5px solid rgba(124,58,237,0.12)",
            boxShadow: "0 8px 40px rgba(124,58,237,0.1)",
            transition: "all 0.3s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "scale(1.015)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 56px rgba(124,58,237,0.18)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 40px rgba(124,58,237,0.1)";
          }}
        >
          {/* Browser top bar */}
          <div
            className="flex items-center justify-between px-4 py-2.5"
            style={{ background: "#f1f0f4", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center gap-1.5">
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
            </div>
            <div
              className="flex-1 mx-4 px-3 py-1 rounded-md text-xs"
              style={{ background: "#fff", color: "#9ca3af", maxWidth: 360, border: "1px solid rgba(0,0,0,0.06)" }}
            >
              prd-chart.com/editor
            </div>
            <div className="flex items-center gap-2" style={{ opacity: 0.4 }}>
              <span style={{ width: 10, height: 1.5, background: "#9ca3af", display: "inline-block" }} />
              <span style={{ width: 10, height: 10, border: "1.5px solid #9ca3af", borderRadius: 2, display: "inline-block" }} />
              <span style={{ width: 8, height: 8, position: "relative", display: "inline-block" }}>
                <span style={{ position: "absolute", inset: 0, border: "1.5px solid #9ca3af", borderRadius: "50%" }} />
              </span>
            </div>
          </div>

          {/* Screenshot image */}
          <div style={{ background: "#fafbff" }}>
            <img
              src={showcaseImages[active]}
              alt="Diagram preview"
              className="w-full"
              style={{ display: "block" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
