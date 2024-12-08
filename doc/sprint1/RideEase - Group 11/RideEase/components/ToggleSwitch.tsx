import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

interface ToggleSwitchProps {
  label: string;
  value: boolean;
  onValueChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}: {value ? 'Online' : 'Offline'}</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 18,
    color: '#333333',
  },
});

export default ToggleSwitch;
