// UT Calculation Logic — pure functions
// Standards: ASME Section V Article 4, AWS D1.1, API 570/510/653

// Sound velocities (in/μs) — ASTM E494
export const SOUND_VELOCITIES = {
  'Carbon Steel': { longitudinal: 0.2320, shear: 0.1250 },
  'Stainless Steel (304)': { longitudinal: 0.2260, shear: 0.1220 },
  'Aluminum': { longitudinal: 0.2510, shear: 0.1220 },
  'Copper': { longitudinal: 0.1830, shear: 0.0890 },
  'Titanium': { longitudinal: 0.2400, shear: 0.1230 },
  'Cast Iron': { longitudinal: 0.1800, shear: 0.1100 },
  'HDPE': { longitudinal: 0.0860, shear: null },
};

// Snell's Law — beam refraction
// sin(θ2) / sin(θ1) = V2 / V1
// θ1 = incident angle in wedge (Rexolite/acrylic), V1 = wedge velocity
// θ2 = refracted angle in steel, V2 = shear velocity in steel
// Rexolite wedge longitudinal velocity: 0.0917 in/μs
export const WEDGE_VELOCITY = 0.0917; // in/μs (Rexolite)

export function calcRefractedAngle(incidentAngleDeg, wedgeVelocity, materialVelocity) {
  const theta1 = (incidentAngleDeg * Math.PI) / 180;
  const sinTheta2 = (Math.sin(theta1) * materialVelocity) / wedgeVelocity;
  if (sinTheta2 > 1) return { angle: null, error: 'Total internal reflection — beam does not enter material' };
  const theta2Rad = Math.asin(sinTheta2);
  return { angle: (theta2Rad * 180) / Math.PI };
}

// Near Field (N) — ASME V Article 4
// N = D² * f / (4 * V)
// D = transducer diameter (in), f = frequency (MHz), V = velocity (in/μs)
export function calcNearField(diameter, freqMHz, velocity) {
  return (diameter * diameter * freqMHz) / (4 * velocity);
}

// Beam Spread half-angle
// sin(α) = 1.22 * V / (f * D)
export function calcBeamSpread(diameter, freqMHz, velocity) {
  const sinAlpha = (1.22 * velocity) / (freqMHz * diameter);
  if (sinAlpha > 1) return null;
  return (Math.asin(sinAlpha) * 180) / Math.PI;
}

// Skip Distance / Half-Skip — ASME V Article 4, AWS D1.1 Annex K
// Half-skip = T * tan(θ)
// Full skip = 2 * T * tan(θ)
// Surface distance (V-path): skip distance along inspection surface
export function calcSkipDistance(wallThickness, refractedAngleDeg) {
  const theta = (refractedAngleDeg * Math.PI) / 180;
  const halfSkip = wallThickness * Math.tan(theta);
  const fullSkip = 2 * halfSkip;
  const halfPath = wallThickness / Math.cos(theta); // beam path to backwall
  const fullPath = 2 * halfPath;
  return { halfSkip, fullSkip, halfPath, fullPath };
}

// dB Gain
// dB = 20 * log10(A1/A2)
export function calcDB(amplitude1, amplitude2) {
  if (amplitude2 === 0) return null;
  return 20 * Math.log10(amplitude1 / amplitude2);
}

// Amplitude ratio from dB
export function calcAmplitudeRatio(dB) {
  return Math.pow(10, dB / 20);
}

// Corrosion Rate + Remaining Life — API 570 Section 7.1 / API 510 Section 7.5
// Short-term CR: (t_prev - t_current) / years_between
// Long-term CR: (t_initial - t_current) / total_years
// Remaining Life: (t_actual - t_required) / CR
// Next inspection: min(RL/2, API max interval)
export function calcCorrosionRate(tPrev, tCurrent, yearsBetween) {
  if (yearsBetween <= 0) return null;
  return (tPrev - tCurrent) / yearsBetween;
}

export function calcRemainingLife(tActual, tRequired, corrosionRate) {
  if (corrosionRate <= 0) return Infinity;
  return (tActual - tRequired) / corrosionRate;
}

export function calcNextInspection(remainingLife, maxInterval = 10) {
  return Math.min(remainingLife / 2, maxInterval);
}

// Minimum Required Thickness — ASME B31.3 / B31.4 hoop stress
// t_min = (P * D) / (2 * S * E + 2 * P * Y)
// P = design pressure (psi), D = OD (in), S = allowable stress (psi), E = joint efficiency, Y = temperature coefficient (0.4 for T<900°F)
export function calcMinWallThickness(pressure, OD, allowableStress, jointEfficiency = 1.0, Y = 0.4) {
  const tMin = (pressure * OD) / (2 * allowableStress * jointEfficiency + 2 * pressure * Y);
  return tMin;
}
