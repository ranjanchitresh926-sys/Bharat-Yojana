"use client";

import React, { useEffect, useState } from 'react';
import GovHeader from '../../../components/GovHeader';
import GovFooter from '../../../components/GovFooter';
import { MessageSquare, AlertTriangle } from 'lucide-react';

interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string;
}

export default function FeedbackDashboard() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => {
        if (!res.ok) throw new Error(res.status === 403 ? 'Forbidden' : 'Failed to fetch feedback');
        return res.json();
      })
      .then(json => {
        setFeedback(json.feedback);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <GovHeader />
      
      <main id="main-content" className="flex-1 max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <MessageSquare className="text-[#0B3D91]" size={32} /> User Feedback
            </h1>
            <p className="text-gray-500 mt-2">View messages submitted by users via the Connect page.</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-24 bg-gray-200 rounded-md"></div>
            <div className="h-24 bg-gray-200 rounded-md"></div>
            <div className="h-24 bg-gray-200 rounded-md"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-md flex flex-col items-center justify-center">
            <AlertTriangle className="text-red-500 mb-2" size={32} />
            <h2 className="text-lg font-bold text-red-900">Access Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
            {feedback.length > 0 ? (
              <div className="space-y-4">
                {feedback.map(item => (
                  <div key={item.id} className="p-4 bg-gray-50 border border-gray-100 rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <a href={`mailto:${item.email}`} className="text-sm text-blue-600 hover:underline">{item.email}</a>
                      </div>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 border border-gray-200 rounded">
                        {new Date(item.receivedAt).toLocaleDateString()} {new Date(item.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-3 text-sm whitespace-pre-wrap leading-relaxed bg-white p-3 border border-gray-200 rounded">
                      {item.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded border border-gray-100 border-dashed">
                No feedback submissions yet.
              </div>
            )}
          </div>
        )}
      </main>

      <GovFooter />
    </div>
  );
}
