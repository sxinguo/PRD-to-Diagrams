import { ArrowRight, FileText, GitBranch, Map, Upload, X } from "lucide-react";
import { motion } from "motion/react";
import { useLang } from "../i18n";
import { Link, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { AuthModal } from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";
import * as mammoth from "mammoth";
import { supabase } from "../../lib/supabase";

export function HeroSection() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    if (isGenerating) {
      setProgress(0);
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => Math.min(prev + 1, 90));
      }, 165);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isGenerating]);

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('未登录');
      }

      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prd: combinedContent
        })
      });

      const raw = await response.text();

      if (!response.ok) {
        let errorMsg = 'Generation failed';
        try {
          const error = JSON.parse(raw);
          errorMsg = error.error || error.message || 'Generation failed';
        } catch {
          errorMsg = raw || 'Generation failed';
        }
        console.error('API Error:', errorMsg);

        if (errorMsg.includes('积分') || errorMsg.includes('credit') || errorMsg.includes('Insufficient')) {
          setShowCreditModal(true);
          return;
        }

        throw new Error(errorMsg);
      }

      const data = JSON.parse(raw);
      if (!data.code) {
        throw new Error('API did not return mermaid code');
      }
      sessionStorage.setItem('mermaidCode', data.code);
      navigate('/editor');
    } catch (error) {
      console.error('Generation failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate diagram. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
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
            fontSize: "0.75em",
            whiteSpace: "nowrap",
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
              rows={6}
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
                paddingRight: "8px",
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
                  disabled={isGenerating}
                  className="ml-1"
                  style={{ background: "none", border: "none", cursor: isGenerating ? "not-allowed" : "pointer", padding: 0, display: "flex" }}>
                  <X size={14} style={{ color: isGenerating ? "#d1d5db" : "#7c3aed" }} />
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
                disabled={isGenerating}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg"
                style={{
                  background: isGenerating ? "#f3f4f6" : "#f5f3ff",
                  border: isGenerating ? "1px solid rgba(124,58,237,0.05)" : "1px solid rgba(124,58,237,0.2)",
                  color: isGenerating ? "#d1d5db" : "#7c3aed",
                  cursor: isGenerating ? "not-allowed" : "pointer",
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
                {isGenerating ? "Generating..." : t.heroCTA}
                {!isGenerating && <ArrowRight size={16} />}
              </button>
            </div>
          </div>

          {/* Progress bar — matches Editor.tsx style */}
          {isGenerating && (
            <div className="mt-3 w-full">
              <div className="flex items-center justify-between text-sm mb-2">
                <span style={{ color: "#6b7280" }}>Generating diagram...</span>
                <span style={{ color: "#7c3aed", fontWeight: 600 }}>{Math.min(100, Math.round(progress))}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "#ede9fe" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7)" }}
                  animate={{ width: `${Math.min(100, progress)}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>
          )}
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
        onSuccess={handleAuthSuccess}
      />
    )}

    {showCreditModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💳</span>
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: "#1e0a3c" }}>
              Insufficient Credits
            </h3>
            <p className="text-gray-600 mb-6">
              You don't have enough credits to generate a diagram. Purchase more credits to continue.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreditModal(false)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 font-semibold"
                style={{ color: "#6b7280" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreditModal(false);
                  navigate('/pricing');
                }}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                Buy Credits
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
    </>
  );
}
