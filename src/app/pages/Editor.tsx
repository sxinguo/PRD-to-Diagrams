import { useState, useRef, useCallback, useEffect } from "react";
import { Zap, FileText, Download, RotateCcw, CheckCircle, GitBranch, Map, List, Copy, Eye, ZoomIn, ZoomOut, Sparkles, Send, Palette, Move } from "lucide-react";
import { motion } from "motion/react";
import { useLang } from "../i18n";
import mermaid from "mermaid";
import MonacoEditor from "@monaco-editor/react";
import { useSearchParams } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

const SUPABASE_URL = "https://aqdrywckvqrpuvaddsxj.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZHJ5d2NrdnFycHV2YWRkc3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzIwNTgsImV4cCI6MjA5NDc0ODA1OH0.mB7voJ7pT1LZ1iL9Rb3g5scm_CypmufPxb47t4sMmQ8";

type DiagramType = "sequence" | "flowchart" | "journey";

const COLOR_THEMES = {
  purple: {
    name: 'Purple',
    primaryColor: '#ede9fe',
    primaryTextColor: '#1e0a3c',
    primaryBorderColor: '#7c3aed',
    lineColor: '#7c3aed',
    secondaryColor: '#f5f3ff',
    tertiaryColor: '#fff',
  },
  blue: {
    name: 'Blue',
    primaryColor: '#dbeafe',
    primaryTextColor: '#1e3a8a',
    primaryBorderColor: '#3b82f6',
    lineColor: '#3b82f6',
    secondaryColor: '#eff6ff',
    tertiaryColor: '#fff',
  },
  green: {
    name: 'Green',
    primaryColor: '#d1fae5',
    primaryTextColor: '#064e3b',
    primaryBorderColor: '#10b981',
    lineColor: '#10b981',
    secondaryColor: '#ecfdf5',
    tertiaryColor: '#fff',
  },
  orange: {
    name: 'Orange',
    primaryColor: '#fed7aa',
    primaryTextColor: '#7c2d12',
    primaryBorderColor: '#f97316',
    lineColor: '#f97316',
    secondaryColor: '#ffedd5',
    tertiaryColor: '#fff',
  },
  pink: {
    name: 'Pink',
    primaryColor: '#fce7f3',
    primaryTextColor: '#831843',
    primaryBorderColor: '#ec4899',
    lineColor: '#ec4899',
    secondaryColor: '#fdf2f8',
    tertiaryColor: '#fff',
  },
  glassmorphism: {
    name: 'Glassmorphism',
    primaryColor: '#ede9fe',
    primaryTextColor: '#1e0a3c',
    primaryBorderColor: '#7c3aed',
    lineColor: '#333333',
    secondaryColor: '#f5f3ff',
    tertiaryColor: '#fff',
  },
};

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: COLOR_THEMES.purple
});

const DEMO_MERMAID = `sequenceDiagram
    participant User as 用户
    participant System as 系统
    participant API as 短信API

    User->>System: 1. 输入手机号，点击获取验证码
    System->>API: 2. 请求发送验证码
    API-->>System: 3. 返回发送成功
    System-->>User: 4. 显示"验证码已发送"
    User->>System: 5. 输入收到的验证码
    System->>System: 6. 验证验证码（有效期5分钟）
    alt 验证成功
        System-->>User: 7. 登录成功，跳转首页
    else 验证失败
        System-->>User: 8. 显示错误提示（剩余重试次数）
    end`;

