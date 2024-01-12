import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// IMPORT SCREENS
import SignInScreen from "./src/screens/SignInScreen";
import AccountScreen from "./src/screens/AccountScreen";
import HomePage from "./src/screens/HomePage";
import { LeaveRequest } from "./src/screens/LeaveRequest";
import { TimeTracking } from "./src/screens/TimeTracking";
import {LeaveCount} from "./src/screens/LeaveCount"
import { Profile } from "./src/screens/Profile";
import BottomBar from "./src/screens/BottomBar/BottomBar";
import Setting from "./src/screens/Setting";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
    <NavigationContainer>
      <Stack.Navigator  >
        
        <Stack.Screen name="SignInScreen" component={SignInScreen} options={{
            headerShown: false
          }}/>
        
        <Stack.Screen name="AccountScreen" component={AccountScreen} options={{
            headerShown: false
          }} />
        <Stack.Screen name="HomePage" component={HomePage} options={{
            headerShown: false
          }} />
        <Stack.Screen name="LeaveRequest" component={LeaveRequest} options={{
            headerShown: false
          }} />
        <Stack.Screen name="TimeTracking" component={TimeTracking} options={{
            headerShown: false
          }} />
        <Stack.Screen name="LeaveCount" component={LeaveCount} options={{
            headerShown: false
          }} />
        <Stack.Screen name="Profile" component={Profile} options={{
            headerShown: false
          }} />
        <Stack.Screen name="BottomBar" component={BottomBar} options={{
            headerShown: false
          }} />
          <Stack.Screen name="Setting" component={Setting} options={{
            headerShown: false
          }} />
        
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
};