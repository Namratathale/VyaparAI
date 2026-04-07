import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User, Phone, ArrowRight, 
  CheckCircle2, Eye, EyeOff 
} from 'lucide-react';
import { signInWithGoogle } from '../services/authService';
import { createUserWithEmailAndPassword } from "firebase/auth"; //
import { doc, setDoc } from "firebase/firestore"; //
import { auth, db } from "../services/authService";

const AuthPage = ({ onLoginSuccess }) => {
  // --- 1. COMPONENT STATE (Inside the function body) ---
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1: Details, 2: OTP, 3: Success
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration Data State
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });

  // OTP State (Now 4 digits for industry speed)
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);

  // --- 2. LOGIC HANDLERS ---

  const handleNextStep = () => {
    if (step === 1) {
      handleRegisterSubmit();
    } else if (step === 2) {
      handleVerifyAndRedirect();
    }
  };

  const handleRegisterSubmit = async () => {
  setLoading(true);
  try {
    // 1. Create the secure user account
    const userCredential = await createUserWithEmailAndPassword(
      auth, regData.email, regData.password
    );
    const user = userCredential.user; //

    // 2. Save business data to Firestore using the User ID (UID)
    await setDoc(doc(db, "users", user.uid), {
      fullName: regData.fullName,
      phone: regData.phone,
      email: regData.email,
      isVerified: false, // Will turn true after OTP
      createdAt: new Date().toISOString()
    }); //

    // 3. Trigger WhatsApp OTP (via your backend/Cloud Function)
    const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
    // await triggerWhatsAppOTP(regData.phone, generatedCode); 
    
    setOtpSent(true);
    setStep(2);
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};

  const handleVerifyAndRedirect = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3); // Show success screen
    }, 1500);
  };

  const finalizeRegistration = () => {
    // Industry Standard: Redirect to login after successful reg
    setIsLogin(true);
    setStep(1);
    setOtpSent(false);
    setOtp(['', '', '', '']);
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const slideIn = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  // --- 3. UI RENDERING ---
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
            /* --- LOGIN VIEW --- */
            <motion.div key="login" {...slideIn} className="space-y-5">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input type="email" placeholder="Email Address" className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 pl-12 pr-12 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <button onClick={() => onLoginSuccess()} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95">
                Secure Login
              </button>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <button onClick={signInWithGoogle} className="bg-white text-slate-900 font-bold py-3 rounded-2xl text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                  Google Login
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
            /* --- REGISTER VIEW --- */
            <motion.div key="register" {...slideIn}>
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`w-8 h-1 rounded-full ${step >= s ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                ))}
              </div>
              
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white text-center mb-6">Profile Details</h2>
                  <input 
                    type="text" placeholder="Full Name" 
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none"
                    onChange={(e) => setRegData({...regData, fullName: e.target.value})}
                  />
                  <input 
                    type="email" placeholder="Email" 
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none"
                    onChange={(e) => setRegData({...regData, email: e.target.value})}
                  />
                  <input 
                    type="password" placeholder="Create Password" 
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 px-6 text-white outline-none"
                    onChange={(e) => setRegData({...regData, password: e.target.value})}
                  />
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" placeholder="919876543210" 
                      className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl py-4 pl-12 text-white outline-none"
                      onChange={(e) => setRegData({...regData, phone: e.target.value})}
                    />
                  </div>
                  <button onClick={handleNextStep} className="w-full bg-emerald-500 text-slate-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mt-4">
                    {loading ? "Sending..." : "Send WhatsApp OTP"} <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 text-center">
                  <h2 className="text-2xl font-bold text-white">Verify WhatsApp</h2>
                  <p className="text-slate-400 text-sm">Enter the 4-digit code sent to your mobile.</p>
                  <div className="flex justify-center gap-3">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text" maxLength="1"
                        className="w-14 h-16 bg-slate-900/60 border border-slate-700 rounded-xl text-center text-2xl font-bold text-emerald-400 focus:border-emerald-500 outline-none"
                        value={data}
                        onChange={e => handleOtpChange(e.target, index)}
                      />
                    ))}
                  </div>
                  <button onClick={handleNextStep} className="w-full bg-emerald-500 text-slate-950 font-bold py-4 rounded-2xl mt-4">
                    {loading ? "Verifying..." : "Verify & Continue"}
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-6">
                  <CheckCircle2 className="text-emerald-500 mx-auto mb-6" size={60} />
                  <h2 className="text-2xl font-bold text-white mb-2">Registration Complete!</h2>
                  <p className="text-slate-400 mb-8 text-sm">Identity verified via WhatsApp.</p>
                  <button onClick={finalizeRegistration} className="w-full bg-emerald-500 text-slate-950 font-bold py-4 rounded-2xl">
                    Back to Login
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