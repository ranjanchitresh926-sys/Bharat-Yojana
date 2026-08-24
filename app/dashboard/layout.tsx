import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Bharat Yojana',
  description: 'View your saved and tracked scheme applications.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

