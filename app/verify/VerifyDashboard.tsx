"use client";

import React, { useEffect, useState } from 'react';
import GovHeader from '../../components/GovHeader';
import GovFooter from '../../components/GovFooter';
import { Application } from '../../types/scheme';
import { Check, X, Clock, AlertTriangle, ArrowRight, MessageSquare, Trash2, ShieldCheck } from 'lucide-react';
import { Tabs } from '@base-ui/react/tabs';

export default function VerifyDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  // Selection state
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [selectedGrievances, setSelectedGrievances] = useState<string[]>([]);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    type: 'app_review' | 'report_approve' | 'report_dismiss' | 'grievance_resolve';
    validIds: string[];
    totalSelected: number;
    invalidCount: number;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/reports').then(res => res.json()),
      fetch('/api/applications').then(res => res.json()),
      fetch('/api/feedback').then(res => res.json()),
      fetch('/api/grievances').then(res => res.json())
    ]).then(([reportsData, appsData, feedbackData, grievancesData]) => {
      setReports(reportsData.reports || []);
      setApplications(appsData.applications || []);
      setFeedback(feedbackData.feedback || []);
      setGrievances(grievancesData.grievances || []);
      setLoading(false);
    });
  }, []);

  const handleGrievanceAction = async (id: string, action: 'resolved') => {
    try {
      const res = await fetch('/api/grievances', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action })
      });
      if (res.ok) {
        setGrievances(prev => prev.map(g => g.id === id ? { ...g, status: action } : g));
      }
    } catch (e) {
      console.error(e);
    }
  };

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

  // Bulk action initiators
  const initiateBulkApps = () => {
    const validIds = applications.filter(a => selectedApps.includes(a.id) && a.status === 'Submitted').map(a => a.id);
    setConfirmModal({ type: 'app_review', validIds, totalSelected: selectedApps.length, invalidCount: selectedApps.length - validIds.length });
  };

  const initiateBulkReports = (action: 'approve' | 'dismiss') => {
    const validIds = reports.filter(r => selectedReports.includes(r.id) && r.status === 'pending').map(r => r.id);
    setConfirmModal({ type: action === 'approve' ? 'report_approve' : 'report_dismiss', validIds, totalSelected: selectedReports.length, invalidCount: selectedReports.length - validIds.length });
  };

  const initiateBulkGrievances = () => {
    const validIds = grievances.filter(g => selectedGrievances.includes(g.id) && g.status === 'pending').map(g => g.id);
    setConfirmModal({ type: 'grievance_resolve', validIds, totalSelected: selectedGrievances.length, invalidCount: selectedGrievances.length - validIds.length });
  };

  // Execute bulk action
  const executeBulk = async () => {
    if (!confirmModal) return;
    const { type, validIds } = confirmModal;

    if (type === 'app_review') {
      await Promise.all(validIds.map(id => fetch('/api/applications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({id, status: 'Under Review'})})));
      setApplications(prev => prev.map(a => validIds.includes(a.id) ? { ...a, status: 'Under Review' } : a));
      setSelectedApps([]);
    } else if (type === 'report_approve' || type === 'report_dismiss') {
      const action = type === 'report_approve' ? 'approve' : 'dismiss';
      await Promise.all(validIds.map(id => fetch('/api/reports', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({id, action}) })));
      setReports(prev => prev.map(r => validIds.includes(r.id) ? { ...r, status: action === 'approve' ? 'approved' : 'dismissed' } : r));
      setSelectedReports([]);
    } else if (type === 'grievance_resolve') {
      await Promise.all(validIds.map(id => fetch('/api/grievances', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({id, status: 'resolved'})})));
      setGrievances(prev => prev.map(g => validIds.includes(g.id) ? { ...g, status: 'resolved' } : g));
      setSelectedGrievances([]);
    }

    setConfirmModal(null);
  };

  const getNextStatus = (current: string) => {
    if (current === 'Submitted') return 'Under Review';
    if (current === 'Under Review') return 'Verified';
    if (current === 'Verified') return 'Approved';
    return null;
  };

  const pendingAppsCount = applications.filter(a => a.status !== 'Approved' && a.status !== 'Rejected').length;
  const pendingReportsCount = reports.filter(r => r.status === 'pending').length;
  const pendingGrievancesCount = grievances.filter(g => g.status === 'pending').length;
  const feedbackCount = feedback.length;

  const tabClassName = "flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-colors text-[#4B5563] hover:text-[#0B3D91] hover:bg-[#F9FAFB] focus:outline-2 focus:outline-offset-2 focus:outline-[#0B3D91] data-active:text-[#0B3D91] border-b-2 border-transparent data-active:border-[#0B3D91] -mb-[1px] whitespace-nowrap cursor-pointer";

  const renderConfirmMessage = () => {
    if (!confirmModal) return null;
    const { type, validIds, totalSelected, invalidCount } = confirmModal;
    
    let actionText = '';
    let statusRequirement = '';
    
    if (type === 'app_review') {
      actionText = 'Advancing';
      statusRequirement = 'Submitted';
    } else if (type === 'report_approve') {
      actionText = 'Approving';
      statusRequirement = 'pending';
    } else if (type === 'report_dismiss') {
      actionText = 'Dismissing';
      statusRequirement = 'pending';
    } else if (type === 'grievance_resolve') {
      actionText = 'Resolving';
      statusRequirement = 'pending';
    }

    if (invalidCount > 0) {
      return `${actionText} ${validIds.length} of ${totalSelected} selected — ${invalidCount} are not in ${statusRequirement} status.`;
    }
    return `Apply to ${totalSelected} selected ${totalSelected === 1 ? 'item' : 'items'}?`;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans relative">
      <GovHeader />
      <main id="main-content" className="flex-1 max-w-[1200px] mx-auto w-full p-4 sm:p-6 lg:p-8">
        
        <Tabs.Root defaultValue="applications" className="bg-[#FFFFFF] rounded-md shadow-sm border border-[#E5E7EB]">
          <Tabs.List className="flex border-b border-[#E5E7EB] overflow-x-auto">
            <Tabs.Tab value="applications" className={tabClassName}>
              Applications
              {pendingAppsCount > 0 && (
                <span className="bg-[#FEF3C7] text-[#B45309] text-xs font-bold px-2 py-0.5 rounded-full">{pendingAppsCount}</span>
              )}
            </Tabs.Tab>
            <Tabs.Tab value="reports" className={tabClassName}>
              Reports
              {pendingReportsCount > 0 && (
                <span className="bg-[#FEF3C7] text-[#B45309] text-xs font-bold px-2 py-0.5 rounded-full">{pendingReportsCount}</span>
              )}
            </Tabs.Tab>
            <Tabs.Tab value="feedback" className={tabClassName}>
              Feedback
              {feedbackCount > 0 && (
                <span className="bg-[#F3F4F6] text-[#4B5563] text-xs font-bold px-2 py-0.5 rounded-full">{feedbackCount}</span>
              )}
            </Tabs.Tab>
            <Tabs.Tab value="grievances" className={tabClassName}>
              Grievances
              {pendingGrievancesCount > 0 && (
                <span className="bg-[#FEF3C7] text-[#B45309] text-xs font-bold px-2 py-0.5 rounded-full">{pendingGrievancesCount}</span>
              )}
            </Tabs.Tab>
          </Tabs.List>

          {/* Applications Panel */}
          <Tabs.Panel value="applications" className="focus:outline-none">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB] pb-4">
                <div className="bg-[#0B3D91] text-white p-2 rounded-md">
                  <Check size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#111827]">Tracked Applications</h1>
                  <p className="text-sm text-[#4B5563]">Officer Dashboard - Move applications through the pipeline</p>
                </div>
              </div>

              {loading ? (
                <div className="animate-pulse flex flex-col gap-4">
                  <div className="h-20 bg-[#F9FAFB] rounded-md"></div>
                  <div className="h-20 bg-[#F9FAFB] rounded-md"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12 text-[#4B5563] border border-dashed border-[#E5E7EB] rounded-md">
                  No tracked applications yet.
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Select All / Bulk Bar */}
                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-3 rounded-md mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={selectedApps.length > 0 && selectedApps.length === applications.length} 
                        onChange={(e) => setSelectedApps(e.target.checked ? applications.map(a => a.id) : [])}
                        className="w-4 h-4 rounded border-[#E5E7EB] text-[#0B3D91] cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-[#111827]">{selectedApps.length} selected</span>
                    </div>
                    {selectedApps.length > 0 && (
                      <button 
                        onClick={initiateBulkApps} 
                        className="flex items-center gap-2 bg-[#0B3D91] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#1a4fa0] transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-[#0B3D91]"
                      >
                        <ArrowRight size={14} /> Move Selected to Under Review
                      </button>
                    )}
                  </div>

                  {applications.map((app) => {
                    const nextStatus = getNextStatus(app.status);
                    const isFinal = app.status === 'Approved' || app.status === 'Rejected';

                    return (
                      <div key={app.id} className="p-5 border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F9FAFB] transition-colors flex items-start gap-4">
                        <div className="pt-1">
                          <input 
                            type="checkbox" 
                            checked={selectedApps.includes(app.id)} 
                            onChange={() => setSelectedApps(prev => prev.includes(app.id) ? prev.filter(id => id !== app.id) : [...prev, app.id])}
                            className="w-4 h-4 rounded border-[#E5E7EB] text-[#0B3D91] cursor-pointer"
                          />
                        </div>
                        <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold bg-[#DBEAFE] text-[#1E3A8A] px-2 py-0.5 rounded-md">{app.schemeId}</span>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-md 
                                ${app.status === 'Approved' ? 'bg-[#DCFCE7] text-[#15803D]' 
                                : app.status === 'Rejected' ? 'bg-[#FEE2E2] text-[#B91C1C]'
                                : 'bg-[#FEF3C7] text-[#B45309]'}`}
                              >
                                {app.status.toUpperCase()}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-[#111827]">{app.schemeTitle}</h3>
                            <p className="text-xs text-[#4B5563] mt-1">Submitted: {new Date(app.submittedAt).toLocaleString()}</p>
                          </div>

                          {/* Actions */}
                          {!isFinal && (
                            <div className="flex flex-col gap-2 shrink-0 md:w-64">
                              {nextStatus && (
                                <button 
                                  onClick={() => handleAppAction(app.id, nextStatus)}
                                  className="flex justify-center items-center gap-1 bg-[#0B3D91] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#1a4fa0] focus:outline-2 focus:outline-offset-2 focus:outline-[#0B3D91] transition-colors"
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
                                  className="w-full px-3 py-1.5 text-sm border border-[#E5E7EB] rounded-md focus:outline-2 focus:outline-offset-2 focus:outline-[#B91C1C] text-[#111827]"
                                />
                                <button 
                                  onClick={() => handleAppAction(app.id, 'Rejected')}
                                  className="flex justify-center items-center gap-1 bg-white border border-[#B91C1C] text-[#B91C1C] px-4 py-1.5 rounded-md text-sm font-bold hover:bg-[#FEF2F2] focus:outline-2 focus:outline-offset-2 focus:outline-[#B91C1C] transition-colors"
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
          </Tabs.Panel>

          {/* Reports Panel */}
          <Tabs.Panel value="reports" className="focus:outline-none">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB] pb-4">
                <div className="bg-[#B45309] text-white p-2 rounded-md">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#111827]">Data Issue Reports</h2>
                  <p className="text-sm text-[#4B5563]">Citizen feedback on scheme rules</p>
                </div>
              </div>

              {loading ? (
                <div className="animate-pulse flex flex-col gap-4">
                  <div className="h-20 bg-[#F9FAFB] rounded-md"></div>
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-12 text-[#4B5563] border border-dashed border-[#E5E7EB] rounded-md">
                  No data reports submitted yet.
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Select All / Bulk Bar */}
                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-3 rounded-md mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={selectedReports.length > 0 && selectedReports.length === reports.length} 
                        onChange={(e) => setSelectedReports(e.target.checked ? reports.map(r => r.id) : [])}
                        className="w-4 h-4 rounded border-[#E5E7EB] text-[#B45309] cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-[#111827]">{selectedReports.length} selected</span>
                    </div>
                    {selectedReports.length > 0 && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => initiateBulkReports('approve')} 
                          className="flex items-center gap-1 bg-[#FFFFFF] border border-[#15803D] text-[#15803D] px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#F0FDF4] focus:outline-2 focus:outline-offset-2 focus:outline-[#15803D] transition-colors"
                        >
                          <Check size={14} /> Approve Selected
                        </button>
                        <button 
                          onClick={() => initiateBulkReports('dismiss')} 
                          className="flex items-center gap-1 bg-[#FFFFFF] border border-[#B91C1C] text-[#B91C1C] px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#FEF2F2] focus:outline-2 focus:outline-offset-2 focus:outline-[#B91C1C] transition-colors"
                        >
                          <X size={14} /> Dismiss Selected
                        </button>
                      </div>
                    )}
                  </div>

                  {reports.map((report) => (
                    <div key={report.id} className="p-4 border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F9FAFB] transition-colors flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="pt-1 self-start sm:self-center">
                        <input 
                          type="checkbox" 
                          checked={selectedReports.includes(report.id)} 
                          onChange={() => setSelectedReports(prev => prev.includes(report.id) ? prev.filter(id => id !== report.id) : [...prev, report.id])}
                          className="w-4 h-4 rounded border-[#E5E7EB] text-[#B45309] cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4 w-full">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold bg-[#DBEAFE] text-[#1E3A8A] px-2 py-0.5 rounded-md font-mono">{report.schemeCode}</span>
                            <span className="text-xs text-[#4B5563] flex items-center gap-1">
                              <Clock size={12} /> {new Date(report.receivedAt).toLocaleDateString()}
                            </span>
                            {report.status !== 'pending' && (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${report.status === 'approved' ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEE2E2] text-[#B91C1C]'}`}>
                                {report.status.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#111827] mt-2">{report.description}</p>
                        </div>
                        
                        {report.status === 'pending' && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button 
                              onClick={() => handleReportAction(report.id, 'approve')}
                              className="flex items-center gap-1 bg-[#FFFFFF] border border-[#15803D] text-[#15803D] px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#F0FDF4] focus:outline-2 focus:outline-offset-2 focus:outline-[#15803D] transition-colors"
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button 
                              onClick={() => handleReportAction(report.id, 'dismiss')}
                              className="flex items-center gap-1 bg-[#FFFFFF] border border-[#B91C1C] text-[#B91C1C] px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#FEF2F2] focus:outline-2 focus:outline-offset-2 focus:outline-[#B91C1C] transition-colors"
                            >
                              <X size={14} /> Dismiss
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tabs.Panel>

          {/* Feedback Panel */}
          <Tabs.Panel value="feedback" className="focus:outline-none">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-[#E5E7EB] pb-4">
                <div className="bg-[#4B5563] text-white p-2 rounded-md">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#111827]">Citizen Feedback</h2>
                  <p className="text-sm text-[#4B5563]">Submissions from the Connect page contact form (read-only)</p>
                </div>
              </div>

              {loading ? (
                <div className="animate-pulse flex flex-col gap-4">
                  <div className="h-20 bg-[#F9FAFB] rounded-md"></div>
                </div>
              ) : feedback.length === 0 ? (
                <div className="text-center py-12 text-[#4B5563] border border-dashed border-[#E5E7EB] rounded-md">
                  No feedback submitted yet.
                </div>
              ) : (
                <div className="flex flex-col">
                  {feedback.map((f) => (
                    <div key={f.id} className="p-4 border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F9FAFB] transition-colors">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm font-bold text-[#111827]">{f.name}</span>
                        <span className="text-xs text-[#4B5563]">{f.email}</span>
                        <span className="text-xs text-[#4B5563] flex items-center gap-1 ml-auto">
                          <Clock size={12} /> {new Date(f.receivedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-[#111827] mt-2">{f.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tabs.Panel>

          {/* Grievances Panel */}
          <Tabs.Panel value="grievances" className="focus:outline-none">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6 border-b border-[#E5E7EB] pb-4">
                <AlertTriangle className="text-[#B45309]" />
                <h2 className="text-xl font-bold text-[#111827]">Privacy Grievances</h2>
                <span className="ml-auto bg-[#F9FAFB] text-[#4B5563] text-xs font-bold px-2 py-1 rounded-full border border-[#E5E7EB]">
                  {grievances.length} total
                </span>
              </div>

              {loading ? (
                <div className="animate-pulse flex flex-col gap-4">
                  <div className="h-20 bg-[#F9FAFB] rounded-md"></div>
                </div>
              ) : grievances.length === 0 ? (
                <p className="text-sm text-[#4B5563] italic text-center py-8 border border-dashed border-[#E5E7EB] rounded-md">No privacy grievances logged.</p>
              ) : (
                <div className="flex flex-col">
                  {/* Select All / Bulk Bar */}
                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-3 rounded-md mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={selectedGrievances.length > 0 && selectedGrievances.length === grievances.length} 
                        onChange={(e) => setSelectedGrievances(e.target.checked ? grievances.map(g => g.id) : [])}
                        className="w-4 h-4 rounded border-[#E5E7EB] text-[#B45309] cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-[#111827]">{selectedGrievances.length} selected</span>
                    </div>
                    {selectedGrievances.length > 0 && (
                      <button 
                        onClick={initiateBulkGrievances} 
                        className="flex items-center gap-1 bg-[#FFFFFF] border border-[#15803D] text-[#15803D] px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#F0FDF4] transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-[#15803D]"
                      >
                        <ShieldCheck size={14} /> Resolve Selected
                      </button>
                    )}
                  </div>

                  {grievances.map(g => (
                    <div key={g.id} className="p-4 border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F9FAFB] transition-colors flex flex-col sm:flex-row gap-4 items-start">
                      <div className="pt-1">
                        <input 
                          type="checkbox" 
                          checked={selectedGrievances.includes(g.id)} 
                          onChange={() => setSelectedGrievances(prev => prev.includes(g.id) ? prev.filter(id => id !== g.id) : [...prev, g.id])}
                          className="w-4 h-4 rounded border-[#E5E7EB] text-[#B45309] cursor-pointer"
                        />
                      </div>
                      <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start">
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-[#111827]">{g.requestType.toUpperCase()}</span>
                            <span className="text-xs text-[#4B5563]">{new Date(g.receivedAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm font-semibold text-[#4B5563] mb-1">{g.email}</p>
                          <p className="text-sm text-[#111827] bg-[#FFFFFF] p-3 border border-[#E5E7EB] rounded-md mt-2 shadow-sm">{g.details}</p>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                          {g.status === 'pending' ? (
                            <>
                              <span className="text-xs font-bold px-2 py-1 bg-[#FEF3C7] text-[#B45309] rounded-md uppercase">Pending</span>
                              <button 
                                onClick={() => handleGrievanceAction(g.id, 'resolved')}
                                className="flex items-center justify-center p-1.5 bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] rounded-md transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-[#15803D]"
                                title="Mark as Resolved"
                              >
                                <Check size={16} />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-bold px-2 py-1 bg-[#F3F4F6] text-[#4B5563] rounded-md uppercase">Resolved</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tabs.Panel>
        </Tabs.Root>

      </main>
      <GovFooter />

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FFFFFF] p-6 rounded-md shadow-sm border border-[#E5E7EB] max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#111827] mb-2">Confirm Bulk Action</h3>
            <p className="text-[#4B5563] text-sm mb-6 leading-relaxed">
              {renderConfirmMessage()}
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmModal(null)} 
                className="px-4 py-2 bg-[#F9FAFB] hover:bg-[#E5E7EB] text-[#4B5563] text-sm font-bold rounded-md transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-[#4B5563]"
              >
                Cancel
              </button>
              <button 
                onClick={executeBulk} 
                disabled={confirmModal.validIds.length === 0}
                className="px-4 py-2 bg-[#0B3D91] hover:bg-[#1a4fa0] text-white text-sm font-bold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-2 focus:outline-offset-2 focus:outline-[#0B3D91]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
