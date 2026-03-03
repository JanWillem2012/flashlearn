export const sm2 = (word, quality) => {
  let { interval, repetitions, easeFactor } = word;
  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else { repetitions = 0; interval = 1; }
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  return {
    interval, repetitions,
    easeFactor: Math.round(easeFactor * 100) / 100,
    nextReview: nextReview.toISOString(),
    lastReview: new Date().toISOString()
  };
};
export const qualityFromResult = (correct, attempts) => {
  if (!correct) return 1;
  if (attempts === 1) return 5;
  if (attempts === 2) return 4;
  return 3;
};