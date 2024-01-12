import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TimeTracking } from '../TimeTracking';
import AccountScreen from '../AccountScreen';
import Home from '../HomePage';
import { Image, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

function BottomBar() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconImage;

          if (route.name === 'HomePage') {
            iconImage = focused
              ? require('../Assets/home.png')
              : require('../Assets/home.png');
          } else if (route.name === 'Attendance') {
            iconImage = focused
              ? require('../Assets/attendence.png')
              : require('../Assets/attendence.png');
          } else if (route.name === 'TimeTracking') {
            iconImage = focused
              ? require('../Assets/time.png')
              : require('../Assets/time.png');
          }

          return (
            <Image
              source={iconImage}
              style={{
                width: size,
                height: size,
                tintColor: focused ? 'green' : '#231f5c',
              }}
            />
          );
        },
      })}
      tabBarOptions={null} // Remove tabBarOptions
      tabBarStyle={{
        display: 'flex',
        backgroundColor: 'green',
      }}
    >
      <Tab.Screen name="HomePage" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Attendance" component={AccountScreen} options={{ headerShown: false }} />
      <Tab.Screen name="TimeTracking" component={TimeTracking} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default BottomBar;

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: 'blue', // Set the background color to blue
    height: 50, // Set the height of the bottom bar
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    position: 'absolute', // Position the bottom bar at the bottom of the screen
    left: 0,
    right: 0,
    bottom: 0,
  },
});
