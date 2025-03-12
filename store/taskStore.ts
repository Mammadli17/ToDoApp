import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Task {
    id: string;
    text: string;
    completed: boolean;
}

interface TaskStore {
    tasks: Task[];
    addTask: (text: string) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    editTask: (id: string, newText: string) => void;
    loadTasks: () => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    addTask: (text) => {
        set((state) => {
            const newTasks = [...state.tasks, { id: Date.now().toString(), text, completed: false }];
            AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
            return { tasks: newTasks };
        });
    },
    toggleTask: (id) => {
        set((state) => {
            const newTasks = state.tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
            return { tasks: newTasks };
        });
    },
    deleteTask: (id) => {
        set((state) => {
            const newTasks = state.tasks.filter((task) => task.id !== id);
            AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
            return { tasks: newTasks };
        });
    },
    editTask: (id, newText) => {
        set((state) => {
            const newTasks = state.tasks.map((task) =>
                task.id === id ? { ...task, text: newText } : task
            );
            AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
            return { tasks: newTasks };
        });
    },
    loadTasks: async () => {
        const storedTasks = await AsyncStorage.getItem("tasks");
        if (storedTasks) {
            set({ tasks: JSON.parse(storedTasks) });
        }
    },
}));
