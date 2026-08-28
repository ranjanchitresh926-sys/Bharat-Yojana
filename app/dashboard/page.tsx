import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { auth } from '../../auth';

export const metadata: Metadata = {
  title: 'My Dashboard - Bharat Yojana',
  description: 'Track the status of your tracked scheme applications.',
};

export default async function Page() {
  const session = await auth();
  const role = session?.user?.role || "citizen";

  if (role !== "citizen") {
    notFound();
  }

  return <DashboardClient />;
}
