"use client";

import React, { useState } from 'react';
import GovHeader from '../../components/GovHeader';
import GovFooter from '../../components/GovFooter';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ConnectPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/feedback', {
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
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      <GovHeader />
      <main className="flex-1 max-w-[1400px] mx-auto w-full p-8">
        <div className="grid md:grid-cols-2 gap-8">

          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-50 text-green-600 p-3 rounded-full">
                <Mail size={28} />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">Connect With Us</h1>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Have a question about scheme eligibility, found a bug, or want to suggest an improvement?
              We'd love to hear from you.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Email</p>
                  <a
                    href="mailto:bharatyojana-sih@example.com"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    bharatyojana-sih@example.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700">
                <strong>Note:</strong> This is a student project built for Smart India Hackathon.
                For official government scheme queries, please visit the respective scheme portals directly.
              </p>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send Feedback</h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="bg-green-50 text-green-600 p-4 rounded-full mb-4">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Thank you!</h3>
                <p className="text-gray-500 mb-6">Your feedback has been submitted successfully.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what you think..."
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm transition-colors resize-none"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                    <AlertCircle size={16} className="shrink-0" />
                    <p className="text-sm">{errorMsg}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm"
                >
                  {status === 'sending' ? (
                    <>Sending…</>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Feedback
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <GovFooter />
    </div>
  );
}
