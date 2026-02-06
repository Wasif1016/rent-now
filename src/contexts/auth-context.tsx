"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase-client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  /** Get the current session (refreshes from Supabase so token is up-to-date before API calls) */
  getSession: () => Promise<Session | null>;
  signIn: (identifier: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInWithOAuth: (provider: "google" | "github") => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signIn = async (identifier: string, password: string) => {
    const isEmail = identifier.includes("@");
    const credentials: any = { password };

    if (isEmail) {
      credentials.email = identifier;
    } else {
      // Normalize phone number
      let phone = identifier.replace(/\D/g, "");
      // Handle 0308... -> +92308...
      if (phone.startsWith("0") && phone.length === 11) {
        phone = "92" + phone.substring(1);
      }
      // Handle 92308... -> 92308...
      else if (phone.startsWith("92") && phone.length === 12) {
        phone = phone;
      }
      // Handle 308... -> 92308...
      else if (phone.length === 10) {
        phone = "92" + phone;
      }

      // Convert phone to dummy email format (same as vendor-account.service.ts)
      // This allows us to use email-based auth instead of phone auth
      credentials.email = `phone-${phone}@rentnow.local`;
    }

    const { error } = await supabase.auth.signInWithPassword(credentials);
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          metadata,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || "Signup failed" } };
      }

      return { error: null };
    } catch (err: any) {
      return {
        error: { message: err.message || "An error occurred during signup" },
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signInWithOAuth = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const resetPassword = async (email: string) => {
    // Redirect URL must be allowlisted in Supabase: Authentication → URL Configuration → Redirect URLs
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/reset-password`
        : `${
            process.env.NEXT_PUBLIC_APP_URL ||
            process.env.NEXT_PUBLIC_SITE_URL ||
            "http://localhost:3000"
          }/auth/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    return { error };
  };

  const getSession = useCallback(async (): Promise<Session | null> => {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();
    return currentSession;
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        getSession,
        signIn,
        signUp,
        signOut,
        signInWithOAuth,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