// 简单的自然语言转 Mermaid 规则（后续替换为 AI）
function promptToMermaid(prompt: string): string {
  const lower = prompt.toLowerCase();

  // 时序图关键词
  if (lower.includes('时序') || lower.includes('sequence') || lower.includes('登录') || lower.includes('注册') || lower.includes('流程')) {
    if (lower.includes('登录')) {
      return `sequenceDiagram
    participant User as 用户
    participant System as 系统
    participant API as 短信API

    User->>System: 输入手机号，点击获取验证码
    System->>API: 请求发送验证码
    API-->>System: 返回发送成功
    System-->>User: 显示"验证码已发送"
    User->>System: 输入验证码
    System->>System: 验证验证码
    alt 验证成功
        System-->>User: 登录成功，跳转首页
    else 验证失败
        System-->>User: 显示错误提示
    end`;
    }
    if (lower.includes('支付')) {
      return `sequenceDiagram
    participant User as 用户
    participant System as 系统
    participant Payment as 支付系统
    participant Merchant as 商户

    User->>System: 选择商品，提交订单
    System-->>User: 显示订单确认页
    User->>System: 确认支付
    System->>Payment: 发起支付请求
    Payment-->>User: 展示支付方式选择
    User->>Payment: 选择支付方式并验证
    Payment->>Merchant: 通知支付成功
    Merchant-->>System: 订单完成
    System-->>User: 显示支付成功`;
    }
    // 默认时序图
    return `sequenceDiagram
    participant User as 用户
    participant System as 系统

    User->>System: ${prompt.slice(0, 50)}
    System-->>User: 响应结果`;
  }

  // 流程图关键词
  if (lower.includes('流程') || lower.includes('flow') || lower.includes('审批') || lower.includes('订单')) {
    if (lower.includes('订单')) {
      return `flowchart TD
    A[开始] --> B[创建订单]
    B --> C{库存充足?}
    C -- 是 --> D[扣减库存]
    C -- 否 --> E[提示库存不足]
    D --> F[计算金额]
    F --> G{支付成功?}
    G -- 是 --> H[生成订单]
    H --> I[通知用户]
    G -- 否 --> J[支付失败]
    J --> B
    E --> K[结束]`;
    }
    return `flowchart TD
    A[开始] --> B[步骤1]
    B --> C{条件判断}
    C -- 是 --> D[执行操作A]
    C -- 否 --> E[执行操作B]
    D --> F[结束]
    E --> F`;
  }

  // 默认返回示例
  return DEMO_MERMAID;
}

