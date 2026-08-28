"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scheme, CitizenProfile } from '../types/scheme';
import { SchemeEngine } from '../lib/astEvaluator';
import { CheckCircle2, Loader2, BookmarkPlus } from 'lucide-react';
import { getSession } from 'next-auth/react';

interface TrackInterestButtonProps {
  scheme: Scheme;
}

export default function TrackInterestButton({ scheme }: TrackInterestButtonProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [isEligible, setIsEligible] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'loading' | 'success' | 'error' | 'forbidden'>('checking');
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      const role = session?.user?.role || 'citizen';
      
      // If the user is authenticated as officer or admin, physically hide the track feature entirely
      if (role !== 'citizen') {
        setStatus('forbidden');
        return;
      }

      // Read profile from local storage on mount for citizens
      const saved = localStorage.getItem('bharat_yojana_state');
      if (saved) {
        try {
          const { profile: sp } = JSON.parse(saved);
          if (sp) {
            setProfile(sp);
            // Evaluate eligibility
            const result = SchemeEngine.evaluate(sp, scheme);
            setIsEligible(result.isEligible);
          }
        } catch (e) {
          console.error('Failed to parse profile for tracking', e);
        }
      }
      setStatus('idle');
    });
  }, [scheme]);

  const handleTrack = async () => {
    if (!profile || !isEligible) return;
    
    // Manage lightweight anonymous identity
    let citizenId = localStorage.getItem('citizenId');
    if (!citizenId) {
      citizenId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      localStorage.setItem('citizenId', citizenId);
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId: scheme.code,
          schemeTitle: scheme.title,
          profileSnapshot: profile,
          citizenId,
          consentVersion: "v1.0"
        }),
      });

      if (!res.ok) throw new Error('Failed to track application');
      
      setStatus('success');
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  // Only render for eligible users (or block if forbidden)
  if (status === 'checking' || status === 'forbidden' || !profile || !isEligible) {
    return null;
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-md font-bold text-sm">
        <CheckCircle2 size={18} />
        Interest Tracked! Redirecting to dashboard...
      </div>
    );
  }

  const isUnderage = profile.age < 18;

  if (isUnderage) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-5 rounded-md mt-6">
        <h3 className="font-bold text-amber-900 mb-2">Age Restriction</h3>
        <p className="text-sm text-amber-800">
          Because you are under 18 years old, we cannot collect or store your personal data to track this scheme. 
          The eligibility check works locally, but saving this data requires you to be 18 or older.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 p-5 rounded-md mt-6">
      <h3 className="font-bold text-blue-900 mb-2">You are eligible for this scheme!</h3>
      <p className="text-sm text-blue-800 mb-4">
        Since you meet the criteria based on your profile, you can track this scheme in your personal dashboard to simulate the application process.
      </p>

      <div className="mb-4 p-3 bg-white border border-blue-100 rounded-md">
        <label className="flex items-start gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            className="mt-1 w-4 h-4 text-[#0B3D91] border-gray-300 rounded focus:ring-[#0B3D91]"
            checked={hasConsented}
            onChange={(e) => setHasConsented(e.target.checked)}
          />
          <span className="text-sm text-gray-700">
            I explicitly consent to the collection and storage of my profile data for the purpose of tracking my application status. 
            I have read and agree to the <a href="/privacy" className="text-blue-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">Privacy Notice</a>.
          </span>
        </label>
      </div>

      <button
        onClick={handleTrack}
        disabled={status === 'loading' || !hasConsented}
        className="flex items-center gap-2 bg-[#0B3D91] hover:bg-[#1a4fa0] text-white px-5 py-2.5 rounded-md font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-2 focus:outline-offset-2 focus:outline-[#0B3D91]"
      >
        {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <BookmarkPlus size={18} />}
        {status === 'loading' ? 'Saving...' : 'Track My Interest in This Scheme'}
      </button>
      <p className="text-xs text-blue-600/80 font-medium mt-3 italic">
        * Note: This is an internal tool feature for tracking purposes only. It does NOT submit a real application to the government.
      </p>
    </div>
  );
}
