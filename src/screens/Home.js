import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { colors, spacing, fontSize } from '../utils/theme';

const CATEGORIES = [
  {
    id: 'rt',
    label: 'RT',
    title: 'Radiographic Testing',
    color: '#ef4444',
    tools: [
      { key: 'GeometricUnsharpness', label: 'Geometric Unsharpness (Ug)', standard: 'ASME V T-274' },
      { key: 'SourceDecay', label: 'Source Decay', standard: 'A(t) = A₀(½)^t/t½' },
      { key: 'IQIReference', label: 'IQI / Wire Selection', standard: 'ASTM E747' },
      { key: 'PipeSchedule', label: 'Pipe Schedule Reference', standard: 'ASME B36.10' },
      { key: 'ExposureTime', label: 'Exposure Time', standard: 'Inverse Square Law' },
      { key: 'Barricade', label: 'Barricade Distance', standard: '10 CFR 34' },
      { key: 'ExposureCorrection', label: 'Exposure Correction', standard: 'Inverse Square Law' },
      { key: 'FilmDevelopment', label: 'Film Development', standard: 'Time-Temp' },
      { key: 'FilmInterpretation', label: 'Film Interpretation', standard: 'ASME V / API 1104' },
      { key: 'RFactors', label: 'R Factors', standard: 'Radiographic Equivalence' },
    ],
  },
  {
    id: 'ut',
    label: 'UT',
    title: 'Ultrasonic Testing',
    color: '#3b82f6',
    tools: [
      { key: 'SkipDistance', label: 'Skip / Half-Skip Distance', standard: 'ASME V Article 4' },
      { key: 'CorrosionRate', label: 'Corrosion Rate & Remaining Life', standard: 'API 570 / 510' },
      { key: 'SnellsLaw', label: "Snell's Law (Beam Angle)", standard: 'ASME V Article 4' },
      { key: 'NearField', label: 'Near Field / Dead Zone', standard: 'ASME V Article 4' },
      { key: 'DBGain', label: 'dB Gain Calculator', standard: '20·log(A1/A2)' },
      { key: 'SoundVelocity', label: 'Sound Velocity Reference', standard: 'ASTM E494' },
    ],
  },
  {
    id: 'mt',
    label: 'MT',
    title: 'Magnetic Particle Testing',
    color: '#f59e0b',
    tools: [
      { key: 'ProdAmperage', label: 'MT Amperage (Prod / Head / Coil)', standard: 'ASTM E1444' },
      { key: 'YokeLift', label: 'Yoke Lift Reference', standard: 'ASTM E1444 / E3024' },
    ],
  },
  {
    id: 'pt',
    label: 'PT',
    title: 'Liquid Penetrant Testing',
    color: '#22c55e',
    tools: [
      { key: 'DwellTime', label: 'Dwell Time Timer', standard: 'ASME V Article 6' },
    ],
  },
  {
    id: 'vt',
    label: 'VT',
    title: 'Visual Testing',
    color: '#a855f7',
    tools: [
      { key: 'FilletWeld', label: 'Fillet Weld Throat', standard: 'AWS D1.1 / ASME IX' },
    ],
  },
];

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.appTitle}>NDT Nation</Text>
        <Text style={styles.appSubtitle}>Field Calculator Suite</Text>

        {CATEGORIES.map(cat => (
          <View key={cat.id} style={styles.category}>
            <View style={styles.catHeader}>
              <View style={[styles.badge, { backgroundColor: cat.color + '33' }]}>
                <Text style={[styles.badgeText, { color: cat.color }]}>{cat.label}</Text>
              </View>
              <Text style={styles.catTitle}>{cat.title}</Text>
            </View>
            {cat.tools.map(tool => (
              <TouchableOpacity
                key={tool.key}
                style={styles.toolCard}
                onPress={() => navigation.navigate(tool.key)}
                activeOpacity={0.7}
              >
                <Text style={styles.toolLabel}>{tool.label}</Text>
                <Text style={styles.toolStandard}>{tool.standard}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: 40 },
  appTitle: { color: colors.accent, fontSize: 28, fontWeight: '800', letterSpacing: 1 },
  appSubtitle: { color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.lg },
  category: { marginBottom: spacing.lg },
  catHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  badge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3, marginRight: spacing.sm },
  badgeText: { fontWeight: '700', fontSize: fontSize.sm },
  catTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '600' },
  toolCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  toolLabel: { color: colors.textPrimary, fontSize: fontSize.md },
  toolStandard: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: 2 },
});
