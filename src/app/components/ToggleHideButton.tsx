'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toggleHideMonitor } from '../actions';

export default function ToggleHideButton({ id, isHidden }: { id: string, isHidden: boolean }) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    await toggleHideMonitor(id, isHidden);
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={isHidden ? "Tampilkan URL ke Publik" : "Sembunyikan URL dari Publik"}
      className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
        isHidden 
          ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : isHidden ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}
    </button>
  );
}
