import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "team accessc control",
  description:
    "An app to manage team access control. with admin,manager and user roles",
  keywords: [
    "team access control",
    "access management",
    "role-based access",
    "admin panel",
    "user roles",
    "manager dashboard",
    "permission settings",
    "team collaboration",
    "secure access",
    "user management",
  ],
  authors: [{ name: "Your Name", url: "https://github.com/uzumaki-ak" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-800 text-zinc-50">{children}</body>
    </html>
  );
}
