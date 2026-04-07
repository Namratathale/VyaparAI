import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { Page } from './types';
import AuthPage from './pages/AuthPage';
import PlaceholderPage from './components/PlaceholderPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(Page.Home);

  // If user is not logged in, show the sleek Auth/Login screen
  if (!isLoggedIn) {
    return <AuthPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  // Router logic to switch between pages
  const renderPage = () => {
    switch (currentPage) {
      case Page.Home: 
        return <PlaceholderPage name="Home" />;
      case Page.CreateContent: 
        return <PlaceholderPage name="Content Creation Studio" />;
      case Page.CommandCenter: 
        return <PlaceholderPage name="Command Center" />;
      case Page.Onboarding: 
        return <PlaceholderPage name="Onboarding" />;
      case Page.Help: 
        return <PlaceholderPage name="Help" />;
      default: 
        return <PlaceholderPage name="Home" />;
    }
  };

  return (
    <div className="bg-[#0f172a] text-white min-h-screen flex font-sans">
      {/* Sidebar for Navigation */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;