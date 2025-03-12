import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from "react-native";
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
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Yeni task əlavə et..."
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
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: "#ddd",
        fontSize: 16
    },
    addButton: {
        backgroundColor: "#4CAF50",
        borderRadius: 50,
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
        fontWeight: "bold"
    }
});
export default TaskInput;