import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, fontSize } from '../utils/theme';

export default function ScreenWrapper({ title, standard, children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{title}</Text>
        {standard ? <Text style={styles.standard}>{standard}</Text> : null}
        <View style={styles.divider} />
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 40 },
  title: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: '700', marginBottom: 4 },
  standard: { color: colors.accentDim, fontSize: fontSize.sm },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
});
