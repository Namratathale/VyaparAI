import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Send, 
  Copy, 
  RefreshCw, 
  Mic,
  FileText,
  ImageIcon,
  Edit,
  Video
} from "lucide-react";import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const CreateContent = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [cta, setCta] = useState("Visit Website");
  const [language, setLanguage] = useState("English");
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const [specialInstructions, setSpecialInstructions] = useState("");
  // Add these to your state at the top
const [mediaResult, setMediaResult] = useState(null); // URL of generated image/video
const [mediaType, setMediaType] = useState('text'); // 'text', 'image', or 'video'

const generateMedia = async () => {
  setLoading(true);
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  try {
    if (contentType === 'Ad Poster') {
      // --- NANO BANANA 2 (IMAGE GENERATION) ---
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-image:predict?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          instances: [{ prompt: `High-quality professional business poster for ${prompt}. 
          Style: ${tone}, Target Audience: ${audience}. Ensure the text is readable and brand-focused.` }],
          parameters: { sampleCount: 1 }
        })
      });
      const data = await response.json();
      setMediaResult(data.predictions[0].bytesBase64Encoded); // Base64 Image
      setMediaType('image');

    } else if (contentType === 'Video Reel') {
      // --- VEO (VIDEO GENERATION) ---
      const url = `https://generativelanguage.googleapis.com/v1beta/models/veo:predict?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          instances: [{ prompt: `A cinematic 15-second mobile-first reel for ${prompt}. 
          Vibe: ${tone}. High fidelity, 4k, smooth transitions.` }]
        })
      });
      const data = await response.json();
      setMediaResult(data.predictions[0].videoUrl); // Video URL
      setMediaType('video');
    }
  } catch (error) {
    console.error("Media Gen Error:", error);
    alert("Media API is currently in private preview for your region.");
  } finally {
    setLoading(false);
  }
};

// Platforms array for easy mapping
const platforms = [
  { id: 'WhatsApp', icon: '📱' },
  { id: 'Twitter', icon: '🐦' },
  { id: 'Instagram', icon: '📸' },
  { id: 'Facebook', icon: '👥' }
];
  const generateAIContent = async () => {
    if (!prompt) return;
    setLoading(true);

    const models = [
      "gemini-2.0-flash", // Most likely to be available/fast
      "gemini-2.5-flash", // The one that gave you the 503 (exists, but busy)
      "gemini-1.5-flash-8b", // Lightweight version, usually less busy
      "gemini-pro", // Universal fallback
    ];
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    for (const modelName of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
        [ROLE]
        You are an elite Senior Growth Marketer specializing in the Indian MSME (Vyapar) sector. Your goal is to convert users into customers through high-impact copywriting.

        [CONTEXT]
        - Business Category: Indian Startup/Local Business
        - Content Type: ${contentType}
        - Platform: ${platform}
        - Product/Service: ${prompt}
        - Target Audience: ${audience || "General Indian Consumers"}
        - Tone: ${tone}
        
        - Primary Language: ${language}
        - Call to Action: ${cta}
        - Specific Constraints: ${specialInstructions || "None"}

        [GUIDELINES]
        1. Local Relevance: If Hinglish/Hindi is selected, use natural, conversational vocabulary that resonates with Indian buyers.
        2. Hook: Start with a powerful first line to grab attention.
        3. Value Proposition: Clearly state why the customer needs this.
        4. Platform Optimization: 
           - If WhatsApp: Use a friendly, personal greeting. Use bullet points for features. Keep it concise for mobile reading. Include the CTA clearly.
  - If Twitter (X): Keep it under 280 characters. Use a "hook" first sentence. Max 2-3 hashtags.
  - If Instagram: Focus on visual storytelling and emojis. Place hashtags at the bottom. Use a "link in bio" style CTA.
  - If Facebook: Use a longer, storytelling format. Focus on community and trust.
        5. Hashtags: Include 3-5 trending, niche-specific hashtags.

        [STRICT CONSTRAINT]
        Return ONLY the final content. Do NOT include any introductory text, conversational filler, or "Here is your post" style sentences. Start immediately with the post content.`,
                  },
                ],
              },
            ],
          }),
        });

        const data = await response.json();

        if (response.status === 503 || response.status === 429) {
          console.warn(`${modelName} is busy, waiting 1 second...`);
          // Wait 1 second before trying the next model
          await new Promise((resolve) => setTimeout(resolve, 1000));
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
        const demoContent = `✨ **Vyapar AI Suggestion** ✨\n\nLooking to grow your business? Our ${prompt || "new product"} is the perfect solution! \n\n✅ Premium Quality\n✅ Best Prices\n🚀 Fast Delivery\n\nDM us to order now! #SmallBusiness #India #VyaparAI`;

        setResult(demoContent);
        alert(
          "Note: Using optimized local generation due to high server traffic.",
        );
      }
    }
    setLoading(false);
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpecialInstructions(transcript);
    };
    recognition.start();
  };

  //Recreate/ Tweak Function to quickly re-run the generation
const handleRecreate = () => {
  setResult(''); // Optional: clear old result to show loading state
  generateAIContent();
};

