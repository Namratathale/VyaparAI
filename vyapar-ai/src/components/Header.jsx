import React from 'react';
import { LogOut, Bell,Menu, Settings, UserCircle } from 'lucide-react';
import { auth } from '../services/authService';

const Header = ({ userName , onMenuClick }) => {
  const handleLogout = () => {
    auth.signOut(); // Triggers the observer in App.jsx to show AuthPage
  };

 return (
    <header className="flex items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
      <div className="flex items-center gap-4">
        {/* The Toggle Button now has access to the Menu icon */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div>
          <h2 className="text-xl md:text-3xl font-black text-white tracking-tight">
            Welcome, <span className="text-emerald-400">{userName || 'Merchant'}</span>!
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Active Node Badge - Desktop Only */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Node</span>
        </div>

        <button className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-colors">
          <Bell size={20} />
        </button>

        <button 
          onClick={() => auth.signOut()}
          className="flex items-center gap-2 px-5 py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl font-bold transition-all active:scale-95 text-sm"
        >
          <LogOut size={18} />
          <span className="hidden lg:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;