'use client';
import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function SWRegister() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.error('Service worker registration failed:', err);
        });
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 font-semibold text-sm">
      <AlertCircle size={18} className="animate-pulse" />
      Offline — showing cached registry
    </div>
  );
}
