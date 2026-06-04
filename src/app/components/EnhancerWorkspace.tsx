import { useState, useRef, useCallback } from "react";
import { Upload, Zap, User, Moon, Waves, Download, RotateCcw, ImagePlus, CheckCircle } from "lucide-react";
import { ComparisonSlider } from "./ComparisonSlider";
import { motion } from "motion/react";
import { useLang } from "../i18n";

type EnhancementMode = "general" | "portrait" | "lowlight" | "denoise";
type ScaleOption = "2x" | "4x" | "8x";

const DEMO_IMAGE = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=60";

export function EnhancerWorkspace() {
  const { t } = useLang();
  const [mode, setMode] = useState<EnhancementMode>("general");
  const [scale, setScale] = useState<ScaleOption>("2x");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modes: { id: EnhancementMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "general", label: t.modeGeneral, icon: <Zap size={16} />, desc: t.modeGeneralDesc },
    { id: "portrait", label: t.modePortrait, icon: <User size={16} />, desc: t.modePortraitDesc },
    { id: "lowlight", label: t.modeLowlight, icon: <Moon size={16} />, desc: t.modeLowlightDesc },
    { id: "denoise", label: t.modeDenoise, icon: <Waves size={16} />, desc: t.modeDenoiseDesc },
  ];

  const scaleDescs: Record<ScaleOption, string> = {
    "2x": t.scale2xDesc,
    "4x": t.scale4xDesc,
    "8x": t.scale8xDesc,
  };

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setIsDone(false);
      setProgress(0);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleEnhance = () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsDone(true);
          return 100;
        }
        return prev + Math.random() * 12 + 3;
      });
    }, 120);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setIsDone(false);
    setProgress(0);
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!uploadedImage) return;
    const a = document.createElement("a");
    a.href = uploadedImage;
    a.download = `lumixai-enhanced-${scale}.png`;
    a.click();
  };

  const useDemoImage = () => {
    setUploadedImage(DEMO_IMAGE);
    setIsDone(false);
    setProgress(0);
  };

  const card = {
    background: "#fff",
    border: "1.5px solid rgba(124,58,237,0.1)",
    borderRadius: "16px",
    boxShadow: "0 2px 16px rgba(124,58,237,0.06)",
  };

  return (
    <section id="workspace" className="w-full px-4 md:px-8 lg:px-16 py-16"
      style={{ background: "linear-gradient(180deg, #f8f7ff 0%, #fdf4ff 100%)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs"
            style={{ background: "#ede9fe", border: "1px solid rgba(124,58,237,0.2)", color: "#7c3aed" }}>
            <Zap size={12} />
            {t.workspaceBadge}
          </div>
          <h2 className="mb-3" style={{ color: "#1e0a3c", letterSpacing: "-0.03em" }}>
            {t.workspaceH2}
          </h2>
          <p style={{ color: "#9ca3af", maxWidth: 500, margin: "0 auto" }}>
            {t.workspaceDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left controls */}
          <div className="flex flex-col gap-4">
            {/* Mode */}
            <div style={card} className="p-4">
              <p className="text-xs mb-3"
                style={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {t.modeLabel}
              </p>
              <div className="flex flex-col gap-1.5">
                {modes.map(m => (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      background: mode === m.id ? "#f5f3ff" : "transparent",
                      border: mode === m.id ? "1.5px solid rgba(124,58,237,0.3)" : "1.5px solid transparent",
                      cursor: "pointer",
                    }}>
                    <span style={{ color: mode === m.id ? "#7c3aed" : "#d1d5db" }}>{m.icon}</span>
                    <div>
                      <div style={{ color: mode === m.id ? "#7c3aed" : "#374151", fontWeight: mode === m.id ? 600 : 400 }}>
                        {m.label}
                      </div>
                      <div className="text-xs" style={{ color: "#9ca3af" }}>{m.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Scale */}
            <div style={card} className="p-4">
              <p className="text-xs mb-3"
                style={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {t.scaleLabel}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(["2x", "4x", "8x"] as ScaleOption[]).map(s => (
                  <button key={s} onClick={() => setScale(s)}
                    className="py-2 rounded-xl text-sm transition-all"
                    style={{
                      background: scale === s ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#f9f5ff",
                      border: scale === s ? "none" : "1.5px solid rgba(124,58,237,0.12)",
                      color: scale === s ? "#fff" : "#7c3aed",
                      cursor: "pointer",
                      fontWeight: scale === s ? 700 : 400,
                      boxShadow: scale === s ? "0 2px 10px rgba(124,58,237,0.3)" : "none",
                    }}>
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-2.5" style={{ color: "#9ca3af" }}>{scaleDescs[scale]}</p>
            </div>

            {/* Actions */}
            {uploadedImage && !isProcessing && !isDone && (
              <motion.button
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                onClick={handleEnhance}
                className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  border: "none", color: "#fff", cursor: "pointer", fontWeight: 700,
                  boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
                }}>
                <Zap size={16} />
                {t.enhanceBtn}
              </motion.button>
            )}

            {isDone && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
                <button onClick={handleDownload}
                  className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    border: "none", color: "#fff", cursor: "pointer", fontWeight: 700,
                    boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
                  }}>
                  <Download size={16} />
                  {t.downloadBtn} ({scale})
                </button>
                <button onClick={handleReset}
                  className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm"
                  style={{
                    background: "#f5f3ff", border: "1.5px solid rgba(124,58,237,0.15)",
                    color: "#7c3aed", cursor: "pointer",
                  }}>
                  <RotateCcw size={14} />
                  {t.resetBtn}
                </button>
              </motion.div>
            )}
          </div>

          {/* Right: upload / preview / result */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {!uploadedImage ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-4 cursor-pointer"
                style={{
                  minHeight: 380, borderRadius: 16,
                  border: `2px dashed ${isDragOver ? "#7c3aed" : "rgba(124,58,237,0.2)"}`,
                  background: isDragOver ? "#f5f3ff" : "#fafbff",
                  transition: "all 0.2s",
                }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "#ede9fe", border: "1.5px solid rgba(124,58,237,0.2)" }}>
                  <Upload size={28} style={{ color: "#7c3aed" }} />
                </div>
                <div className="text-center">
                  <p style={{ color: "#1e0a3c", fontWeight: 600 }}>{t.dropTitle}</p>
                  <p className="text-sm mt-1" style={{ color: "#9ca3af" }}>
                    {t.dropSub.split("browse files")[0]}
                    <span style={{ color: "#7c3aed" }}>browse files</span>
                    {t.dropSub.split("browse files")[1] ?? ""}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); useDemoImage(); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                  style={{
                    background: "#fff", border: "1.5px solid rgba(124,58,237,0.2)",
                    color: "#7c3aed", cursor: "pointer",
                  }}>
                  <ImagePlus size={14} />
                  {t.tryDemo}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
              </div>
            ) : isProcessing ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-6"
                style={{ minHeight: 380, borderRadius: 16, background: "#fafbff", border: "1.5px solid rgba(124,58,237,0.1)" }}>
                <img src={uploadedImage} alt="Uploaded diagram being processed by AI enhancer" className="max-h-48 object-contain rounded-xl"
                  style={{ opacity: 0.4 }} />
                <div className="w-full max-w-xs flex flex-col gap-3 px-8">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#6b7280" }}>{t.processing}</span>
                    <span style={{ color: "#7c3aed", fontWeight: 600 }}>{Math.min(100, Math.round(progress))}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "#ede9fe" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7)" }}
                      animate={{ width: `${Math.min(100, progress)}%` }}
                      transition={{ duration: 0.1 }} />
                  </div>
                  <p className="text-xs text-center" style={{ color: "#9ca3af" }}>
                    {t.processingMode} {mode} · {scale} {t.processingUpscale}
                  </p>
                </div>
              </motion.div>
            ) : isDone ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm" style={{ color: "#7c3aed", fontWeight: 600 }}>
                  <CheckCircle size={16} />
                  {t.doneLabel}
                </div>
                <ComparisonSlider originalSrc={uploadedImage!} enhancedSrc={uploadedImage!} enhancementMode={mode} />
                <p className="text-xs text-center" style={{ color: "#9ca3af" }}>
                  {t.sliderHint} · {scale} {t.resolution}
                </p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: "#9ca3af" }}>{t.preview}</p>
                  <button onClick={handleReset} className="text-xs flex items-center gap-1"
                    style={{ color: "#7c3aed", background: "transparent", border: "none", cursor: "pointer" }}>
                    <RotateCcw size={12} /> {t.change}
                  </button>
                </div>
                <div style={{ borderRadius: 16, overflow: "hidden", border: "1.5px solid rgba(124,58,237,0.1)", boxShadow: "0 4px 20px rgba(124,58,237,0.08)" }}>
                  <img src={uploadedImage} alt="Uploaded diagram ready for AI enhancement" className="w-full object-contain"
                    style={{ maxHeight: 340, background: "#f8f7ff" }} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
