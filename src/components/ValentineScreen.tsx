import React, { useEffect, useState } from "react";

interface ValentineScreenProps {
  onRestart: () => void;
}

const ValentineScreen: React.FC<ValentineScreenProps> = ({ onRestart }) => {
  const [visible, setVisible] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    setHearts(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        size: 14 + Math.random() * 24,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-primary/20 to-celebration/20 backdrop-blur-md">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute animate-float-heart pointer-events-none"
          style={{
            left: `${h.x}%`,
            bottom: "0",
            animationDelay: `${h.delay}s`,
            fontSize: h.size,
          }}
        >
          💖
        </div>
      ))}

      <div
        className={`transition-all duration-1000 ${visible ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
      >
        <img
          src="/images/valentine.webp"
          alt="Valentine"
          className="w-72 h-72 object-contain mx-auto mb-6 drop-shadow-2xl"
        />
        <h1 className="font-display text-3xl text-primary text-center mb-4">
          Ты прошла все 25 уровней! 💞
        </h1>
        <p className="text-center text-foreground text-lg mb-8 px-4 font-semibold">
          Каждый уровень — как день с тобой: полон радости и любви ❤️
        </p>
        <div className="text-center">
          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-primary to-celebration text-primary-foreground font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            ❤️ Начать влюбляться заново
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValentineScreen;
