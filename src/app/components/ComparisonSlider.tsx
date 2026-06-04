import { useRef, useState, useCallback, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";
import { useLang } from "../i18n";

interface ComparisonSliderProps {
  originalSrc: string;
  enhancedSrc: string;
  enhancementMode: string;
}

export function ComparisonSlider({ originalSrc, enhancedSrc, enhancementMode }: ComparisonSliderProps) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  const getEnhancedFilter = () => {
    switch (enhancementMode) {
      case "portrait": return "brightness(1.07) contrast(1.13) saturate(1.14)";
      case "lowlight": return "brightness(1.38) contrast(1.22) saturate(1.1)";
      case "denoise": return "brightness(1.03) contrast(1.09) saturate(1.05)";
      default: return "brightness(1.06) contrast(1.16) saturate(1.1)";
    }
  };

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => { setDragging(true); updatePosition(e.clientX); };
  const handleTouchStart = (e: React.TouchEvent) => { setDragging(true); updatePosition(e.touches[0].clientX); };

  useEffect(() => {
    const onMove = (e: MouseEvent) => dragging && updatePosition(e.clientX);
    const onUp = () => setDragging(false);
    const onTouch = (e: TouchEvent) => dragging && updatePosition(e.touches[0].clientX);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl select-none"
      style={{
        cursor: dragging ? "grabbing" : "grab",
        aspectRatio: "16/9",
        background: "#f5f3ff",
        border: "1.5px solid rgba(124,58,237,0.15)",
        boxShadow: "0 4px 32px rgba(124,58,237,0.1)",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Enhanced */}
      <img src={enhancedSrc} alt="AI-enhanced diagram with improved clarity and styling"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: getEnhancedFilter(), imageRendering: "crisp-edges" }}
        draggable={false} />

      {/* Original (clipped left) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={originalSrc} alt="Original diagram before AI enhancement"
          className="absolute top-0 left-0 h-full object-cover"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : "100%", filter: "brightness(0.88) contrast(0.9) saturate(0.85)" }}
          draggable={false} />
      </div>

      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-0.5"
        style={{
          left: `${position}%`,
          transform: "translateX(-50%)",
          background: "linear-gradient(180deg, transparent, #7c3aed, #a855f7, #7c3aed, transparent)",
          boxShadow: "0 0 10px rgba(124,58,237,0.5)",
        }} />

      {/* Handle */}
      <div className="absolute top-1/2 flex items-center justify-center rounded-full"
        style={{
          left: `${position}%`,
          transform: "translate(-50%, -50%)",
          width: 40, height: 40,
          background: "linear-gradient(135deg, #7c3aed, #a855f7)",
          boxShadow: "0 0 20px rgba(124,58,237,0.5), 0 4px 12px rgba(0,0,0,0.15)",
          border: "2.5px solid #fff",
        }}>
        <MoveHorizontal size={18} color="#fff" />
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs"
        style={{ background: "rgba(255,255,255,0.9)", color: "#6b7280", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        {t.labelOriginal}
      </div>
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs"
        style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", boxShadow: "0 2px 8px rgba(124,58,237,0.35)" }}>
        {t.labelEnhanced}
      </div>
    </div>
  );
}
