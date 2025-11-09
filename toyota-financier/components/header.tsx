"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import "@/app/styles/header.css";
import logo from "@/public/toyota_logo.png";
import { useAuth } from "@/app/contexts/AuthContext";

const Header: React.FC = () => {
  const { user, signOut, loading } = useAuth();

  return (
    <header className="header-container">
      <Link href="/filter" className="header-logo-container">
        <Image className="header-logo" src={logo} alt="Toyota Logo" />
      </Link>

      <h1>
        Toyota Stuff
        {user && (
          <span
            style={{ marginLeft: "1rem", fontSize: "1.2rem", color: "#777" }}
          >
            Hi, {user.user_metadata?.username || user.email.split("@")[0]}!
          </span>
        )}
      </h1>

      {!loading && (
        <nav>
          <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
            <li>
              <Link href="/favorites">Favorites</Link>
            </li>
            {!user ? (
              <li>
                <Link href="/signin">Sign In</Link>
              </li>
            ) : (
              <li style={{ cursor: "pointer" }} onClick={signOut}>
                Sign Out
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
