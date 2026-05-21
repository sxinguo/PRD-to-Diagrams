import { Zap, Shield, Cpu, Globe, Layers, ScanLine, FileText, GitBranch, Map, List } from "lucide-react";
import { motion } from "motion/react";
import { useLang } from "../i18n";

const samples = [
  {
    key: "arch",
    before: "PRD Text",
    after: "Sequence Diagram",
  },
  {
    key: "portrait",
    before: "PRD Text",
    after: "Flowchart",
  },
  {
    key: "wildlife",
    before: "PRD Text",
    after: "User Journey",
  },
];

export function FeaturesSection() {
  const { t } = useLang();

  const sampleLabels: Record<string, string> = {
    arch: t.galArch,
    portrait: t.galPortrait,
    wildlife: t.galWildlife,
  };

  const features = [
    { icon: <List size={20} />, title: t.feat1Title, desc: t.feat1Desc, color: "#7c3aed" },
    { icon: <GitBranch size={20} />, title: t.feat2Title, desc: t.feat2Desc, color: "#6366f1" },
    { icon: <Map size={20} />, title: t.feat3Title, desc: t.feat3Desc, color: "#a855f7" },
    { icon: <Layers size={20} />, title: t.feat4Title, desc: t.feat4Desc, color: "#7c3aed" },
    { icon: <Shield size={20} />, title: t.feat5Title, desc: t.feat5Desc, color: "#6366f1" },
    { icon: <Globe size={20} />, title: t.feat6Title, desc: t.feat6Desc, color: "#a855f7" },
  ];

  return (
    <section id="features" className="w-full px-4 md:px-8 lg:px-16 py-20"
      style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block px-3 py-1 rounded-full text-xs mb-4"
            style={{ background: "#ede9fe", border: "1px solid rgba(124,58,237,0.2)", color: "#7c3aed" }}>
            {t.featuresBadge}
          </div>
          <h2 style={{ color: "#1e0a3c", letterSpacing: "-0.03em", marginBottom: 12 }}>
            {t.featuresH2a}<br />
            <span style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {t.featuresH2b}
            </span>
          </h2>
          <p style={{ color: "#9ca3af", maxWidth: 460, margin: "0 auto" }}>{t.featuresDesc}</p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="p-6 rounded-2xl group transition-all"
              style={{
                background: "#fafbff",
                border: "1.5px solid rgba(124,58,237,0.08)",
                boxShadow: "0 2px 12px rgba(124,58,237,0.04)",
                transition: "all 0.25s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(124,58,237,0.25)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(124,58,237,0.1)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(124,58,237,0.08)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(124,58,237,0.04)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}15`, border: `1.5px solid ${f.color}30`, color: f.color }}>
                {f.icon}
              </div>
              <h3 style={{ color: "#1e0a3c", marginBottom: 8 }}>{f.title}</h3>
              <p className="text-sm" style={{ color: "#9ca3af", lineHeight: 1.75 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Gallery */}
        <div className="text-center mb-8">
          <h3 style={{ color: "#1e0a3c" }}>{t.galleryTitle}</h3>
          <p className="text-sm mt-2" style={{ color: "#9ca3af" }}>{t.galleryDesc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {samples.map((s) => (
            <div key={s.key} className="rounded-2xl overflow-hidden group"
              style={{ border: "1.5px solid rgba(124,58,237,0.1)", boxShadow: "0 4px 20px rgba(124,58,237,0.07)" }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #f8f7ff 0%, #fdf4ff 100%)" }}>
                  <div className="text-center">
                    {s.key === "arch" && <List size={40} style={{ color: "#7c3aed", marginBottom: 8 }} />}
                    {s.key === "portrait" && <GitBranch size={40} style={{ color: "#6366f1", marginBottom: 8 }} />}
                    {s.key === "wildlife" && <Map size={40} style={{ color: "#a855f7", marginBottom: 8 }} />}
                    <span style={{ color: "#1e0a3c", fontWeight: 600, fontSize: "0.9rem" }}>{s.after}</span>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full flex justify-between px-3 pb-3">
                    <span className="text-xs px-2.5 py-1 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.92)", color: "#6b7280", border: "1px solid rgba(0,0,0,0.06)" }}>
                      {t.galHoverBefore}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-lg"
                      style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff" }}>
                      {t.galAfter}
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3" style={{ background: "#fafbff" }}>
                <span className="text-sm" style={{ color: "#374151" }}>{sampleLabels[s.key]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
