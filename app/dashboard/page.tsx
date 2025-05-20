import dynamic from "next/dynamic";

const DashboardClient = dynamic(() => import("./dashboard-client"));

export default function Page() {
  return <DashboardClient />;
}
