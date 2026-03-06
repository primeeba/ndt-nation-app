import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../utils/theme';

export default function ResultCard({ label, value, unit, highlight, note }) {
  return (
    <View style={[styles.card, highlight && styles.cardHighlight]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, highlight && styles.valueHighlight]}>
        {value} {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardHighlight: {
    borderColor: colors.accent,
    backgroundColor: '#0c2a30',
  },
  label: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: 4 },
  value: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: '700' },
  valueHighlight: { color: colors.accent },
  unit: { color: colors.textSecondary, fontSize: fontSize.md, fontWeight: '400' },
  note: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: 4 },
});
