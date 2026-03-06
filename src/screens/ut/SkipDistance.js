import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import InputField from '../../components/InputField';
import ResultCard from '../../components/ResultCard';
import { calcSkipDistance } from '../../utils/utCalcs';
import { colors, spacing, fontSize } from '../../utils/theme';

const COMMON_ANGLES = ['45', '60', '70'];

export default function SkipDistance() {
  const [wallThickness, setWallThickness] = useState('');
  const [angle, setAngle] = useState('45');

  const T = parseFloat(wallThickness);
  const theta = parseFloat(angle);
  const result = !isNaN(T) && !isNaN(theta) && T > 0 ? calcSkipDistance(T, theta) : null;

  return (
    <ScreenWrapper title="Skip Distance" standard="ASME V Article 4 / AWS D1.1 Annex K">
      <InputField label="Wall Thickness (T)" value={wallThickness} onChangeText={setWallThickness} unit="in" placeholder="0.5" />

      <Text style={styles.label}>Refracted Angle (θ₂)</Text>
      <View style={styles.chips}>
        {COMMON_ANGLES.map(a => (
          <TouchableOpacity
            key={a}
            style={[styles.chip, angle === a && styles.chipActive]}
            onPress={() => setAngle(a)}
          >
            <Text style={[styles.chipText, angle === a && styles.chipTextActive]}>{a}°</Text>
          </TouchableOpacity>
        ))}
      </View>
      <InputField label="Custom Angle" value={angle} onChangeText={setAngle} unit="°" placeholder="45" />

      {result && (
        <>
          <ResultCard label="Half-Skip Distance" value={result.halfSkip.toFixed(3)} unit="in" highlight note="Surface distance to first backwall reflection" />
          <ResultCard label="Full Skip Distance" value={result.fullSkip.toFixed(3)} unit="in" note="Surface distance for full V-path" />
          <ResultCard label="Half Sound Path" value={result.halfPath.toFixed(3)} unit="in" />
          <ResultCard label="Full Sound Path" value={result.fullPath.toFixed(3)} unit="in" />
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.xs },
  chips: { flexDirection: 'row', gap: 8, marginBottom: spacing.sm },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  chipActive: { backgroundColor: colors.accentDim, borderColor: colors.accent },
  chipText: { color: colors.textSecondary, fontSize: fontSize.sm },
  chipTextActive: { color: colors.accent },
});
