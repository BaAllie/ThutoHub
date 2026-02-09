// app/child-profiles.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChildProfilesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Child Profiles</Text>
      <Text style={styles.subtitle}>Coming soon: Add learners and customize their paths 🎯</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
