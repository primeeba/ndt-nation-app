import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import InputField from '../../components/InputField';
import ResultCard from '../../components/ResultCard';
import { calcDecay, ISOTOPE_HALF_LIVES } from '../../utils/rtCalcs';
import { colors, spacing, fontSize } from '../../utils/theme';

const ISOTOPES = Object.keys(ISOTOPE_HALF_LIVES);

export default function SourceDecay() {
  const [initialActivity, setInitialActivity] = useState('');
  const [days, setDays] = useState('');
  const [selectedIsotope, setSelectedIsotope] = useState('Ir-192');

  const A0 = parseFloat(initialActivity);
  const t = parseFloat(days);
  const currentActivity = !isNaN(A0) && !isNaN(t) ? calcDecay(A0, selectedIsotope, t) : null;
  const percentRemaining = currentActivity != null ? (currentActivity / A0) * 100 : null;

  return (
    <ScreenWrapper title="Source Decay" standard="A(t) = A₀ × (½)^(t/t½)">
      <Text style={styles.label}>Isotope</Text>
      <View style={styles.isotopes}>
        {ISOTOPES.map(iso => (
          <TouchableOpacity
            key={iso}
            style={[styles.chip, selectedIsotope === iso && styles.chipActive]}
            onPress={() => setSelectedIsotope(iso)}
          >
            <Text style={[styles.chipText, selectedIsotope === iso && styles.chipTextActive]}>{iso}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ResultCard
        label="Half-life"
        value={`${ISOTOPE_HALF_LIVES[selectedIsotope]} days`}
        note={`(${(ISOTOPE_HALF_LIVES[selectedIsotope] / 30.44).toFixed(1)} months)`}
      />

      <InputField label="Initial Activity (A₀)" value={initialActivity} onChangeText={setInitialActivity} unit="Ci" placeholder="100" />
      <InputField label="Days Since Calibration" value={days} onChangeText={setDays} unit="days" placeholder="30" />

      {currentActivity != null && (
        <>
          <ResultCard label="Current Activity" value={currentActivity.toFixed(2)} unit="Ci" highlight />
          <ResultCard label="Remaining" value={`${percentRemaining.toFixed(1)}%`} />
          <ResultCard label="Activity Lost" value={(A0 - currentActivity).toFixed(2)} unit="Ci" />
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.xs },
  isotopes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  chip: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  chipActive: { backgroundColor: colors.accentDim, borderColor: colors.accent },
  chipText: { color: colors.textSecondary, fontSize: fontSize.sm },
  chipTextActive: { color: colors.accent },
});
