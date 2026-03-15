import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Barlow_Condensed, Lexend, Orbitron } from "next/font/google";

import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-lexend",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Team Management",
  description: "Minimal team access control with roles and team assignment.",
  keywords: [
    "team management",
    "access control",
    "role-based access",
    "admin panel",
    "user roles",
    "manager dashboard",
    "permission settings",
    "team collaboration",
    "secure access",
    "user management",
  ],
  authors: [{ name: "Uzumaki-ak", url: "https://github.com/uzumaki-ak" }],
};

const themeScript = `
(() => {
  try {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (prefersDark ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${lexend.variable} ${orbitron.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
