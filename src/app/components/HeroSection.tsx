import { ArrowRight, FileText, GitBranch, Map, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useLang } from "../i18n";
import { Link, useNavigate } from "react-router";
import { useState, useRef } from "react";
import { AuthModal } from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";
import * as mammoth from "mammoth";

export function HeroSection() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const features = [
    { icon: <FileText size={20} />, label: t.typeSequence, desc: t.typeSequenceDesc, color: "#7c3aed" },
    { icon: <GitBranch size={20} />, label: t.typeFlowchart, desc: t.typeFlowchartDesc, color: "#6366f1" },
    { icon: <Map size={20} />, label: t.typeJourney, desc: t.typeJourneyDesc, color: "#a855f7" },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isDocx = file.name.endsWith('.docx');
    const isTxt = file.name.endsWith('.txt');

    if (!isDocx && !isTxt) {
      alert('Only .docx and .txt files are supported');
      return;
    }

    try {
      if (isTxt) {
        const text = await file.text();
        setUploadedFile({ name: file.name, content: text });
      } else {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setUploadedFile({ name: file.name, content: result.value });
      }
    } catch (error) {
      console.error('File parsing error:', error);
      alert('Failed to parse file');
    }
  };

  const handleGenerate = async () => {
    const fileContent = uploadedFile?.content || '';
    const textContent = prompt.trim();
    const combinedContent = fileContent && textContent
      ? `${fileContent}\n\n${textContent}`
      : fileContent || textContent;

    if (!combinedContent) return;

    if (!user) {
      setShowAuth(true);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prd: combinedContent
        })
      });

      if (!response.ok) {
        throw new Error('生成失败');
      }

      const data = await response.json();
      sessionStorage.setItem('mermaidCode', data.code);
      navigate('/editor');
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
              className="w-full px-5 rounded-2xl resize-none focus:outline-none"
              rows={5}
              style={{
                background: "#fff",
                border: "1.5px solid rgba(124,58,237,0.15)",
                boxShadow: "0 4px 24px rgba(124,58,237,0.08)",
                color: "#1e0a3c",
                fontSize: "1rem",
                lineHeight: 1.6,
                fontFamily: "'Inter', -apple-system, sans-serif",
                paddingTop: uploadedFile ? "3rem" : "1rem",
                paddingBottom: "1rem",
              }}
            />

            {/* Uploaded file indicator */}
            {uploadedFile && (
              <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: "#ede9fe", border: "1px solid rgba(124,58,237,0.2)" }}>
                <FileText size={14} style={{ color: "#7c3aed" }} />
                <span className="text-xs" style={{ color: "#7c3aed", fontWeight: 500 }}>{uploadedFile.name}</span>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="ml-1"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                  <X size={14} style={{ color: "#7c3aed" }} />
                </button>
              </div>
            )}

            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.txt"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
                style={{
                  background: "#f5f3ff",
                  border: "1px solid rgba(124,58,237,0.2)",
                  color: "#7c3aed",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}>
                <Upload size={16} />
              </button>
              <span className="text-xs" style={{ color: "#9ca3af" }}>Ctrl+Enter</span>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || (!prompt.trim() && !uploadedFile)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
                style={{
                  background: isGenerating || (!prompt.trim() && !uploadedFile) ? "#d1d5db" : "linear-gradient(135deg, #7c3aed, #a855f7)",
                  border: "none",
                  color: "#fff",
                  cursor: isGenerating || (!prompt.trim() && !uploadedFile) ? "not-allowed" : "pointer",
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mb-8">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="flex items-center gap-2.5 p-3 rounded-xl"
              style={{
                background: "#fff",
                border: "1.5px solid rgba(124,58,237,0.1)",
                boxShadow: "0 2px 12px rgba(124,58,237,0.06)",
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${f.color}15`, color: f.color }}>
                {f.icon}
              </div>
              <div className="text-left">
                <div style={{ fontWeight: 600, color: "#1e0a3c", fontSize: "0.85rem" }}>{f.label}</div>
                <div style={{ color: "#9ca3af", fontSize: "0.75rem" }}>{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

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
