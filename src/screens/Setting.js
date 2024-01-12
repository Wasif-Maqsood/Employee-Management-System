import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BottomBar from './BottomBar/BottomBar';

export const Setting = () => {
  const [userData, setUserData] = useState([]);
  const [UserId, setUserId] = useState(null);
  const [updatedUserName, setUpdatedUserName] = useState(''); 
  const [updatedphone, setupdatedphone] = useState(''); 
  const [updatedpassword, setupdatedpassword] = useState(''); 
  const [updatedtime_in, setupdatedtime_in] = useState(''); 
  const [updatedtime_out, setupdatedtime_out] = useState(''); 



  
  const [updatedUserEmail, setUpdatedUserEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('UserId');
        if (storedUserId) {
          setUserId(parseInt(storedUserId, 10));
        }
      } catch (error) {
        console.error('Error retrieving user name', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://39.61.57.232:8003/api/v1/accounts/listemployee/');
        const data = await response.json();
        setUserData(data.results);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const filteredUserData = userData.filter(item => item.id === UserId);
 
  const handleUpdate = async () => {
    try {
      const updatedUserData = {
        id: UserId,
        name: updatedUserName,
        
        location_id: 1,
        phone: updatedphone,
        password:updatedpassword,
        // time_in:updatedtime_in,
        // time_out:updatedtime_out
      };
  
      const response = await fetch(`http://39.61.57.232:8003/api/v1/accounts/updateemployee/${UserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });
  
      if (!response.ok) {
        console.error('Error updating user data:', response.status);
        const errorResponse = await response.text(); 
        console.error('Error response:', errorResponse);
  
        alert('An error occurred during the update. Please try again.');
        return;
      }
      alert('User data updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  
  

  const renderItem = ({ item }) => (
    <View style={styles.container}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.text}>User ID: {item.id}</Text>
      <Text style={styles.text}>Name: {item.name}</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={updatedUserName}
        onChangeText={(text) => setUpdatedUserName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone_#."
        value={updatedphone}
        onChangeText={(text) => setupdatedphone(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={updatedpassword}
        onChangeText={(text) => setupdatedpassword(text)}
      />
      <TouchableOpacity onPress={handleUpdate}>
        <View style={styles.updateButton}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Update Profile</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const navigation = useNavigation();

  const goBack = () => {
    navigation.replace('BottomBar');
  };
  const Attendance = () => {
    navigation.replace('AccountScreen');
  };
  const LeaveRequest = () => {
    navigation.replace('LeaveRequest');
  };
  const TimeTracking = () => {
    navigation.replace('TimeTracking');
  };

  return (
    <>
      <View style={{ marginBottom: 10, flexDirection: 'row', backgroundColor: '#231f5c', height: 60 }}>
        <TouchableOpacity onPress={goBack}>
          <View>
            <Image source={require('./Assets/backword.png')} style={[styles.image, { tintColor: 'white' }]} />
          </View>
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold', marginTop: 9.9, marginLeft: 115 }}>Setting</Text>
      </View>
      <View>
        <FlatList
          data={filteredUserData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      
     <View style={{backgroundColor:"#231f5c"}}>
     <View style={styles.bar}>
        <TouchableOpacity onPress={goBack} >
          <Image source={require('./Assets/home.png')} style={{ width: 35, height: 35, tintColor: 'green', marginLeft:10, marginTop:5 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={Attendance} >
        <Image source={require('./Assets/attendence.png')} style={{ width: 35, height: 35, tintColor: 'green', marginLeft:125, marginTop:5 }} />
        </TouchableOpacity>
        <TouchableOpacity onPressOut={TimeTracking} >
        <Image source={require('./Assets/time.png')} style={{ width: 35, height: 35, tintColor: 'green', marginLeft:115, marginTop:5 }} />
        </TouchableOpacity>
        </View> 
     </View>
      
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  updateButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  image: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginTop: 10,
  },
  bar:{
    flexDirection: "row",
    marginTop: 10, 
    height: 42,
    marginTop:118,
    marginBottom:20, 
    borderColor:"black",
    backgroundColor: "white" 
  }      
});

export default Setting;
