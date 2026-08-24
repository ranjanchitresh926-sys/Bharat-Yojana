import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connect & Support - Bharat Yojana',
  description: 'Get in touch with the support team for scheme-related queries.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

