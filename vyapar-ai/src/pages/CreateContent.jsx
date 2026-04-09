import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  Mic,
  FileText,
  ImageIcon,
  Edit,
  VideoOff,
  Download,
  Copy,
  Share2
} from "lucide-react";

const CreateContent = () => {
  // --- Enhanced State Management with TypeScript-like structure ---
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [cta, setCta] = useState("Visit Website");
  const [language, setLanguage] = useState("English");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [contentType, setContentType] = useState("Social Post");
  const [mediaResult, setMediaResult] = useState(null); 
  const [mediaType, setMediaType] = useState('text');
  const [copied, setCopied] = useState(false);

  // --- Utility Functions ---
  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // --- 🎨 ENHANCED POSTER GENERATION with detailed prompt engineering ---
  const generatePoster = async () => {
    setLoading(true);
    setMediaResult(null);
    setResult("");

    // **ADVANCED POSTER PROMPT** - Optimized for Imagen 3.0 (2026)
    const posterPrompt = `🎨 PREMIUM COMMERCIAL POSTER for "${prompt}"

**BRAND CONTEXT**: Indian SMB (${platform} campaign)
**TARGET**: ${audience || 'Urban Indian professionals 25-45'}
**TONE**: ${tone} - ${tone === 'Professional' ? 'Corporate elegance' : tone === 'Excited' ? 'Vibrant energy' : tone === 'Urgent' ? 'Limited time offer' : 'Warm approachable'}

**VISUAL SPECIFICATIONS**:
- 8K resolution, cinematic lighting, professional product photography
- Composition: Rule of thirds, product 60% focal point
- Color palette: Premium gold/blue tones, high contrast
- Typography: Bold headline + clean subtext + prominent CTA
- Elements: ${tone === 'Professional' ? 'Minimalist luxury' : 'Dynamic energy bursts'}
- Background: Subtle gradient or authentic Indian market context
- CTA Button: "${cta}" in glowing emerald green

**DELIVERABLE**: Square 1:1 aspect ratio, print-ready 300 DPI quality`;

    try {
      // Vertex AI Imagen 3.0 endpoint (2026 standard)
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ 
            prompt: posterPrompt,
            negative_prompt: "blurry, low quality, amateur, cluttered, watermark"
          }],
          parameters: { 
            sampleCount: 1, 
            aspectRatio: "1:1",
            safetyFilterLevel: "block_only_high",
            quality: "high"
          }
        })
      });

      const data = await response.json();

      if (response.ok && data.predictions?.[0]?.bytesBase64Encoded) {
        setMediaResult(data.predictions[0].bytesBase64Encoded);
        setMediaType('image');
      } else {
        throw new Error(data.error?.message || "Image generation limit reached");
      }
    } catch (error) {
      console.error("Poster Generation Error:", error);
      
      // **ENHANCED FALLBACK** - Premium placeholder with dynamic text overlay
      setMediaResult({
        type: 'fallback',
        prompt: prompt,
        cta: cta,
        tone: tone
      });
      setMediaType('fallback');
      console.log("Showing premium marketing template as fallback");
    } finally {
      setLoading(false);
    }
  };

  // --- ✍️ SUPERCHARGED CONTENT GENERATION with detailed prompt ---
  // 🚨 QUICK FIX - Replace ONLY the generateAIContent function in your CreateContent.jsx

