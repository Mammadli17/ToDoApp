import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal } from "react-native";
import { useTaskStore } from "../store/taskStore";
import { Swipeable } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const TaskItem = ({ task }: any) => {
    const { toggleTask, deleteTask, editTask } = useTaskStore();
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(task.text);

    const renderRightActions = () => (
        <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
                deleteTask(task.id);
                Toast.show({ type: "error", text1: "Task silindi!" });
            }}
        >
            <Text style={styles.deleteText}>Sil</Text>
        </TouchableOpacity>
    );

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableOpacity onLongPress={() => setIsEditing(true)} onPress={() => toggleTask(task.id)} style={styles.task}>
                <Text style={[styles.taskText, task.completed && styles.completed]}>{task.text}</Text>
            </TouchableOpacity>

            <Modal visible={isEditing} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            value={newText}
                            onChangeText={setNewText}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    editTask(task.id, newText);
                                    setIsEditing(false);
                                    Toast.show({ type: "info", text1: "Task güncellendi!" });
                                }}
                                style={styles.saveButton}
                            >
                                <Text style={styles.buttonText}>Yadda saxla</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f7f7f7" },
    task: { backgroundColor: "#fff", padding: 15, marginVertical: 5, borderRadius: 10, elevation: 3 },
    taskText: { fontSize: 16, fontWeight: "500", color: "#333" },
    completed: { textDecorationLine: "line-through", color: "gray" },
    deleteButton: { backgroundColor: "#ff5c5c", justifyContent: "center", padding: 15, borderRadius: 5 },
    deleteText: { color: "white", fontWeight: "bold" },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
    modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%", shadowOpacity: 0.3, shadowRadius: 10 },
    input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10, borderColor: "#ddd", fontSize: 16 },
    modalButtons: { flexDirection: "row", justifyContent: "space-between" },
    cancelButton: { backgroundColor: "#aaa", padding: 10, borderRadius: 5, flex: 1, marginRight: 5 },
    saveButton: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, flex: 1, marginLeft: 5 },
    buttonText: { color: "white", fontWeight: "bold", textAlign: "center" },
    inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, elevation: 3 },
    addButton: { backgroundColor: "#4CAF50", borderRadius: 50, width: 40, height: 40, justifyContent: "center", alignItems: "center", marginLeft: 10 },
    addButtonText: { fontSize: 24, color: "white", fontWeight: "bold" },
    emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" },
});

export default TaskItem;
