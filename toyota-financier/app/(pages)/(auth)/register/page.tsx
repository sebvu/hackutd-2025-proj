"use client";

import React, { useState } from "react";
import "@/app/styles/Register.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Redirect after successful registration
      window.location.href = "/signin";
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
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
        <p className="signup-title-text">Create an Account</p>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          {["username", "email", "nickname", "password", "confirmPassword"].map((field) => (
            <div key={field} className="signup-form-group">
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                id={field}
                type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                placeholder={`Enter your ${field}`}
                value={(form as any)[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required={!["nickname"].includes(field)}
              />
            </div>
          ))}

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="signup-already-text" onClick={() => (window.location.href = "/signin")}>
          Already have an account?
        </p>
        <p className="signup-or-text">or</p>

        <img
          src="/google.png"
          alt="Google Sign-In"
          className="signup-google-icon"
          onClick={handleGoogleSignUp}
        />
      </div>
    </div>
  );
}
