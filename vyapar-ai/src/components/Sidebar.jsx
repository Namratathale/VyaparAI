import React from 'react';
import { Page } from '../types';
import { Home, Sparkles, LayoutDashboard, UserCircle, HelpCircle } from 'lucide-react';

const navItems = [
  { page: Page.Home, label: 'Home', icon: Home },
  { page: Page.CreateContent, label: 'Create Content', icon: Sparkles },
  { page: Page.CommandCenter, label: 'Command Center', icon: LayoutDashboard },
  { page: Page.Onboarding, label: 'Onboarding', icon: UserCircle },
  { page: Page.Help, label: 'Help & FAQ', icon: HelpCircle },
];

const Sidebar = ({ currentPage, setCurrentPage }) => {
  return (
    <aside className="bg-gray-900/80 backdrop-blur-sm text-white w-64 p-4 space-y-2 border-r border-gray-700/50 hidden md:block min-h-screen">
      <div className="text-2xl font-bold p-6 text-center text-purple-400 tracking-tight">
        Vyapar.ai
      </div>
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.page}>
              <button
                onClick={() => setCurrentPage(item.page)}
                className={`w-full flex items-center p-3 my-1 rounded-xl transition-all duration-200 ${
                  currentPage === item.page
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;