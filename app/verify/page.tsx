import React from "react";
import { notFound } from "next/navigation";
import VerifyDashboard from "./VerifyDashboard";
import { auth } from "../../auth";

export default async function VerifyPage() {
  const session = await auth();
  const role = session?.user?.role || "citizen";

  if (role !== "officer") {
    notFound();
  }

  return <VerifyDashboard />;
}
