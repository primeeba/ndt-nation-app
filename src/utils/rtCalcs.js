// RT Calculation Logic — pure functions, no UI
// Standards: ASME Section V Article 2, API 1104 21st Ed, ASTM E1742

// --- Geometric Unsharpness ---
// ASME V T-274: Ug = F * b / a
// F = source size, b = OFD (object-to-film), a = source-to-object distance
// For DWE: OFD = full pipe OD (source outside pipe, film on far side)
export function calcUg(sourceSize, SFD, OFD) {
  const SOD = SFD - OFD;
  if (SOD <= 0) return { ug: null, error: 'OFD must be less than SFD' };
  const ug = (sourceSize * OFD) / SOD;
  return { ug, SOD };
}

// ASME V T-274.2 Ug limits by wall thickness (inches)
export function ugLimit(wallThickness) {
  if (wallThickness <= 2) return 0.020;
  if (wallThickness <= 3) return 0.030;
  if (wallThickness <= 4) return 0.040;
  return 0.070;
}

// API 1104 21st Ed: flat 0.020" for all pipeline thicknesses
export const API1104_UG_LIMIT = 0.020;

// Min SFD: SFD_min = OFD * (F / Ug_max + 1)
export function calcMinSFD(sourceSize, OFD, ugMax = 0.020) {
  return OFD * (sourceSize / ugMax + 1);
}

// --- Source Decay ---
// A(t) = A0 * (1/2)^(t/t½)
// Half-lives (days): Ir-192: 73.83, Se-75: 119.78, Co-60: 1925.5, Yb-169: 32.01
export const ISOTOPE_HALF_LIVES = {
  'Ir-192': 73.83,
  'Se-75': 119.78,
  'Co-60': 1925.5,
  'Yb-169': 32.01,
  'Tm-170': 128.6,
};

export function calcDecay(initialActivity, isotope, daysSince) {
  const t12 = ISOTOPE_HALF_LIVES[isotope];
  if (!t12) return null;
  return initialActivity * Math.pow(0.5, daysSince / t12);
}

// --- Exposure Time Correction ---
// Inverse square law: T2 = T1 * (SFD2/SFD1)^2 * (Activity1/Activity2)
export function calcExposureCorrection(T1, SFD1, SFD2, A1, A2) {
  return T1 * Math.pow(SFD2 / SFD1, 2) * (A1 / A2);
}

// --- Barricade Distance ---
// Safe distance: D = D_ref * sqrt(doseRate_ref / doseLimit)
// NRC 10 CFR 20: 2 mR/hr controlled area, 0.1 mR/hr uncontrolled
export function calcBarricadeDistance(activityCi, distanceRef, doseRateAtRef, doseLimit = 2) {
  return distanceRef * Math.sqrt(doseRateAtRef / doseLimit);
}

// --- IQI Selection (wire type) ---
// ASTM E747 / ASME V T-276 wire diameter selection by material thickness
// Returns [essential wire, 2T wire designations]
export function selectWireIQI(wallThickness) {
  // ASTM E747 Table 1 — wire sets A/B/C/D
  const table = [
    { maxT: 0.25, essential: '4', twoT: '6' },
    { maxT: 0.375, essential: '5', twoT: '7' },
    { maxT: 0.5, essential: '6', twoT: '8' },
    { maxT: 0.75, essential: '7', twoT: '9' },
    { maxT: 1.0, essential: '8', twoT: '10' },
    { maxT: 1.5, essential: '9', twoT: '11' },
    { maxT: 2.0, essential: '10', twoT: '12' },
    { maxT: 2.5, essential: '11', twoT: '13' },
    { maxT: 4.0, essential: '12', twoT: '14' },
    { maxT: 6.0, essential: '13', twoT: '15' },
    { maxT: 8.0, essential: '14', twoT: '16' },
  ];
  for (const row of table) {
    if (wallThickness <= row.maxT) return row;
  }
  return { essential: '14', twoT: '16' };
}

// --- ASME B36.10 Pipe Schedule → Wall Thickness lookup ---
export const PIPE_SCHEDULES = {
  '0.5': { '40': 0.109, '80': 0.147, '160': 0.188, 'XXS': 0.294 },
  '0.75': { '40': 0.113, '80': 0.154, '160': 0.219, 'XXS': 0.308 },
  '1': { '40': 0.133, '80': 0.179, '160': 0.250, 'XXS': 0.358 },
  '1.25': { '40': 0.140, '80': 0.191, '160': 0.250, 'XXS': 0.382 },
  '1.5': { '40': 0.145, '80': 0.200, '160': 0.281, 'XXS': 0.400 },
  '2': { '40': 0.154, '80': 0.218, '160': 0.344, 'XXS': 0.436 },
  '2.5': { '40': 0.203, '80': 0.276, '160': 0.375, 'XXS': 0.552 },
  '3': { '40': 0.216, '80': 0.300, '160': 0.438, 'XXS': 0.600 },
  '4': { '40': 0.237, '80': 0.337, '120': 0.438, '160': 0.531, 'XXS': 0.674 },
  '6': { '40': 0.280, '80': 0.432, '120': 0.562, '160': 0.719, 'XXS': 0.864 },
  '8': { '40': 0.322, '80': 0.500, '120': 0.594, '160': 0.719, 'XXS': 0.875 },
  '10': { '40': 0.365, '60': 0.500, '80': 0.594, '100': 0.719, '120': 0.844, '160': 1.000 },
  '12': { '40': 0.406, '60': 0.562, '80': 0.688, '100': 0.844, '120': 1.000, '160': 1.125 },
  '16': { '40': 0.500, '60': 0.656, '80': 0.844, '100': 1.031, '120': 1.219, '160': 1.438 },
  '18': { '40': 0.562, '60': 0.750, '80': 0.938, '100': 1.156, '120': 1.375, '160': 1.562 },
  '20': { '40': 0.594, '60': 0.812, '80': 1.031, '100': 1.281, '120': 1.500, '160': 1.750 },
  '24': { '40': 0.688, '60': 0.969, '80': 1.219, '100': 1.531, '120': 1.812, '160': 2.062 },
};
