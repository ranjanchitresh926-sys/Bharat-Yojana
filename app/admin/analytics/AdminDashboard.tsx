"use client";

import React, { useEffect, useState } from 'react';
import GovHeader from '../../../components/GovHeader';
import GovFooter from '../../../components/GovFooter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PieChart, Pie, Cell as PieCell, Legend } from 'recharts';
import { ShieldCheck, BarChart3, AlertTriangle, Lightbulb } from 'lucide-react';

interface AnalyticsData {
  applicationsByStatus: { name: string; count: number }[];
  applicationsByScheme: { name: string; count: number }[];
  reportCounts: { pending: number; resolved: number };
  untrackedSchemes: { code: string; title: string; category: string }[];
}

const STATUS_COLORS: Record<string, string> = {
  'Submitted': '#94a3b8',
  'Under Review': '#fbbf24',
  'Verified': '#60a5fa',
  'Approved': '#22c55e',
  'Rejected': '#ef4444'
};

const REPORT_COLORS = ['#f59e0b', '#10b981'];

export default function AdminDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      <GovHeader />
      
      <main id="main-content" className="flex-1 max-w-[1400px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <ShieldCheck className="text-[#0B3D91]" size={32} /> Admin Analytics
            </h1>
            <p className="text-gray-500 mt-2">Aggregate metrics and gap analysis. Raw citizen profiles are strictly scrubbed.</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-md"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-md"></div>
              <div className="h-64 bg-gray-200 rounded-md"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-md flex flex-col items-center justify-center">
            <AlertTriangle className="text-red-500 mb-2" size={32} />
            <h2 className="text-lg font-bold text-red-900">Access Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Applications</p>
                  <p className="text-3xl font-black text-[#0B3D91]">
                    {data.applicationsByStatus.reduce((acc, curr) => acc + curr.count, 0)}
                  </p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-3 rounded-full">
                  <BarChart3 size={24} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Pending Reports</p>
                  <p className="text-3xl font-black text-amber-600">
                    {data.reportCounts.pending}
                  </p>
                </div>
                <div className="bg-amber-50 text-amber-600 p-3 rounded-full">
                  <AlertTriangle size={24} />
                </div>
              </div>

              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Untracked Schemes</p>
                  <p className="text-3xl font-black text-emerald-600">
                    {data.untrackedSchemes.length}
                  </p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full">
                  <Lightbulb size={24} />
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Status Chart */}
              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Applications by Pipeline Status</h3>
                <div className="h-72 w-full">
                  {data.applicationsByStatus.reduce((a,c) => a + c.count, 0) > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.applicationsByStatus} margin={{ top: 5, right: 30, left: 0, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {data.applicationsByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#cbd5e1'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">No applications tracked yet.</div>
                  )}
                </div>
              </div>

              {/* Reports Breakdown */}
              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Data Report Resolution</h3>
                <div className="h-72 w-full">
                  {(data.reportCounts.pending + data.reportCounts.resolved) > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Pending', value: data.reportCounts.pending },
                            { name: 'Resolved', value: data.reportCounts.resolved }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          <PieCell fill={REPORT_COLORS[0]} />
                          <PieCell fill={REPORT_COLORS[1]} />
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">No reports submitted yet.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Gap Analysis Table */}
            <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Untracked Scheme Gap Analysis</h3>
                  <p className="text-sm text-gray-500 mt-1">Schemes available in the system but currently experiencing zero engagement.</p>
                </div>
              </div>

              {data.untrackedSchemes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-200">
                      <tr>
                        <th scope="col" className="px-6 py-3 font-bold">Scheme Code</th>
                        <th scope="col" className="px-6 py-3 font-bold">Scheme Title</th>
                        <th scope="col" className="px-6 py-3 font-bold">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.untrackedSchemes.map((scheme, idx) => (
                        <tr key={scheme.code} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                          <td className="px-6 py-4 font-bold text-blue-600">{scheme.code}</td>
                          <td className="px-6 py-4 font-medium text-gray-900">{scheme.title}</td>
                          <td className="px-6 py-4 text-gray-600">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{scheme.category}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">All schemes have at least one tracked application. Excellent coverage!</div>
              )}
            </div>

          </div>
        ) : null}
      </main>

      <GovFooter />
    </div>
  );
}
