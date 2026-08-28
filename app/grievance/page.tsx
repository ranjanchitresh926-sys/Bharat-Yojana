"use client";

import React, { useState } from 'react';
import GovHeader from '../../components/GovHeader';
import GovFooter from '../../components/GovFooter';

export default function GrievancePage() {
  const [form, setForm] = useState({ email: '', requestType: '', details: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to submit grievance');
      setStatus('success');
      setForm({ email: '', requestType: '', details: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <GovHeader />
      
      <main id="main-content" className="flex-1 max-w-3xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Grievance Officer</h1>
          <p className="text-gray-600 mb-8">
            This channel is strictly for data privacy concerns, consent withdrawal, and data deletion requests. 
            If you have a problem with scheme eligibility or incorrect data, please use the <a href="/connect" className="text-blue-600 hover:underline">Report an Issue</a> page instead.
          </p>

          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-md">
              <h2 className="text-xl font-bold mb-2">Request Submitted</h2>
              <p>Your grievance has been logged successfully. The Data Protection Officer will review and act on it within 72 hours.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                  Failed to submit request. Please try again.
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Your Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 text-black"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="requestType" className="block text-sm font-semibold text-gray-700 mb-1.5">Request Type</label>
                <select 
                  id="requestType" 
                  value={form.requestType}
                  onChange={(e) => setForm({...form, requestType: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded bg-white focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 text-black"
                  required
                >
                  <option value="">Select a request type...</option>
                  <option value="withdraw">Withdraw Consent</option>
                  <option value="delete">Data Deletion Request</option>
                  <option value="access">Data Access Request</option>
                  <option value="other">Other Privacy Concern</option>
                </select>
              </div>

              <div>
                <label htmlFor="details" className="block text-sm font-semibold text-gray-700 mb-1.5">Details</label>
                <textarea 
                  id="details" 
                  rows={5} 
                  value={form.details}
                  onChange={(e) => setForm({...form, details: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 resize-none text-black"
                  required
                  placeholder="Please provide your citizen ID (if known) or describe your privacy concern..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-gray-900 disabled:opacity-50"
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Grievance'}
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                * The Grievance Officer will respond to your request within 72 hours.
              </p>
            </form>
          )}
        </div>
      </main>

      <GovFooter />
    </div>
  );
}
