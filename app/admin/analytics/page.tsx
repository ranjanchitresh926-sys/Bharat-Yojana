import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import { auth } from "../../../auth";

export const metadata: Metadata = {
  title: "Admin Analytics — Bharat Yojana",
  description: "Aggregate application, report, and scheme-engagement analytics for administrators.",
};

export default async function AnalyticsPage() {
  const session = await auth();
  const role = session?.user?.role || "citizen";

  if (role !== "admin") {
    notFound();
  }

  return <AdminDashboard />;
}
