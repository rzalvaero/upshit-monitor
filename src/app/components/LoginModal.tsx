'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, LogIn } from 'lucide-react';
import { login } from '../actions';

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
    const result = await login(password);

    if (result?.error) {
      setError(result.error);
    } else {
      setIsOpen(false);
    }
    setLoading(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-all"
      >
        <Lock size={18} />
        <span>Login Admin</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-800">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                  <Lock className="text-indigo-500" size={24} />
                  Akses Admin
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Password Rahasia
                  </label>
                  <div className="relative flex items-center">
                    <input
                      name="password"
                      type="password"
                      required
                      placeholder="Masukkan password admin..."
                      className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-indigo-600 dark:to-blue-600 hover:opacity-90 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <LogIn size={18} />
                      Buka Akses
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
