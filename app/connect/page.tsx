import React from 'react';
import { Metadata } from 'next';
import ConnectClient from './ConnectClient';

export const metadata: Metadata = {
  title: 'Connect - Bharat Yojana',
  description: 'Get in touch, report a data issue, or find links to official government scheme portals.',
};

export default function Page() {
  return <ConnectClient />;
}
