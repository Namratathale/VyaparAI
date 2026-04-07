import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { signInWithGoogle } from '../services/authService';

const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const slideIn = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const handleNextStep = () => {
  setLoading(true);
  
  // Simulated Backend Call
  setTimeout(() => {
    setLoading(false);
    if (step === 2) {
      // In a real app, you'd verify the OTP against your database here
      console.log("OTP Verified: ", otp.join(''));
    }
    setStep(step + 1);
  }, 1500);
};

  const renderStepper = () => (
    <div className="flex items-center justify-center space-x-4 mb-10">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-500 ${
            step >= s ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-700 text-slate-600'
          }`}>
            {step > s ? <CheckCircle2 size={20} /> : s}
          </div>
          {s < 3 && (
            <div className={`h-1 w-12 rounded-full transition-all duration-500 ${step > s ? 'bg-emerald-500' : 'bg-slate-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
const [otpSent, setOtpSent] = useState(false);

// Add this function to handle OTP typing:
const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    // Focus next input
    if (element.nextSibling) {
        element.nextSibling.focus();
    }
};

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-900 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 p-8 rounded-[2.5rem] shadow-2xl relative"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            Vyapar<span className="text-emerald-400">.ai</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm tracking-wide uppercase">
            {isLogin ? 'Official Business Portal' : 'Create your digital identity'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div key="login" {...slideIn} className="space-y-5">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input type="email" placeholder="Email Address" className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 pl-12 pr-12 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <button onClick={() => onLoginSuccess()} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95">
                Secure Login
              </button>
              
              <div className="relative my-6 text-center">
                <span className="relative px-4 text-slate-500 uppercase text-[10px] font-black tracking-widest">Or Continue With</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
  onClick={async () => {
    try {
      await signInWithGoogle();
      onLoginSuccess();
    } catch (e) {
      alert("Google Login Failed. Please try again.");
    }
  }}
  className="bg-white text-slate-900 font-bold py-3 rounded-2xl text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
>
  Google
</button>
                <button className="bg-slate-700 text-white font-bold py-3 rounded-2xl text-sm hover:bg-slate-600 transition-all">
                  GitHub
                </button>
              </div>

              <p className="text-center text-slate-500 mt-8 text-sm">
                New user? <button onClick={() => setIsLogin(false)} className="text-emerald-400 font-bold hover:underline">Register Profile</button>
              </p>
            </motion.div>
          ) : (
            <motion.div key="register" {...slideIn}>
              {renderStepper()}
              
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white text-center mb-6">Profile Details</h2>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input type="text" placeholder="Full Name" className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white outline-none" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input type="email" placeholder="Official Email" className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white outline-none" />
                  </div>
                  <button 
                    onClick={handleNextStep} 
                    className="w-full bg-emerald-500 text-slate-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mt-4"
                  >
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {step === 2 && (
  <div className="space-y-6 text-center">
    {!otpSent ? (
      <>
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-white mb-2">WhatsApp Security</h2>
          <p className="text-slate-400 text-sm mb-8">Link your WhatsApp for secure updates.</p>
          <div className="relative text-left">
            <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-3 mb-2 block font-sans">WhatsApp Number</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400" size={20} />
              <input 
                type="text" 
                placeholder="919876543210" 
                className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono tracking-widest" 
              />
            </div>
          </div>
          <button 
            onClick={() => setOtpSent(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl mt-6 transition-all shadow-lg shadow-emerald-900/20"
          >
            Send OTP via WhatsApp
          </button>
        </div>
      </>
    ) : (
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
        <p className="text-slate-400 text-sm mb-8">Enter the 6-digit code sent to your WhatsApp.</p>
        
        <div className="flex justify-center gap-2 mb-8">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="w-12 h-14 bg-slate-900/60 border border-slate-700 rounded-xl text-center text-xl font-bold text-emerald-400 focus:border-emerald-500 outline-none transition-all"
              value={data}
              onChange={e => handleOtpChange(e.target, index)}
              onFocus={e => e.target.select()}
            />
          ))}
        </div>

        <button 
          onClick={handleNextStep}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-900/20"
        >
          Verify & Finish
        </button>
        
        <p className="mt-6 text-sm text-slate-500">
          Didn't get the code? <button onClick={() => setOtpSent(false)} className="text-emerald-400 font-bold hover:underline">Resend</button>
        </p>
      </div>
    )}
  </div>
)}

              {step === 3 && (
                <div className="text-center py-6">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-emerald-500" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
                    <p className="text-slate-400 mb-8 text-sm">Account verified successfully.</p>
                    <button onClick={() => onLoginSuccess()} className="w-full bg-emerald-500 text-slate-950 font-bold py-4 rounded-2xl">
                        Launch Dashboard
                    </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;