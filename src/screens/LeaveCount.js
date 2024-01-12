import React, { useState, useEffect } from 'react';
import { View, Text, FlatList,ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LeaveCount = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('UserId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error retrieving user ID', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch('http://39.61.57.232:8003/api/v1/accounts/Leave_Table/');
        if (response.ok) {
          const data = await response.json();
          const filteredData = data.results.filter((item) => item.user_id === parseInt(userId));
          setLeaveData(filteredData);
          const CountfilteredData = filteredData.length;
          await AsyncStorage.setItem('CountfilteredData', CountfilteredData.toString());
        } else {
          console.error('Server responded with an error:', response.status);
        }
      } catch (error) {
        console.error('Error during leave data fetch:', error);
      }
      
    };

    fetchLeaveData();
  }, [userId]);


  return (
    <>
    <Text style={{ fontSize: 20, fontWeight: 'bold', color:"#231f5c", marginLeft:10 }}>Leave List</Text>
      <FlatList
        data={leaveData}
        keyExtractor={(item) => item.leave_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.leaveItem}>
            <View style={{flexDirection:'row', }}>
            <Text style={{ fontSize: 20, color: 'white', fontWeight:'bold' }}>User ID: {item.user_id}</Text>
            <Text style={{ fontSize: 20, color: 'white', fontWeight:'bold', marginLeft:90 }} >Date: {item.date}</Text>
            </View>
            <View style={{flexDirection:'row', }}>
            <Text style={{ fontSize: 20, color: 'white', fontWeight:'bold' }}>Status: {item.status}</Text>
            <Text style={{ fontSize: 20, color: 'white', fontWeight:'bold', marginLeft:42  }} >Leave ID: {item.leave_id}</Text>
            </View>
            <Text style={{ fontSize: 20, color: 'white',fontWeight:'bold',  }} >Leave Reason: {item.leave_reason}</Text>
          </View>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  FlatList: {
    flexGrow: 1,
  },
  leaveItem: {
    backgroundColor: '#231f5c',
    padding: 16,
    marginBottom: 10,
    margin:10,
    borderRadius: 8,
    elevation: 3,
  },
});
