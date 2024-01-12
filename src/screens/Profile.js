import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const Profile = () => {
  const [userData, setUserData] = useState([]);
  const [UserId, setUserId] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('UserId');
        if (storedUserId) {
          setUserId(parseInt(storedUserId, 10));
          console.log('UserId fetch from Profile ', storedUserId);
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

  const renderItem = ({ item }) => (
    <View style={styles.container}>
    <Image source={{ uri: item.avatar }} style={styles.avatar} />
    <Text style={styles.text}>ID: {item.id}</Text>
    <Text style={styles.text}>Name: {item.name}</Text>
    <Text style={styles.text}>Email: {item.email}</Text>
    <Text style={styles.text}>CNIC: {item.CNIC}</Text>
    <Text style={styles.text}>Phone: {item.phone}</Text>
    <Text style={styles.text}>Password: {item.password}</Text>
    <Text style={styles.text}>Joining Date: {item.joining_date}</Text>
    <Text style={styles.text}>Designation: {item.designation}</Text>
    <Text style={styles.text}>Time_In: {item.time_in}</Text>
    <Text style={styles.text}>Time_Out: {item.time_out}</Text>
    <TouchableOpacity onPress={UpdatePage}>
        <View style={styles.updateButton}>
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Change Profile</Text>
        </View>
      </TouchableOpacity>
  </View>
  );
  const navigation = useNavigation();

  const goBack = () => {
    navigation.replace('BottomBar');
  };
  const UpdatePage = () => {
    navigation.replace('Setting');
  };

  return (
    <>
    <View style={{ marginBottom: 10, flexDirection: 'row', backgroundColor:"#231f5c", height:60 }} >
    <TouchableOpacity onPress={goBack} >
        <View>
        <Image source={require('./Assets/backword.png')} style={[styles.image, { tintColor: 'white' }]} />
        </View>
      </TouchableOpacity>
    <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold', marginTop:9.9, marginLeft: 120 }}>Profile </Text>
    </View>
    <View>
      <FlatList
        data={filteredUserData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
    </>
  );
};

export default Profile;
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    margin: 10,
    borderColor:"black",
    borderWidth:3,
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
    fontSize: 21,
    marginBottom: 8,
    fontWeight:"bold"
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  image: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginTop: 14
  },
  updateButton: {
    backgroundColor: '#231f5c',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  }
});

