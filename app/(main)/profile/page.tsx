import { requireUser } from "@/app/lib/guards";
import ProfileClient from "./ProfileClient";

const ProfilePage = async () => {
  await requireUser("/profile");
  return <ProfileClient />;
};

export default ProfilePage;
