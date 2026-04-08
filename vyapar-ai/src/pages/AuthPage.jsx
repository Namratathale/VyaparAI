import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User, Phone, ArrowRight, 
  CheckCircle2, Eye, EyeOff 
} from 'lucide-react';
import { auth, signInWithGoogle } from '../services/authService';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
const [showCreatePassword, setShowCreatePassword] = useState(true); // Default to show
const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Default to hide
const [showPassword, setShowPassword] = useState(false); // For login password visibility
// Registration & Login States
const [regData, setRegData] = useState({ fullName: '', email: '', password: '', phone: '' });
const [loginData, setLoginData] = useState({ email: '', password: '' });

  // --- NEW: OTP State for the 4-digit boxes ---
  const [otp, setOtp] = useState(['', '', '', '']);

  // 1. Handle Registration (Trigger Node.js Email)
 // --- Updated Logic inside AuthPage ---

// 1. Password Strength Validation (UI Helper)
const isPasswordValid = regData.password.length >= 6;
const passwordsMatch = regData.password === regData.confirmPassword;

const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  
  // A. Immediate Validation Checks
  if (!isPasswordValid) {
    alert("Security Requirement: Password must be at least 6 characters long.");
    return;
  }
  
  if (!passwordsMatch) {
    alert("Validation Error: Passwords do not match!");
    return;
  }

  setLoading(true);
  try {
    // B. Pre-check: Does user exist? (Prevents sending unnecessary OTPs)
    // We attempt to fetch "SignInMethods". If it returns data, the email is taken.
    const fetchMethods = await import("firebase/auth").then(m => m.fetchSignInMethodsForEmail);
    const methods = await fetchMethods(auth, regData.email);
    
    if (methods.length > 0) {
      alert("Account Notice: This email is already registered. Please login to your portal.");
      setIsLogin(true); // Switch them to Login view automatically
      return;
    }

    // C. Trigger Node.js Email OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    
    const response = await fetch('http://localhost:5000/api/send-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: regData.email, otpCode: generatedOtp })
    });

    const result = await response.json();
    if (result.success) {
      localStorage.setItem('verification_otp', generatedOtp);
      setStep(2); 
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    // Handle the specific Firebase "Email already in use" if the pre-check missed it
    if (error.code === 'auth/email-already-in-use') {
      alert("This email is already in use. Please use a different email or login.");
      setIsLogin(true);
    } else {
      alert("System Error: " + error.message);
    }
  } finally {
    setLoading(false);
  }
};

  // 2. Handle OTP Verification & Official Firebase Creation
