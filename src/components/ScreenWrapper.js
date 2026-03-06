import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, fontSize } from '../utils/theme';
import FeedbackPanel from './FeedbackPanel';

export default function ScreenWrapper({ title, standard, calculatorId, children }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const id = calculatorId || title.toLowerCase().replace(/\s+/g, '_');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{title}</Text>
        {standard ? <Text style={styles.standard}>{standard}</Text> : null}
        <View style={styles.divider} />
        {children}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Feedback button */}
      <TouchableOpacity style={styles.feedbackBtn} onPress={() => setShowFeedback(true)}>
        <Text style={styles.feedbackIcon}>💬</Text>
        <Text style={styles.feedbackLabel}>Feedback</Text>
      </TouchableOpacity>

      <FeedbackPanel
        calculatorId={id}
        visible={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
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
  feedbackBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: colors.accent,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  feedbackIcon: { fontSize: 16, marginRight: 6 },
  feedbackLabel: { color: colors.background, fontWeight: '700', fontSize: fontSize.sm },
});
