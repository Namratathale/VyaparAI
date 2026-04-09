import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu, Home, PenTool, Layout, Rocket, HelpCircle } from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  // Define your menu items
  const menuItems = [
    { id: 'Home', icon: Home, label: 'Home' },
{ id: 'CreateContent', icon: PenTool, label: 'AI Studio' },    { id: 'CommandCenter', icon: Layout, label: 'Command Center' },
    { id: 'Onboarding', icon: Rocket, label: 'Onboarding' },
    { id: 'Help', icon: HelpCircle, label: 'Support' },
  ];

  return (
    <>
      {/* Mobile Overlay: Dims the background when sidebar is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-2xl font-black text-white tracking-tighter">
              Vyapar<span className="text-emerald-400">.ai</span>
            </h1>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400">
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false); // Auto-close on mobile
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${
                  currentPage === item.id 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;