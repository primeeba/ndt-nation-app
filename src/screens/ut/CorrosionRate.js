import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../../components/ScreenWrapper';
import InputField from '../../components/InputField';
import ResultCard from '../../components/ResultCard';
import { calcCorrosionRate, calcRemainingLife, calcNextInspection } from '../../utils/utCalcs';
import { colors, spacing, fontSize } from '../../utils/theme';

export default function CorrosionRate() {
  const [tPrev, setTPrev] = useState('');
  const [tCurrent, setTCurrent] = useState('');
  const [yearsBetween, setYearsBetween] = useState('');
  const [tRequired, setTRequired] = useState('');
  const [maxInterval, setMaxInterval] = useState('10');

  const prev = parseFloat(tPrev);
  const curr = parseFloat(tCurrent);
  const yrs = parseFloat(yearsBetween);
  const req = parseFloat(tRequired);
  const maxInt = parseFloat(maxInterval) || 10;

  const CR = !isNaN(prev) && !isNaN(curr) && !isNaN(yrs) ? calcCorrosionRate(prev, curr, yrs) : null;
  const RL = CR != null && !isNaN(req) ? calcRemainingLife(curr, req, CR) : null;
  const nextInsp = RL != null ? calcNextInspection(RL, maxInt) : null;

  return (
    <ScreenWrapper title="Corrosion Rate & Remaining Life" standard="API 570 Section 7.1 / API 510 Section 7.5">
      <InputField label="Previous Thickness (t₁)" value={tPrev} onChangeText={setTPrev} unit="in" placeholder="0.500" />
      <InputField label="Current Thickness (t₂)" value={tCurrent} onChangeText={setTCurrent} unit="in" placeholder="0.475" />
      <InputField label="Years Between Readings" value={yearsBetween} onChangeText={setYearsBetween} unit="years" placeholder="2" />
      <InputField label="Required Minimum Thickness (t_min)" value={tRequired} onChangeText={setTRequired} unit="in" placeholder="0.300" />
      <InputField label="Max Inspection Interval" value={maxInterval} onChangeText={setMaxInterval} unit="years" placeholder="10" />

      {CR != null && (
        <>
          <ResultCard label="Corrosion Rate" value={CR.toFixed(4)} unit="in/yr" highlight />
          {RL != null && (
            <>
              <ResultCard
                label="Remaining Life"
                value={isFinite(RL) ? `${RL.toFixed(1)} years` : '∞'}
                note={`At current rate reaching t_min in ${isFinite(RL) ? RL.toFixed(1) : '∞'} years`}
              />
              {nextInsp != null && (
                <ResultCard
                  label="Next Inspection Due"
                  value={`${nextInsp.toFixed(1)} years`}
                  note={`= min(RL/2, ${maxInt} yr max interval) per API 570`}
                  highlight
                />
              )}
            </>
          )}
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({});
