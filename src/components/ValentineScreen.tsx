import React, { useEffect, useState } from "react";
import { FloatingHeart } from "./HeartIcons";

const HEART_COLORS = [
  "hsl(340, 75%, 60%)",
  "hsl(330, 70%, 70%)",
  "hsl(350, 80%, 65%)",
  "hsl(320, 60%, 75%)",
  "hsl(0, 70%, 70%)",
];

interface ValentineScreenProps {
  onRestart: () => void;
}

const AnimatedHeart: React.FC = () => (
  <div className="relative w-56 h-56 mx-auto mb-4 flex items-center justify-center">
    <svg
      viewBox="0 0 120 110"
      className="w-full h-full animate-heartbeat drop-shadow-2xl"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(340, 75%, 60%)" />
          <stop offset="50%" stopColor="hsl(350, 80%, 65%)" />
          <stop offset="100%" stopColor="hsl(320, 70%, 70%)" />
        </linearGradient>
        <filter id="heartGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M60 100 C60 100, 10 65, 10 35 C10 15, 30 5, 45 5 C52 5, 57 10, 60 15 C63 10, 68 5, 75 5 C90 5, 110 15, 110 35 C110 65, 60 100, 60 100Z"
        fill="url(#heartGrad)"
        filter="url(#heartGlow)"
      />
      <path
        d="M45 20 C38 20, 22 28, 25 42"
        stroke="hsl(0, 0%, 100%)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
    {/* Sparkles around heart */}
    <div className="absolute top-2 left-6 animate-sparkle-1">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="hsl(42, 80%, 60%)">
        <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
      </svg>
    </div>
    <div className="absolute top-4 right-4 animate-sparkle-2">
      <svg width="12" height="12" viewBox="0 0 16 16" fill="hsl(340, 70%, 75%)">
        <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
      </svg>
    </div>
    <div className="absolute bottom-10 left-2 animate-sparkle-3">
      <svg width="10" height="10" viewBox="0 0 16 16" fill="hsl(280, 50%, 75%)">
        <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
      </svg>
    </div>
    <div className="absolute bottom-16 right-2 animate-sparkle-1" style={{ animationDelay: "0.5s" }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="hsl(42, 80%, 65%)">
        <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
      </svg>
    </div>
  </div>
);

const ValentineScreen: React.FC<ValentineScreenProps> = ({ onRestart }) => {
  const [visible, setVisible] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; delay: number; size: number; color: string }[]>([]);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    setHearts(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        size: 14 + Math.random() * 24,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-primary/20 to-celebration/20 backdrop-blur-md">
      {hearts.map((h) => (
        <FloatingHeart
          key={h.id}
          color={h.color}
          size={h.size}
          className="absolute animate-float-heart pointer-events-none"
          style={{
            left: `${h.x}%`,
            bottom: "0",
            animationDelay: `${h.delay}s`,
          }}
        />
      ))}

      <div className={`transition-all duration-1000 px-4 ${visible ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
        <AnimatedHeart />
        <h1 className="font-display text-2xl text-primary text-center mb-3">
          Ты прошла все 25 уровней!
        </h1>
        <p className="text-center text-foreground text-base mb-6 font-semibold">
          Каждый уровень — как день с тобой: полон радости и любви
        </p>
        <div className="text-center">
          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-primary to-celebration text-primary-foreground font-bold py-2.5 px-6 rounded-full text-base shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            Начать заново
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValentineScreen;
