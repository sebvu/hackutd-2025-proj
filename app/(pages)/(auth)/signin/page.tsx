"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import "@/app/styles/Register.css";

export default function SignIn() {
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      await signIn(form.email, form.password);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
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
      </div>
    </div>
  );
}
