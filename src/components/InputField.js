import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../utils/theme';

export default function InputField({ label, value, onChangeText, placeholder, unit }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}{unit ? <Text style={styles.unit}> ({unit})</Text> : null}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || '0'}
        placeholderTextColor={colors.textMuted}
        keyboardType="decimal-pad"
        returnKeyType="done"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.xs },
  unit: { color: colors.textMuted, fontSize: fontSize.sm },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.textPrimary,
    fontSize: fontSize.md,
  },
});
