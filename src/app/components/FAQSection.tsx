import { useState } from "react";
import { motion } from "motion/react";
import { useLang } from "../i18n";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs = {
  en: [
    {
      question: "What types of diagrams are supported?",
      answer: "PRD Chart supports three major diagram types: Sequence Diagrams (user-system interaction flows), Flowcharts (business process visualization), and User Journey Maps (customer experience mapping)."
    },
    {
      question: "How do I generate a diagram?",
      answer: "Simply describe your requirement in the input box on the homepage, select your preferred diagram type, then click 'Start Generating'. Our AI will analyze your PRD text and generate professional Mermaid code instantly."
    },
    {
      question: "How many credits does one generation cost?",
      answer: "Each diagram generation costs 3 credits. You can preview the generated diagram and export it in PNG or SVG format."
    },
    {
      question: "What PRD formats are supported?",
      answer: "We support plain text, Markdown format, and structured PRD documents. Simply paste your PRD text or upload a .txt file to get started."
    },
    {
      question: "Can I export diagrams in other formats?",
      answer: "Yes, you can export your generated diagrams as PNG files."
    },
    {
      question: "How accurate are the generated diagrams?",
      answer: "Our AI is built with neural precision to extract user-system interactions, business processes, and customer journeys from your PRD. The diagrams are production-ready and suitable for professional documentation."
    },
    {
      question: "Do credits expire?",
      answer: "No, all purchased credits never expire. Pay as you go with no subscription required."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, you get 12 free credits upon registration. Plus, if you use the service daily, you'll receive 3 bonus credits every day."
    },
  ],
  zh: [
    {
      question: "支持哪些类型的图表？",
      answer: "PRD Chart 支持三大图表类型：时序图（用户与系统交互流程）、流程图（业务流程可视化）、用户旅程地图（客户体验地图）。"
    },
    {
      question: "如何生成图表？",
      answer: "只需在首页输入框中描述你的需求，选择偏好的图表类型，然后点击「开始生成」。AI 会即时分析 PRD 文本并生成专业的 Mermaid 代码。"
    },
    {
      question: "每次生成消耗多少积分？",
      answer: "每次图表生成消耗 3 积分。你可以预览生成的图表，并以 PNG 或 SVG 格式导出。"
    },
    {
      question: "支持哪些 PRD 格式？",
      answer: "支持纯文本、Markdown 格式和结构化 PRD 文档。只需粘贴 PRD 文本或上传 .txt 文件即可开始。"
    },
    {
      question: "可以导出哪些格式？",
      answer: "可以 PNG 格式导出生成的图表。"
    },
    {
      question: "生成的图表准确吗？",
      answer: "我们的 AI 采用神经网络精度构建，能从 PRD 中准确提取用户与系统交互、业务流程和客户旅程。图表已达到生产级别，可直接用于专业文档。"
    },
    {
      question: "积分会过期吗？",
      answer: "不会，所有购买的积分永不过期。按需付费，无需订阅。"
    },
    {
      question: "有免费试用吗？",
      answer: "有，注册即送 12 积分。此外，每天使用完还可领取 3 积分奖励。"
    },
  ],
};

function FAQItem({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-xl overflow-hidden"
      style={{
        border: "1.5px solid rgba(124,58,237,0.1)",
        background: "#fff",
        marginBottom: 12,
      }}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <h3 style={{ fontWeight: 600, color: "#1e0a3c", fontSize: "0.95rem", margin: 0 }}>{item.question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={18} style={{ color: "#7c3aed" }} />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-4" style={{ color: "#6b7280", fontSize: "0.875rem", lineHeight: 1.7 }}>
          {item.answer}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FAQSection() {
  const { lang, t } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = faqs[lang] as FAQItem[];

  return (
    <section id="faq" className="w-full px-4 md:px-8 lg:px-16 py-16"
      style={{ background: "linear-gradient(180deg, #fafbff 0%, #fff 100%)" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block px-3 py-1 rounded-full text-xs mb-4"
            style={{ background: "#ede9fe", border: "1px solid rgba(124,58,237,0.2)", color: "#7c3aed" }}>
            FAQ
          </div>
          <h2 style={{ color: "#1e0a3c", letterSpacing: "-0.03em", marginBottom: 10 }}>
            {lang === "zh" ? "常见问题" : "Frequently Asked Questions"}
          </h2>
          <p style={{ color: "#9ca3af", maxWidth: 460, margin: "0 auto" }}>
            {lang === "zh"
              ? "关于图表生成的一切疑问，这里都有答案"
              : "Everything you need to know about diagram generation"}
          </p>
        </div>

        {/* FAQ list */}
        <div>
          {items.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* CTA hint */}
        <div className="text-center mt-8">
          <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
            {lang === "zh" ? "还有其他问题？" : "Still have questions?"}
            <a href="mailto:support@chartprd.com" className="ml-1" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
              {lang === "zh" ? "联系我们" : "Contact us"}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}