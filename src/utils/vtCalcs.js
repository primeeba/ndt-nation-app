// VT Calculation Logic — pure functions
// Standards: AWS D1.1, ASME Section IX, API 1104

// Fillet weld effective throat
// For equal leg fillet: Throat = 0.707 * leg_size
// AWS D1.1 Table 4.5 / ASME IX QW-196
export function calcFilletThroat(legSize) {
  return 0.707 * legSize;
}

// Minimum fillet weld size by base metal thickness
// AWS D1.1 Table 5.8
export function minFilletWeldSize(basemetalThickness) {
  if (basemetalThickness <= 0.25) return 0.125;   // 1/8"
  if (basemetalThickness <= 0.5) return 0.1875;   // 3/16"
  if (basemetalThickness <= 0.75) return 0.25;    // 1/4"
  return 0.3125; // 5/16" for > 3/4"
}

// Porosity acceptance — AWS D1.1 Table 6.1
// Individual pore > 3/32" is rejectable
// Aggregate porosity > 3/8" per linear inch is rejectable
export function checkPorosityAWS(poresDiameters, linearInch = 1) {
  const MAX_INDIVIDUAL = 3 / 32; // 0.09375"
  const MAX_AGGREGATE = 3 / 8;  // 0.375" per lin inch

  const oversized = poresDiameters.filter(d => d > MAX_INDIVIDUAL);
  const aggregate = poresDiameters.reduce((sum, d) => sum + d, 0);
  const aggregatePerInch = aggregate / linearInch;

  return {
    accept: oversized.length === 0 && aggregatePerInch <= MAX_AGGREGATE,
    oversizedPores: oversized.length,
    aggregatePerInch: aggregatePerInch.toFixed(4),
    maxAggregate: MAX_AGGREGATE,
    maxIndividual: MAX_INDIVIDUAL,
  };
}

// Undercut depth limits
// AWS D1.1: max 1/32" (0.03125") for primary members, 1/16" (0.0625") for secondary
// API 1104: max 1/32" depth, max 2" length in any 12" of weld
export function checkUndercut(depth, member = 'primary') {
  const limits = {
    primary: 0.03125,
    secondary: 0.0625,
  };
  const limit = limits[member] || limits.primary;
  return {
    accept: depth <= limit,
    depth,
    limit,
    standard: 'AWS D1.1 Clause 6.9',
  };
}
