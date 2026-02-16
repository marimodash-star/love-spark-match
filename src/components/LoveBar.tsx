import React from "react";

interface LoveBarProps {
  score: number;
  target: number;
  level: number;
}

const LoveBar: React.FC<LoveBarProps> = ({ score, target, level }) => {
  const pct = Math.min((score / target) * 100, 100);

  return (
    <div className="w-full max-w-md mx-auto px-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-foreground">
          Уровень {level}
        </span>
        <span className="text-xs font-bold text-foreground">
          {score} / {target}
        </span>
      </div>
      <div className="w-full h-4 rounded-full bg-love-bar-bg overflow-hidden border border-cell-border shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-celebration transition-all duration-500 ease-out relative"
          style={{ width: `${pct}%` }}
        >
          {pct > 15 && (
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary-foreground">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoveBar;
