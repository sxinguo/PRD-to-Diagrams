import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "zh";

export const translations = {
  en: {
    // Navbar
    navFeatures: "Features",
    navPricing: "Pricing",
    navFAQ: "FAQ",
    navBlog: "Blog",
    navSignIn: "Sign In",
    navGetStarted: "Get Started Free",

    // Hero
    heroBadge: "Trusted by 10,000+ Product Managers",
    heroH1a: "Turn PRD into",
    heroH1b: "Professional Diagrams",
    heroDesc: "Upload your PRD document and instantly generate sequence diagrams, flowcharts, and user journey maps. Save hours of manual work.",
    heroCTA: "Start Generating",
    heroDemo: "View Examples",
    heroPlaceholder: "Describe your requirement, e.g.: Generate a user login sequence diagram with phone verification and OTP flow",
    statPRDs: "PRDs Processed",
    statDiagrams: "Diagrams Generated",
    statTime: "Avg Generation Time",
    statAccuracy: "Diagram Accuracy",

    // Workspace
    workspaceBadge: "AI-Powered Diagram Generation",
    workspaceH2: "Transform Your PRD into Visual Diagrams",
    workspaceDesc: "Paste your PRD text or upload a .txt file. Our AI will analyze and generate professional diagrams instantly.",
    typeLabel: "Diagram Type",
    typeSequence: "Sequence Diagram",
    typeSequenceDesc: "User-system interaction flows",
    typeFlowchart: "Flowchart",
    typeFlowchartDesc: "Business process visualization",
    typeJourney: "User Journey Map",
    typeJourneyDesc: "Customer experience mapping",
    generateBtn: "Generate Diagram",
    downloadBtn: "Download Diagram",
    resetBtn: "Try Another PRD",
    viewMode: "View Mode",
    dropTitle: "Paste or upload your PRD text here",
    dropSub: "Supports .txt format · Paste directly or upload file",
    tryDemo: "Try a demo PRD",
    processing: "Analyzing PRD with AI…",
    processingMode: "Extracting",
    processingUpscale: "generating",
    doneLabel: "Diagram generated successfully",
    sliderHint: "Preview your generated diagram",
    resolution: "resolution",
    preview: "Preview",
    change: "Change",
    labelOriginal: "Original Text",
    labelEnhanced: "Generated Diagram",

    // Features
    featuresBadge: "Why PRD图示",
    featuresH2a: "Everything You Need to",
    featuresH2b: "Visualize Your PRD",
    featuresDesc: "From text to professional diagrams in seconds.",
    feat1Title: "Sequence Diagram Generation",
    feat1Desc: "Automatically extract user-system interactions from your PRD and generate clean sequence diagrams.",
    feat2Title: "Flowchart Creation",
    feat2Desc: "Transform business processes and workflows into clear, professional flowcharts instantly.",
    feat3Title: "User Journey Mapping",
    feat3Desc: "Convert user stories and requirements into comprehensive user journey maps.",
    feat4Title: "Multiple Format Support",
    feat4Desc: "Works with plain text, Markdown, and structured PRD documents.",
    feat5Title: "Export Options",
    feat5Desc: "Download diagrams as PNG, SVG, or draw.io format for easy integration.",
    feat6Title: "Privacy First",
    feat6Desc: "Your PRDs are processed securely and never stored on our servers.",
    galleryTitle: "See the Results",
    galleryDesc: "From PRD text to professional diagrams",
    galArch: "Sequence Diagram",
    galPortrait: "Flowchart",
    galWildlife: "User Journey",
    galHoverBefore: "Original PRD",
    galAfter: "Generated",

    // Pricing
    pricingBadge: "Pricing",
    pricingH2: "Pay As You Go",
    pricingDesc: "Buy credits once, use forever. No subscription required.",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save 20%",
    pricingNote: "Credits never expire. SSL encrypted. 14-day refund guarantee.",
    planFree: "Free",
    planFreeDesc: "Get started with 12 free credits",
    planStarter: "Starter Pack",
    planStarterDesc: "100 credits for casual use",
    planPro: "Pro Pack",
    planProDesc: "500 credits for power users",
    mostPopular: "Best Value",
    ctaFree: "Get Started",
    ctaStarter: "Buy Starter Pack",
    ctaPro: "Buy Pro Pack",
    perMonth: "",
    f_6credits: "12 free credits on signup",
    f_3perGen: "3 credits per generation",
    f_dailyBonus: "Daily bonus: +3 if used yesterday",
    f_100credits: "100 credits pack",
    f_500credits: "500 credits pack",
    f_5000credits: "5000 credits pack",
    f_allDiagrams: "All diagram types",
    f_priorityQueue: "Priority queue",
    f_noExpiry: "Credits never expire",
    f_emailSupport: "Email support",
    f_commercial: "Commercial license",

    // Footer
    footerTagline: "AI-powered PRD to diagram conversion for product managers.",
    footerNote: "Built with neural precision · Powered by AI",
    footerCopy: "© 2026 PRD Chart Inc. All rights reserved.",
    footerContact: "Contact us: feedback9980@163.com",
    colProduct: "Product",
    colCompany: "Company",
    colLegal: "Legal",
    colSupport: "Support",
    navPrivacyPolicy: "Privacy Policy",
    navTerms: "Terms & Conditions",
    navRefundPolicy: "Refund Policy",

    // Meta
    pageTitle: "PRD Chart - AI-Powered PRD to Diagram Converter",
    pageDescription: "Upload your PRD and instantly generate sequence diagrams, flowcharts, and user journey maps. Built for product managers.",

    // Editor AI Modal
    aiModalTitle: "AI Generate Diagram",
    aiModalDesc: "Describe what diagram you want to create",
    aiModalPlaceholder: "e.g., User login flow with phone verification and OTP",
    aiUploadDoc: "Upload Document",
    aiCancel: "Cancel",
    aiGenerate: "Generate",
    aiGenerating: "Generating...",
    aiGeneratingHint: "AI is analyzing your input and generating diagram…",
    errNoCredits: "Insufficient credits (current: {n} credits). Please purchase more credits.",
    errTimeout: "Request timed out. Please check your network and retry.",
    errNetwork: "Network error. Please check your connection and retry.",
    errNotAuth: "Please sign in before generating.",
    errEmptyResult: "AI returned empty content.",
    errDefault: "Failed to generate diagram, please retry.",
    creditsModalTitle: "Insufficient Credits",
    creditsModalDesc: "You need at least 3 credits to generate a diagram. Purchase credits to continue.",
    creditsModalBuy: "Buy Credits",
    creditsModalCancel: "Cancel",
  },
  zh: {
    navFeatures: "功能",
    navPricing: "价格",
    navFAQ: "常见问题",
    navBlog: "博客",
    navSignIn: "登录",
    navGetStarted: "免费开始使用",

    heroBadge: "超过 10,000 名产品经理信赖",
    heroH1a: "将 PRD 转化为",
    heroH1b: "专业图表",
    heroDesc: "上传您的 PRD 文档，即可即时生成时序图、流程图和用户旅程地图。节省数小时的手动工作。",
    heroCTA: "开始生成",
    heroDemo: "查看示例",
    heroPlaceholder: "描述你的需求，例如：帮我生成一个用户登录的时序图，包含手机号验证和验证码流程",
    statPRDs: "已处理 PRD",
    statDiagrams: "已生成图表",
    statTime: "平均生成时间",
    statAccuracy: "图表准确度",

    workspaceBadge: "AI 驱动的图表生成引擎",
    workspaceH2: "将您的 PRD 转化为可视化图表",
    workspaceDesc: "粘贴您的 PRD 文本或上传 .txt 文件。我们的 AI 将即时分析并生成专业图表。",
    typeLabel: "图表类型",
    typeSequence: "时序图",
    typeSequenceDesc: "用户与系统的交互流程",
    typeFlowchart: "流程图",
    typeFlowchartDesc: "业务流程可视化",
    typeJourney: "用户旅程地图",
    typeJourneyDesc: "客户体验地图",
    generateBtn: "生成图表",
    downloadBtn: "下载图表",
    resetBtn: "处理其他 PRD",
    viewMode: "观看模式",
    dropTitle: "在此粘贴或上传 PRD 文本",
    dropSub: "支持 .txt 格式 · 直接粘贴或上传文件",
    tryDemo: "试用示例 PRD",
    processing: "AI 分析 PRD 中…",
    processingMode: "正在提取",
    processingUpscale: "生成",
    doneLabel: "图表生成成功",
    sliderHint: "预览生成的图表",
    resolution: "分辨率",
    preview: "预览",
    change: "更换",
    labelOriginal: "原始文本",
    labelEnhanced: "生成的图表",

    featuresBadge: "为什么选择 PRD图示",
    featuresH2a: "将 PRD",
    featuresH2b: "可视化的最佳方式",
    featuresDesc: "几秒钟内从文本到专业图表。",
    feat1Title: "时序图生成",
    feat1Desc: "从 PRD 中自动提取用户与系统的交互，生成清晰的时序图。",
    feat2Title: "流程图创建",
    feat2Desc: "将业务流程和工作流程即时转化为清晰专业的流程图。",
    feat3Title: "用户旅程地图",
    feat3Desc: "将用户故事和需求转化为全面的用户旅程地图。",
    feat4Title: "多格式支持",
    feat4Desc: "支持纯文本、Markdown 和结构化 PRD 文档。",
    feat5Title: "导出选项",
    feat5Desc: "支持导出 PNG、SVG 或 draw.io 格式，方便集成。",
    feat6Title: "隐私优先",
    feat6Desc: "您的 PRD 得到安全处理，绝不会存储在我们的服务器上。",
    galleryTitle: "查看效果",
    galleryDesc: "从 PRD 文本到专业图表",
    galArch: "时序图",
    galPortrait: "流程图",
    galWildlife: "用户旅程",
    galHoverBefore: "原始 PRD",
    galAfter: "已生成",

    pricingBadge: "价格方案",
    pricingH2: "按需付费，灵活使用",
    pricingDesc: "一次购买积分，长期有效。无需订阅，随时购买。",
    monthly: "按月付费",
    yearly: "按年付费",
    save: "节省 20%",
    pricingNote: "积分永不过期 · SSL 加密 · 14 天无理由退款",
    planFree: "免费版",
    planFreeDesc: "注册即送 12 积分，每天用完可领 3 积分",
    planStarter: "入门包",
    planStarterDesc: "100 积分，适合轻度使用",
    planPro: "专业包",
    planProDesc: "500 积分，适合高频使用",
    mostPopular: "超值之选",
    ctaFree: "免费开始",
    ctaStarter: "购买入门包",
    ctaPro: "购买专业包",
    perMonth: "",
    f_6credits: "注册即送 12 积分",
    f_3perGen: "每次生成消耗 3 积分",
    f_dailyBonus: "每天用完可领 +3 积分",
    f_100credits: "100 积分包",
    f_500credits: "500 积分包",
    f_5000credits: "5000 积分包",
    f_allDiagrams: "全部图表类型",
    f_priorityQueue: "优先队列",
    f_noExpiry: "积分永不过期",
    f_emailSupport: "邮件支持",
    f_commercial: "商业授权",

    footerTagline: "面向产品经理的 AI PRD 转图表工具。",
    footerNote: "以神经网络精度构建 · 由 AI 驱动",
    footerCopy: "© 2026 ChartPRD Inc. 保留所有权利。",
    footerContact: "有问题联系我们：feedback9980@163.com",
    colProduct: "产品",
    colCompany: "公司",
    colLegal: "法律",
    colSupport: "支持",
    navPrivacyPolicy: "隐私政策",
    navTerms: "条款与条件",
    navRefundPolicy: "退款政策",

    pageTitle: "ChartPRD - AI一键生成PRD图表",
    pageDescription: "上传PRD文档，AI自动生成时序图、流程图、用户体验地图。专为产品经理打造的PRD可视化工具。",

    // Editor AI Modal
    aiModalTitle: "AI 生成图表",
    aiModalDesc: "描述你想要创建的图表",
    aiModalPlaceholder: "例如：用户登录流程，包含手机号验证码登录",
    aiUploadDoc: "上传文档",
    aiCancel: "取消",
    aiGenerate: "生成",
    aiGenerating: "生成中...",
    aiGeneratingHint: "AI 正在分析输入并生成图表…",
    errNoCredits: "积分不足（当前 {n} 积分），请先购买积分。",
    errTimeout: "请求超时，请检查网络后重试。",
    errNetwork: "网络连接失败，请检查网络后重试。",
    errNotAuth: "请先登录后再生成。",
    errEmptyResult: "AI 返回内容为空。",
    errDefault: "生成图表失败，请重试。",
    creditsModalTitle: "积分不足",
    creditsModalDesc: "生成图表至少需要 3 积分，请购买积分后继续。",
    creditsModalBuy: "购买积分",
    creditsModalCancel: "取消",
  },
};

export type T = typeof translations.en;

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: T;
}>({ lang: "en", setLang: () => {}, t: translations.en });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];

  // Update document title and meta when language changes
  if (typeof document !== 'undefined') {
    document.title = t.pageTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t.pageDescription);
    }
    document.documentElement.lang = lang;
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
