import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { Page } from './types';
import Header from './components/Header';

// Temporary "Placeholder" Pages until we build the real ones
const PlaceholderPage = ({ name }) => (
  <div className="animate-fade-in">
    <Header title={name} subtitle={`Welcome to the ${name} section.`} />
    <div className="bg-gray-800/30 border border-gray-700 p-10 rounded-2xl text-center">
      <p className="text-gray-400 italic">This feature is currently under construction...</p>
    </div>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState(Page.Home);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <PlaceholderPage name="Home" />;
      case Page.CreateContent:
        return <PlaceholderPage name="Content Creation Studio" />;
      case Page.CommandCenter:
        return <PlaceholderPage name="Business Command Center" />;
      case Page.Onboarding:
        return <PlaceholderPage name="Brand Onboarding" />;
      case Page.Help:
        return <PlaceholderPage name="Help & Support" />;
      default:
        return <PlaceholderPage name="Home" />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex font-sans">
      {/* Sidebar - Navigation */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;