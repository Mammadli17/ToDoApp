import React, { useState } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { useTaskStore } from "../store/taskStore";

const EditTaskModal = ({ visible, onClose, task }:any) => {
  const [newText, setNewText] = useState(task?.text || "");
  const editTask = useTaskStore((state) => state.editTask);

  const handleSave = () => {
    if (newText.trim() === "") return;
    editTask(task.id, newText);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Taskı Düzəlt</Text>
          <TextInput style={styles.input} value={newText} onChangeText={setNewText} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Yadda Saxla</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Ləğv Et</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContainer: { width: 300, backgroundColor: "white", padding: 20, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  button: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, flex: 1, alignItems: "center", margin: 5 },
  cancelButton: { backgroundColor: "#d9534f" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default EditTaskModal;
