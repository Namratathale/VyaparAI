import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Cpu, BarChart3, Zap, Shield, Briefcase } from 'lucide-react';

const icons = [DollarSign, Cpu, BarChart3, Zap, Shield, Briefcase];

const Background = () => {
  // Generate 15 random floating elements
  const elements = Array.from({ length: 15 });

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0f172a] pointer-events-none">
      {/* Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />

      {elements.map((_, i) => {
        const Icon = icons[Math.floor(Math.random() * icons.length)];
        return (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              y: '110vh', 
              x: `${Math.random() * 100}vw`,
              scale: 0.5 
            }}
            animate={{ 
              opacity: [0, 0.3, 0], 
              y: '40vh', // Disappear as they move to the middle
              scale: [0.5, 1, 0.8],
              rotate: 360 
            }}
            transition={{ 
              duration: 10 + Math.random() * 15, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10 
            }}
            className="absolute text-emerald-500/20"
          >
            <Icon size={24 + Math.random() * 20} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default Background;