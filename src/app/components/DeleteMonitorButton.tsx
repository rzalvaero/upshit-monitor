'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteMonitor } from '../actions';

export default function DeleteMonitorButton({ id, name }: { id: string, name: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Apakah Anda yakin ingin menghapus monitor "${name}" beserta seluruh riwayatnya?`)) {
      return;
    }

    setLoading(true);
    const result = await deleteMonitor(id);
    if (result?.error) {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="Hapus Monitor"
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? (
        <span className="w-5 h-5 block border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
      ) : (
        <Trash2 size={20} />
      )}
    </button>
  );
}
