import React from "react";
import GameBoard from "@/components/GameBoard";
import LoveBar from "@/components/LoveBar";
import LevelComplete from "@/components/LevelComplete";
import ValentineScreen from "@/components/ValentineScreen";
import { useGameBoard } from "@/game/useGameBoard";

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
  } = useGameBoard();

  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-start pt-4 pb-8 px-2 overflow-hidden">
      {/* Title */}
      <h1 className="font-display text-3xl text-primary mb-3 drop-shadow-sm">
        Love Match 💕
      </h1>

      {/* Love Bar */}
      <LoveBar score={score} target={levelConfig.targetScore} level={currentLevel + 1} />

      {/* Game Board */}
      <div className="mt-3 flex-1 flex items-start justify-center">
        <GameBoard
          board={board}
          selected={selected}
          onCellClick={handleCellClick}
          onSwap={handleSwap}
          swapping={swapping}
          invalidSwap={invalidSwap}
          animating={animating}
        />
      </div>

      {/* Level Complete Overlay */}
      {levelComplete && (
        <LevelComplete
          level={currentLevel + 1}
          message={levelConfig.message || "Отлично! 💕"}
          onNext={nextLevel}
          isLast={currentLevel >= 24}
        />
      )}

      {/* Final Valentine Screen */}
      {gameComplete && <ValentineScreen onRestart={restartGame} />}
    </div>
  );
};

export default Index;
