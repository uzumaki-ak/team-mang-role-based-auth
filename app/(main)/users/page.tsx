import { requireUser } from "@/app/lib/guards";
import UsersClient from "./UsersClient";
import { Suspense } from "react";

const UsersPage = async () => {
  await requireUser("/users");
  return (
    <Suspense fallback={<div className="panel p-20 text-center animate-pulse uppercase tracking-widest text-xs font-bold">Synchronizing...</div>}>
      <UsersClient />
    </Suspense>
  );
};

export default UsersPage;
