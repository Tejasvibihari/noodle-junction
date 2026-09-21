import { describe, expect, it } from 'vitest';
import {
  assertPaise,
  formatINR,
  isPaise,
  paiseToRupees,
  percentOfPaise,
  roundOffToRupee,
  rupeesToPaise,
  sumPaise,
} from './money';

describe('rupeesToPaise / paiseToRupees', () => {
  it('converts without float drift', () => {
    expect(rupeesToPaise(19.99)).toBe(1999);
    expect(rupeesToPaise(0.1 + 0.2)).toBe(30);
    expect(rupeesToPaise(180)).toBe(18000);
    expect(paiseToRupees(54600)).toBe(546);
  });
  it('rejects non-finite input', () => {
    expect(() => rupeesToPaise(NaN)).toThrow();
    expect(() => rupeesToPaise(Infinity)).toThrow();
  });
});

describe('isPaise / assertPaise', () => {
  it('accepts integers and rejects fractions/non-numbers', () => {
    expect(isPaise(100)).toBe(true);
    expect(isPaise(-50)).toBe(true);
    expect(isPaise(10.5)).toBe(false);
    expect(isPaise('100')).toBe(false);
    expect(() => assertPaise(1.5)).toThrow(/paise/);
  });
});

describe('sumPaise', () => {
  it('adds integers and guards against floats', () => {
    expect(sumPaise([40000, 12000, 2600])).toBe(54600);
    expect(sumPaise([])).toBe(0);
    expect(() => sumPaise([100, 0.5])).toThrow();
  });
});

describe('percentOfPaise', () => {
  it('computes GST and discounts on paise', () => {
    expect(percentOfPaise(52000, 5)).toBe(2600);
    expect(percentOfPaise(52000, 10)).toBe(5200);
    expect(percentOfPaise(18000, 18)).toBe(3240);
  });
  it('supports fractional rates', () => {
    expect(percentOfPaise(10000, 2.5)).toBe(250);
    expect(percentOfPaise(99999, 2.5)).toBe(2500); // 2499.975 -> 2500
  });
  it('rounds half away from zero', () => {
    expect(percentOfPaise(10, 5)).toBe(1); // 0.5 -> 1
    expect(percentOfPaise(-10, 5)).toBe(-1);
  });
  it('handles zero', () => {
    expect(percentOfPaise(0, 18)).toBe(0);
    expect(percentOfPaise(5000, 0)).toBe(0);
  });
});

describe('roundOffToRupee', () => {
  it('rounds to the nearest rupee and reports the delta', () => {
    expect(roundOffToRupee(54649)).toEqual({ totalPaise: 54600, roundOffPaise: -49 });
    expect(roundOffToRupee(54650)).toEqual({ totalPaise: 54700, roundOffPaise: 50 });
    expect(roundOffToRupee(54600)).toEqual({ totalPaise: 54600, roundOffPaise: 0 });
  });
  it('total + roundOff invariant holds', () => {
    for (const p of [1, 49, 50, 99, 101, 12345, 999_999]) {
      const r = roundOffToRupee(p);
      expect(r.totalPaise % 100).toBe(0);
      expect(p + r.roundOffPaise).toBe(r.totalPaise);
    }
  });
});

describe('formatINR', () => {
  it('omits decimals when whole rupees', () => {
    expect(formatINR(54600)).toBe('₹546');
    expect(formatINR(0)).toBe('₹0');
  });
  it('shows 2 decimals when needed', () => {
    expect(formatINR(54650)).toBe('₹546.50');
    expect(formatINR(5)).toBe('₹0.05');
  });
  it('uses Indian digit grouping', () => {
    expect(formatINR(124000)).toBe('₹1,240');
    expect(formatINR(12345600)).toBe('₹1,23,456');
  });
});
