import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import InputField from '../../components/InputField';
import ResultCard from '../../components/ResultCard';
import { calcProdAmps, calcHeadShotAmps, calcCoilAmps } from '../../utils/mtCalcs';
import { colors, spacing, fontSize } from '../../utils/theme';

const TECHNIQUES = ['Prod', 'Head Shot', 'Coil'];
const CURRENTS = ['AC', 'HWDC'];

export default function MTAmperage() {
  const [technique, setTechnique] = useState('Prod');
  const [current, setCurrent] = useState('AC');
  const [spacing_, setSpacing] = useState('');
  const [diameter, setDiameter] = useState('');
  const [turns, setTurns] = useState('4');
  const [length, setLength] = useState('');

  let result = null;
  let warning = null;

  if (technique === 'Prod') {
    const sp = parseFloat(spacing_);
    if (!isNaN(sp)) {
      const r = calcProdAmps(sp, current);
      result = r;
      warning = r.warning;
    }
  } else if (technique === 'Head Shot') {
    const d = parseFloat(diameter);
    if (!isNaN(d)) result = calcHeadShotAmps(d);
  } else if (technique === 'Coil') {
    const n = parseFloat(turns);
    const l = parseFloat(length);
    const d = parseFloat(diameter);
    if (!isNaN(n) && !isNaN(l) && !isNaN(d)) result = calcCoilAmps(n, l, d);
  }

  return (
    <ScreenWrapper title="MT Amperage" standard="ASME V Article 7 / ASTM E1444">
      <Text style={styles.label}>Technique</Text>
      <View style={styles.chips}>
        {TECHNIQUES.map(t => (
          <TouchableOpacity key={t} style={[styles.chip, technique === t && styles.chipActive]} onPress={() => setTechnique(t)}>
            <Text style={[styles.chipText, technique === t && styles.chipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {(technique === 'Prod') && (
        <>
          <View style={styles.row}>
            {CURRENTS.map(c => (
              <TouchableOpacity key={c} style={[styles.chip, current === c && styles.chipActive]} onPress={() => setCurrent(c)}>
                <Text style={[styles.chipText, current === c && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <InputField label="Prod Spacing" value={spacing_} onChangeText={setSpacing} unit="in" placeholder="6" />
        </>
      )}

      {technique === 'Head Shot' && (
        <InputField label="Part Diameter" value={diameter} onChangeText={setDiameter} unit="in" placeholder="3" />
      )}

      {technique === 'Coil' && (
        <>
          <InputField label="Number of Turns (N)" value={turns} onChangeText={setTurns} placeholder="4" />
          <InputField label="Part Length (L)" value={length} onChangeText={setLength} unit="in" placeholder="12" />
          <InputField label="Part Diameter (D)" value={diameter} onChangeText={setDiameter} unit="in" placeholder="3" />
        </>
      )}

      {warning && <Text style={styles.warning}>⚠ {warning}</Text>}

      {result?.min != null && !warning && (
        <>
          <ResultCard label="Min Amperage" value={`${result.min} A`} />
          <ResultCard label="Max Amperage" value={`${result.max} A`} highlight />
          {result.method && <ResultCard label="Method" value={result.method} />}
          {result.fillFactor != null && (
            <ResultCard label="Fill Factor (D/L)" value={result.fillFactor.toFixed(3)} note={`L/D ratio: ${result.LD.toFixed(2)}`} />
          )}
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  chipActive: { backgroundColor: colors.accentDim, borderColor: colors.accent },
  chipText: { color: colors.textSecondary, fontSize: fontSize.sm },
  chipTextActive: { color: colors.accent },
  row: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  warning: { color: colors.danger, fontSize: fontSize.sm, marginBottom: spacing.sm },
});
