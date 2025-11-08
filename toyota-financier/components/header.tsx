"use client";

import React from "react";
import Link from "next/link";
import "@/app/styles/header.css"; 

const Header: React.FC = () => {
  return (
    <header className="header-container">
      <h1>My Website</h1>

      <nav>
        <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
