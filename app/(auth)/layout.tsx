import Link from "next/link";
import ThemeToggle from "@/app/components/theme/ThemeToggle";
import type { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="auth-shell">
      <div className="panel auth-card space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="label">
            Access Core
          </Link>
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
