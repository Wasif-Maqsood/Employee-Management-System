import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LeaveCount } from './LeaveCount';

export const LeaveRequest = () => {
  const [UserId, setUserId] = useState(null);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveData, setLeaveData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('UserId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error retrieving user ID', error);
      }
    };

    fetchData();
  }, []);

  const handleLeaveRequest = async () => {
    try {
      if (!leaveReason) {
        Alert.alert('Error', 'Please enter a leave reason');
        return;
      }

      const leaveData = {
        leave_reason: leaveReason,
        status: 'Pending',
        user_id: UserId,
      };

      const response = await fetch('http://39.61.57.232:8003/api/v1/accounts/Leave/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leaveData),
      });

      if (response.ok) {
        // Set leaveData with the actual response from the server
        const responseData = await response.json();
        setLeaveData(responseData);
        alert('Leave request send successfully!');
      } else {
        // Handle errors here
        console.error('Leave request failed');
      }
    } catch (error) {
      console.error('Error in leave request:', error);
    }
  };

  const navigation = useNavigation();

  const goBack = () => {
    navigation.replace('BottomBar');
  };

  return (
    <>
      <View style={{  flexDirection: 'row', backgroundColor:"#231f5c", height:50 }}>
        <TouchableOpacity onPress={goBack}>
          <View>
            <Image source={require('./Assets/backword.png')} style={[styles.image, { tintColor: 'white' }]} />
          </View>
        </TouchableOpacity>
        <View>
          <Text style={{ fontSize: 30, color: 'white', marginLeft: 70, marginTop: 5, fontWeight:'bold' }}>Leave Request</Text>
        </View>
      </View>

      <View style={{padding:5, margin:10 }} >
      <Text style={{ fontSize: 24, fontWeight: 'bold', color:'#231f5c'  }}>Leave Reason:</Text>

      <TextInput
  placeholder="Leave Reason Write:"
  onChangeText={(text) => setLeaveReason(text)}
  style={{
    // height: 100,
    width: '100%',
    borderColor: '#231f5c',
    borderWidth: 3,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'center', // Center the placeholder vertically
  }}
  multiline
/>


      <TouchableOpacity
        style={{
          width: '100%',
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          backgroundColor: '#231f5c',
          marginBottom: 20,
          marginTop:8,
        }}
        onPress={handleLeaveRequest}
      >
        <Text style={{ color: 'white', fontSize: 20,  }}>Request Leave</Text>
      </TouchableOpacity>

      {leaveData && (
        <View style={{ alignItems: 'flex-start', borderWidth: 7, padding: 10, borderRadius: 10, borderColor:'#231f5c' }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold', color:'#231f5c', textDecorationLine:"underline", }}>Leave Request Details:</Text>
          <Text style={{fontSize:20, color:'black', fontWeight:"bold"}} >User ID: {leaveData.user_id}</Text>
          <Text style={{fontSize:20, color:'black', fontWeight:"bold"}} >Status: {leaveData.status}</Text>
          <Text style={{fontSize:20, color:'black', fontWeight:"bold"}} >Leave Reason: {leaveData.leave_reason}</Text>
        </View>
      )}
    </View>
    <LeaveCount/>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginTop: 12,
  },
});
