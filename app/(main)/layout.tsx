import Header from "@/app/components/layout/Header";
import Sidebar from "@/app/components/layout/Sidebar";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/app/lib/auth";

const MainLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();

  return (
    <div className={`app-shell ${!user ? "no-sidebar" : ""}`}>
      {user && <Sidebar />}
      <div className="app-content">
        <Header />
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
