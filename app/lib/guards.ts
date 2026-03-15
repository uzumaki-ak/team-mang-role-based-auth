import { getCurrentUser } from "@/app/lib/auth";
import { Role } from "@/app/types";
import { redirect } from "next/navigation";

const sanitizeNext = (nextPath?: string) => {
  if (!nextPath || !nextPath.startsWith("/")) {
    return "/dashboard";
  }
  return nextPath;
};

export const requireUser = async (nextPath?: string) => {
  const user = await getCurrentUser();
  if (!user) {
    const safeNext = sanitizeNext(nextPath);
    redirect(`/login?next=${encodeURIComponent(safeNext)}`);
  }
  return user;
};

export const requireAdmin = async (nextPath?: string) => {
  const user = await requireUser(nextPath);
  if (user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }
  return user;
};
