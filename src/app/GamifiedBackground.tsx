'use client';
import React from 'react';

export default function GamifiedBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-[#0b0f19] text-gray-100 overflow-x-hidden">
      
      {/* 1. Injecting Custom Keyframe Animations directly for Hackathon speed */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-25px) rotate(15deg); opacity: 0.5; }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-40px) scale(1.1); opacity: 0.6; }
        }
        @keyframes grid-glow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-slow 5s ease-in-out infinite; animation-delay: 2s; }
        .animate-float-fast { animation: float-fast 6s ease-in-out infinite; animation-delay: 1s; }
      `}</style>

      {/* 2. Gamified Tech Grid Overlay (Responsive scale) */}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1e293b 1px, transparent 1px),
            linear-gradient(to bottom, #1e293b 1px, transparent 1px)
          `,
          backgroundSize: '45px 45px',
          animation: 'grid-glow 10s ease-in-out infinite'
        }}
      />

      {/* 3. Moving Objects (Eco & Gamified Floating Floating Assets) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        
        {/* Environmental Green Orb */}
        <div className="absolute top-[15%] left-[10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px] animate-float-slow" />
        
        {/* Social Blue Orb */}
        <div className="absolute bottom-[20%] right-[5%] w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] animate-float-medium" />
        
        {/* Floating Gamified Node 1 (Green Square) */}
        <div className="absolute top-[25%] right-[15%] w-4 h-4 border border-emerald-400/40 rotate-45 animate-float-fast" />

        {/* Floating Gamified Node 2 (Orange Plus Sign) */}
        <div className="absolute bottom-[35%] left-[18%] text-orange-500/30 text-2xl font-light animate-float-slow selection:bg-transparent">
          ＋
        </div>

        {/* Floating Gamified Node 3 (Purple Circle) */}
        <div className="absolute top-[60%] left-[8%] w-3 h-3 border-2 border-purple-500/30 rounded-full animate-float-medium" />

        {/* Geometric Tech Line decoration */}
        <svg className="absolute top-0 left-1/4 w-full h-full opacity-[0.03] stroke-slate-400" fill="none">
          <path d="M 0,100 L 200,300 L 400,200 L 800,600" strokeWidth="2" strokeDasharray="8 4" />
        </svg>
      </div>

      {/* 4. Page Content Wrapper (Sits cleanly over the moving objects) */}
      <div className="relative z-10 transition-all duration-500 ease-in-out">
        {children}
      </div>
    </div>
  );
}