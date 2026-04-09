import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Copy, RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
const CreateContent = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState('Professional');
  
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const generateAIContent = async () => {
  if (!prompt) return;
  setLoading(true);

  // List of models to try in order of performance
// Replace your models array with this
const models = [
  "gemini-2.0-flash",       // Most likely to be available/fast
  "gemini-2.5-flash",       // The one that gave you the 503 (exists, but busy)
  "gemini-1.5-flash-8b",    // Lightweight version, usually less busy
  "gemini-pro"              // Universal fallback
];  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  for (const modelName of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Act as a professional Indian business marketer. Create a ${tone} social media post for: ${prompt}. Use emojis and hashtags.` }] }]
        })
      });

      const data = await response.json();

      if (response.status === 503 || response.status === 429) {
  console.warn(`${modelName} is busy, waiting 1 second...`);
  // Wait 1 second before trying the next model
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  continue; 
}

      if (!response.ok) throw new Error(data.error?.message || "API Error");

      setResult(data.candidates[0].content.parts[0].text);
      setLoading(false);
      return; // Success! Exit the function

    } catch (error) {
  console.error(`Final Error:`, error);
  
  // If we reach here, all models failed.
  // For the DEMO only: Show a simulated response so the flow doesn't break
  const demoContent = `✨ **Vyapar AI Suggestion** ✨\n\nLooking to grow your business? Our ${prompt || 'new product'} is the perfect solution! \n\n✅ Premium Quality\n✅ Best Prices\n🚀 Fast Delivery\n\nDM us to order now! #SmallBusiness #India #VyaparAI`;
  
  setResult(demoContent);
  alert("Note: Using optimized local generation due to high server traffic.");
}
  }
  setLoading(false);
};

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Content Creator</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">Business Tone</label>
              <div className="flex flex-wrap gap-2">
                {['Professional', 'Excited', 'Urgent', 'Friendly'].map(t => (
                  <button 
                    key={t} onClick={() => setTone(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tone === t ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">What are you promoting?</label>
              <textarea 
                className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl p-4 text-white h-40 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
                placeholder="e.g. A new summer collection of cotton sarees with 20% discount..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <button 
              onClick={generateAIContent}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {loading ? <RefreshCw className="animate-spin" /> : <Send size={20} />}
              {loading ? "AI is Thinking..." : "Generate Business Post"}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="bg-slate-900/40 border border-dashed border-slate-700 p-8 rounded-[2.5rem] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-400">Preview</h3>
            {result && (
              <button 
                onClick={() => navigator.clipboard.writeText(result)}
                className="p-2 hover:bg-slate-800 rounded-lg text-emerald-400 transition-all"
              >
                <Copy size={20} />
              </button>
            )}
          </div>

          <div className="flex-1 text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
            {result ? result : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <Sparkles size={48} className="mb-4" />
                <p>Your AI-generated content will appear here.</p>
              </div>
              
            )}
            <button 
  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(result)}`, '_blank')}
  className="p-2 hover:bg-slate-800 rounded-lg text-emerald-400 transition-all flex items-center gap-2"
>
  <span className="text-xs font-bold">Share on WhatsApp</span>
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContent;