/**
 * Telemetry Safety & Formatting Utility for ENERGENIUS
 * Enforces STRICT 5-digit maximum total display limit and realistic physical bounds.
 */

export function safeNumber(val: any, fallback = 0, min = -9999, max = 9999): number {
  if (val === null || val === undefined || typeof val !== 'number' || isNaN(val) || !isFinite(val)) {
    return fallback;
  }
  return Math.max(min, Math.min(max, val));
}

/**
 * Format a number to at most 5 digits total (digits before + digits after decimal point)
 */
export function format5DigitMax(num: number, maxDecimals = 2): string {
  const safe = safeNumber(num);
  const abs = Math.abs(safe);

  let decimals = maxDecimals;
  if (abs >= 1000) {
    decimals = 0; // e.g. 1347 -> 4 digits total
  } else if (abs >= 100) {
    decimals = 1; // e.g. 124.5 -> 4 digits total
  } else if (abs >= 10) {
    decimals = 2; // e.g. 12.45 -> 4 digits total
  } else {
    decimals = 2; // e.g. 2.84 -> 3 digits total
  }

  const formatted = safe.toFixed(decimals);
  
  // Guard string representation so total digit count (excluding '-' and '.') <= 5
  const rawDigits = formatted.replace('-', '').replace('.', '');
  if (rawDigits.length > 5) {
    const intPart = Math.trunc(safe);
    return intPart.toString().slice(0, 5);
  }

  return formatted;
}

export function formatVoltage(v: number): string {
  const safe = safeNumber(v, 3.30, 0, 5.0);
  return format5DigitMax(safe, 2);
}

export function formatCurrent(iMa: number): string {
  const safe = safeNumber(iMa, 12.5, 0, 50.0);
  return format5DigitMax(safe, 2);
}

export function formatPower(pMw: number): string {
  const safe = safeNumber(pMw, 35.0, 0, 999.0);
  return format5DigitMax(safe, 2);
}

export function formatEnergy(eWh: number): string {
  const safe = safeNumber(eWh, 2.84, 0, 9999);
  return format5DigitMax(safe, 2);
}

export function formatBalance(bWh: number): string {
  const safe = safeNumber(bWh, 1.53, -9999, 9999);
  const formatted = format5DigitMax(Math.abs(safe), 2);
  return safe >= 0 ? `+${formatted}` : `-${formatted}`;
}

export function formatLux(lux: number): string {
  const safe = safeNumber(lux, 500, 100, 1000);
  return format5DigitMax(safe, 1);
}

export function formatCredits(ec: number): string {
  const safe = Math.round(safeNumber(ec, 1315, 0, 9999));
  return safe.toString();
}

export function formatSoC(soc: number): string {
  const safe = safeNumber(soc, 68, 0, 100);
  return format5DigitMax(safe, 0);
}
