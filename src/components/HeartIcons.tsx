import React from "react";

export const HeartIcon: React.FC<{ className?: string; size?: number; color?: string }> = ({ 
  className = "", size = 24, color = "currentColor" 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export const DoubleHeartIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "", size = 24 
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M10 22.35l-1.05-.96C4.4 17.36 2 14.78 2 11.5 2 8.92 4.02 7 6.5 7c1.34 0 2.63.61 3.5 1.59C10.87 7.61 12.16 7 13.5 7 15.98 7 18 8.92 18 11.5c0 3.28-2.4 5.86-6.95 9.89L10 22.35z" fill="hsl(340, 75%, 60%)"/>
    <path d="M22 25.35l-1.05-.96C16.4 20.36 14 17.78 14 14.5c0-2.58 2.02-4.5 4.5-4.5 1.34 0 2.63.61 3.5 1.59.87-.98 2.16-1.59 3.5-1.59 2.48 0 4.5 1.92 4.5 4.5 0 3.28-2.4 5.86-6.95 9.89L22 25.35z" fill="hsl(340, 80%, 70%)" opacity="0.8"/>
  </svg>
);

export const SparkleHeartIcon: React.FC<{ className?: string; size?: number }> = ({ 
  className = "", size = 24 
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M16 28l-1.8-1.63C6.4 19.36 2 15.28 2 10.5 2 6.42 5.42 3 9.5 3c2.24 0 4.38 1.04 5.75 2.65L16 6.53l.75-.88C18.12 4.04 20.26 3 22.5 3 26.58 3 30 6.42 30 10.5c0 4.78-4.4 8.86-12.2 15.87L16 28z" fill="hsl(340, 75%, 60%)"/>
    <circle cx="8" cy="6" r="1.5" fill="hsl(42, 80%, 55%)"/>
    <circle cx="26" cy="8" r="1" fill="hsl(42, 80%, 55%)"/>
    <circle cx="24" cy="4" r="1.5" fill="hsl(42, 80%, 55%)"/>
    <path d="M6 3l.5 1.5L8 5l-1.5.5L6 7l-.5-1.5L4 5l1.5-.5z" fill="hsl(42, 80%, 65%)"/>
    <path d="M27 5l.4 1.2 1.2.4-1.2.4-.4 1.2-.4-1.2-1.2-.4 1.2-.4z" fill="hsl(42, 80%, 65%)"/>
  </svg>
);

export const FloatingHeart: React.FC<{ color?: string; size?: number; style?: React.CSSProperties; className?: string }> = ({ 
  color = "hsl(340, 75%, 60%)", size = 20, style, className = "" 
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={style} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const CAT_IMAGES = Array.from({ length: 25 }, (_, i) => `/images/cat-${i + 1}.webp`);

export const getCatImage = (level: number): string => {
  return CAT_IMAGES[(level - 1) % CAT_IMAGES.length];
};
