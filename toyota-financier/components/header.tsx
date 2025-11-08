"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import "@/app/styles/header.css"; 
import logo from "@/public/toyota_logo.png"

const Header: React.FC = () => {
  return (
    <header className="header-container">
      <div className="header-logo-container">
        <Image className="header-logo" src={logo} alt="Toyota Logo"/>
      </div>
      <h1>My Website</h1>
      <nav>
        <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
          <li><Link href="/">Favorites</Link></li>
          <li><Link href="/about">Sign In</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
