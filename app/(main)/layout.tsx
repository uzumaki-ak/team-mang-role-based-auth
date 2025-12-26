import React from "react";
import Header from "../components/layout/Header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-4 ">{children}</main>
    </>
  );
};
export default MainLayout;
