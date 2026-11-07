export interface RiskAssessment {
  level: 'SAFE' | 'REVIEW' | 'WARNING';
  score: number; // 0 (safest) to 100 (highest risk)
  chips: string[];
  nameMatch: boolean;
}

export function assessRisk(input: {
  amount: number;
  history: number;
  recipientName?: string;
  accountName?: string;
}): RiskAssessment {
  const chips: string[] = [];
  let score = 5;

  const rName = (input.recipientName || '').trim().toLowerCase();
  const aName = (input.accountName || '').trim().toLowerCase();

  let nameMatch = true;
  if (rName && aName) {
    const rWords = rName.split(/\s+/).filter(Boolean);
    const aWords = aName.split(/\s+/).filter(Boolean);
    const hasOverlap = rWords.some((w) => aWords.some((aw) => aw.includes(w) || w.includes(aw)));

    if (!hasOverlap) {
      nameMatch = false;
      chips.push('Account name differs from entered recipient');
      score += 45;
    }
  }

  if (input.history === 0) {
    chips.push('First transfer to this destination bank account');
    score += 15;
  }

  if (input.amount >= 1000) {
    chips.push('High volume transaction — extra verification recommended');
    score += 25;
  } else if (input.amount >= 500 && input.history === 0) {
    chips.push('Substantial amount for a new recipient');
    score += 15;
  }

  const level: 'SAFE' | 'REVIEW' | 'WARNING' =
    score >= 50 ? 'WARNING' : score >= 20 ? 'REVIEW' : 'SAFE';

  return {
    level,
    score: Math.min(score, 100),
    chips,
    nameMatch
  };
}
