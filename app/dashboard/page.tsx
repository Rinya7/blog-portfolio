import { withAuth } from "@/components/withAuth";

function DashboardPage() {
  return <div>👋 This is your personal account.</div>;
}

export default withAuth(DashboardPage);
