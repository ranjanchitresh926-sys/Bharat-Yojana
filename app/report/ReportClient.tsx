"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import GovHeader from '../../components/GovHeader';
import GovFooter from '../../components/GovFooter';
import { Flag, Send, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

function ReportForm() {
  const searchParams = useSearchParams();
  const initialSchemeCode = searchParams.get('schemeCode') || '';
  
  const [form, setForm] = useState({ schemeCode: initialSchemeCode, description: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setForm({ schemeCode: '', description: '' });
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-8 sm:p-10">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Report a Data Issue</h2>
      <p className="text-sm text-gray-600 mb-6">
        Use this form to report incorrect eligibility rules, outdated limits, or broken links in our system. 
        <strong className="text-amber-700 block mt-2 bg-amber-50 p-2 rounded border border-amber-200">
          Note: This is to report issues with this tool's internal data only. This is NOT a grievance redressal portal for government applications.
        </strong>
      </p>

      {status === 'success' ? (
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="bg-green-50 text-green-600 p-4 rounded-full mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Issue Reported</h3>
          <p className="text-gray-500 mb-6">Our team will verify the scheme data and update it shortly.</p>
          <button
            onClick={() => setStatus('idle')}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Report another issue
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="schemeCode" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Scheme Code
            </label>
            <input
              id="schemeCode"
              type="text"
              required
              value={form.schemeCode}
              onChange={(e) => setForm({ ...form, schemeCode: e.target.value })}
              placeholder="e.g. PM-KISAN"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 focus:border-blue-500 text-sm transition-colors text-black"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Issue Description
            </label>
            <textarea
              id="description"
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. The maximum landholding limit was changed to 5 acres in 2024..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 focus:border-blue-500 text-sm transition-colors resize-none text-black"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2.5">
              <AlertCircle size={16} className="shrink-0" />
              <p className="text-sm">{errorMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full flex items-center justify-center gap-2 bg-[#0B3D91] hover:bg-[#1a4fa0] text-white px-6 py-3 rounded-md font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-2 focus:outline-offset-2 focus:outline-[#0B3D91]"
          >
            {status === 'sending' ? 'Submitting...' : 'Submit Report'}
            {!status.includes('sending') && <Send size={18} />}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ReportClient() {
  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      <GovHeader />
      <main id="main-content" className="flex-1 max-w-[800px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        <Link 
          href="/schemes"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0B3D91] transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 rounded"
        >
          <ArrowLeft size={16} /> Back to schemes
        </Link>
        <Suspense fallback={<div className="bg-white p-10 rounded-md shadow-sm border border-gray-200 animate-pulse h-64"></div>}>
          <ReportForm />
        </Suspense>
      </main>
      <GovFooter />
    </div>
  );
}
