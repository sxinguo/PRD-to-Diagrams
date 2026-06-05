import { useLang } from "../i18n";

export function Footer() {
  const { t } = useLang();

  const links = [
    { label: t.navPrivacyPolicy, href: "/privacy-policy" },
    { label: t.navFeatures, href: "#" },
    { label: t.navPricing, href: "/pricing" },
    { label: t.navRefundPolicy, href: "/refund-policy" },
  ];

  return (
    <footer className="w-full px-4 md:px-8 lg:px-16 py-14"
      style={{ background: "#fff", borderTop: "1.5px solid rgba(124,58,237,0.08)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          {/* Brand */}
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.webp"
                alt="PRD Chart - Mermaid diagram generator"
                className="w-8 h-8 rounded-lg"
                style={{ objectFit: "cover" }}
              />
              <span style={{ color: "#1e0a3c", fontWeight: 700 }}>
                PRD<span style={{ color: "#7c3aed" }}>-Chart</span>
              </span>
            </div>
            <p className="text-xs" style={{ color: "#9ca3af", lineHeight: 1.7 }}>
              {t.footerTagline}
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="text-xs no-underline"
                style={{ color: "#9ca3af", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#7c3aed")}
                onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-8"
          style={{ borderTop: "1px solid rgba(124,58,237,0.08)" }}>
          <p className="text-xs" style={{ color: "#d1d5db" }}>{t.footerCopy}</p>
          <p className="text-xs" style={{ color: "#9ca3af" }}>{t.footerContact}</p>
        </div>
      </div>
    </footer>
  );
}
