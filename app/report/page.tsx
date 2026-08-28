import React from 'react';
import { Metadata } from 'next';
import ReportClient from './ReportClient';

export const metadata: Metadata = {
  title: 'Report a Data Issue - Bharat Yojana',
  description: "Report incorrect eligibility rules, outdated limits, or broken links in this tool's own scheme data.",
};

export default function Page() {
  return <ReportClient />;
}
