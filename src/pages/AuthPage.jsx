import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  Github, 
  CheckCircle2,
  LogIn 
} from 'lucide-react';
const AuthPage = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: Profile, 2: WhatsApp, 3: Success
  const [loading, setLoading] = useState(false);

  // Animation variants
  const slideIn = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const handleNextStep = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(step + 1);
    }, 1000);
  };

  const renderStepper = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all duration-500 ${
            step >= s ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-700 text-gray-600'
          }`}>
            {step > s ? <CheckCircle2 size={20} /> : s}
          </div>
          {s < 3 && (
            <div className={`h-1 w-12 rounded-full transition-all duration-500 ${step > s ? 'bg-emerald-500' : 'bg-gray-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-800/40 backdrop-blur-xl border border-slate-700 p-8 rounded-[2.5rem] shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">
            Vyapar<span className="text-emerald-400">.ai</span>
          </h1>
          <p className="text-slate-400 font-medium">
            {isLogin ? 'Official Business Portal' : 'Create your digital identity'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div key="login" {...slideIn} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input type="email" placeholder="Email Address" className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input type="password" placeholder="Password" className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
              </div>
              <button onClick={() => onLoginSuccess()} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-900/20 transition-all active:scale-95">
                Secure Login
              </button>
              
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-[#1e293b] text-slate-500 uppercase tracking-widest text-xs font-bold">OR</span></div>
              </div>

              <button className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-95">
  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
  Continue with Google
</button>

              <p className="text-center text-slate-500 mt-6">
                New user? <button onClick={() => setIsLogin(false)} className="text-emerald-400 font-bold hover:underline">Register profile</button>
              </p>
            </motion.div>
          ) : (
            <motion.div key="register" {...slideIn}>
              {renderStepper()}
              
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white text-center mb-6">Start Your Profile</h2>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input type="text" placeholder="Full Name" className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white outline-none" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input type="email" placeholder="Official Email" className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="password" placeholder="Password" className="bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-4 text-white outline-none" />
                    <input type="password" placeholder="Confirm" className="bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-4 text-white outline-none" />
                  </div>
                  <button onClick={handleNextStep} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
                    Next Step <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">WhatsApp Security</h2>
                  <p className="text-slate-400 text-sm mb-6">Link your WhatsApp for secure updates.</p>
                  <div className="relative text-left">
                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2 mb-1 block">WhatsApp Number</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input type="text" placeholder="919876543210" className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white outline-none" />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 ml-2">Include country code without the + sign.</p>
                  </div>
                  <button onClick={handleNextStep} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl mt-4">
                    Send OTP via WhatsApp
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-10">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-emerald-500" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Account Verified!</h2>
                    <p className="text-slate-400 mb-8">Welcome to the future of business management.</p>
                    <button onClick={() => onLoginSuccess()} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl">
                        Enter Dashboard
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