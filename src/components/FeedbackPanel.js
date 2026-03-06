import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Animated, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { submitFeedback, getFeedback } from '../utils/supabase';
import { colors, spacing, fontSize } from '../utils/theme';

export default function FeedbackPanel({ calculatorId, visible, onClose }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 1 : 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
    if (visible) loadComments();
  }, [visible]);

  async function loadComments() {
    setLoading(true);
    const { data } = await getFeedback(calculatorId);
    if (data) setComments(data);
    setLoading(false);
  }

  async function handleSubmit() {
    if (!input.trim()) return;
    setSubmitting(true);
    const { error } = await submitFeedback(calculatorId, input.trim());
    if (!error) {
      setInput('');
      await loadComments();
    }
    setSubmitting(false);
  }

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <Animated.View style={[styles.panel, { transform: [{ translateY }] }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Feedback</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginVertical: 20 }} />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(_, i) => i.toString()}
            style={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>No feedback yet. Be the first.</Text>}
            renderItem={({ item }) => (
              <View style={styles.bubble}>
                <Text style={styles.comment}>{item.comment}</Text>
                <Text style={styles.time}>
                  {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            )}
          />
        )}

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Add feedback..."
              placeholderTextColor={colors.textMuted}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSubmit} disabled={submitting}>
              <Text style={styles.sendText}>{submitting ? '...' : '↑'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, zIndex: 100, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  panel: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: '700' },
  close: { color: colors.textMuted, fontSize: 18, padding: 4 },
  list: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  empty: { color: colors.textMuted, fontSize: fontSize.sm, textAlign: 'center', marginTop: 20 },
  bubble: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  comment: { color: colors.textPrimary, fontSize: fontSize.md, lineHeight: 22 },
  time: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: fontSize.md,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: colors.background, fontSize: 18, fontWeight: '700' },
});
