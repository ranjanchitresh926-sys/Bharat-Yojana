"use client";

import React, { useEffect, useState } from 'react';
import GovHeader from '../../components/GovHeader';
import GovFooter from '../../components/GovFooter';
import { Application } from '../../types/scheme';
import { Check, X, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export default function VerifyDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      fetch('/api/reports').then(res => res.json()),
      fetch('/api/applications').then(res => res.json())
    ]).then(([reportsData, appsData]) => {
      setReports(reportsData.reports || []);
      setApplications(appsData.applications || []);
      setLoading(false);
    });
  }, []);

  const handleReportAction = async (id: string, action: 'approve' | 'dismiss') => {
    try {
      const res = await fetch('/api/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'approved' : 'dismissed' } : r));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAppAction = async (id: string, newStatus: string) => {
    const reason = newStatus === 'Rejected' ? rejectionReasons[id] : undefined;
    
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus, rejectionReason: reason }),
      });
      if (res.ok) {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus as any, rejectionReason: reason } : a));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getNextStatus = (current: string) => {
    if (current === 'Submitted') return 'Under Review';
    if (current === 'Under Review') return 'Verified';
    if (current === 'Verified') return 'Approved';
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <GovHeader />
      <main id="main-content" className="flex-1 max-w-[1200px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Applications Section */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
            <div className="bg-[#0B3D91] text-white p-2 rounded">
              <Check size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tracked Applications</h1>
              <p className="text-sm text-gray-500">Officer Dashboard - Move applications through the pipeline</p>
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-20 bg-gray-100 rounded-md"></div>
              <div className="h-20 bg-gray-100 rounded-md"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-md">
              No tracked applications yet.
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const nextStatus = getNextStatus(app.status);
                const isFinal = app.status === 'Approved' || app.status === 'Rejected';

                return (
                  <div key={app.id} className="border border-gray-200 rounded-md p-5 bg-gray-50 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{app.schemeId}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded 
                            ${app.status === 'Approved' ? 'bg-green-100 text-green-800' 
                            : app.status === 'Rejected' ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'}`}
                          >
                            {app.status.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{app.schemeTitle}</h3>
                        <p className="text-xs text-gray-500 mt-1">Submitted: {new Date(app.submittedAt).toLocaleString()}</p>
                      </div>

                      {/* Actions */}
                      {!isFinal && (
                        <div className="flex flex-col gap-2 shrink-0 md:w-64">
                          {nextStatus && (
                            <button 
                              onClick={() => handleAppAction(app.id, nextStatus)}
                              className="flex justify-center items-center gap-1 bg-[#0B3D91] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#1a4fa0] focus:outline-2 focus:outline-offset-2 focus:outline-[#0B3D91] transition-colors"
                            >
                              Move to {nextStatus} <ArrowRight size={14} />
                            </button>
                          )}
                          
                          <div className="flex flex-col gap-1 mt-2">
                            <input 
                              type="text" 
                              placeholder="Reason for rejection (optional)"
                              value={rejectionReasons[app.id] || ''}
                              onChange={(e) => setRejectionReasons(prev => ({...prev, [app.id]: e.target.value}))}
                              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
                            />
                            <button 
                              onClick={() => handleAppAction(app.id, 'Rejected')}
                              className="flex justify-center items-center gap-1 bg-white border border-red-600 text-red-700 px-4 py-1.5 rounded text-sm font-bold hover:bg-red-50 focus:outline-2 focus:outline-offset-2 focus:outline-red-600 transition-colors"
                            >
                              <X size={14} /> Reject Application
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Data Reports Section */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
            <div className="bg-amber-600 text-white p-2 rounded">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Data Issue Reports</h2>
              <p className="text-sm text-gray-500">Citizen feedback on scheme rules</p>
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-20 bg-gray-100 rounded-md"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border border-dashed border-gray-300 rounded-md">
              No data reports submitted yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{report.schemeCode}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> {new Date(report.receivedAt).toLocaleDateString()}
                      </span>
                      {report.status !== 'pending' && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${report.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {report.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 mt-2">{report.description}</p>
                  </div>
                  
                  {report.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleReportAction(report.id, 'approve')}
                        className="flex items-center gap-1 bg-white border border-green-600 text-green-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-green-50 focus:outline-2 focus:outline-offset-2 focus:outline-green-600 transition-colors"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button 
                        onClick={() => handleReportAction(report.id, 'dismiss')}
                        className="flex items-center gap-1 bg-white border border-red-600 text-red-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-red-50 focus:outline-2 focus:outline-offset-2 focus:outline-red-600 transition-colors"
                      >
                        <X size={14} /> Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
      <GovFooter />
    </div>
  );
}
