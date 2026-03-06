// MT Calculation Logic — pure functions
// Standards: ASME Section V Article 7, ASTM E1444

// Head Shot (direct contact) amperage
// ASME V T-764 / ASTM E1444: 300-800 amps/inch of diameter
// For low permeability materials (austenitic SS): up to 1000 amps/inch
export function calcHeadShotAmps(diameterInches, lowPermeability = false) {
  const minFactor = 300;
  const maxFactor = lowPermeability ? 1000 : 800;
  return {
    min: Math.round(minFactor * diameterInches),
    max: Math.round(maxFactor * diameterInches),
  };
}

// Prod Technique amperage
// ASME V T-764.1 / ASTM E1444 Section 11
// AC: 100-125 amps/inch of prod spacing
// HWDC: 90-110 amps/inch
// Max prod spacing: 8 inches
export function calcProdAmps(prodSpacingInches, current = 'AC') {
  if (prodSpacingInches > 8) {
    return { min: null, max: null, warning: 'Prod spacing exceeds 8" maximum per ASTM E1444' };
  }
  const ranges = {
    AC: { min: 100, max: 125 },
    HWDC: { min: 90, max: 110 },
  };
  const r = ranges[current] || ranges.AC;
  return {
    min: Math.round(r.min * prodSpacingInches),
    max: Math.round(r.max * prodSpacingInches),
  };
}

// Coil Shot — Longitudinal magnetization
// ASME V T-764.3 / ASTM E1444
// Required NI (amp-turns): 35,000–45,000
// Low fill factor (D/L < 1/3): I = 45000 / (N * L/D)
// High fill factor (D/L >= 1/3): use NI required / N
export function calcCoilAmps(turns, partLengthInches, partDiameterInches) {
  const fillFactor = partDiameterInches / partLengthInches;
  const LD = partLengthInches / partDiameterInches;
  let minAmps, maxAmps, method;

  if (fillFactor < 1/3) {
    // Low fill factor formula
    minAmps = Math.round(35000 / (turns * LD));
    maxAmps = Math.round(45000 / (turns * LD));
    method = 'Low fill factor (D/L < 1/3)';
  } else {
    // High fill factor: NI = 35000–45000
    minAmps = Math.round(35000 / turns);
    maxAmps = Math.round(45000 / turns);
    method = 'High fill factor (D/L ≥ 1/3)';
  }

  return { minAmps, maxAmps, fillFactor, LD, method };
}

// Yoke lift requirements — ASTM E1444 / E3024
export const YOKE_LIFT_REQUIREMENTS = {
  'AC Yoke': { minLiftLbs: 10, minLiftKg: 4.5, note: 'At maximum pole spacing' },
  'DC Yoke (100mm spacing)': { minLiftLbs: 30, minLiftKg: 13.5 },
  'DC Yoke (150mm spacing)': { minLiftLbs: 50, minLiftKg: 22.5 },
  'Battery-Powered Permanent Magnet': { minLiftLbs: 10, minLiftKg: 4.5 },
};
