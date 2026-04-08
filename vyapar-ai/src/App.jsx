import React, { useState, useEffect } from 'react';
import { auth } from './services/authService';
import { onAuthStateChanged } from "firebase/auth"; //
import Sidebar from './components/Sidebar';
import { Page } from './types';
import AuthPage from './pages/AuthPage';
import PlaceholderPage from './components/PlaceholderPage';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  const [user, setUser] = useState(null); // Industry Standard: Store the user object
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(Page.Home);

  // --- Industry Standard: Auth Observer ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading once Firebase responds
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const isVerifying = window.location.pathname === '/verify' || window.location.href.includes('apiKey');

  if (loading) return <div className="bg-[#0f172a] min-h-screen" />; // Blank screen while checking auth

  if (isVerifying && !user) {
    return <VerifyEmail onVerified={() => (window.location.href = "/")} />;
  }

  // If no user is logged in, show AuthPage
  if (!user) {
    return <AuthPage onLoginSuccess={() => {}} />; // Observer handles the state change
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home: return <PlaceholderPage name="Home" />;
      case Page.CreateContent: return <PlaceholderPage name="Content Creation Studio" />;
      case Page.CommandCenter: return <PlaceholderPage name="Command Center" />;
      default: return <PlaceholderPage name="Home" />;
    }
  };

  return (
    <div className="bg-[#0f172a] text-white min-h-screen flex font-sans">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{renderPage()}</div>
      </main>
    </div>
  );
}

export default App;