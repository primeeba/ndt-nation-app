import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import InputField from '../../components/InputField';
import ResultCard from '../../components/ResultCard';
import { selectWireIQI, PIPE_SCHEDULES } from '../../utils/rtCalcs';
import { colors, spacing, fontSize } from '../../utils/theme';

export default function IQIReference() {
  const [wallThickness, setWallThickness] = useState('');

  const wall = parseFloat(wallThickness);
  const result = !isNaN(wall) && wall > 0 ? selectWireIQI(wall) : null;

  return (
    <ScreenWrapper title="IQI / Wire Selection" standard="ASTM E747 / ASME V T-276">
      <InputField
        label="Wall Thickness / Material Thickness"
        value={wallThickness}
        onChangeText={setWallThickness}
        unit="in"
        placeholder="0.5"
      />

      {result && (
        <>
          <ResultCard label="Essential Wire" value={`Wire #${result.essential}`} highlight note="Must be visible on radiograph" />
          <ResultCard label="2T Wire" value={`Wire #${result.twoT}`} note="For 2T sensitivity" />
          <Text style={styles.note}>
            Per ASTM E747 Table 1 / ASME V T-276{'\n'}
            Essential wire diameter must be visible in the IQI image area.{'\n'}
            IQI placed on source side unless impractical.
          </Text>
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  note: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.md, lineHeight: 20 },
});
