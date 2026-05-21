import React, { useRef, useState, useCallback } from "react";
import mermaid from "mermaid";
import { motion } from "motion/react";

const TEST_CODE = `sequenceDiagram
    participant User as 用户
    participant System as 系统
    User->>System: Hello`;

export default function HandleGenerateDebug() {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) =>
    setLogs(prev => [...prev, `[${String(Date.now()).slice(-6)}] ${msg}`]);

  const flushLog = () => new Promise(r => setTimeout(r, 0));

  const handleGenerate = useCallback(async () => {
    setLogs([]);
    addLog("=== START ===");
    addLog(`ref BEFORE setIsDone: ${!!mermaidRef.current}`);

    setIsProcessing(true);
    setProgress(0);

    const interval = setInterval(() => setProgress(p => Math.min(p + 12, 90)), 80);
    await new Promise(r => setTimeout(r, 1200));
    clearInterval(interval);
    setProgress(100);
    setIsProcessing(false);

    addLog(`ref AFTER setIsProcessing(false): ${!!mermaidRef.current}`);
    addLog(`isDone BEFORE setIsDone: ${isDone}`);

    await new Promise(r => setTimeout(r, 50));

    setIsDone(true);
    addLog("setIsDone(true) called");
    addLog(`ref IMMEDIATELY after setIsDone: ${!!mermaidRef.current}`);

    // Force re-render to check if ref becomes available
    await new Promise(r => setTimeout(r, 0));
    addLog(`ref after 1 macrotick: ${!!mermaidRef.current}`);

    await new Promise(r => setTimeout(r, 100));
    addLog(`ref after 100ms: ${!!mermaidRef.current}`);

    if (mermaidRef.current) {
      addLog("ref OK — rendering...");
      try {
        const { svg } = await mermaid.render(`test-${Date.now()}`, TEST_CODE);
        mermaidRef.current.innerHTML = svg;
        addLog(`SVG set, len=${svg.length}`);
      } catch (e: any) {
        addLog(`ERROR: ${e?.message}`);
      }
    } else {
      addLog("ref is NULL — skip render");
    }
    addLog("=== END ===");
  }, [isDone]);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h2 style={{ marginBottom: 16 }}>handleGenerate Debug</h2>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
          <div style={{ color: "#6b7280", fontSize: 14 }}>Editor (placeholder)</div>
        </div>

        <div style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "8px 16px", borderBottom: "1px solid #eee", background: "#fafbff", fontSize: 13, color: "#6b7280" }}>
            Preview  {isDone && <span style={{ color: "#16a34a", fontWeight: 600 }}>Done</span>}
          </div>
          <div style={{ flex: 1, padding: 24, overflow: "auto", minHeight: 300 }}>
            {isProcessing ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div>Generating... {Math.round(progress)}%</div>
                <div style={{ height: 4, background: "#ede9fe", borderRadius: 99, marginTop: 12 }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: "#7c3aed", borderRadius: 99, transition: "width 0.1s" }} />
                </div>
              </div>
            ) : isDone ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div
                  ref={mermaidRef}
                  style={{
                    border: mermaidRef.current ? "2px solid #7c3aed" : "2px dashed red",
                    borderRadius: 8,
                    minHeight: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </motion.div>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#9ca3af", fontSize: 14 }}>
                Write Mermaid code, preview here
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isProcessing}
        style={{
          padding: "10px 28px",
          background: isProcessing ? "#d1d5db" : "linear-gradient(135deg, #7c3aed, #a855f7)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 15,
          cursor: isProcessing ? "not-allowed" : "pointer",
          marginBottom: 24,
        }}
      >
        {isProcessing ? `Generating... ${Math.round(progress)}%` : "Generate (Debug)"}
      </button>

      <div style={{ background: "#0d1117", color: "#39d353", padding: 20, borderRadius: 8, fontFamily: "monospace", fontSize: 13, maxHeight: 500, overflow: "auto", whiteSpace: "pre-wrap" }}>
        {logs.length === 0 ? "Click Generate to run test..." : logs.join("\n")}
      </div>
    </div>
  );
}