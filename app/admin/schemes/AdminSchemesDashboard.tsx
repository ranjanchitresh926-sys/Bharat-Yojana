'use client';

import React, { useEffect, useState } from 'react';
import GovHeader from '../../../components/GovHeader';
import GovFooter from '../../../components/GovFooter';
import { BookOpen, Edit2, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Scheme } from '../../../types/scheme';

interface Draft {
  id: string;
  targetSchemeCode: string | null;
  payload: string;
  status: string;
  createdBy: string;
  createdAt: string;
}

export default function AdminSchemesDashboard() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showPublishModal, setShowPublishModal] = useState<string | null>(null);
  const [showDraftModal, setShowDraftModal] = useState<{ code: string | null, scheme?: Scheme } | null>(null);
  const [drafting, setDrafting] = useState(false);

  const fetchData = async () => {
    try {
      const [schemesRes, draftsRes] = await Promise.all([
        fetch('/api/schemes'),
        fetch('/api/admin/schemes/drafts')
      ]);
      const sData = await schemesRes.json();
      const dData = await draftsRes.json();
      
      setSchemes(sData.schemes || []);
      setDrafts(dData.drafts || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDraft = async (targetSchemeCode: string | null, baseScheme?: Scheme) => {
    setDrafting(true);
    try {
      const defaultPayload = {
        code: 'NEW-SCHEME',
        title: 'New Scheme Title',
        category: 'General',
        level: 'Central',
        ministry: 'Unknown',
        rulesAST: { "==": [1, 1] },
        numericLimits: {},
        fallbackSchemeIds: [],
        sourceCitation: 'Draft Source'
      };

      let payload = baseScheme ? { ...baseScheme } : defaultPayload;

      if (baseScheme) {
         payload.title = payload.title + " (Edited Draft)";
      }

      const res = await fetch('/api/admin/schemes/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetSchemeCode, payload })
      });
      const data = await res.json();
      if (data.success) {
        setShowDraftModal(null);
        await fetchData();
      } else {
        alert("Failed to create draft: " + data.error);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setDrafting(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/schemes/drafts/${id}/publish`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setShowPublishModal(null);
        await fetchData();
      } else {
        alert("Publish failed: " + data.error);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const handleDiscard = async (id: string) => {
    if (!confirm('Are you sure you want to discard this draft?')) return;
    try {
      const res = await fetch(`/api/admin/schemes/drafts/${id}/discard`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchData();
      } else {
        alert("Discard failed: " + data.error);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans">
      <GovHeader />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight flex items-center gap-3">
              <BookOpen className="text-[#0B3D91]" size={32} /> Admin Schemes
            </h1>
            <p className="text-[#4B5563] mt-2 text-sm">
              Manage live schemes and propose drafts. Drafts must be evaluated against the rule engine before publishing.
            </p>
          </div>
          <div>
            <button
              onClick={() => handleCreateDraft(null)}
              className="bg-[#0B3D91] hover:bg-[#082B66] text-white px-4 py-2 rounded-md font-bold text-sm shadow-sm transition-colors flex items-center gap-2 focus:outline-2 focus:outline-offset-2 focus:outline-[#0B3D91]"
            >
              <Plus size={16} /> Propose New Scheme
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-500 text-sm">Loading schemes and drafts...</div>
        ) : error ? (
          <div className="text-red-600 bg-red-50 p-4 rounded-md shadow-sm border border-red-200">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pending Drafts Section */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                Pending Drafts <span className="bg-[#FEF3C7] text-[#92400E] text-xs px-2 py-0.5 rounded-full">{drafts.length}</span>
              </h2>
              {drafts.length === 0 ? (
                <div className="bg-white p-6 rounded-md shadow-sm text-center text-sm text-gray-500">
                  No pending drafts. Propose a new scheme or edit an existing one.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {drafts.map((draft) => {
                    let parsed: Partial<Scheme> = {};
                    try { parsed = JSON.parse(draft.payload); } catch (e) {}

                    return (
                      <div key={draft.id} className="bg-white rounded-md shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-gray-900">{parsed.title || 'Untitled Draft'}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {draft.targetSchemeCode ? `Editing: ${draft.targetSchemeCode}` : 'New Scheme'} • Created by {draft.createdBy} on {new Date(draft.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowPublishModal(draft.id)}
                            className="bg-[#059669] hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-bold text-xs shadow-sm transition-colors flex items-center gap-1 focus:outline-2 focus:outline-offset-2 focus:outline-[#059669]"
                          >
                            <CheckCircle size={14} /> Publish
                          </button>
                          <button
                            onClick={() => handleDiscard(draft.id)}
                            className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 px-3 py-1.5 rounded-md font-bold text-xs shadow-sm transition-colors flex items-center gap-1"
                          >
                            <XCircle size={14} /> Discard
                          </button>
                        </div>

                        {/* Publish Modal */}
                        {showPublishModal === draft.id && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                            <div className="bg-white rounded-md shadow-lg max-w-md w-full p-6 text-left">
                              <h3 className="text-lg font-bold text-gray-900 mb-2">Publish Draft</h3>
                              <p className="text-sm text-gray-600 mb-4">
                                You are about to publish changes for <strong>{parsed.code || 'this draft'}</strong>.
                                The rulesAST will be evaluated against test profiles before saving to the live registry. This action cannot be undone.
                              </p>
                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={() => setShowPublishModal(null)}
                                  className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handlePublish(draft.id)}
                                  className="px-4 py-2 text-sm font-bold bg-[#059669] hover:bg-emerald-700 text-white rounded-md shadow-sm"
                                >
                                  Confirm Publish
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <hr className="border-gray-200" />

            {/* Live Schemes Section */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                Live Schemes <span className="bg-[#E0F2FE] text-[#0369A1] text-xs px-2 py-0.5 rounded-full">{schemes.length}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schemes.map((scheme) => (
                  <div key={scheme.id} className="bg-white p-4 rounded-md shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#0B3D91] mb-1">{scheme.code}</div>
                      <h3 className="font-bold text-gray-900 leading-tight mb-2">{scheme.title}</h3>
                      <div className="text-sm text-gray-500 mb-4">{scheme.ministry}</div>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <button
                        onClick={() => handleCreateDraft(scheme.code, scheme)}
                        disabled={drafting}
                        className="text-[#0B3D91] hover:text-[#082B66] font-bold text-sm flex items-center gap-1 w-full justify-center disabled:opacity-50"
                      >
                        <Edit2 size={14} /> Edit Scheme
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
      
      <GovFooter />
    </div>
  );
}
