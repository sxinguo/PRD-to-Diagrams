import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

interface Profile {
  credits_remaining: number;
  total_credits: number;
  subscription_plan: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profile: Profile | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  profile: null,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log("AuthProvider rendering...");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async (userId: string) => {
    console.log("=== fetchProfile START ===");

    try {
      // 直接用 hardcoded 的 URL 和 key，避免依赖 supabase SDK
      const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZHJ5d2NrdnFycHV2YWRkc3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzIwNTgsImV4cCI6MjA5NDc0ODA1OH0.mB7voJ7pT1LZ1iL9Rb3g5scm_CypmufPxb47t4sMmQ8";

      console.log("Using direct fetch for profile...");

      const response = await fetch(
        `https://aqdrywckvqrpuvaddsxj.supabase.co/rest/v1/profiles?id=eq.${userId}&select=credits_remaining,total_credits,subscription_plan`,
        {
          method: "GET",
          headers: {
            "apikey": ANON_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("fetchProfile - HTTP status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("fetchProfile HTTP error:", response.status, errorText);
        setProfile({ credits_remaining: 0, total_credits: 0, subscription_plan: "free" });
        return;
      }

      const data = await response.json();
      console.log("fetchProfile - response:", data);

      if (Array.isArray(data) && data.length > 0) {
        const p = data[0];
        setProfile({
          credits_remaining: p.credits_remaining || 0,
          total_credits: p.total_credits || 0,
          subscription_plan: p.subscription_plan || "free",
        });
      } else {
        console.warn("No profile found");
        setProfile({ credits_remaining: 0, total_credits: 0, subscription_plan: "free" });
      }
    } catch (error) {
      console.error("fetchProfile exception:", error);
      setProfile({ credits_remaining: 0, total_credits: 0, subscription_plan: "free" });
    }
    console.log("=== fetchProfile END ===");
  };

  const checkAndApplyDailyBonus = async (userId: string) => {
    const today = new Date().toISOString().split("T")[0];

    // 获取用户今天的积分使用情况
    const { data: historyToday } = await supabase
      .from("credits_history")
      .select("amount")
      .eq("user_id", userId)
      .gte("created_at", today + "T00:00:00")
      .eq("type", "deduct");

    const usedToday = historyToday?.reduce((sum, h) => sum + h.amount, 0) || 0;

    // 获取用户当前积分和上次领取状态
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits_remaining, last_daily_bonus, daily_credits_used")
      .eq("id", userId)
      .single();

    if (!profile) return;

    // 条件：当天用过积分（usedToday > 0）且今天还没领取每日赠送
    if (usedToday > 0 && profile.last_daily_bonus !== today) {
      // 如果积分已用完，给 3 积分
      if (profile.credits_remaining === 0) {
        await supabase.from("profiles").update({
          credits_remaining: 3,
          last_daily_bonus: today,
          daily_credits_used: usedToday,
        }).eq("id", userId);

        await supabase.from("credits_history").insert({
          user_id: userId,
          amount: 3,
          type: "add",
          description: "每日签到赠送",
        });

        await fetchProfile(userId);
      } else {
        // 更新当天使用记录
        await supabase.from("profiles").update({
          daily_credits_used: usedToday,
        }).eq("id", userId);
      }
    }
  };

  useEffect(() => {
    console.log("AuthContext useEffect initializing...");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Got session:", !!session, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchProfile(session.user.id);
        checkAndApplyDailyBonus(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", _event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          fetchProfile(session.user.id);
          checkAndApplyDailyBonus(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    console.log("signOut clicked");
    await supabase.auth.signOut();
    console.log("signOut done");
  };

  const refreshProfile = async () => {
    console.log("=== refreshProfile START ===");
    try {
      // 获取当前用户
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile({ credits_remaining: 0, total_credits: 0, subscription_plan: "free" });
      }
    } catch (error) {
      console.error("refreshProfile error:", error);
    }
    console.log("=== refreshProfile END ===");
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, profile, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}