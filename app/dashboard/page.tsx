import { withAuth } from "@/components/withAuth";

function DashboardContent() {
  return <div>👋 This is your personal account.</div>;
}

const DashboardPage = withAuth(DashboardContent);

export default function Page() {
  return <DashboardPage />;
}
