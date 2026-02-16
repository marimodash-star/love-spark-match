import React from "react";
import GameBoard from "@/components/GameBoard";
import LoveBar from "@/components/LoveBar";
import LevelComplete from "@/components/LevelComplete";
import ValentineScreen from "@/components/ValentineScreen";
import { useGameBoard } from "@/game/useGameBoard";
import { SparkleHeartIcon } from "@/components/HeartIcons";

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
      <h1 className="font-display text-3xl text-primary mb-3 drop-shadow-sm inline-flex items-center gap-2">
        Love Match <SparkleHeartIcon size={32} />
      </h1>

      <LoveBar score={score} target={levelConfig.targetScore} level={currentLevel + 1} />

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

      {levelComplete && (
        <LevelComplete
          level={currentLevel + 1}
          message={levelConfig.message || "Отлично! 💕"}
          onNext={nextLevel}
          isLast={currentLevel >= 24}
        />
      )}

      {gameComplete && <ValentineScreen onRestart={restartGame} />}
    </div>
  );
};

export default Index;
