import { requireAdmin } from "@/app/lib/guards";
import TeamsClient from "./TeamsClient";

const TeamsPage = async () => {
  await requireAdmin("/teams");
  return <TeamsClient />;
};

export default TeamsPage;
