import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet } from 'react-native';
import Button from './Button';
import { COLORS } from '../constants/colors';

export default function EditTokenModal({ visible, onClose, onSave, initialTitle, initialVehicle, initialInfo }) {
  const [title, setTitle] = useState(initialTitle);
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [info, setInfo] = useState(initialInfo);

  useEffect(() => {
    setTitle(initialTitle);
    setVehicle(initialVehicle);
    setInfo(initialInfo);
  }, [initialTitle, initialVehicle, initialInfo]);

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed || !vehicle.trim()) return;
    const saved = await onSave({
      title: trimmed,
      vehicle_type: vehicle.trim(),
      additional_info: info.trim(),
    });
    if (saved !== false) onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Token</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter new title" autoFocus />
          <TextInput style={styles.input} value={vehicle} onChangeText={setVehicle} placeholder="Enter vehicle type" />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={info}
            onChangeText={setInfo}
            placeholder="Additional info"
            multiline
          />
          <View style={styles.buttons}>
            <Button title="Cancel" onPress={onClose} type="secondary" style={{ flex: 1, marginRight: 8 }} />
            <Button title="Save" onPress={handleSave} style={{ flex: 1, marginLeft: 8 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modal: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 20 },
  buttons: { flexDirection: 'row' },
});