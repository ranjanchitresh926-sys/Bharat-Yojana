"use client";

import React, { useEffect, useState } from 'react';
import GovHeader from '../../../components/GovHeader';
import GovFooter from '../../../components/GovFooter';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
  Cell as PieCell,
} from 'recharts';
import { ShieldCheck, BarChart3, AlertTriangle, Lightbulb, FileWarning } from 'lucide-react';

interface AnalyticsData {
  applicationsByStatus: { name: string; count: number }[];
  applicationsByScheme: { name: string; count: number }[];
  reportCounts: { pending: number; resolved: number };
  grievanceCounts: { pending: number; resolved: number };
  untrackedSchemes: { code: string; title: string; category: string }[];
}

/**
 * DESIGN.md colour tokens mapped to application pipeline statuses.
 *
 * In-progress statuses use Primary (#0B3D91) at decreasing opacity so the
 * chart reads as a single coherent pipeline: darker = earlier stage.
 * Terminal statuses use Success / Danger directly.
 */
const STATUS_COLORS: Record<string, string> = {
  'Submitted':    '#0B3D91',   // Primary — full opacity (earliest)
  'Under Review': '#3D64A8',   // Primary mid-shade
  'Verified':     '#6B8FC4',   // Primary light-shade (furthest in-progress)
  'Approved':     '#15803D',   // Success
  'Rejected':     '#B91C1C',   // Danger
};

const REPORT_PIE_COLORS = [
  '#B45309', // Warning — pending
  '#15803D', // Success — resolved
];

