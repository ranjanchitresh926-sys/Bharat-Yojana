import React from 'react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import VerifyDashboard from './VerifyDashboard';

export default async function VerifyPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('userRole')?.value;

  if (role !== 'officer') {
    notFound();
  }

  return <VerifyDashboard />;
}
