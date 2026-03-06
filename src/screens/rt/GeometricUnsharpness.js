import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import InputField from '../../components/InputField';
import ResultCard from '../../components/ResultCard';
import { calcUg, calcMinSFD, ugLimit, API1104_UG_LIMIT } from '../../utils/rtCalcs';
import { colors, spacing, fontSize } from '../../utils/theme';

export default function GeometricUnsharpness() {
  const [sourceSize, setSourceSize] = useState('');
  const [SFD, setSFD] = useState('');
  const [OFD, setOFD] = useState('');
  const [useAPI, setUseAPI] = useState(false);
  const [wallThickness, setWallThickness] = useState('');

  const F = parseFloat(sourceSize);
  const sfd = parseFloat(SFD);
  const ofd = parseFloat(OFD);
  const wall = parseFloat(wallThickness);

  const result = !isNaN(F) && !isNaN(sfd) && !isNaN(ofd) ? calcUg(F, sfd, ofd) : null;
  const limit = useAPI ? API1104_UG_LIMIT : (!isNaN(wall) ? ugLimit(wall) : 0.020);
  const minSFD = !isNaN(F) && !isNaN(ofd) ? calcMinSFD(F, ofd, limit) : null;

  const ugPass = result?.ug != null ? result.ug <= limit : null;

  return (
    <ScreenWrapper title="Geometric Unsharpness" standard="ASME V T-274 / API 1104 21st Ed">
      <View style={styles.row}>
        <Text style={styles.switchLabel}>Use API 1104 (0.020" fixed limit)</Text>
        <Switch
          value={useAPI}
          onValueChange={setUseAPI}
          trackColor={{ false: colors.border, true: colors.accentDim }}
          thumbColor={useAPI ? colors.accent : colors.textMuted}
        />
      </View>

      <InputField label="Source Size (F)" value={sourceSize} onChangeText={setSourceSize} unit="in" placeholder="0.08" />
      <InputField label="Source-to-Film Distance (SFD)" value={SFD} onChangeText={setSFD} unit="in" placeholder="30" />
      <InputField label="Object-to-Film Distance (OFD)" value={OFD} onChangeText={setOFD} unit="in" placeholder="0.5" />
      {!useAPI && (
        <InputField label="Wall Thickness (for ASME limit)" value={wallThickness} onChangeText={setWallThickness} unit="in" placeholder="0.5" />
      )}

      {result?.error && <Text style={styles.error}>{result.error}</Text>}

      {result?.ug != null && (
        <>
          <ResultCard label="Ug" value={result.ug.toFixed(4)} unit="in" highlight={true} />
          <ResultCard
            label="Code Limit"
            value={`≤ ${limit.toFixed(3)}`}
            unit="in"
            note={useAPI ? 'API 1104 21st Ed' : 'ASME V T-274.2'}
          />
          <ResultCard
            label="Result"
            value={ugPass ? '✓ ACCEPT' : '✗ REJECT'}
            note={ugPass ? `Ug is within limit` : `Ug ${result.ug.toFixed(4)} exceeds limit ${limit.toFixed(3)}`}
          />
          {minSFD != null && (
            <ResultCard label="Minimum SFD" value={minSFD.toFixed(2)} unit="in" note="For current source size and OFD at code limit" />
          )}
        </>
      )}

      <Text style={styles.note}>
        For DWE: OFD = full pipe OD (source outside pipe, film on far wall)
        {'\n'}SOD (source-to-object): {result?.SOD?.toFixed(2) ?? '—'} in
      </Text>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  switchLabel: { color: colors.textSecondary, fontSize: fontSize.sm, flex: 1 },
  error: { color: colors.danger, fontSize: fontSize.sm, marginBottom: spacing.sm },
  note: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.md, lineHeight: 20 },
});
