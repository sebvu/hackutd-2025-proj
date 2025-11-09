import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/header";
import { AuthProvider } from "@/app/contexts/AuthContext";
import "./styles/global.css";
import "./styles/filter.css";
import "./styles/slider.css";
import "./styles/chatbot.css"
import ChatbotBubble from "@/components/ChatbotBubble";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toyota Stuff",
  description: "Toyota car catalog and filters",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <ChatbotBubble />
        </AuthProvider>
      </body>
    </html>
  );
}
