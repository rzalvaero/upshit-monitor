'use client';

import { LogOut } from 'lucide-react';
import { logout } from '../actions';

export default function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      title="Logout Admin"
      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
    >
      <LogOut size={20} />
    </button>
  );
}
