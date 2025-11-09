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
      <h1>Toyota Stuff</h1>
      <nav>
        <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
          <li><Link href="/favorites">Favorites</Link></li>
          <li><Link href="/signin">Sign In</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