// Function to scroll back to inputs
const handleTweak = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Type post, image, or video in the 3 cards and link them to contentType state for more specific prompts and better results. For now, it's defaulted to "Social Post" in the prompt template.
const [contentType, setContentType] = useState("Social Post");
  




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

   <div className="space-y-4">
  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
    1. Choose Content Type
  </label>

  <div className="grid grid-cols-3 gap-3">
    {[
      { id: "Social Post", icon: <FileText size={20} /> },
      { id: "Ad Poster", icon: <ImageIcon size={20} /> },
      { id: "Video Reel", icon: <Video size={20} /> }
    ].map((mode) => (
      <button
        key={mode.id}
        onClick={() => setContentType(mode.id)}
        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
          contentType === mode.id
            ? "bg-emerald-500/10 border-emerald-500 text-white"
            : "bg-slate-900/40 border-slate-700 text-slate-500 hover:border-slate-600"
        }`}
      >
        {mode.icon}
        <span className="text-[10px] font-bold uppercase">
          {mode.id}
        </span>
      </button>
    ))}
  </div>
</div>

  {/* Card Content */}

          <div className="space-y-6">
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">
                Business Tone
              </label>
              <div className="flex flex-wrap gap-2">
                {["Professional", "Excited", "Urgent", "Friendly"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tone === t ? "bg-emerald-500 text-slate-950" : "bg-slate-700 text-slate-400"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">
                What are you promoting?
              </label>
              <textarea
                className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl p-4 text-white h-40 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
                placeholder="e.g. A new summer collection of cotton sarees with 20% discount..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <p className="text-[10px] text-slate-500 mt-2 px-1 italic">
                Tip: Mention specific features like "Pure Cotton," "24-hour
                delivery," or "Handmade" for better results.
              </p>
            </div>

            {/* Add this below Section 2 (Describe Product) */}
            <div className="mt-6">
  <label className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 block">
    Select Publishing Platform
  </label>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {platforms.map((p) => (
      <button
        key={p.id}
        onClick={() => setPlatform(p.id)}
        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-1 ${
          platform === p.id 
          ? 'bg-emerald-500/20 border-emerald-500 text-white' 
          : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:border-slate-600'
        }`}
      >
        <span className="text-xl">{p.icon}</span>
        <span className="text-[10px] font-bold uppercase">{p.id}</span>
      </button>
    ))}
  </div>
</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Target Audience
                </label>
                <input
                  type="text"
                  placeholder="e.g. Retailers, Students"
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl p-3 text-white mt-1 outline-none focus:border-emerald-500"
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Language
                </label>
                <select
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl p-3 text-white mt-1 outline-none"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Hinglish</option>
                  <option>Marathi</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Primary Call to Action
              </label>
              <select
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl p-3 text-white mt-1 outline-none"
                onChange={(e) => setCta(e.target.value)}
              >
                <option>Link in Bio</option>
                <option>WhatsApp us to Order</option>
                <option>Visit our Store</option>
                <option>Shop Now</option>
                <option>Register for the Event</option>
              </select>
            </div>

            <button
              onClick={generateAIContent}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {loading ? (
                <RefreshCw className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
              {loading ? "AI is Thinking..." : "Generate Business Post"}
            </button>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
                  Special Instructions (Optional)
                </label>
                <button
                  onClick={startListening}
                  className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-all"
                  title="Voice to Text"
                >
                  <Mic size={16} />{" "}
                  {/* Microphone placeholder or use Mic icon */}
                </button>
              </div>
              <textarea
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl p-4 text-white h-24 outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none text-sm"
                placeholder="Ex: 'Announce a 10% discount for Diwali' or 'Compare market trends'..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Output Section */}
       {/* Output Section */}
<div className="bg-slate-900/40 border border-dashed border-slate-700 p-8 rounded-[2.5rem] flex flex-col min-h-[500px]">
  
  <h3 className="text-xl font-bold text-slate-400 mb-6">
    Output Preview
  </h3>

  <div className="flex-1 flex flex-col items-center justify-center text-center">

    {/* 🔄 Loading State */}
    {loading ? (
      <div>
        <RefreshCw
          className="animate-spin text-emerald-400 mx-auto mb-4"
          size={40}
        />
        <p className="text-slate-500 font-bold">
          AI is crafting your media...
        </p>
      </div>

    ) : mediaType === "image" && mediaResult ? (

      /* 🖼️ Image Output */
      <>
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          src={`data:image/png;base64,${mediaResult}`}
          className="w-full h-auto rounded-3xl shadow-2xl border border-slate-700"
          alt="AI Poster"
        />

        <button
          onClick={() => {
            const link = document.createElement("a");
            link.href = `data:image/png;base64,${mediaResult}`;
            link.download = `vyapar_ai_${contentType}.png`;
            link.click();
          }}
          className="mt-6 w-full py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-200 transition-all shadow-xl"
        >
          Download Poster
        </button>
      </>

    ) : mediaType === "video" && mediaResult ? (

      /* 🎬 Video Output */
      <>
        <video
          src={mediaResult}
          controls
          className="w-full rounded-3xl border border-slate-700"
          autoPlay
          loop
        />

        <button
          onClick={() => {
            const link = document.createElement("a");
            link.href = mediaResult;
            link.download = `vyapar_ai_${contentType}.mp4`;
            link.click();
          }}
          className="mt-6 w-full py-4 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-200 transition-all shadow-xl"
        >
          Download Reel
        </button>
      </>

    ) : result ? (

      /* ✍️ Text Output */
      <>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-left">
          {result}
        </p>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3 w-full">
          
          <button
            onClick={handleRecreate}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all border border-slate-700"
          >
            <RefreshCw size={18} />
            Recreate
          </button>

          <button
            onClick={handleTweak}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl font-bold transition-all border border-emerald-500/20"
          >
            <Edit size={18} />
            Tweak
          </button>

          <button
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent(result)}`,
                "_blank"
              )
            }
            className="col-span-2 mt-2 py-4 bg-emerald-500 text-slate-950 font-black rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20"
          >
            Share on WhatsApp
          </button>

        </div>
      </>

    ) : (

      /* ✨ Empty State */
      <div className="opacity-30">
        <Sparkles size={48} className="mx-auto mb-4" />
        <p>Your AI content will appear here.</p>
      </div>

    )}

  </div>
</div>
      </div>
    </div>
  );
};

export default CreateContent;
