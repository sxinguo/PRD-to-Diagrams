import { useState } from "react";
import { Sparkles, Menu, X, LogOut, User, Coins } from "lucide-react";
import { useLang } from "../i18n";
import { Link, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { AuthModal } from "./AuthModal";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { lang, setLang, t } = useLang();
  const location = useLocation();
  const { user, signOut, profile } = useAuth();

  const links = [
    { label: t.navFeatures, href: "/#features", external: true },
    { label: t.navPricing, href: "/pricing", external: false },
    { label: t.navFAQ, href: "/#faq", external: true },
  ];

  const isActive = (href: string) => href === "/pricing" && location.pathname === "/pricing";

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(124,58,237,0.1)",
          boxShadow: "0 1px 24px rgba(124,58,237,0.06)",
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <img
            src="/logo.png"
            alt="PRD Chart logo - AI diagram generator"
            className="w-8 h-8 rounded-lg"
            style={{ objectFit: "cover" }}
          />
          <span style={{ color: "#1e0a3c", fontWeight: 700, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#7c3aed" }}>PRD</span><span style={{ color: "#1e0a3c" }}>-Chart</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) =>
            !l.external ? (
              <Link key={l.label} to={l.href}
                style={{
                  color: isActive(l.href) ? "#7c3aed" : "#4b5563",
                  textDecoration: "none", fontSize: "0.9rem",
                  fontWeight: isActive(l.href) ? 600 : 400,
                }}>
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={l.href}
                style={{ color: "#4b5563", textDecoration: "none", fontSize: "0.9rem", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#7c3aed")}
                onMouseLeave={e => (e.currentTarget.style.color = "#4b5563")}>
                {l.label}
              </a>
            )
          )}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Lang toggle */}
          <div className="flex items-center rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(124,58,237,0.2)", background: "#f5f3ff" }}>
            {(["en", "zh"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className="px-3 py-1.5 text-xs transition-all"
                style={{
                  background: lang === l ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "transparent",
                  color: lang === l ? "#fff" : "#7c3aed",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: lang === l ? 600 : 400,
                }}>
                {l === "en" ? "EN" : "中文"}
              </button>
            ))}
          </div>

          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#f5f3ff" }}>
                <Coins size={16} style={{ color: "#7c3aed" }} />
                <span style={{ color: "#7c3aed", fontWeight: 700, fontSize: "0.875rem" }}>
                  {profile?.credits_remaining ?? 0}
                </span>
                <span style={{ color: "#9ca3af", fontSize: "0.75rem" }}>Credits</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "#f5f3ff", border: "1px solid rgba(124,58,237,0.2)" }}>
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User profile avatar"
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <User size={16} style={{ color: "#7c3aed" }} />
                )}
                <span style={{ color: "#7c3aed", fontSize: "0.875rem", fontWeight: 500 }}>
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{
                  background: "#f5f3ff",
                  border: "1px solid rgba(124,58,237,0.2)",
                  color: "#7c3aed",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowAuthModal(true)}
                style={{ color: "#6b7280", background: "transparent", border: "none", cursor: "pointer", padding: "8px 14px", fontSize: "0.9rem" }}>
                {t.navSignIn}
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  padding: "8px 18px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  boxShadow: "0 2px 12px rgba(124,58,237,0.3)",
                }}>
                {t.navGetStarted}
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <div className="flex items-center rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(124,58,237,0.2)" }}>
            {(["en", "zh"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className="px-2 py-1 text-xs"
                style={{
                  background: lang === l ? "linear-gradient(135deg, #7c3aed, #a855f7)" : "#f5f3ff",
                  color: lang === l ? "#fff" : "#7c3aed",
                  border: "none",
                  cursor: "pointer",
                }}>
                {l === "en" ? "EN" : "中"}
              </button>
            ))}
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: "#374151", background: "transparent", border: "none", cursor: "pointer" }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 py-4 flex flex-col gap-1 px-6 md:hidden"
            style={{ background: "rgba(255,255,255,0.97)", borderBottom: "1px solid rgba(124,58,237,0.1)", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
            {links.map((l) =>
              !l.external ? (
                <Link key={l.label} to={l.href} onClick={() => setMobileOpen(false)}
                  style={{ color: "#374151", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #f3f4f6", display: "block" }}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                  style={{ color: "#374151", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                  {l.label}
                </a>
              )
            )}
            <button
              onClick={() => { setMobileOpen(false); setShowAuthModal(true); }}
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                padding: "10px 20px",
                cursor: "pointer",
                marginTop: "8px",
                fontWeight: 600,
              }}>
              {t.navGetStarted}
            </button>
          </div>
        )}
      </nav>
      {showAuthModal && (
        <AuthModal
          isOpen={true}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {}}
        />
      )}
    </>
  );
}