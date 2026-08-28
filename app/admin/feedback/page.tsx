import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import FeedbackDashboard from "./FeedbackDashboard";
import { auth } from "../../../auth";

export const metadata: Metadata = {
  title: "User Feedback - Bharat Yojana",
  description: "View user feedback and connect submissions.",
};

export default async function FeedbackPage() {
  const session = await auth();
  const role = session?.user?.role || "citizen";

  if (role !== "admin") {
    notFound();
  }

  return <FeedbackDashboard />;
}
