import React, { useMemo } from "react";
import GameBoard from "@/components/GameBoard";
import LoveBar from "@/components/LoveBar";
import LevelComplete from "@/components/LevelComplete";
import ValentineScreen from "@/components/ValentineScreen";
import { useGameBoard } from "@/game/useGameBoard";

const STARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: 4 + Math.random() * 8,
  delay: Math.random() * 4,
  duration: 2 + Math.random() * 3,
}));

const Index: React.FC = () => {
  const {
    board,
    score,
    selected,
    animating,
    levelComplete,
    gameComplete,
    levelConfig,
    currentLevel,
    handleCellClick,
    handleSwap,
    nextLevel,
    restartGame,
    swapping,
    invalidSwap,
    hintCells,
    boardShaking,
  } = useGameBoard();

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background items-center justify-start pt-2 pb-4 px-2 overflow-hidden relative">
      {/* Background sparkle stars */}
      {STARS.map((s) => (
        <svg
          key={s.id}
          className="absolute pointer-events-none animate-star-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
          viewBox="0 0 16 16"
          fill="hsl(340, 60%, 82%)"
        >
          <path d="M8 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
        </svg>
      ))}

      <h1 className="font-display text-2xl text-primary mb-2 drop-shadow-sm relative z-10">
        Love Match
      </h1>

      <div className="relative z-10 w-full">
        <LoveBar score={score} target={levelConfig.targetScore} level={currentLevel + 1} />
      </div>

      <div className="mt-2 flex-1 flex items-start justify-center w-full relative z-10">
        <GameBoard
          board={board}
          selected={selected}
          onCellClick={handleCellClick}
          onSwap={handleSwap}
          swapping={swapping}
          invalidSwap={invalidSwap}
          animating={animating}
          hintCells={hintCells}
          boardShaking={boardShaking}
        />
      </div>

      {levelComplete && (
        <LevelComplete
          level={currentLevel + 1}
          message={levelConfig.message || "Отлично!"}
          onNext={nextLevel}
          isLast={currentLevel >= 24}
        />
      )}

      {gameComplete && <ValentineScreen onRestart={restartGame} />}
    </div>
  );
};

export default Index;
