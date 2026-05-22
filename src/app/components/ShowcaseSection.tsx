import { useState } from "react";
import { motion } from "motion/react";
import { useLang } from "../i18n";
import { List, GitBranch, Map } from "lucide-react";

type Category = "all" | "sequence" | "flowchart" | "journey";

interface ShowcaseItem {
  id: string;
  category: Category;
  label: string;
  icon: React.ReactNode;
}

const items: ShowcaseItem[] = [
  {
    id: "s1",
    category: "sequence",
    label: "用户登录时序图",
    icon: <List size={32} style={{ color: "#7c3aed" }} />,
  },
  {
    id: "f1",
    category: "flowchart",
    label: "订单处理流程图",
    icon: <GitBranch size={32} style={{ color: "#6366f1" }} />,
  },
  {
    id: "j1",
    category: "journey",
    label: "新用户注册旅程",
    icon: <Map size={32} style={{ color: "#a855f7" }} />,
  },
  {
    id: "s2",
    category: "sequence",
    label: "支付结算时序图",
    icon: <List size={32} style={{ color: "#7c3aed" }} />,
  },
  {
    id: "f2",
    category: "flowchart",
    label: "售后处理流程图",
    icon: <GitBranch size={32} style={{ color: "#6366f1" }} />,
  },
  {
    id: "j2",
    category: "journey",
    label: "用户下单旅程",
    icon: <Map size={32} style={{ color: "#a855f7" }} />,
  },
];

function DiagramCard({ item }: { item: ShowcaseItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        border: "1.5px solid rgba(124,58,237,0.1)",
        boxShadow: "0 4px 24px rgba(124,58,237,0.07)",
        background: "#fff",
      }}
    >
      {/* Preview */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "4/3", background: "linear-gradient(135deg, #f8f7ff 0%, #fdf4ff 100%)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {item.icon}
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ width: 60, height: 4, borderRadius: 2, background: "rgba(124,58,237,0.15)" }} />
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(124,58,237,0.1)" }} />
              <div style={{ width: 50, height: 4, borderRadius: 2, background: "rgba(124,58,237,0.12)" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(124,58,237,0.07)", background: "#fafbff" }}>
        <span className="text-sm" style={{ color: "#374151" }}>{item.label}</span>
      </div>
    </motion.div>
  );
}

export function ShowcaseSection() {
  const { lang, t } = useLang();
  const [active, setActive] = useState<Category>("all");

  const tabs: { id: Category; label: string }[] = [
    { id: "all", label: lang === "zh" ? "全部" : "All" },
    { id: "sequence", label: lang === "zh" ? "时序图" : "Sequence" },
    { id: "flowchart", label: lang === "zh" ? "流程图" : "Flowchart" },
    { id: "journey", label: lang === "zh" ? "旅程图" : "Journey" },
  ];

  const visible = active === "all" ? items : items.filter(i => i.category === active);

  return (
    <section id="showcase" className="w-full px-4 md:px-8 lg:px-16 py-12"
      style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 rounded-full text-xs mb-4"
            style={{ background: "#ede9fe", border: "1px solid rgba(124,58,237,0.2)", color: "#7c3aed" }}>
            {lang === "zh" ? "图表演示" : "Diagram Showcase"}
          </div>
          <h2 style={{ color: "#1e0a3c", letterSpacing: "-0.03em", marginBottom: 10 }}>
            {lang === "zh" ? (
              <>从 PRD 到专业图表，<span style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>一键生成</span></>
            ) : (
              <>From PRD to Professional Diagrams, <span style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>One Click</span></>
            )}
          </h2>
          <p style={{ color: "#9ca3af", maxWidth: 460, margin: "0 auto" }}>
            {lang === "zh"
              ? "支持时序图、流程图、用户旅程地图等多种图表类型"
              : "Support for sequence diagrams, flowcharts, user journey maps and more"}
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-1.5 p-1 rounded-xl"
            style={{ background: "#f5f3ff", border: "1.5px solid rgba(124,58,237,0.12)" }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActive(tab.id)}
                className="px-5 py-1.5 rounded-lg text-sm transition-all"
                style={{
                  background: active === tab.id ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "transparent",
                  color: active === tab.id ? "#fff" : "#9ca3af",
                  border: "none", cursor: "pointer",
                  fontWeight: active === tab.id ? 600 : 400,
                  boxShadow: active === tab.id ? "0 2px 8px rgba(124,58,237,0.28)" : "none",
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {visible.map(item => (
            <DiagramCard key={item.id} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
