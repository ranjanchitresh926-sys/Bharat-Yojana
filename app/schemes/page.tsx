import React from 'react';
import SchemesCatalogClient from './SchemesCatalogClient';

export const metadata = {
  title: 'All Schemes - Bharat Yojana',
  description: 'Browse the complete catalog of government schemes available on Bharat Yojana.'
};

export default function SchemesCatalogPage() {
  return <SchemesCatalogClient />;
}