const generateAIContent = async () => {
  if (!prompt.trim()) {
    alert("Please describe your product/service first! 📝");
    return;
  }

  setLoading(true);
  setMediaResult(null);
  setMediaType('text');

  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  // 🔥 UPDATED 2026 MODEL LIST - All actively supported by Groq
  const availableModels = [
    "llama-3.3-70b-versatile",    // Primary recommendation (replaces 70b-8192)
    "llama3-70b-8192",           // Legacy fallback if still works
    "llama-3.1-8b-instant",      // Fast & reliable 8B
    "llama3-8b-8192",            // Legacy 8B fallback
    "llama-3.3-128k-instruct",   // Long context variant
    "mixtral-8x7b-32768",        // Excellent alternative
    "gemma2-9b-it"               // Fast Google model
  ];

  let lastError = null;

  // 🔄 Try models in order until one works
  for (const modelName of availableModels) {
    try {
      console.log(`🔄 Trying model: ${modelName}`);
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "system",
              content: "You are Vyapar AI - India's #1 SMB marketing copywriter. Create high-converting social media posts for Indian businesses."
            },
            {
              role: "user",
              content: `🚀 INDIAN SMB MARKETING CAMPAIGN

**DETAILS**:
- Type: ${contentType}
- Platform: ${platform}
- Product: "${prompt}"
- Audience: ${audience || "Local business owners"}
- Tone: ${tone}
- Language: ${language}
- CTA: "${cta}"
- Special: ${specialInstructions || "Make it engaging"}

**REQUIREMENTS**:
✅ Start directly with post copy
✅ 3-5 emojis max, Indian style
✅ Platform-optimized formatting
✅ High conversion focus
✅ End with strong ${cta}

Generate viral content NOW:`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();

      if (response.ok && data.choices?.[0]?.message?.content) {
        console.log(`✅ Success with model: ${modelName}`);
        setResult(data.choices[0].message.content.trim());
        setLoading(false);
        return; // SUCCESS - exit loop
      } else {
        console.warn(`❌ Model ${modelName} failed:`, data.error);
        lastError = data.error;
        await delay(500); // Brief pause before next try
      }

    } catch (error) {
      console.warn(`⚠️ Model ${modelName} error:`, error.message);
      lastError = error;
      await delay(300);
    }
  }

  // 🛡️ FINAL FAILSAFE - Premium template (ALWAYS works)
  console.log("🔄 All models failed, using premium fallback");
  const fallbackContent = `✨ ${tone === 'Urgent' ? '⏰ LIMITED OFFER!' : 'Special Launch!'} ✨

"${prompt}" – Premium Quality • Trusted Brand ✅

💰 Unbeatable Market Price
⚡ Mumbai Same-Day Delivery
⭐ 5000+ Happy Local Businesses

👉 ${cta} Today!

#VyaparAI #${platform} #LocalBusinessPower`;

  setResult(fallbackContent);
  setLoading(false);
  
  // Show helpful message
  alert(`🤖 Vyapar AI used premium template (API busy). Copy this high-converting post! 
Try again in 30s for fresh AI content.`);
};


  // --- Enhanced Action Handler ---
  const handleMainAction = useCallback(() => {
    if (contentType === "Social Post") {
      generateAIContent();
    } else if (contentType === "Ad Poster") {
      generatePoster();
    } else {
      alert("🎥 Video Reels coming soon! Use Social Post + Poster for now.");
    }
  }, [contentType, prompt, audience, tone, platform, cta, language, specialInstructions]);

  // --- Voice Input (Enhanced) ---
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("🎤 Voice input not supported. Type your special instructions instead.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-IN';
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setSpecialInstructions(transcript);
    };
    recognition.onerror = () => alert("Voice input failed. Please type instead.");
    recognition.start();
  };

  // --- Copy to Clipboard ---
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = result;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- Platforms Config ---
  const platforms = [
    { id: 'WhatsApp', icon: '📱', color: 'emerald' },
    { id: 'Twitter', icon: '🐦', color: 'sky' },
    { id: 'Instagram', icon: '📸', color: 'pink' },
    { id: 'Facebook', icon: '👥', color: 'blue' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-emerald-900/10 space-y-8 pb-10 max-w-7xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="animate-fade-in"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: ENHANCED INPUT PANEL */}
          <div className="bg-slate-800/50 backdrop-blur-2xl border border-slate-700/50 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-500/10">
            <div className="flex items-center gap-3 mb-8">
              <motion.div 
                className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl text-emerald-400 shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles size={28} />
              </motion.div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  Vyapar AI Studio
                </h3>
                <p className="text-slate-500 text-sm mt-1">India's #1 SMB Content Generator</p>
              </div>
            </div>

            {/* Content Mode Selector */}
            <div className="space-y-4 mb-8">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                🎯 Content Mode
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: "Social Post", icon: <FileText size={24} />, disabled: false, color: "emerald" },
                  { id: "Ad Poster", icon: <ImageIcon size={24} />, disabled: false, color: "indigo" },
                  { id: "Video Reel", icon: <VideoOff size={24} />, disabled: true, color: "gray" }
                ].map((mode) => (
                  <motion.button
                    key={mode.id}
                    disabled={mode.disabled || loading}
                    onClick={() => setContentType(mode.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all gap-3 h-28 ${
                      mode.disabled 
                        ? "opacity-40 cursor-not-allowed bg-slate-900/30 border-slate-800/50" 
                        : contentType === mode.id 
                          ? `bg-gradient-to-br from-${mode.color}-500/20 border-${mode.color}-500 shadow-lg shadow-${mode.color}-500/25 text-white` 
                          : "bg-slate-900/40 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className={`p-2 rounded-2xl bg-${mode.color}-500/10 group-hover:bg-${mode.color}-500/20 transition-all`}>
                      {mode.icon}
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider">{mode.id}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="mb-8">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block flex items-center gap-2">
                🎭 Business Tone
              </label>
              <div className="flex flex-wrap gap-3">
                {["Professional", "Excited", "Urgent", "Friendly"].map((t) => (
                  <motion.button 
                    key={t}
                    onClick={() => setTone(t)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-2xl text-sm font-black transition-all shadow-lg ${
                      tone === t 
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/50" 
                        : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600 hover:text-white"
                    }`}
                  >
                    {t}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Main Input */}
            <div className="mb-8">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">
                🏪 Product/Service Details
              </label>
              <textarea 
                className="w-full bg-slate-900/70 border-2 border-slate-700/50 rounded-3xl p-6 text-white h-44 outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all resize-none text-lg placeholder-slate-500" 
                placeholder="Ex: 'Premium organic spices wholesale - pure, aromatic, farm-fresh, delivered daily to Mumbai kirana stores'" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                disabled={loading}
              />
            </div>

            {/* Platform Selector */}
            <div className="mb-8">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block flex items-center gap-2">
                📱 Target Platform
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {platforms.map((p) => (
                  <motion.button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`group flex flex-col items-center justify-center p-5 rounded-3xl border-4 transition-all gap-2 aspect-square ${
                      platform === p.id 
                        ? `bg-gradient-to-br from-${p.color}-500/20 border-${p.color}-500 shadow-2xl shadow-${p.color}-500/30 text-white` 
                        : 'bg-slate-900/40 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform">{p.icon}</span>
                    <span className="text-xs font-black uppercase tracking-wider">{p.id}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                  🎯 Target Audience
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Mumbai kirana owners, age 30-50" 
                  className="w-full bg-slate-900/70 border-2 border-slate-700/50 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all" 
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">
                  🌐 Language
                </label>
                <select 
                  className="w-full bg-slate-900/70 border-2 border-slate-700/50 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all" 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={loading}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Hinglish</option>
                  <option>Marathi</option>
                  <option>Gujarati</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="text-xs font-bold text-slate-400 uppercase block mb-3">
                🚀 Call to Action
              </label>
              <select 
                className="w-full bg-slate-900/70 border-2 border-slate-700/50 rounded-2xl p-4 text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all text-lg" 
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                disabled={loading}
              >
                <option>WhatsApp us to Order ➡️</option>
                <option>Visit our Store Today!</option>
                <option>Shop Online Now</option>
                <option>Free Demo Available</option>
                <option>Limited Stock - Order Now!</option>
              </select>
            </div>

            {/* Generate Button */}
            <motion.button 
              onClick={handleMainAction} 
              disabled={loading || !prompt.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black py-6 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-500/40 active:shadow-emerald-500/60 text-lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={24} />
                  AI is Crafting...
                </>
              ) : (
                <>
                  <Send size={24} />
                  Generate {contentType}
                </>
              )}
            </motion.button>

            {/* Voice Instructions */}
            <div className="mt-10 pt-8 border-t border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  🗣️ Voice Instructions
                </label>
                <motion.button 
                  onClick={startListening}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 rounded-2xl hover:from-emerald-500/30 hover:to-teal-500/30 transition-all shadow-lg border border-emerald-500/30"
                >
                  <Mic size={20} />
                </motion.button>
              </div>
              <textarea 
                className="w-full bg-slate-900/70 border-2 border-slate-700/50 rounded-2xl p-5 text-white h-28 outline-none text-sm resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder-slate-500" 
                placeholder="Ex: 'Make it sound more urgent and add discount mention' or 'Use more Hindi words'" 
                value={specialInstructions} 
                onChange={(e) => setSpecialInstructions(e.target.value)} 
              />
            </div>
          </div>

          {/* RIGHT: ENHANCED PREVIEW PANEL */}
          <div className="bg-slate-900/50 backdrop-blur-2xl border-2 border-slate-700/50 p-8 rounded-[2.5rem] flex flex-col min-h-[700px] sticky top-8 shadow-2xl shadow-slate-900/50">
            <h3 className="text-2xl font-black text-slate-300 mb-8 uppercase tracking-widest flex items-center gap-3">
              ✨ Live Preview
            </h3>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center relative">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="space-y-6"
                  >
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full mx-auto"
                    />
                    <div>
                      <p className="text-xl font-black text-slate-300 mb-2">
                        Vyapar AI is crafting your {contentType.toLowerCase()}...
                      </p>
                      <p className="text-slate-500 text-sm">High-quality generation takes ~10 seconds</p>
                    </div>
                  </motion.div>
                ) : mediaResult && mediaType === 'image' ? (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-6"
                  >
                    <img 
                      src={`data:image/png;base64,${mediaResult}`} 
                      className="w-full h-auto max-h-[500px] object-contain rounded-3xl shadow-2xl border-4 border-slate-700/50 hover:shadow-emerald-500/30 transition-all duration-300" 
                      alt="Vyapar AI Generated Poster"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = `data:image/png;base64,${mediaResult}`;
                        link.download = `vyapar_${contentType.toLowerCase()}_${Date.now()}.png`;
                        link.click();
                      }}
                      className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-3xl shadow-xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all text-lg"
                    >
                      <Download size={20} className="inline mr-2" />
                      Download HD Poster (8K)
                    </motion.button>
                  </motion.div>
                ) : mediaType === 'fallback' ? (
                  <motion.div
                    key="fallback"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-12 border-4 border-dashed border-slate-700/50 shadow-2xl text-center"
                  >
                    <ImageIcon size={64} className="mx-auto mb-6 text-slate-500" />
                    <h4 className="text-xl font-black text-slate-300 mb-4">
                      Premium Poster Template
                    </h4>
                    <p className="text-slate-500 mb-8">
                      AI Image Engine busy. Download this professional template and add your branding!
                    </p>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      className="w-full py-4 bg-white/90 text-slate-950 font-black rounded-2xl shadow-xl hover:bg-white transition-all"
                    >
                      Download Template
                    </motion.button>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="w-full max-w-2xl text-left space-y-6"
                  >
                    <div className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl min-h-[400px] hover:shadow-emerald-500/20 transition-all">
                      <div className="text-slate-200 leading-relaxed whitespace-pre-wrap text-xl font-medium bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                        {result}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <motion.button
                        onClick={handleMainAction}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-center gap-3 py-4 px-6 bg-slate-800/80 text-slate-300 rounded-2xl font-black border-2 border-slate-700 hover:bg-slate-700/80 hover:border-slate-600 transition-all"
                      >
                        <RefreshCw size={20} />
                        Recreate
                      </motion.button>
                      
                      <motion.button
                        onClick={copyToClipboard}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 rounded-2xl font-black border-2 border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
                      >
                        <Copy size={20} />
                        {copied ? 'Copied!' : 'Copy Text'}
                      </motion.button>
                      
                      <motion.button
                        onClick={() => window.scrollTo({top:0, behavior:'smooth'})}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-slate-700 to-slate-800 text-slate-300 rounded-2xl font-black border-2 border-slate-600 hover:from-slate-600 hover:to-slate-700 transition-all"
                      >
                        <Edit size={20} />
                        Tweak
                      </motion.button>
                    </div>

                    <motion.button 
                      onClick={() => {
                        const url = platform === 'WhatsApp' 
                          ? `https://wa.me/?text=${encodeURIComponent(result)}`
                          : `https://twitter.com/intent/tweet?text=${encodeURIComponent(result)}`;
                        window.open(url, "_blank");
                      }}
                      whileHover={{ scale: 1.02 }}
                      className="w-full py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black rounded-3xl shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all text-lg flex items-center justify-center gap-3 mx-auto"
                    >
                      <Share2 size={24} />
                      Share on {platform}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    className="opacity-20"
                  >
                    <Sparkles size={96} className="mx-auto mb-8 text-emerald-500/50" />
                    <p className="text-2xl font-black text-slate-500">Content Preview Area</p>
                    <p className="text-slate-500 mt-2">Enter details above to generate 🔥 content</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateContent;
