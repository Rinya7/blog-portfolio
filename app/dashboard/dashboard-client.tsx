"use client";

import { withAuth } from "@/components/withAuth";

function DashboardContent() {
  return <div>👋 This is your personal account.</div>;
}

export default withAuth(DashboardContent);
