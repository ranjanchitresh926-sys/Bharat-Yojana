import React from "react";
import { notFound } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import { auth } from "../../../auth";

export default async function AnalyticsPage() {
  const session = await auth();
  const role = session?.user?.role || "citizen";

  if (role !== "admin") {
    notFound();
  }

  return <AdminDashboard />;
}
