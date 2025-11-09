"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import "@/app/styles/Register.css";

export default function Register() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      await signUp(form.email, form.password, form.username);
      setSuccessMsg("✅ Account created! Please verify your email to log in.");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-page-container">
      <div className="signup-container">
        <p className="signup-title-text">Create an Account</p>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

        <form className="signup-form" onSubmit={handleSubmit}>
          {["username", "email", "password"].map((field) => (
            <div key={field} className="signup-form-group">
              <label htmlFor={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                type={field === "password" ? "password" : "text"}
                placeholder={`Enter your ${field}`}
                value={(form as any)[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                required
              />
            </div>
          ))}

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p
          className="signup-already-text"
          onClick={() => (window.location.href = "/signin")}
        >
          Already have an account?
        </p>
      </div>
    </div>
  );
}
