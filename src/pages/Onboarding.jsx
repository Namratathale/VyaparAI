import React, { useState } from 'react';
import Header from '../components/Header';
import { CheckCircle2, ArrowRight, Briefcase, Palette, Share2 } from 'lucide-react';

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [brandData, setBrandData] = useState({
    name: '',
    voice: 'Friendly & Casual',
    logo: null
  });

  return (
    <div className="max-w-3xl mx-auto py-10 animate-fade-in">
      <Header 
        title="Business Onboarding" 
        subtitle="Help Vyapar.ai learn your brand personality." 
      />

      {/* Stepper Logic */}
      <div className="flex justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10" />
        {[1, 2, 3].map((s) => (
          <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
            {s}
          </div>
        ))}
      </div>

      <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-[2.5rem]">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><Briefcase className="text-emerald-400" /> Step 1: Brand Details</h3>
            <input 
              type="text" 
              placeholder="Brand Name (e.g., Artisan Wonders)" 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-emerald-500"
              onChange={(e) => setBrandData({...brandData, name: e.target.value})}
            />
            <button onClick={() => setStep(2)} className="w-full bg-emerald-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2">Next <ArrowRight size={18} /></button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2"><Palette className="text-emerald-400" /> Step 2: Brand Voice</h3>
            <div className="grid grid-cols-2 gap-3">
              {["Friendly", "Professional", "Witty", "Elegant"].map(v => (
                <button 
                  key={v}
                  onClick={() => setBrandData({...brandData, voice: v})}
                  className={`p-4 rounded-xl border-2 transition-all ${brandData.voice === v ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-900'}`}
                >
                  {v}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(3)} className="w-full bg-emerald-600 py-4 rounded-xl font-bold">Continue</button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-bold flex items-center justify-center gap-2"><Share2 className="text-emerald-400" /> Step 3: All Set!</h3>
            <p className="text-slate-400">Your brand profile is ready. Vyapar.ai will now generate content in a {brandData.voice} style for {brandData.name}.</p>
            <button onClick={() => window.location.reload()} className="w-full bg-emerald-600 py-4 rounded-xl font-bold">Launch Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;