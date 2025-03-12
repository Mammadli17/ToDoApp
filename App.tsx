import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import HomeScreen from "screens/home";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HomeScreen />
    </GestureHandlerRootView>
  );
};

export default App;
