import React from 'react';
import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'My Dashboard - Bharat Yojana',
  description: 'Track the status of your tracked scheme applications.',
};

export default function Page() {
  return <DashboardClient />;
}