export function EditorPage() {
  const { t, lang } = useLang();
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';
  const initialCode = searchParams.get('code') || '';
  const { user, profile, refreshProfile } = useAuth();

  const [diagramType, setDiagramType] = useState<DiagramType>("sequence");
  const [code, setCode] = useState<string>(initialCode);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<keyof typeof COLOR_THEMES>("purple");
  const [viewMode, setViewMode] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // 点击外部关闭颜色选择器
  useEffect(() => {
    if (!showColorPicker) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-color-picker]')) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showColorPicker]);

  const mermaidRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const isSpacePressed = useRef(false);

  const handleDownload = async () => {
    if (!mermaidRef.current) return;

    const svg = mermaidRef.current.querySelector('svg');
    if (!svg) return;

    const svgClone = svg.cloneNode(true) as SVGElement;

    // 移除所有背景色
    svgClone.style.background = 'none';
    svgClone.style.backgroundColor = 'transparent';
    const bgRect = svgClone.querySelector('rect[fill="#ffffff"], rect[fill="white"]');
    if (bgRect) bgRect.remove();

    const viewBox = svgClone.getAttribute('viewBox');
    let width = parseFloat(svgClone.getAttribute('width') || '800');
    let height = parseFloat(svgClone.getAttribute('height') || '600');

    if (viewBox) {
      const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
      width = vbWidth;
      height = vbHeight;
    }

    const scale = 3;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    canvas.width = width * scale;
    canvas.height = height * scale;

    svgClone.setAttribute('width', String(width));
    svgClone.setAttribute('height', String(height));

    const svgData = new XMLSerializer().serializeToString(svgClone);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.download = `diagram-${Date.now()}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        }
      }, 'image/png');

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  // 空格键 + 拖拽平移
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !viewMode && previewContainerRef.current && document.activeElement?.tagName !== 'TEXTAREA' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        isSpacePressed.current = true;
        previewContainerRef.current.style.cursor = 'grab';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpacePressed.current = false;
        if (previewContainerRef.current) {
          previewContainerRef.current.style.cursor = viewMode ? 'grab' : 'default';
        }
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [viewMode]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewMode || isSpacePressed.current) {
      e.stopPropagation();
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      e.stopPropagation();
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isPanning) {
      e.stopPropagation();
    }
    setIsPanning(false);
  };

  useEffect(() => {
    if (previewContainerRef.current) {
      previewContainerRef.current.style.cursor = isPanning ? 'grabbing' : (viewMode ? 'grab' : 'default');
    }
  }, [viewMode, isPanning]);

  const diagramTypes: { id: DiagramType; label: string; icon: React.ReactNode }[] = [
    { id: "sequence", label: t.typeSequence, icon: <List size={16} /> },
    { id: "flowchart", label: t.typeFlowchart, icon: <GitBranch size={16} /> },
    { id: "journey", label: t.typeJourney, icon: <Map size={16} /> },
  ];

  const renderMermaid = useCallback(async (mermaidCode: string) => {
    if (!mermaidRef.current) return;

    try {
      const id = `mermaid-${Date.now()}`;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: COLOR_THEMES[currentTheme]
      });
      const { svg } = await mermaid.render(id, mermaidCode);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = svg;

        // Apply glassmorphism effect
        if (currentTheme === 'glassmorphism') {
          const svgEl = mermaidRef.current.querySelector('svg');
          if (svgEl) {
            const rects = svgEl.querySelectorAll('rect');
            const colors = ['#ff6b9d', '#c44569', '#4834df', '#30336b', '#00d2d3', '#0fb9b1', '#ffa502', '#ff6348', '#a29bfe', '#6c5ce7'];
            rects.forEach((rect, i) => {
              const color = colors[i % colors.length];
              rect.setAttribute('fill', color);
              rect.setAttribute('fill-opacity', '0.15');
              rect.setAttribute('style', 'backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);');
            });

            const paths = svgEl.querySelectorAll('path');
            paths.forEach(path => {
              path.setAttribute('stroke', '#333333');
              path.setAttribute('stroke-width', '2');
            });

            const lines = svgEl.querySelectorAll('line');
            lines.forEach(line => {
              line.setAttribute('stroke', '#333333');
              line.setAttribute('stroke-width', '2');
            });
          }
        }

        setIsDone(true);
      }
    } catch (error) {
      console.error('Mermaid render error:', error);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center; background: #fef2f2; border-radius: 12px;">Diagram syntax error</div>`;
      }
    }
  }, [currentTheme]);

  // 初始化：根据 code 参数自动渲染
  useEffect(() => {
    if (initialCode) {
      setIsDone(true);
    } else if (initialPrompt) {
      const generated = promptToMermaid(initialPrompt);
      setCode(generated);
    }
  }, [initialPrompt, initialCode]);

  // 实时渲染：当代码或主题改变时自动渲染
  useEffect(() => {
    if (!code.trim() || isProcessing) {
      return;
    }

    const timer = setTimeout(async () => {
      if (!mermaidRef.current) return;

      try {
        // 清除旧的 SVG
        mermaidRef.current.innerHTML = '';

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: COLOR_THEMES[currentTheme]
        });
        const { svg } = await mermaid.render(id, code);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;

          // Apply glassmorphism effect
          if (currentTheme === 'glassmorphism') {
            const svgEl = mermaidRef.current.querySelector('svg');
            if (svgEl) {
              const rects = svgEl.querySelectorAll('rect');
              const colors = ['#ff6b9d', '#c44569', '#4834df', '#30336b', '#00d2d3', '#0fb9b1', '#ffa502', '#ff6348', '#a29bfe', '#6c5ce7'];
              rects.forEach((rect, i) => {
                const color = colors[i % colors.length];
                rect.setAttribute('fill', color);
                rect.setAttribute('fill-opacity', '0.3');
                rect.setAttribute('stroke', color);
                rect.setAttribute('stroke-opacity', '0.6');
              });

              const paths = svgEl.querySelectorAll('path.flowchart-link, path[class*="messageLine"]');
              paths.forEach(path => {
                path.setAttribute('stroke', '#333333');
                path.setAttribute('stroke-width', '2.5');
              });

              const lines = svgEl.querySelectorAll('line');
              lines.forEach(line => {
                line.setAttribute('stroke', '#333333');
                line.setAttribute('stroke-width', '2.5');
              });

              const markers = svgEl.querySelectorAll('marker path, marker polygon');
              markers.forEach(marker => {
                marker.setAttribute('fill', '#333333');
                marker.setAttribute('stroke', '#333333');
              });
            }
          }

          setIsDone(true);
        }
      } catch (error) {
        console.error('Mermaid render error:', error);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center; background: #fef2f2; border-radius: 12px;">Diagram syntax error</div>`;
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [code, currentTheme]);

  const handleGenerate = useCallback(async () => {
    console.log("[handleGenerate] START");
    try {
      console.log("[handleGenerate] code:", code?.substring(0, 50));
      console.log("[handleGenerate] user:", user?.id, "profile:", profile?.credits_remaining);

      if (!code.trim()) {
        alert("请先输入 Mermaid 代码");
        return;
      }

      // 检查积分并扣减
      if (user && profile) {
        console.log("[handleGenerate] credits check, remaining:", profile.credits_remaining);
        if (profile.credits_remaining < 3) {
          alert("积分不足（当前 " + profile.credits_remaining + " 积分），请先购买积分");
          return;
        }

        console.log("[handleGenerate] calling fetch...");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || ANON_KEY;
        const userId = session?.user?.id || user.id;

        if (!userId) {
          alert("无法获取用户ID，请重新登录");
          return;
        }

        const requestBody = {
          user_id: userId,
          amount: 3,
          description: "AI生成图表",
        };
        console.log("[handleGenerate] request body:", JSON.stringify(requestBody));
        console.log("[handleGenerate] has token:", !!session?.access_token);

        const resp = await fetch(
          `${SUPABASE_URL}/rest/v1/rpc/deduct_credits`,
          {
            method: "POST",
            headers: {
              "apikey": ANON_KEY,
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        console.log("[handleGenerate] fetch complete, status:", resp.status);

        if (!resp.ok) {
          const errText = await resp.text();
          console.error("[handleGenerate] 扣积分失败:", resp.status, errText);
          alert("扣积分失败: " + errText);
          return;
        }

        const respText = await resp.text();
        console.log("[handleGenerate] use_credits result:", respText);

        // refreshProfile 不 await，让它在后台更新积分显示，不阻塞 UI
        refreshProfile();
      } else {
        console.log("[handleGenerate] skipping credit (no user or profile)");
      }

      setIsProcessing(true);
      console.log("[handleGenerate] setIsProcessing(true) done");

      setProgress(0);
      console.log("[handleGenerate] setProgress(0) done");

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 12, 90));
      }, 80);

      await new Promise(resolve => setTimeout(resolve, 1200));
      console.log("[handleGenerate] delay done");

      clearInterval(progressInterval);
      setProgress(100);
      setIsDone(true);
      setIsProcessing(false);
      console.log("[handleGenerate] setIsDone(true) and setIsProcessing(false) done");

      await new Promise(resolve => setTimeout(resolve, 50));

      if (mermaidRef.current) {
        console.log("[handleGenerate] mermaidRef found, rendering...");
        try {
          mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: COLOR_THEMES[currentTheme]
        });
          const id = `mermaid-${Date.now()}`;
          console.log("[handleGenerate] calling mermaid.render with id:", id);
          const { svg } = await mermaid.render(id, code);
          console.log("[handleGenerate] mermaid.render done, svg length:", svg.length);
          mermaidRef.current.innerHTML = svg;

          // Apply glassmorphism effect
          if (currentTheme === 'glassmorphism') {
            const svgEl = mermaidRef.current.querySelector('svg');
            if (svgEl) {
              const rects = svgEl.querySelectorAll('rect');
              const colors = ['#ff6b9d', '#c44569', '#4834df', '#30336b', '#00d2d3', '#0fb9b1', '#ffa502', '#ff6348', '#a29bfe', '#6c5ce7'];
              rects.forEach((rect, i) => {
                const color = colors[i % colors.length];
                rect.setAttribute('fill', color);
                rect.setAttribute('fill-opacity', '0.3');
                rect.setAttribute('stroke', color);
                rect.setAttribute('stroke-opacity', '0.6');
              });

              const paths = svgEl.querySelectorAll('path.flowchart-link, path[class*="messageLine"]');
              paths.forEach(path => {
                path.setAttribute('stroke', '#333333');
                path.setAttribute('stroke-width', '2.5');
              });

              const lines = svgEl.querySelectorAll('line');
              lines.forEach(line => {
                line.setAttribute('stroke', '#333333');
                line.setAttribute('stroke-width', '2.5');
              });

              const markers = svgEl.querySelectorAll('marker path, marker polygon');
              markers.forEach(marker => {
                marker.setAttribute('fill', '#333333');
                marker.setAttribute('stroke', '#333333');
              });
            }
          }

          console.log("[handleGenerate] SVG set");
        } catch (error) {
          console.error("[handleGenerate] render error:", error);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center; background: #fef2f2; border-radius: 12px;">Error</div>`;
          }
        }
      } else {
        console.log("[handleGenerate] mermaidRef is null — NOT rendering SVG");
      }
      console.log("[handleGenerate] END");
    } catch (err) {
      console.error("[handleGenerate] 异常:", err);
    }
  }, [code, user, profile, refreshProfile]);

  const handleReset = () => {
    setCode("");
    setIsDone(false);
    setProgress(0);
  };

  const handleLoadDemo = () => {
    setCode(DEMO_MERMAID);
    setIsDone(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleRegenerate = () => {
    if (initialPrompt) {
      const generated = promptToMermaid(initialPrompt);
      setCode(generated);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;

    // 检查积分并扣减
    if (user && profile) {
      if (profile.credits_remaining < 3) {
        alert("积分不足（当前 " + profile.credits_remaining + " 积分），请先购买积分");
        return;
      }

      try {
        console.log("[handleAIGenerate] 开始扣积分, userId:", user.id);

        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || ANON_KEY;
        const userId = session?.user?.id || user.id;

        if (!userId) {
          alert("无法获取用户ID，请重新登录");
          return;
        }

        const resp = await fetch(
          `${SUPABASE_URL}/rest/v1/rpc/deduct_credits`,
          {
            method: "POST",
            headers: {
              "apikey": ANON_KEY,
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              amount: 3,
              description: "AI生成图表",
            }),
          }
        );

        console.log("[handleAIGenerate] use_credits HTTP status:", resp.status);

        if (!resp.ok) {
          const errText = await resp.text();
          console.error("[handleAIGenerate] 扣积分失败:", resp.status, errText);
          alert("扣积分失败: " + errText);
          return;
        }

        const respText = await resp.text();
        console.log("[handleAIGenerate] use_credits response:", respText);
        await refreshProfile();
      } catch (err) {
        console.error("[handleAIGenerate] 扣积分异常:", err);
        alert("扣积分失败，请重试");
        return;
      }
    }

    setIsAIGenerating(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/generate-diagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prd: aiPrompt,
          diagramType: diagramType
        })
      });

      if (!response.ok) {
        throw new Error('生成图表失败');
      }

      const data = await response.json();
      const generated = data.code;
      setCode(generated);
      setIsAIGenerating(false);
      setShowAIChat(false);
      setAiPrompt("");

      // 自动渲染
      setTimeout(() => {
        if (mermaidRef.current) {
          (async () => {
            try {
              const id = `mermaid-${Date.now()}`;
              mermaid.initialize({
                startOnLoad: false,
                theme: 'base',
                themeVariables: COLOR_THEMES[currentTheme]
              });
              const { svg } = await mermaid.render(id, generated);
              if (mermaidRef.current) {
                mermaidRef.current.innerHTML = svg;

                // Apply glassmorphism effect
                if (currentTheme === 'glassmorphism') {
                  const svgEl = mermaidRef.current.querySelector('svg');
                  if (svgEl) {
                    const rects = svgEl.querySelectorAll('rect');
                    const colors = ['#ff6b9d', '#c44569', '#4834df', '#30336b', '#00d2d3', '#0fb9b1', '#ffa502', '#ff6348', '#a29bfe', '#6c5ce7'];
                    rects.forEach((rect, i) => {
                      const color = colors[i % colors.length];
                      rect.setAttribute('fill', color);
                      rect.setAttribute('fill-opacity', '0.15');
                      rect.setAttribute('style', 'backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);');
                    });

                    const paths = svgEl.querySelectorAll('path');
                    paths.forEach(path => {
                      path.setAttribute('stroke', '#333333');
                      path.setAttribute('stroke-width', '2');
                    });

                    const lines = svgEl.querySelectorAll('line');
                    lines.forEach(line => {
                      line.setAttribute('stroke', '#333333');
                      line.setAttribute('stroke-width', '2');
                    });
                  }
                }

                setIsDone(true);
              }
            } catch (error) {
              console.error('[handleAIGenerate] Mermaid render error:', error);
            }
          })();
        }
      }, 100);
    } catch (error) {
      console.error('AI生成失败:', error);
      alert('生成图表失败，请重试');
      setIsAIGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f8f7ff", height: "100vh" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3"
        style={{ background: "#fff", borderBottom: "1px solid rgba(124,58,237,0.1)" }}>
        <div className="flex items-center gap-4">
          <span style={{ fontWeight: 700, color: "#1e0a3c", fontSize: "1.1rem" }}>PRD图示</span>
          <span style={{ color: "#9ca3af" }}>/</span>
          <span style={{ color: "#6b7280" }}>Editor</span>
        </div>
      </div>

      {/* Main content: 40% editor / 60% preview */}
      <div className="flex-1 flex" style={{ overflow: "hidden" }}>
        {/* Left: Monaco Editor (40%) */}
        <div className="flex flex-col border-r"
          style={{ width: "40%", borderColor: "rgba(124,58,237,0.1)", background: "#fff", height: "100%" }}>
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-4 py-2"
            style={{ background: "#fafbff", borderBottom: "1px solid rgba(124,58,237,0.08)" }}>
            <div className="flex items-center gap-2">
              <List size={14} style={{ color: "#7c3aed" }} />
              <span style={{ fontSize: "0.85rem", color: "#e5e7eb" }}>Mermaid Code</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleLoadDemo}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                style={{ background: "transparent", border: "1px solid rgba(124,58,237,0.3)", color: "#7c3aed", cursor: "pointer" }}>
                <FileText size={12} />
                Demo
              </button>
              <button onClick={handleCopyCode}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                style={{ background: "transparent", border: "1px solid rgba(124,58,237,0.3)", color: "#7c3aed", cursor: "pointer" }}>
                <Copy size={12} />
                Copy
              </button>
            </div>
          </div>
          {/* Monaco Editor */}
          <div className="flex-1" style={{ position: "relative" }}>
            <MonacoEditor
              height="100%"
              defaultLanguage="markdown"
              value={code}
              onChange={(value) => {
                setCode(value || "");
              }}
              theme="light"
              loading={<div style={{ padding: "20px", textAlign: "center", color: "#7c3aed" }}>Loading editor...</div>}
              onMount={(editor) => {
                console.log('Monaco editor mounted', editor);
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                wordWrap: "on",
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderLineHighlight: "line",
                cursorBlinking: "smooth",
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
              }}
            />
          </div>
          {/* Bottom bar */}
          <div className="flex items-center justify-between gap-3 px-4 py-3"
            style={{ background: "#fafbff", borderTop: "1px solid rgba(124,58,237,0.08)" }}>
            <button onClick={() => setShowAIChat(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "#fff", cursor: "pointer" }}>
              <Sparkles size={12} />
              AI Generate
            </button>
            <div className="flex items-center gap-3">
              <button onClick={handleGenerate} disabled={!code.trim() || isProcessing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                style={{
                  background: code.trim() && !isProcessing ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#d1d5db",
                  border: "none",
                  color: "#fff",
                  cursor: code.trim() && !isProcessing ? "pointer" : "not-allowed",
                  fontWeight: 600
                }}>
                <Zap size={12} />
                {isProcessing ? `${Math.round(progress)}%` : "Generate"}
              </button>
              {initialPrompt && (
                <button onClick={handleRegenerate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                  style={{ background: "transparent", border: "1px solid rgba(124,58,237,0.3)", color: "#7c3aed", cursor: "pointer" }}>
                  <RotateCcw size={12} />
                  Regenerate
                </button>
              )}
              <button onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                style={{ background: "transparent", border: "1px solid rgba(124,58,237,0.3)", color: "#7c3aed", cursor: "pointer" }}>
                <RotateCcw size={12} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right: Preview (60%) */}
        <div className="flex-1 flex flex-col" style={{ background: "#ffffff" }}>
          {/* Preview toolbar */}
          <div className="flex items-center justify-between px-4 py-2"
            style={{ borderBottom: "1px solid rgba(124,58,237,0.08)", background: "#ffffff" }}>
            <div className="flex items-center gap-2">
              <Eye size={14} style={{ color: "#7c3aed" }} />
              <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>Preview</span>
              {isDone && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                  style={{ background: "#dcfce7", color: "#16a34a" }}>
                  <CheckCircle size={10} />
                  Done
                </span>
              )}
            </div>
            {isDone && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode(!viewMode)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                  style={{
                    background: viewMode ? "#7c3aed" : "#f5f3ff",
                    border: "1px solid rgba(124,58,237,0.15)",
                    color: viewMode ? "#fff" : "#7c3aed",
                    cursor: "pointer"
                  }}>
                  <Move size={14} />
                  <span>{t.viewMode}</span>
                </button>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: "#f5f3ff", border: "1px solid rgba(124,58,237,0.15)" }}>
                  <button onClick={() => setZoom(z => Math.max(25, z - 25))} className="p-1 rounded hover:bg-purple-100" style={{ border: "none", background: "transparent", cursor: "pointer", color: "#7c3aed" }}>
                    <ZoomOut size={14} />
                  </button>
                  <span style={{ fontSize: "0.75rem", color: "#7c3aed", minWidth: "45px", textAlign: "center" }}>{zoom}%</span>
                  <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="p-1 rounded hover:bg-purple-100" style={{ border: "none", background: "transparent", cursor: "pointer", color: "#7c3aed" }}>
                    <ZoomIn size={14} />
                  </button>
                </div>
                <div className="relative" data-color-picker>
                  <button onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                    style={{ background: "#f5f3ff", border: "1px solid rgba(124,58,237,0.15)", color: "#7c3aed", cursor: "pointer" }}>
                    <Palette size={14} />
                    <span>{COLOR_THEMES[currentTheme].name}</span>
                  </button>
                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute right-0 mt-1 p-2 rounded-xl z-10"
                      style={{ background: "#fff", border: "1px solid rgba(124,58,237,0.15)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: "160px" }}>
                      {(Object.keys(COLOR_THEMES) as Array<keyof typeof COLOR_THEMES>).map(key => (
                        <button
                          key={key}
                          onClick={() => {
                            setCurrentTheme(key);
                            setShowColorPicker(false);
                          }}
                          className="flex items-center gap-2 w-full px-2 py-2 rounded-lg text-xs transition-all hover:bg-purple-50"
                          style={{ border: "none", cursor: "pointer" }}>
                          <span className="w-4 h-4 rounded-full" style={{ background: COLOR_THEMES[key].primaryBorderColor }} />
                          <span style={{ color: currentTheme === key ? "#7c3aed" : "#374151", fontWeight: currentTheme === key ? 600 : 400 }}>
                            {COLOR_THEMES[key].name}
                          </span>
                          {currentTheme === key && (
                            <CheckCircle size={12} style={{ color: "#7c3aed", marginLeft: "auto" }} />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
                <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", border: "none", color: "#fff", cursor: "pointer" }}>
                  <Download size={12} />
                  {t.downloadBtn}
                </button>
              </div>
            )}
          </div>

          {/* Diagram preview area */}
          <div
            ref={previewContainerRef}
            className="flex-1 p-6 overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              position: 'relative',
              userSelect: 'none',
              cursor: isPanning ? 'grabbing' : (viewMode ? 'grab' : 'default')
            }}
          >
            {isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "#ede9fe" }}>
                  <FileText size={28} style={{ color: "#7c3aed" }} />
                </div>
                <div className="w-64">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: "#6b7280" }}>Generating diagram...</span>
                    <span style={{ color: "#7c3aed", fontWeight: 600 }}>{Math.min(100, Math.round(progress))}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "#ede9fe" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7)" }}
                      animate={{ width: `${Math.min(100, progress)}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              </div>
            ) : isDone ? (
              <div className="h-full flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-4xl"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                    pointerEvents: 'none'
                  }}
                >
                  <div ref={mermaidRef} className="flex items-center justify-center" style={{ minHeight: "200px", transform: `scale(${zoom / 100})`, transformOrigin: "center", transition: "transform 0.2s" }} />
                </motion.div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "#ede9fe" }}>
                  {diagramType === "sequence" && <List size={32} style={{ color: "#7c3aed" }} />}
                  {diagramType === "flowchart" && <GitBranch size={32} style={{ color: "#6366f1" }} />}
                  {diagramType === "journey" && <Map size={32} style={{ color: "#a855f7" }} />}
                </div>
                <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                  Write Mermaid code on the left, preview on the right
                </p>
                <p style={{ color: "#c4b5fd", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Auto-renders as you type
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Chat Modal */}
      {showAIChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setShowAIChat(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg mx-4"
            style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} style={{ color: "#7c3aed" }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e0a3c" }}>AI Generate Diagram</h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "16px" }}>
              Describe what diagram you want to create
            </p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., 用户登录流程，包含手机号验证码登录"
              className="w-full p-3 rounded-lg text-sm"
              style={{ border: "1px solid rgba(124,58,237,0.2)", minHeight: "120px", resize: "vertical", fontFamily: "inherit" }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleAIGenerate();
                }
              }}
            />
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setShowAIChat(false)}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ background: "transparent", border: "1px solid #e5e7eb", color: "#6b7280", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleAIGenerate} disabled={!aiPrompt.trim() || isAIGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
                style={{
                  background: aiPrompt.trim() && !isAIGenerating ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#e5e7eb",
                  border: "none",
                  color: "#fff",
                  cursor: aiPrompt.trim() && !isAIGenerating ? "pointer" : "not-allowed"
                }}>
                {isAIGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Send size={14} />
                    Generate
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default EditorPage;