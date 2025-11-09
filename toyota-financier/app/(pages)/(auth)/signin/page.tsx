"use client";

import React, { useState } from "react";
import { createBrowserSupabaseClient } from "@/utils/supabase-browser";
import "@/app/styles/Register.css";

export default function SignIn() {
  const supabase = createBrowserSupabaseClient();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) throw new Error(error.message);

      // Redirect to /filter after login
      window.location.href = "/filter";
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}`,
        },
      });

      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      console.error("Google login error:", err);
    }
  }

  return (
    <div className="signup-page-container">
      <div className="signup-container">
        <p className="signup-title-text">Sign In</p>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="signup-form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p
          className="signup-already-text"
          onClick={() => (window.location.href = "/register")}
        >
          Don’t have an account?
        </p>
        <p className="signup-or-text">or</p>

        <img
          src="/google.png"
          alt="Google Sign-In"
          className="signup-google-icon"
          onClick={handleGoogleLogin}
        />
      </div>
    </div>
  );
}
