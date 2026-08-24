import React from 'react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

export default async function AnalyticsPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('userRole')?.value;

  // Double-gate Page Component Check
  if (role !== 'admin') {
    notFound();
  }

  return <AdminDashboard />;
}