const GRIEVANCE_PIE_COLORS = [
  '#B91C1C', // Danger — pending privacy grievances carry more urgency
  '#15803D', // Success — resolved
];

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeCount, setPurgeCount] = useState<number | null>(null);
  const [purging, setPurging] = useState(false);
  const [purgeMessage, setPurgeMessage] = useState<string | null>(null);

  const handleOpenPurge = async () => {
    setShowPurgeModal(true);
    setPurgeMessage(null);
    setPurgeCount(null);
    try {
      const res = await fetch('/api/admin/purge-expired', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun: true })
      });
      const data = await res.json();
      if (data.success) {
        setPurgeCount(data.count);
      } else {
        setPurgeMessage("Failed to count applications: " + data.error);
      }
    } catch (err) {
      setPurgeMessage("Error: " + err.message);
    }
  };

  const handleConfirmPurge = async () => {
    setPurging(true);
    try {
      const res = await fetch('/api/admin/purge-expired', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success) {
        setPurgeMessage("Success: Purged " + data.applicationsDeleted + " applications and updated " + data.consentRecordsMarkedWithdrawn + " consent records.");
      } else {
        setPurgeMessage("Failed to purge: " + data.error);
      }
    } catch (err) {
      setPurgeMessage("Error: " + err.message);
    }
    setPurging(false);
  };

  useEffect(() => {
    fetch('/api/admin/summary')
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status === 403 ? 'Forbidden' : 'Failed to fetch analytics');
        }
        return res.json();
      })
      .then(json => {
        setData(json.metrics);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
      <GovHeader />

      <main id="main-content" className="flex-1 max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#E5E7EB] pb-4">
          
            <div>
              <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-3">
                <ShieldCheck className="text-[#0B3D91]" size={32} /> Admin Analytics
              </h1>
              <p className="text-[#4B5563] mt-2 text-sm">
                Aggregate metrics and gap analysis - no individual citizen data is ever shown here,
                even to admins. This page reflects counts only.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <button
                onClick={handleOpenPurge}
                className="bg-[#B91C1C] hover:bg-red-800 text-white px-4 py-2 rounded-md font-bold text-sm shadow-sm transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-[#B91C1C]"
              >
                Run Retention Purge Now
              </button>
            </div>

        </div>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 bg-[#E5E7EB] rounded-md" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-72 bg-[#E5E7EB] rounded-md" />
              <div className="h-72 bg-[#E5E7EB] rounded-md" />
            </div>
          </div>
        ) : error ? (
          <div className="bg-[#FEF2F2] border border-[#B91C1C] p-6 rounded-md flex flex-col items-center justify-center">
            <AlertTriangle className="text-[#B91C1C] mb-2" size={32} />
            <h2 className="text-lg font-bold text-[#111827]">Access Error</h2>
            <p className="text-[#B91C1C]">{error}</p>
          </div>
        ) : data ? (
          <div className="space-y-6">

            {/* ── Metric Cards ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

              {/* Total Applications */}
              <div className="bg-[#FFFFFF] p-6 rounded-md shadow-sm border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                    Total Applications
                  </p>
                  <p className="text-3xl font-black text-[#0B3D91] font-mono">
                    {data.applicationsByStatus.reduce((acc, c) => acc + c.count, 0)}
                  </p>
                </div>
                <div className="bg-[#DBEAFE] text-[#0B3D91] p-3 rounded-md">
                  <BarChart3 size={24} />
                </div>
              </div>

              {/* Pending Reports */}
              <div className="bg-[#FFFFFF] p-6 rounded-md shadow-sm border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                    Pending Reports
                  </p>
                  <p className="text-3xl font-black text-[#B45309] font-mono">
                    {data.reportCounts.pending}
                  </p>
                </div>
                <div className="bg-[#FEF3C7] text-[#B45309] p-3 rounded-md">
                  <AlertTriangle size={24} />
                </div>
              </div>

              {/* Pending Grievances */}
              <div className="bg-[#FFFFFF] p-6 rounded-md shadow-sm border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                    Pending Grievances
                  </p>
                  <p className="text-3xl font-black text-[#B91C1C] font-mono">
                    {data.grievanceCounts.pending}
                  </p>
                </div>
                <div className="bg-[#FEE2E2] text-[#B91C1C] p-3 rounded-md">
                  <FileWarning size={24} />
                </div>
              </div>

              {/* Untracked Schemes */}
              <div className="bg-[#FFFFFF] p-6 rounded-md shadow-sm border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#4B5563] uppercase tracking-wider mb-1">
                    Untracked Schemes
                  </p>
                  <p className="text-3xl font-black text-[#15803D] font-mono">
                    {data.untrackedSchemes.length}
                  </p>
                </div>
                <div className="bg-[#DCFCE7] text-[#15803D] p-3 rounded-md">
                  <Lightbulb size={24} />
                </div>
              </div>
            </div>

            {/* ── Charts Row ───────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Applications by Pipeline Status — Bar Chart */}
              <div className="bg-[#FFFFFF] p-6 rounded-md shadow-sm border border-[#E5E7EB]">
                <h2 className="text-base font-bold text-[#111827] mb-6">
                  Applications by Pipeline Status
                </h2>
                <div className="h-72 w-full">
                  {data.applicationsByStatus.reduce((a, c) => a + c.count, 0) > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.applicationsByStatus}
                        margin={{ top: 5, right: 20, left: 0, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#4B5563', fontFamily: 'inherit' }}
                          dy={10}
                          interval={0}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#4B5563', fontFamily: 'inherit' }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          cursor={{ fill: '#F9FAFB' }}
                          contentStyle={{
                            borderRadius: '6px',
                            border: '1px solid #E5E7EB',
                            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                            fontSize: 12,
                          }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Applications">
                          {data.applicationsByStatus.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={STATUS_COLORS[entry.name] ?? '#CBD5E1'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-[#4B5563] text-sm border border-dashed border-[#E5E7EB] rounded-md">
                      No applications tracked yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Reports & Grievances — side-by-side Donut charts */}
              <div className="bg-[#FFFFFF] p-6 rounded-md shadow-sm border border-[#E5E7EB]">
                <h2 className="text-base font-bold text-[#111827] mb-6">
                  Reports &amp; Grievances Resolution
                </h2>
                <div className="grid grid-cols-2 gap-4 h-72">

                  {/* Reports donut */}
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-bold text-[#4B5563] uppercase tracking-wider mb-2">
                      Data Reports
                    </p>
                    {(data.reportCounts.pending + data.reportCounts.resolved) > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Pending', value: data.reportCounts.pending },
                              { name: 'Resolved', value: data.reportCounts.resolved },
                            ]}
                            cx="50%" cy="45%"
                            innerRadius={45} outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                          >
                            <PieCell fill={REPORT_PIE_COLORS[0]} />
                            <PieCell fill={REPORT_PIE_COLORS[1]} />
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: '6px',
                              border: '1px solid #E5E7EB',
                              boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                              fontSize: 12,
                            }}
                          />
                          <Legend
                            verticalAlign="bottom" height={32}
                            iconType="circle" iconSize={8}
                            wrapperStyle={{ fontSize: 11, color: '#4B5563' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-[#4B5563] text-xs text-center border border-dashed border-[#E5E7EB] rounded-md w-full">
                        No reports yet.
                      </div>
                    )}
                  </div>

                  {/* Grievances donut */}
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-bold text-[#4B5563] uppercase tracking-wider mb-2">
                      Privacy Grievances
                    </p>
                    {(data.grievanceCounts.pending + data.grievanceCounts.resolved) > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Pending', value: data.grievanceCounts.pending },
                              { name: 'Resolved', value: data.grievanceCounts.resolved },
                            ]}
                            cx="50%" cy="45%"
                            innerRadius={45} outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                          >
                            <PieCell fill={GRIEVANCE_PIE_COLORS[0]} />
                            <PieCell fill={GRIEVANCE_PIE_COLORS[1]} />
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: '6px',
                              border: '1px solid #E5E7EB',
                              boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                              fontSize: 12,
                            }}
                          />
                          <Legend
                            verticalAlign="bottom" height={32}
                            iconType="circle" iconSize={8}
                            wrapperStyle={{ fontSize: 11, color: '#4B5563' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-[#4B5563] text-xs text-center border border-dashed border-[#E5E7EB] rounded-md w-full">
                        No grievances yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Gap Analysis Table ───────────────────────────────── */}
            <div className="bg-[#FFFFFF] p-6 rounded-md shadow-sm border border-[#E5E7EB]">
              <div className="mb-6">
                <h2 className="text-base font-bold text-[#111827]">
                  Untracked Scheme Gap Analysis
                </h2>
                <p className="text-sm text-[#4B5563] mt-1">
                  Schemes available in the system but currently experiencing zero engagement.
                </p>
              </div>

              {data.untrackedSchemes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-[#4B5563] uppercase bg-[#F9FAFB] border-y border-[#E5E7EB]">
                      <tr>
                        <th scope="col" className="px-6 py-3 font-bold">Scheme Code</th>
                        <th scope="col" className="px-6 py-3 font-bold">Scheme Title</th>
                        <th scope="col" className="px-6 py-3 font-bold">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.untrackedSchemes.map((scheme, idx) => (
                        <tr
                          key={scheme.code}
                          className={`border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors duration-200 ${
                            idx % 2 === 0 ? 'bg-[#FFFFFF]' : 'bg-[#F9FAFB]'
                          }`}
                        >
                          <td className="px-6 py-4 font-mono font-bold text-[#0B3D91] text-xs">
                            {scheme.code}
                          </td>
                          <td className="px-6 py-4 font-medium text-[#111827]">
                            {scheme.title}
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-[#F3F4F6] text-[#4B5563] px-2 py-1 rounded-md text-xs font-bold">
                              {scheme.category}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-[#4B5563] border border-dashed border-[#E5E7EB] rounded-md text-sm">
                  All schemes have at least one tracked application. Excellent coverage!
                </div>
              )}
            </div>

          </div>
        ) : null}
      </main>

      
      <GovFooter />

      {/* Purge Modal */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-md shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Retention Purge</h2>
            
            {purgeMessage ? (
              <div className="mb-6 p-4 rounded-md bg-gray-50 border border-gray-200 text-sm text-gray-800">
                {purgeMessage}
              </div>
            ) : purgeCount === null ? (
              <p className="text-sm text-gray-600 mb-6">Calculating eligible applications...</p>
            ) : (
              <p className="text-sm text-gray-600 mb-6">
                Found <strong>{purgeCount}</strong> applications in a terminal state (Approved/Rejected) older than 30 days.
                <br /><br />
                Proceeding will hard-delete these applications and mark their associated consent records as withdrawn. This action cannot be undone.
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPurgeModal(false)}
                className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900"
                disabled={purging}
              >
                {purgeMessage ? 'Close' : 'Cancel'}
              </button>
              {!purgeMessage && (
                <button
                  onClick={handleConfirmPurge}
                  disabled={purging || purgeCount === null || purgeCount === 0}
                  className="px-4 py-2 text-sm font-bold bg-[#B91C1C] hover:bg-red-800 text-white rounded-md disabled:opacity-50"
                >
                  {purging ? 'Purging...' : 'Confirm Purge'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}