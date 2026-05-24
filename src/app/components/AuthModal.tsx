import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { X, Mail, Chrome } from "lucide-react";
import { supabase } from "../../lib/supabase";

const TURNSTILE_SITE_KEY = "0x4AAAAAADUuGmSEMunFfR85";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOAuthPending, setIsOAuthPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scriptId = "turnstile-script";
    if (document.getElementById(scriptId)) {
      setTurnstileReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => setTurnstileReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!turnstileReady || !turnstileRef.current) return;

    const container = turnstileRef.current;
    if (container.innerHTML) return;

    const widgetId = (window as any).turnstile.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: "light",
      callback: (token: string) => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(null),
      "error-callback": () => setTurnstileToken(null),
    });

    return () => {
      try {
        (window as any).turnstile.remove(widgetId);
      } catch {}
    };
  }, [turnstileReady]);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "signup") {
        if (!turnstileToken) {
          setMessage({ type: "error", text: "Please complete the verification first" });
          setLoading(false);
          return;
        }
        const verifyRes = await fetch('http://localhost:3001/api/verify-turnstile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken }),
        });
        if (!verifyRes.ok) {
          setMessage({ type: "error", text: "Verification service unavailable, please try again later" });
          setLoading(false);
          return;
        }
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          setMessage({ type: "error", text: "Verification failed, please try again" });
          setLoading(false);
          return;
        }
        const checkRes = await fetch('http://localhost:3001/api/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!checkRes.ok) {
          setMessage({ type: "error", text: "Registration service unavailable, please try again later" });
          setLoading(false);
          return;
        }
        const checkData = await checkRes.json();
        if (checkData.exists) {
          setMessage({ type: "error", text: "This email is already registered, please sign in" });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            captchaToken: turnstileToken,
          },
        });
        if (error) {
          if (error.message.includes("already been registered") || error.message.includes("already exists") || error.code === "23505") {
            setMessage({ type: "error", text: "This email is already registered, please sign in or use another email" });
            setLoading(false);
            return;
          }
          throw error;
        }
        setMessage({ type: "success", text: "Registration successful! Please check your email for the verification link." });
      } else {
        if (!turnstileToken) {
          setMessage({ type: "error", text: "Please complete the verification first" });
          setLoading(false);
          return;
        }
        const verifyRes = await fetch('http://localhost:3001/api/verify-turnstile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken }),
        });
        if (!verifyRes.ok) {
          setMessage({ type: "error", text: "Verification service unavailable, please try again later" });
          setLoading(false);
          return;
        }
        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          setMessage({ type: "error", text: "Verification failed, please try again" });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
          options: {
            captchaToken: turnstileToken,
          },
        });
        if (error) throw error;
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Operation failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsOAuthPending(true);
    setMessage(null);
    try {
      const redirectUrl = window.location.hostname === 'localhost'
        ? `${window.location.origin}/`
        : 'https://prdchart.art/';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Google sign in failed" });
    } finally {
      setIsOAuthPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e0a3c" }}>
            {mode === "login" ? "Sign In" : "Sign Up"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            style={{ color: "#9ca3af" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading || isOAuthPending}
          className="w-full flex items-center justify-center gap-3 p-3 rounded-xl mb-4 transition-all"
          style={{
            background: "#fff",
            border: "1.5px solid #e5e7eb",
            cursor: loading || isOAuthPending ? "not-allowed" : "pointer",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          <span style={{ fontWeight: 500, color: "#374151" }}>Sign in with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-4">
          <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>或</span>
          <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl"
              style={{
                border: "1.5px solid rgba(124,58,237,0.2)",
                fontSize: "0.95rem",
              }}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl"
              style={{
                border: "1.5px solid rgba(124,58,237,0.2)",
                fontSize: "0.95rem",
              }}
            />
          </div>

          {message && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{
                background: message.type === "success" ? "#dcfce7" : "#fef2f2",
                color: message.type === "success" ? "#16a34a" : "#ef4444",
              }}
            >
              {message.text}
            </div>
          )}

          <div ref={turnstileRef} className="flex justify-center" />

          <button
            type="submit"
            disabled={loading || isOAuthPending}
            className="w-full py-3 rounded-xl font-semibold text-white"
            style={{
              background: loading || isOAuthPending ? "#9ca3af" : "linear-gradient(135deg, #7c3aed, #a855f7)",
              cursor: loading || isOAuthPending ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Processing..." : isOAuthPending ? "Redirecting..." : mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Toggle Mode */}
        <p className="text-center mt-4" style={{ fontSize: "0.9rem", color: "#6b7280" }}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage(null);
            }}
            className="ml-1 font-semibold"
            style={{ color: "#7c3aed" }}
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}