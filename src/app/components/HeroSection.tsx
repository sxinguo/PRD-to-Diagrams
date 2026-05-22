import { ArrowRight, FileText, GitBranch, Map } from "lucide-react";
import { motion } from "motion/react";
import { useLang } from "../i18n";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";

export function HeroSection() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  const stats = [
    { value: "100K+", label: t.statPRDs },
    { value: "500K+", label: t.statDiagrams },
    { value: "<10s", label: t.statTime },
    { value: "95%+", label: t.statAccuracy },
  ];

  const features = [
    { icon: <FileText size={20} />, label: t.typeSequence, desc: t.typeSequenceDesc, color: "#7c3aed" },
    { icon: <GitBranch size={20} />, label: t.typeFlowchart, desc: t.typeFlowchartDesc, color: "#6366f1" },
    { icon: <Map size={20} />, label: t.typeJourney, desc: t.typeJourneyDesc, color: "#a855f7" },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!user) {
      setShowAuth(true);
      return;
    }

    setIsGenerating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/generate-diagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prd: prompt.trim()
        })
      });

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const data = await response.json();
      console.log('[首页-AI返回的原始代码]:', data.code);
      navigate(`/editor?code=${encodeURIComponent(data.code)}`);
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成图表失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)",
          width: 900, height: 700, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(167,139,250,0.18) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", top: "20%", left: "-5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,181,253,0.15) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", top: "15%", right: "-5%",
          width: 360, height: 360, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(147,197,253,0.12) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(124,58,237,0.12) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full"
      >
        {/* Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{ background: "#f5f3ff", border: "1px solid rgba(124,58,237,0.2)" }}>
          <span className="text-xs" style={{ color: "#6d28d9" }}>{t.heroBadge}</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(2.4rem, 6vw, 4.4rem)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.04em",
          color: "#1e0a3c",
          marginBottom: "1.25rem",
        }}>
          {t.heroH1a}
          <br />
          <span style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6366f1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {t.heroH1b}
          </span>
        </h1>

        <p className="mb-8 max-w-xl" style={{ color: "#6b7280", lineHeight: 1.75, fontSize: "1.1rem" }}>
          {t.heroDesc}
        </p>

        {/* Input box */}
        <div className="w-full max-w-2xl mb-6">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  handleGenerate();
                }
              }}
              placeholder={t.heroPlaceholder}
              className="w-full px-5 py-4 rounded-2xl resize-none focus:outline-none"
              rows={3}
              style={{
                background: "#fff",
                border: "1.5px solid rgba(124,58,237,0.15)",
                boxShadow: "0 4px 24px rgba(124,58,237,0.08)",
                color: "#1e0a3c",
                fontSize: "1rem",
                lineHeight: 1.6,
                fontFamily: "'Inter', -apple-system, sans-serif",
              }}
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="text-xs" style={{ color: "#9ca3af" }}>Ctrl+Enter</span>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
                style={{
                  background: isGenerating || !prompt.trim() ? "#d1d5db" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                  border: "none",
                  color: "#fff",
                  cursor: isGenerating || !prompt.trim() ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
                }}
              >
                {isGenerating ? "生成中..." : t.heroCTA}
                {!isGenerating && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Feature types */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-12">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{
                background: "#fff",
                border: "1.5px solid rgba(124,58,237,0.1)",
                boxShadow: "0 2px 12px rgba(124,58,237,0.06)",
              }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: `${f.color}15`, color: f.color }}>
                {f.icon}
              </div>
              <div className="text-left">
                <div style={{ fontWeight: 600, color: "#1e0a3c", fontSize: "0.95rem" }}>{f.label}</div>
                <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px w-full max-w-2xl rounded-2xl overflow-hidden"
          style={{ border: "1.5px solid rgba(124,58,237,0.12)", background: "rgba(124,58,237,0.12)" }}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-5 px-3"
              style={{ background: "#fff" }}>
              <span style={{ color: "#7c3aed", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "-0.03em" }}>
                {s.value}
              </span>
              <span className="text-xs mt-1" style={{ color: "#9ca3af" }}>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          style={{ width: 1.5, height: 28, background: "rgba(124,58,237,0.25)", borderRadius: 2 }} />
      </motion.div>
    </section>

    {showAuth && (
      <AuthModal
        isOpen={true}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          setShowAuth(false);
          if (prompt.trim()) {
            navigate("/editor?prompt=" + encodeURIComponent(prompt.trim()));
          } else {
            navigate("/editor");
          }
        }}
      />
    )}
    </>
  );
}
