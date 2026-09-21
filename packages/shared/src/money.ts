/**
 * Money helpers. ALL money in Noodle Junction is an integer number of paise
 * (₹1 = 100 paise). Never store or compute with floating-point rupees.
 */

export const PAISE_PER_RUPEE = 100;

export function isPaise(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value);
}

export function assertPaise(value: unknown, label = 'amount'): asserts value is number {
  if (!isPaise(value)) throw new TypeError(`${label} must be an integer number of paise`);
}

/** Round half away from zero (so +2.5 -> 3 and -2.5 -> -3). */
function roundHalfAwayFromZero(n: number): number {
  return n < 0 ? -Math.round(-n) : Math.round(n);
}

/** Convert a rupee amount (e.g. from an admin form) to paise. */
export function rupeesToPaise(rupees: number): number {
  if (!Number.isFinite(rupees)) throw new TypeError('rupees must be a finite number');
  // toFixed(2) avoids 19.99 * 100 = 1998.9999999999998
  return roundHalfAwayFromZero(Number(rupees.toFixed(2)) * PAISE_PER_RUPEE);
}

export function paiseToRupees(paise: number): number {
  assertPaise(paise);
  return paise / PAISE_PER_RUPEE;
}

export function sumPaise(values: readonly number[]): number {
  return values.reduce((acc, v) => {
    assertPaise(v);
    return acc + v;
  }, 0);
}

/**
 * `rate`% of `amountPaise`, rounded to the nearest paisa (half away from zero).
 * `rate` may have up to 2 decimals (e.g. 2.5, 18). Uses basis points internally
 * so it never multiplies by a float.
 */
export function percentOfPaise(amountPaise: number, rate: number): number {
  assertPaise(amountPaise, 'amountPaise');
  if (!Number.isFinite(rate)) throw new TypeError('rate must be a finite number');
  const basisPoints = Math.round(rate * 100);
  return roundHalfAwayFromZero((amountPaise * basisPoints) / 10_000);
}

/**
 * Round a total to the nearest whole rupee (half up). Returns the rounded
 * total and the round-off delta, which is stored separately on the order
 * (`pricing.roundOffPaise`).
 */
export function roundOffToRupee(totalPaise: number): { totalPaise: number; roundOffPaise: number } {
  assertPaise(totalPaise, 'totalPaise');
  const rounded = roundHalfAwayFromZero(totalPaise / PAISE_PER_RUPEE) * PAISE_PER_RUPEE;
  return { totalPaise: rounded, roundOffPaise: rounded - totalPaise };
}

/**
 * Display format: ₹ prefix, Indian digit grouping, decimals only when needed
 * (10-THEME §9): 54600 -> "₹546", 54650 -> "₹546.50", 12345600 -> "₹1,23,456".
 */
export function formatINR(paise: number): string {
  assertPaise(paise);
  const hasPaise = paise % PAISE_PER_RUPEE !== 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: hasPaise ? 2 : 0,
    maximumFractionDigits: hasPaise ? 2 : 0,
  }).format(paise / PAISE_PER_RUPEE);
}
