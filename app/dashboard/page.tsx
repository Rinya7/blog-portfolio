import dynamic from "next/dynamic";

// Динамически импортируем компонент с "use client"
const DashboardClient = dynamic(() => import("./dashboard-client"), {
  ssr: false,
});

export default function Page() {
  return <DashboardClient />;
}
