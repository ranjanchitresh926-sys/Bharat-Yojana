import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { auth } from '../../../auth';
import AdminSchemesDashboard from './AdminSchemesDashboard';

export const metadata: Metadata = {
  title: 'Admin Schemes - Bharat Yojana',
  description: 'Manage schemes and drafts for Bharat Yojana.',
};

export default async function AdminSchemesPage() {
  const session = await auth();
  const role = session?.user?.role || 'citizen';

  if (role !== 'admin') {
    notFound();
  }

  return <AdminSchemesDashboard />;
}
