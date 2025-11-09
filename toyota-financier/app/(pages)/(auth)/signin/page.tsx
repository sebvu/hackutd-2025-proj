"use client";

import React, { useState } from "react";
import "@/app/styles/Register.css";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Redirect to home after successful login
      window.location.href = "/";
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "google" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
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
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="signup-form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="signup-already-text" onClick={() => (window.location.href = "/register")}>
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
