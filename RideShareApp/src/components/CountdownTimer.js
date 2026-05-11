import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function CountdownTimer({ createdAt, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const created = new Date(createdAt);
    const now = new Date();
    const elapsed = (now - created) / 1000;
    let remaining = Math.max(120 - elapsed, 0);
    setTimeLeft(remaining);
    setEditable(remaining === 0);
    if (remaining === 0 && onComplete) onComplete();

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setEditable(true);
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>⏳ Edit available in</Text>
      <Text style={[styles.timer, editable && styles.editable]}>
        {editable ? '✓ Ready to edit' : `${minutes}:${seconds.toString().padStart(2, '0')}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 12 },
  label: { fontSize: 14, color: COLORS.gray },
  timer: { fontSize: 28, fontWeight: 'bold', color: COLORS.warning },
  editable: { color: COLORS.success },
});