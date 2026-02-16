import React, { useEffect, useState } from "react";
import { FloatingHeart, SparkleHeartIcon, getCatImage } from "./HeartIcons";

interface LevelCompleteProps {
  level: number;
  message: string;
  onNext: () => void;
  isLast: boolean;
}

const HEART_COLORS = [
  "hsl(340, 75%, 60%)",
  "hsl(330, 70%, 70%)",
  "hsl(350, 80%, 65%)",
  "hsl(320, 60%, 75%)",
  "hsl(0, 70%, 70%)",
  "hsl(280, 50%, 75%)",
];

const LevelComplete: React.FC<LevelCompleteProps> = ({ level, message, onNext, isLast }) => {
  const [hearts, setHearts] = useState<{ id: number; x: number; delay: number; color: string; size: number }[]>([]);
  const [confetti, setConfetti] = useState<{ id: number; x: number; delay: number; color: string; rotate: number }[]>([]);

  useEffect(() => {
    setHearts(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      size: 12 + Math.random() * 20,
    })));
    setConfetti(Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      rotate: Math.random() * 360,
    })));
  }, []);

  const showCat = level >= 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
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

      {confetti.map((c) => (
        <div
          key={`c-${c.id}`}
          className="absolute top-0 animate-confetti pointer-events-none"
          style={{
            left: `${c.x}%`,
            animationDelay: `${c.delay}s`,
            width: 8,
            height: 8,
            backgroundColor: c.color,
            borderRadius: "2px",
            transform: `rotate(${c.rotate}deg)`,
          }}
        />
      ))}

      <div className="animate-bounce-in bg-card rounded-3xl p-6 mx-4 max-w-sm text-center shadow-2xl border-2 border-primary/30 relative z-10">
        <SparkleHeartIcon className="mx-auto mb-3" size={40} />
        <h2 className="font-display text-xl text-primary mb-3">Уровень {level} пройден!</h2>
        
        {showCat ? (
          <img
            src={getCatImage(level)}
            alt="Милый котик"
            className="w-44 h-44 object-contain mx-auto mb-4 rounded-2xl"
          />
        ) : (
          <p className="text-base text-foreground leading-relaxed mb-4 font-semibold">
            {message}
          </p>
        )}

        <button
          onClick={onNext}
          className="bg-gradient-to-r from-primary to-celebration text-primary-foreground font-bold py-2.5 px-6 rounded-full text-base shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          {isLast ? "Начать заново" : "Дальше"}
        </button>
      </div>
    </div>
  );
};

export default LevelComplete;
