import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";


//.envye atmadimki islede bilesiz

const firebaseConfig = {
    apiKey: "AIzaSyCnEdIjEHHRZUREXu8bYnYbOxi4jf9pg1E",
    authDomain: "test-1953b.firebaseapp.com",
    projectId: "test-1953b",
    storageBucket: "test-1953b.firebasestorage.app",
    messagingSenderId: "582158117414",
    appId: "1:582158117414:web:b2b1ba4de9e2ba7ae3d4e7",
    measurementId: "G-9MJJR3XK7B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    syncTasks: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],

    addTask: async (text) => {
        const newTask = { text, completed: false };
        const netInfo = await NetInfo.fetch();
        let firestoreId = Date.now().toString();

        if (netInfo.isConnected) {
            try {
                const docRef = await addDoc(collection(db, "tasks"), newTask);
                firestoreId = docRef.id;
            } catch (error) {
                console.error("Firestore xeta", error);
            }
        }

        const finalTask = { id: firestoreId, ...newTask };

        set((state) => {
            const newTasks = [...state.tasks, finalTask];
            AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
            return { tasks: newTasks };
        });
    },

    toggleTask: async (id) => {
        set((state) => {
            const newTasks = state.tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
            return { tasks: newTasks };
        });

        const netInfo = await NetInfo.fetch();
        if (netInfo.isConnected) {
            try {
                const taskRef = doc(db, "tasks", id);
                await updateDoc(taskRef, { completed: !get().tasks.find(task => task.id === id)?.completed });
            } catch (error) {
                console.error("❌ Firestore update xeta::", error);
            }
        }
    },

    deleteTask: async (id) => {
        set((state) => {
            const newTasks = state.tasks.filter((task) => task.id !== id);
            AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
            return { tasks: newTasks };
        });

        const netInfo = await NetInfo.fetch();
        if (netInfo.isConnected) {
            try {
                await deleteDoc(doc(db, "tasks", id));
            } catch (error) {
                console.error("❌ Firestore silme xeta::", error);
            }
        }
    },

    editTask: async (id, newText) => {
        set((state) => {
            const newTasks = state.tasks.map((task) =>
                task.id === id ? { ...task, text: newText } : task
            );
            AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
            return { tasks: newTasks };
        });

        const netInfo = await NetInfo.fetch();
        if (netInfo.isConnected) {
            try {
                await updateDoc(doc(db, "tasks", id), { text: newText });
            } catch (error) {
                console.error("❌ Firestore güncelleme xeta:", error);
            }
        }
    },

    loadTasks: async () => {
        try {
            const storedTasks = await AsyncStorage.getItem("tasks");
            if (storedTasks) {
                set({ tasks: JSON.parse(storedTasks) });
            }

            const netInfo = await NetInfo.fetch();
            if (netInfo.isConnected) {
                const snapshot = await getDocs(collection(db, "tasks"));
                const firebaseTasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));

                set({ tasks: firebaseTasks });
                AsyncStorage.setItem("tasks", JSON.stringify(firebaseTasks));
            }
        } catch (error) {
            console.error("❌ Tasklari yüklerken xeta:", error);
        }
    },

    syncTasks: async () => {
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) return;

        try {
            const storedTasks = await AsyncStorage.getItem("tasks");
            if (storedTasks) {
                const localTasks: Task[] = JSON.parse(storedTasks);
                const snapshot = await getDocs(collection(db, "tasks"));
                const firebaseTasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));

                for (const task of localTasks) {
                    if (!firebaseTasks.find((t) => t.id === task.id)) {
                        await addDoc(collection(db, "tasks"), { text: task.text, completed: task.completed });
                    }
                }

                for (const task of firebaseTasks) {
                    if (!localTasks.find((t) => t.id === task.id)) {
                        await deleteDoc(doc(db, "tasks", task.id));
                    }
                }

                const updatedSnapshot = await getDocs(collection(db, "tasks"));
                const updatedFirebaseTasks = updatedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));

                set({ tasks: updatedFirebaseTasks });
                AsyncStorage.setItem("tasks", JSON.stringify(updatedFirebaseTasks));
            }
        } catch (error) {
            console.error("❌ Senkronizasiya xetasi:", error);
        }
    },
}));
