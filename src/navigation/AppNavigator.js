import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../utils/theme';

import Home from '../screens/Home';

// RT screens
import GeometricUnsharpness from '../screens/rt/GeometricUnsharpness';
import SourceDecay from '../screens/rt/SourceDecay';
import IQIReference from '../screens/rt/IQIReference';
import PipeSchedule from '../screens/rt/PipeSchedule';

// UT screens
import SkipDistance from '../screens/ut/SkipDistance';
import CorrosionRate from '../screens/ut/CorrosionRate';

// MT screens
import ProdAmperage from '../screens/mt/ProdAmperage';

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.background, elevation: 0, shadowOpacity: 0 },
  headerTintColor: colors.accent,
  headerTitleStyle: { color: colors.textPrimary, fontWeight: '700' },
  cardStyle: { backgroundColor: colors.background },
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={Home} options={{ title: 'NDT Nation' }} />

        {/* RT */}
        <Stack.Screen name="GeometricUnsharpness" component={GeometricUnsharpness} options={{ title: 'Geom. Unsharpness' }} />
        <Stack.Screen name="SourceDecay" component={SourceDecay} options={{ title: 'Source Decay' }} />
        <Stack.Screen name="IQIReference" component={IQIReference} options={{ title: 'IQI Reference' }} />
        <Stack.Screen name="PipeSchedule" component={PipeSchedule} options={{ title: 'Pipe Schedule' }} />

        {/* UT */}
        <Stack.Screen name="SkipDistance" component={SkipDistance} options={{ title: 'Skip Distance' }} />
        <Stack.Screen name="CorrosionRate" component={CorrosionRate} options={{ title: 'Corrosion Rate' }} />

        {/* MT */}
        <Stack.Screen name="ProdAmperage" component={ProdAmperage} options={{ title: 'MT Amperage' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