const handleVerifyOTP = async () => {
  const enteredOtp = otp.join('');
  const correctOtp = localStorage.getItem('verification_otp');

  if (enteredOtp === correctOtp) {
    setLoading(true);
    try {
      // Industry Standard: Attempt to create the user
      await createUserWithEmailAndPassword(auth, regData.email, regData.password);
      
      // If successful, clean up and move to Success Screen
      localStorage.removeItem('verification_otp');
      setStep(3); 
    } catch (error) {
      // PROFESSIONAL ERROR HANDLING
      if (error.code === 'auth/email-already-in-use') {
        alert("User already exists with this email. Please login instead.");
        setIsLogin(true); // Auto-switch to login for better UX
        setStep(1);
      } else {
        alert("Registration Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  } else {
    alert("Invalid code. Please check your email.");
  }
};
  // 3. Handle Actual Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      onLoginSuccess();
    } catch (error) {
      alert("Login Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper for OTP Input boxes
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value && element.nextSibling) element.nextSibling.focus();
  };

  const slideIn = { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 } };

  return (
    
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-900 font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 p-8 rounded-[2.5rem] shadow-2xl relative">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Vyapar<span className="text-emerald-400">.ai</span></h1>
          <p className="text-slate-400 font-medium text-sm tracking-wide uppercase">
            {isLogin ? 'Official Business Portal' : step === 2 ? 'Verify Identity' : 'Create your digital identity'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            /* --- LOGIN UI --- */
            <motion.div key="login" {...slideIn} className="space-y-5">
  <div className="space-y-4">
    {/* Email Input */}
    <div className="relative">
      <Mail 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" 
        size={20} 
      />
      <input 
        type="email" 
        placeholder="Email Address" 
        className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" 
        onChange={(e) => setLoginData({...loginData, email: e.target.value})} 
      />
    </div>

    {/* Password Input */}
    <div className="relative">
      <Lock 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" 
        size={20} 
      />
      <input 
        type={showPassword ? "text" : "password"} 
        placeholder="Password" 
        className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" 
        onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
      />
      
      {/* Password Visibility Toggle */}
      <button 
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>

  {/* Login Action */}
  <button 
    onClick={handleLoginSubmit}
    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
  >
    Secure Login
  </button>

  {/* Google Login */}
  <button
    onClick={async () => {
      try { 
        await signInWithGoogle();
        onLoginSuccess();
      } catch (error) {
        alert("Google Login Failed: " + error.message);
      }

    }}
    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mt-4 transition-all active:scale-95"
  >
    <img src="/google-logo.png" alt="Google Logo" className="w-5 h-5" />
    Sign in with Google
  </button> 
  <p className="text-center text-slate-400 mt-6">
    Don't have an account?{" "}
    <button onClick={() => { setIsLogin(false); setStep(1); }} className="text-emerald-400 hover:underline">  Register</button>
  </p>


</motion.div>
          ) : (
            /* --- REGISTER UI --- */
            <motion.div key="register" {...slideIn}>
              {step === 1 && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
  <input 
    type="text" placeholder="Full Name" required 
    className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none" 
    onChange={(e) => setRegData({...regData, fullName: e.target.value})} 
  />
  <input 
    type="email" placeholder="Email" required 
    className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none" 
    onChange={(e) => setRegData({...regData, email: e.target.value})} 
  />

  {/* Create Password - Visible by Default */}
  <div className="relative">
    <input 
      type={showCreatePassword ? "text" : "password"} 
      placeholder="Create Password" required 
      className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 px-6 pr-12 text-white outline-none focus:ring-2 focus:ring-emerald-500/50" 
      onChange={(e) => setRegData({...regData, password: e.target.value})} 
    />
    <button 
      type="button" 
      onClick={() => setShowCreatePassword(!showCreatePassword)} 
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
    >
      {showCreatePassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>

  {/* Confirm Password - Hidden by Default */}
  <div className="relative">
    <input 
      type={showConfirmPassword ? "text" : "password"} 
      placeholder="Confirm Password" required 
      className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 px-6 pr-12 text-white outline-none focus:ring-2 focus:ring-emerald-500/50" 
      onChange={(e) => setRegData({...regData, confirmPassword: e.target.value})} 
    />
    <button 
      type="button" 
      onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
    >
      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>

  <button 
  type="submit" 
  disabled={loading || !isPasswordValid || !passwordsMatch || regData.fullName.length < 2} 
  className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mt-4 transition-all ${
    !isPasswordValid || !passwordsMatch 
      ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95 shadow-lg'
  }`}
>
  {loading ? "Processing..." : "Register & Get OTP"} <ArrowRight size={20} />
</button>

{/* Real-time Password Hint */}
{!isPasswordValid && regData.password.length > 0 && (
  <p className="text-red-400 text-xs mt-2 ml-2 animate-pulse">
    Password must be at least 6 characters.
  </p>
)}

  <p className="text-center text-slate-400 mt-6">
    Already have an account?{" "}
    <button onClick={() => { setIsLogin(true); setStep(1); }} className="text-emerald-400 hover:underline"> Login</button>
  </p>
</form>
              )}

              {step === 2 && (
  <div className="space-y-6 text-center animate-fade-in">
    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="text-emerald-500" size={40} />
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
    <p className="text-slate-400 text-sm mb-8">Enter the 4-digit code sent to {regData.email}</p>
    
    <div className="flex justify-center gap-3 mb-8">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          className="w-14 h-16 bg-slate-900/60 border border-slate-700 rounded-xl text-center text-2xl font-bold text-emerald-400 focus:border-emerald-500 outline-none transition-all"
          value={data}
          onChange={e => {
            if (isNaN(e.target.value)) return;
            const newOtp = [...otp];
            newOtp[index] = e.target.value;
            setOtp(newOtp);
            if (e.target.value && e.target.nextSibling) e.target.nextSibling.focus();
          }}
        />
      ))}
    </div>

    <button 
      onClick={handleVerifyOTP} 
      className="w-full bg-emerald-500 text-slate-950 font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
    >
      Verify & Create Account
    </button>
  </div>
)}

  {step === 3 && (
  <motion.div 
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="text-center py-6"
  >
    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
      <CheckCircle2 className="text-emerald-400" size={50} />
    </div>
    
    <h2 className="text-3xl font-black text-white mb-3">Verification Successful!</h2>
    <p className="text-slate-400 mb-10 text-sm leading-relaxed">
      Your Vyapar AI business profile is now active. <br />
      Please use your credentials to access the portal.
    </p>

    <button 
      onClick={() => {
        setIsLogin(true); // Switch back to login view
        setStep(1);      // Reset to first step of login
      }} 
      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2"
    >
      Proceed to Secure Login <ArrowRight size={20} />
    </button>
  </motion.div>
)}


            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;