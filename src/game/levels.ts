export interface LevelConfig {
  level: number;
  gridSize: number;
  targetScore: number;
  message?: string;
}

const MESSAGES: Record<number, string> = {
  1: "Ты — для меня, как окрошка для лета",
  2: "Каждый день с тобой — это быть в любви и с любовью",
  3: "A million dreams for the world we're gonna make",
  4: "Ты моё солнышко в пасмурный день",
  5: "С тобой даже понедельник — праздник",
  6: "Ты лучше, чем Wi-Fi в аэропорту",
  7: "Каждый момент с тобой — маленькое чудо",
  8: "Ты — мой любимый уровень в этой игре",
  9: "Обнимаю тебя через экран",
  10: "10 уровней позади — как 10 причин любить тебя",
  11: "Поле стало больше, но любовь — ещё больше",
  12: "Ты вдохновляешь меня каждый день",
  13: "Счастливое число — потому что ты рядом",
  14: "Люблю тебя больше, чем котики любят коробки",
  15: "Половина пути пройдена вместе!",
  16: "Поле 10x10, а сердце — безразмерное",
  17: "Ты — самое красивое совпадение в моей жизни",
  18: "С тобой хочется собирать не три, а миллион в ряд",
  19: "Ты мой бесконечный бонус-уровень",
  20: "20 уровней любви и ни капли усталости",
  21: "Каждый свайп — это как поцелуй",
  22: "Два лебедя — 22 — символ нашей пары",
  23: "Почти финал, но наша история — только начало",
  24: "Предпоследний уровень, но не предпоследняя улыбка",
  25: "Финал! Но наша любовь — бесконечна",
};

export const LEVELS: LevelConfig[] = Array.from({ length: 25 }, (_, i) => {
  const level = i + 1;
  let gridSize: number;
  if (level <= 10) gridSize = 6;
  else if (level <= 15) gridSize = 8;
  else gridSize = 10;

  const baseScore = gridSize === 6 ? 80 : gridSize === 8 ? 150 : 250;
  const targetScore = baseScore + (level - 1) * 20;

  return { level, gridSize, targetScore, message: MESSAGES[level] };
});

export const PIECE_IMAGES = [
  "/images/piece-1.webp",
  "/images/piece-2.webp",
  "/images/piece-3.webp",
  "/images/piece-4.webp",
  "/images/piece-5.webp",
  "/images/piece-6.webp",
];
