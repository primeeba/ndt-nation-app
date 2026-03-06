import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import ResultCard from '../../components/ResultCard';
import { PIPE_SCHEDULES } from '../../utils/rtCalcs';
import { colors, spacing, fontSize } from '../../utils/theme';

const NOMINAL_SIZES = Object.keys(PIPE_SCHEDULES);

// OD lookup per ASME B36.10
const PIPE_OD = {
  '0.5': 0.840, '0.75': 1.050, '1': 1.315, '1.25': 1.660,
  '1.5': 1.900, '2': 2.375, '2.5': 2.875, '3': 3.500,
  '4': 4.500, '6': 6.625, '8': 8.625, '10': 10.750,
  '12': 12.750, '16': 16.000, '18': 18.000, '20': 20.000, '24': 24.000,
};

export default function PipeSchedule() {
  const [selectedSize, setSelectedSize] = useState('6');

  const schedules = PIPE_SCHEDULES[selectedSize] || {};
  const OD = PIPE_OD[selectedSize];

  return (
    <ScreenWrapper title="Pipe Schedule Reference" standard="ASME B36.10 / B36.19">
      <Text style={styles.label}>Nominal Pipe Size (NPS)</Text>
      <View style={styles.chips}>
        {NOMINAL_SIZES.map(size => (
          <TouchableOpacity
            key={size}
            style={[styles.chip, selectedSize === size && styles.chipActive]}
            onPress={() => setSelectedSize(size)}
          >
            <Text style={[styles.chipText, selectedSize === size && styles.chipTextActive]}>{size}"</Text>
          </TouchableOpacity>
        ))}
      </View>

      {OD && <ResultCard label="Outside Diameter (OD)" value={`${OD}"`} highlight />}

      <Text style={styles.sectionTitle}>Wall Thickness by Schedule</Text>
      {Object.entries(schedules).map(([sch, wall]) => (
        <ResultCard key={sch} label={`Schedule ${sch}`} value={`${wall}"`} note={`${(wall * 25.4).toFixed(2)} mm`} />
      ))}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  chipActive: { backgroundColor: colors.accentDim, borderColor: colors.accent },
  chipText: { color: colors.textSecondary, fontSize: fontSize.sm },
  chipTextActive: { color: colors.accent },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '600', marginBottom: spacing.sm },
});
