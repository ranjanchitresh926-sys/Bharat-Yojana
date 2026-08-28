"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import GovHeader from '../../components/GovHeader';
import GovFooter from '../../components/GovFooter';
import { Application } from '../../types/scheme';
import { AlertCircle, Clock, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from '../../components/TranslationProvider';
import { schemeTranslations } from '../../lib/schemeTranslations';

const STATUS_STEPS = ['Submitted', 'Under Review', 'Verified', 'Decision'];

export default function CitizenDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [consents, setConsents] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { lang } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let citizenId = localStorage.getItem('citizenId');
    if (!citizenId) {
      setApplications([]);
      setLoading(false);
      return;
    }

    fetch(`/api/applications?citizenId=${citizenId}`)
      .then(res => res.json())
      .then(data => {
        setApplications(data.applications || []);
        setConsents(data.consentRecords || []);
        setLoading(false);
      });
  }, []);

  
  const handleWithdraw = async () => {
    const citizenId = localStorage.getItem('citizenId');
    if (!citizenId) return;
    setIsWithdrawing(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citizenId, action: 'withdraw' })
      });
      if (res.ok) {
        // Refresh data locally
        setConsents(prev => prev.map(c => c.withdrawnAt ? c : { ...c, withdrawnAt: new Date().toISOString() }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleDeleteAll = async () => {
    const citizenId = localStorage.getItem('citizenId');
    if (!citizenId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/applications?citizenId=${citizenId}`, { method: 'DELETE' });
      if (res.ok) {
        setApplications([]);
        setConsents(prev => prev.map(c => c.withdrawnAt ? c : { ...c, withdrawnAt: new Date().toISOString() }));
        setShowConfirm(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === 'Submitted') return 0;
    if (status === 'Under Review') return 1;
    if (status === 'Verified') return 2;
    if (status === 'Approved' || status === 'Rejected') return 3;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <GovHeader />
      
      <main id="main-content" className="flex-1 max-w-[1200px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Tracked Schemes</h1>
          <p className="text-gray-500 mt-2">Monitor the status of your internal scheme applications.</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md flex gap-3 text-blue-800">
          <AlertCircle className="shrink-0 mt-0.5 text-blue-600" size={20} />
          <div className="text-sm leading-relaxed font-medium">
            <strong>Internal Tool Notice:</strong> The applications below are simulated for demonstration purposes. 
            The statuses (Verified, Approved, Rejected, etc.) are updated via the Officer verification view. 
            <strong> This does NOT represent a real application to any government entity.</strong>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-md animate-pulse"></div>
            <div className="h-32 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-md shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Tracked Schemes</h3>
            <p className="text-gray-500 mb-6">You haven't tracked interest in any schemes yet.</p>
            <Link href="/schemes" className="bg-[#0B3D91] text-white px-5 py-2.5 rounded-md font-bold hover:bg-[#1a4fa0] focus:outline-2 focus:outline-offset-2 focus:outline-blue-600">
              Browse Schemes
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map(app => {
              const currentStepIndex = getStepIndex(app.status);
              
              return (
                <div key={app.id} className="bg-white rounded-md shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{app.schemeId}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock size={12} /> {new Date(app.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900">{schemeTranslations[lang as keyof typeof schemeTranslations]?.[app.schemeId] || app.schemeTitle}</h3>
                    </div>
                    <Link 
                      href={`/schemes/${app.schemeId}`}
                      className="text-sm font-bold text-blue-600 border border-blue-200 px-4 py-2 rounded hover:bg-blue-50 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 transition-colors self-start sm:self-center"
                    >
                      View Scheme
                    </Link>
                  </div>

                  {/* Status Timeline */}
                  <div className="relative pt-2">
                    <div className="absolute top-6 left-6 right-6 h-1 bg-gray-100 rounded">
                      <div 
                        className="h-full bg-green-500 rounded transition-all duration-500"
                        style={{ width: `${(currentStepIndex / 3) * 100}%` }}
                      ></div>
                    </div>

                    <div className="relative flex justify-between">
                      {STATUS_STEPS.map((step, idx) => {
                        const isCompleted = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;
                        const isRejected = app.status === 'Rejected' && idx === 3;
                        const isApproved = app.status === 'Approved' && idx === 3;

                        return (
                          <div key={step} className="flex flex-col items-center relative z-10 w-24">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 bg-white transition-colors
                              ${isRejected ? 'border-red-500 text-red-500' 
                                : isApproved ? 'border-green-600 text-green-600'
                                : isCurrent ? 'border-blue-600 text-blue-600'
                                : isCompleted ? 'border-green-500 text-green-500'
                                : 'border-gray-200 text-gray-300'}`}
                            >
                              {isRejected ? <XCircle size={20} /> 
                               : isCompleted ? <CheckCircle2 size={20} /> 
                               : <Clock size={20} />}
                            </div>
                            <span className={`text-xs font-bold text-center
                              ${isRejected ? 'text-red-600'
                                : isCurrent ? 'text-blue-700'
                                : isCompleted ? 'text-green-700'
                                : 'text-gray-400'}`}
                            >
                              {idx === 3 && (app.status === 'Approved' || app.status === 'Rejected') ? app.status : step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {app.status === 'Rejected' && app.rejectionReason && (
                    <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded-md">
                      <h4 className="text-sm font-bold text-red-800 mb-1">Reason for Rejection</h4>
                      <p className="text-sm text-red-700">{app.rejectionReason}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      
        {/* Data Rights & Privacy Section */}
        {!loading && (applications.length > 0 || consents.length > 0) && (
          <div className="mt-12 bg-white rounded-md shadow-sm border border-red-200 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Data & Privacy</h2>
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
              In accordance with our Privacy Notice, you have the right to view, withdraw consent for, and delete your personal data. 
              Below is the exact data currently stored on our servers linked to your device identifier.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6 max-h-60 overflow-y-auto font-mono text-xs text-gray-600">
              <p className="font-bold text-gray-900 mb-2">Stored Applications ({applications.length}):</p>
              <pre>{JSON.stringify(applications.map(a => ({ id: a.id, scheme: a.schemeTitle, status: a.status, profileSnapshot: a.profileSnapshot })), null, 2)}</pre>
              <p className="font-bold text-gray-900 mt-4 mb-2">Stored Consent Records ({consents.length}):</p>
              <pre>{JSON.stringify(consents, null, 2)}</pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleWithdraw}
                disabled={isWithdrawing || consents.every(c => c.withdrawnAt)}
                className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm rounded transition-colors disabled:opacity-50"
              >
                {isWithdrawing ? 'Processing...' : 'Withdraw Consent (Stop future tracking)'}
              </button>

              {!showConfirm ? (
                <button 
                  onClick={() => setShowConfirm(true)}
                  className="px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-sm rounded transition-colors"
                >
                  Delete All My Data
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-red-50 p-2 border border-red-200 rounded">
                  <span className="text-sm font-bold text-red-700 ml-2">Are you sure? This is irreversible.</span>
                  <button 
                    onClick={handleDeleteAll}
                    disabled={isDeleting}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete Permanently'}
                  </button>
                  <button 
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-sm rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      <GovFooter />
    </div>
  );
}
