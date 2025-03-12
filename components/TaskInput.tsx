import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTaskStore } from "../store/taskStore";
import Toast from "react-native-toast-message";

const TaskInput = () => {
    const [taskText, setTaskText] = useState("");
    const addTask = useTaskStore((state) => state.addTask);

    const handleAddTask = () => {
        if (taskText.trim() === "") return;
        addTask(taskText);
        setTaskText("");
        Toast.show({ type: "success", text1: "Task əlavə edildi!" });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Yeni task əlavə et..."
                placeholderTextColor="#aaa"
                value={taskText}
                onChangeText={setTaskText}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderColor: "#ddd",
        borderWidth: 1,
        backgroundColor: "#f9f9f9",
        color: "#333",
    },
    addButton: {
        backgroundColor: "#4CAF50",
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    addButtonText: {
        fontSize: 24,
        color: "white",
        fontWeight: "bold",
    },
});

export default TaskInput;
