import React, { useEffect, useState } from 'react';
import { auth } from '../services/authService';
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { CheckCircle2, AlertCircle } from 'lucide-react';
import Loader from '../components/Loader';

const VerifyEmail = ({ onVerified }) => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'

  useEffect(() => {
    const completeSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        // Retrieve email from storage
        let email = window.localStorage.getItem('emailForSignIn');
        
        // Industry Standard: If storage is empty, try to get email from URL (advanced) 
        // or fallback to prompt
        if (!email) {
          email = window.prompt('Please confirm your email to complete registration:');
        }

        try {
          await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem('emailForSignIn');
          setStatus('success'); // Update UI to success state
        } catch (error) {
          console.error("Verification Error:", error);
          setStatus('error');
        }
      }
    };
    completeSignIn();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6 font-sans">
      <div className="w-full max-w-md bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 p-10 rounded-[2.5rem] shadow-2xl text-center">
        
        {status === 'verifying' && (
          <div className="animate-fade-in">
            <Loader />
            <p className="text-slate-400 mt-6 font-medium">Verifying your digital identity...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-fade-in">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-emerald-400" size={48} />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Account Verified!</h2>
            <p className="text-slate-400 mb-8">Your Vyapar AI profile is now active. Please proceed to login.</p>
            <button 
              onClick={() => window.location.href = '/'} 
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
            >
              Back to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-fade-in">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-red-400" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Link Expired</h2>
            <p className="text-slate-400 mb-8 text-sm">This link has already been used or has expired. Please request a new one.</p>
            <button 
              onClick={() => window.location.href = '/'} 
              className="w-full bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;