import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import VerifyDashboard from "./VerifyDashboard";
import { auth } from "../../auth";

export const metadata: Metadata = {
  title: "Verify — Bharat Yojana",
  description: "Officer review queue for tracked applications, data reports, and citizen feedback.",
};

export default async function VerifyPage() {
  const session = await auth();
  const role = session?.user?.role || "citizen";

  if (role !== "officer") {
    notFound();
  }

  return <VerifyDashboard />;
}
