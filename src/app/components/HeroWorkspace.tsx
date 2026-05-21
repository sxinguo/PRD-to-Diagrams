import { useState, useRef } from "react";
import { Upload, Zap, FileText, RotateCcw, GitBranch, Map, List } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLang } from "../i18n";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

type DiagramType = "sequence" | "flowchart" | "journey";

const SUPABASE_URL = "https://aqdrywckvqrpuvaddsxj.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZHJ5d2NrdnFycHV2YWRkc3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzIwNTgsImV4cCI6MjA5NDc0ODA1OH0.mB7voJ7pT1LZ1iL9Rb3g5scm_CypmufPxb47t4sMmQ8";

const DEMO_PRD = `用户登录流程 PRD:

1. 用户打开APP，进入登录页面
2. 用户输入手机号，点击获取验证码
3. 系统发送验证码到用户手机
4. 用户输入验证码
5. 系统验证验证码是否正确
6. 验证成功，用户登录系统
7. 验证失败，显示错误信息，允许重试`;

export function HeroWorkspace() {
  const { t } = useLang();
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();

  const [diagramType, setDiagramType] = useState<DiagramType>("sequence");
  const [prdText, setPrdText] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const diagramTypes: { id: DiagramType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "sequence", label: t.typeSequence, icon: <List size={14} />, desc: t.typeSequenceDesc },
    { id: "flowchart", label: t.typeFlowchart, icon: <GitBranch size={14} />, desc: t.typeFlowchartDesc },
    { id: "journey", label: t.typeJourney, icon: <Map size={14} />, desc: t.typeJourneyDesc },
  ];

  const processFile = (file: File) => {
    if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) return;
    const reader = new FileReader();
    reader.onload = (e) => setPrdText(e.target?.result as string);
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleGenerate = async () => {
    if (!prdText.trim()) return;

    // 检查登录和积分
    if (!user) {
      alert("请先登录");
      return;
    }

    if (profile && profile.credits_remaining < 3) {
      alert("积分不足（当前 " + profile.credits_remaining + " 积分），请先购买积分");
      return;
    }

    // 扣3积分（必须等完成后再跳转，否则 fetch 会被页面跳转中断）
    let deductOk = false;
    try {
      console.log("[handleGenerate] 开始扣积分, userId:", user.id);

      const resp = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/deduct_credits`,
        {
          method: "POST",
          headers: {
            "apikey": ANON_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            amount: 3,
            description: "AI生成图表",
          }),
        }
      );

      console.log("[handleGenerate] use_credits HTTP status:", resp.status);

      if (!resp.ok) {
        const errText = await resp.text();
        console.error("[handleGenerate] 扣积分失败:", resp.status, errText);
        alert("扣积分失败: " + errText);
        return;
      }

      const respText = await resp.text();
      console.log("[handleGenerate] use_credits response:", respText);
      deductOk = true;
    } catch (err) {
      console.error("[handleGenerate] 扣积分异常:", err);
      alert("扣积分失败，请重试");
      return;
    }

    // 扣积分成功后再跳转
    if (deductOk) {
      console.log("[handleGenerate] 扣积分成功，跳转编辑器");
      await refreshProfile();
      navigate(`/editor?prompt=${encodeURIComponent(prdText)}`);
    }
  };

  const handleReset = () => setPrdText("");

  return (
    <section
      style={{
        minHeight: "100svh",
        paddingTop: 64,
        background: "linear-gradient(160deg, #f8f7ff 0%, #fdf4ff 60%, #f0f4ff 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Background dots */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: "absolute", top: "-15%", right: "-8%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.13) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", left: "-5%",
          width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(147,197,253,0.1) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(124,58,237,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 md:px-8 py-10 flex flex-col items-center gap-6">

        {/* ── Headline ── */}
        <div className="text-center">
          <h1 style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.04em",
            color: "#1e0a3c",
            margin: "0 0 10px",
          }}>
            {t.heroH1a}{" "}
            <span style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 55%, #6366f1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              {t.heroH1b}
            </span>
          </h1>
          <p style={{ color: "#9ca3af", margin: 0, fontSize: "0.95rem" }}>
            {t.heroDesc}
          </p>
        </div>

        {/* ── Diagram type selector ── */}
        <div className="flex gap-1.5 p-1 rounded-xl w-full"
          style={{ background: "#fff", border: "1.5px solid rgba(124,58,237,0.1)", boxShadow: "0 2px 12px rgba(124,58,237,0.06)" }}>
          {diagramTypes.map(d => (
            <button key={d.id} onClick={() => setDiagramType(d.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs transition-all"
              style={{
                background: diagramType === d.id ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent",
                color: diagramType === d.id ? "#fff" : "#9ca3af",
                border: "none", cursor: "pointer",
                fontWeight: diagramType === d.id ? 600 : 400,
                boxShadow: diagramType === d.id ? "0 2px 8px rgba(124,58,237,0.28)" : "none",
              }}>
              {d.icon}
              <span>{d.label}</span>
            </button>
          ))}
        </div>

        {/* ── Main area ── */}
        <AnimatePresence mode="wait">

          {/* Drop zone / Text input */}
          {!prdText && (
            <motion.div key="drop"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="w-full"
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              style={{
                height: 260,
                borderRadius: 20,
                border: `2px dashed ${isDragOver ? "#7c3aed" : "rgba(124,58,237,0.22)"}`,
                background: isDragOver ? "rgba(124,58,237,0.05)" : "rgba(255,255,255,0.75)",
                backdropFilter: "blur(8px)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                transition: "all 0.18s",
              }}>
              <motion.div
                animate={isDragOver ? { scale: 1.12 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                  width: 60, height: 60, borderRadius: 16,
                  background: "#ede9fe",
                  border: "1.5px solid rgba(124,58,237,0.22)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                <FileText size={26} style={{ color: "#7c3aed" }} />
              </motion.div>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#1e0a3c", fontWeight: 600, margin: "0 0 4px" }}>{t.dropTitle}</p>
                <p style={{ color: "#9ca3af", fontSize: "0.82rem", margin: 0 }}>{t.dropSub}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setPrdText(DEMO_PRD); }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 14px", borderRadius: 10,
                  background: "#fff", border: "1.5px solid rgba(124,58,237,0.18)",
                  color: "#7c3aed", cursor: "pointer", fontSize: "0.8rem",
                  boxShadow: "0 2px 8px rgba(124,58,237,0.07)",
                }}>
                <FileText size={13} />
                {t.tryDemo}
              </button>
              <input ref={fileInputRef} type="file" accept=".txt,text/*" className="hidden" onChange={handleFileInput} />
            </motion.div>
          )}

          {/* Text input area */}
          {!prdText && (
            <motion.div key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="w-full"
              style={{
                borderRadius: 20,
                border: "1.5px solid rgba(124,58,237,0.1)",
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(8px)",
              }}>
              <textarea
                value={prdText}
                onChange={(e) => setPrdText(e.target.value)}
                placeholder={t.dropTitle}
                className="w-full h-48 p-4 rounded-2xl resize-none focus:outline-none"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#1e0a3c",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                }}
              />
            </motion.div>
          )}

          {/* Preview */}
          {prdText && (
            <motion.div key="preview"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="w-full" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>{t.preview}</span>
                <button onClick={handleReset}
                  style={{ display: "flex", alignItems: "center", gap: 5, color: "#7c3aed", background: "transparent", border: "none", cursor: "pointer", fontSize: "0.8rem" }}>
                  <RotateCcw size={11} /> {t.change}
                </button>
              </div>
              <div style={{ borderRadius: 16, overflow: "hidden", border: "1.5px solid rgba(124,58,237,0.12)", boxShadow: "0 4px 20px rgba(124,58,237,0.08)", background: "#fff" }}>
                <div style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(124,58,237,0.08)",
                  background: "#fafbff",
                  fontSize: "0.8rem",
                  color: "#9ca3af",
                }}>
                  {prdText.length} characters
                </div>
                <div style={{ padding: 16, maxHeight: 200, overflow: "auto" }}>
                  <p style={{
                    color: "#1e0a3c",
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}>
                    {prdText.slice(0, 500)}{prdText.length > 500 ? "..." : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* ── Bottom bar: type info + action ── */}
        <div className="flex items-center gap-3 w-full">
          {/* Type info */}
          <div className="flex gap-1 p-1 rounded-xl"
            style={{ background: "#fff", border: "1.5px solid rgba(124,58,237,0.1)", boxShadow: "0 2px 8px rgba(124,58,237,0.05)" }}>
            {diagramTypes.map(d => (
              <button key={d.id} onClick={() => setDiagramType(d.id)}
                className="px-4 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: diagramType === d.id ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent",
                  color: diagramType === d.id ? "#fff" : "#9ca3af",
                  border: "none", cursor: "pointer",
                  fontWeight: diagramType === d.id ? 700 : 400,
                }}>
                {d.label}
              </button>
            ))}
          </div>

          {/* Action */}
          <div className="flex gap-2 flex-1 justify-end">
            {prdText ? (
              <>
                <button onClick={handleReset}
                  style={{
                    padding: "9px 14px", borderRadius: 12,
                    background: "#f5f3ff", border: "1.5px solid rgba(124,58,237,0.18)",
                    color: "#7c3aed", cursor: "pointer", display: "flex", alignItems: "center",
                  }}>
                  <RotateCcw size={14} />
                </button>
                <button onClick={handleGenerate}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    padding: "9px 20px", borderRadius: 12,
                    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                    border: "none", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem",
                    boxShadow: "0 3px 18px rgba(124,58,237,0.38)",
                  }}>
                  <Zap size={15} />
                  {t.generateBtn}
                </button>
              </>
            ) : (
              <button onClick={() => fileInputRef.current?.click()}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  padding: "9px 20px", borderRadius: 12,
                  background: "#f5f3ff", border: "1.5px solid rgba(124,58,237,0.18)",
                  color: "#7c3aed", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem",
                }}>
                <Upload size={14} />
                {t.dropTitle}
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
