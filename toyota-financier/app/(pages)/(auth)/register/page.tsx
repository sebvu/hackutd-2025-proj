"use client";

import React from "react";

const Register: React.FC = () => {
  return (
    <div className="signup-page-container">
      <div className="signup-container">
        {/* Title */}
        <p className="signup-title-text">Create an Account</p>

        {/* Signup Form */}
        <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
          <div className="signup-form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Your username"
              required
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email address"
              required
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="nickname">Nickname</label>
            <input
              id="nickname"
              type="text"
              name="nickname"
              placeholder="Your nickname (optional)"
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>

          <div className="signup-form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              required
            />
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>

        {/* Links */}
        <p className="signup-already-text">Already have an account?</p>
        <p className="signup-or-text">or</p>

        <img
          src="/google.png"
          alt="Google Sign-In"
          className="signup-google-icon"
        />
      </div>
    </div>
  );
};

export default Register;
