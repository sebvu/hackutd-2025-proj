"use client";

import { createBrowserSupabaseClient } from "@/utils/supabase-browser";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createBrowserSupabaseClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Restore session and listen for changes
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ?? null);
      setLoading(false);
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function signUp(email: string, password: string, username?: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/signin`,
      },
    });
    if (error) throw new Error(error.message);
    alert("Check your email for a verification link!");
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    window.location.href = "/filter";
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/signin";
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
