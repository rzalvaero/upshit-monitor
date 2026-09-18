'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RefreshButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Panggil API Cron secara manual
      await fetch('/api/cron/check');
      // Refresh UI (Server Component)
      router.refresh();
    } catch (error) {
      console.error('Failed to run check', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
      <span>{loading ? 'Mengecek...' : 'Cek Sekarang'}</span>
    </button>
  );
}
