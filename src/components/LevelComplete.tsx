import React, { useEffect, useState } from "react";

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
    const h = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      size: 12 + Math.random() * 20,
    }));
    setHearts(h);

    const c = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 1.5,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      rotate: Math.random() * 360,
    }));
    setConfetti(c);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      {/* Hearts */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute animate-float-heart pointer-events-none"
          style={{
            left: `${h.x}%`,
            bottom: "0",
            animationDelay: `${h.delay}s`,
            fontSize: h.size,
            color: h.color,
          }}
        >
          ❤️
        </div>
      ))}

      {/* Confetti */}
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

      <div className="animate-bounce-in bg-card rounded-3xl p-8 mx-4 max-w-sm text-center shadow-2xl border-2 border-primary/30 relative z-10">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-display text-2xl text-primary mb-4">Уровень {level} пройден!</h2>
        <p className="text-lg text-foreground leading-relaxed mb-6 font-semibold">
          {message}
        </p>
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-primary to-celebration text-primary-foreground font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          {isLast ? "❤️ Начать влюбляться заново" : "Следующий уровень →"}
        </button>
      </div>
    </div>
  );
};

export default LevelComplete;
