import React from 'react';
import { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Sign In - Bharat Yojana',
  description: 'Officer and admin sign-in. Citizens do not need an account to search for schemes.',
};

export default function Page() {
  return <LoginClient />;
}
