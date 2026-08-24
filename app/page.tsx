import React from 'react';
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'Home - Bharat Yojana',
  description: 'Find Indian government welfare schemes you are eligible for, in your own language.',
};

export default function Page() {
  return <HomeClient />;
}

