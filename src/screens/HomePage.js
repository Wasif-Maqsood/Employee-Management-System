import React, {useState, useEffect} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  FlatList,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [userName, setUserName] = useState(userName);
  const [UserPic, setUserPic] = useState(UserPic);
  const [UserId, setUserId] = useState(null);
  const [userData, setUserData] = useState([]);
  const [todayTime, SettodayTime] = useState('');
  const [todayTimeOut, settodayTimeOut] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          'http://39.61.57.232:8003/api/v1/accounts/listemployee/',
        );
        const data = await response.json();
        setUserData(data.results);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const filteredUserData = userData.filter(item => item.id === UserId);

  const renderItem = ({item}) => (
    <View
      style={{
        backgroundColor: '#231f5c',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between', 
        height: 80,
      }}>
      <View>
        <Text
          style={{
            color: 'white',
            fontSize: 25,
            fontWeight: 'bold',
            marginLeft: 5,
          }}>
          Hi
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 25,
            fontWeight: 'bold',
            marginLeft: 5,
          }}>
          {item.name}
        </Text>
      </View>

      <View>
        {UserPic && (
          <TouchableOpacity onPress={toggleDropdown}>
            <Image source={{uri: item.avatar}} style={styles.avatar} />
          </TouchableOpacity>
        )}

        <Modal
          visible={isDropdownVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setDropdownVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={Profile}>
              <Text style={styles.optionText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={Setting}>
              <Text style={styles.optionText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={LogOut}>
              <Text style={styles.optionText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );

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
    const fetchData = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem('userName');
        if (storedUserName) {
          setUserName(storedUserName);
        }
      } catch (error) {
        console.error('Error retrieving user name', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedtodayTime = await AsyncStorage.getItem('todayTime');
        if (storedtodayTime) {
          SettodayTime(storedtodayTime);
        }
      } catch (error) {
        console.error('Error retrieving user name', error);
      }
    };
    fetchData();
  }, []);
  // console.log("today time in", todayTime)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedtodayTimeOut = await AsyncStorage.getItem('todayTimeOut');
        if (storedtodayTimeOut) {
          settodayTimeOut(storedtodayTimeOut);
        }
      } catch (error) {
        console.error('Error retrieving user name', error);
      }
    };
    fetchData();
  }, []);
  // console.log("today time out", todayTimeOut)




  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserPic = await AsyncStorage.getItem('UserPic');
        if (storedUserPic) {
          storedUserPc = 'http://39.61.57.232:8003/uploads/'.concat(storedUserPic);
          setUserPic(storedUserPc);
          // console.log("home page",storedUserPc)
          
        }
      } catch (error) {
        console.error('Error retrieving user name', error);
      }
    };
    fetchData();
  }, []);

  const navigation = useNavigation();

  const Attendance = () => {
    navigation.replace('AccountScreen');
  };
  const LeaveRequest = () => {
    navigation.replace('LeaveRequest');
  };
  const TimeTracking = () => {
    navigation.replace('TimeTracking');
  };
  const LogOut = () => {
    // AsyncStorage.removeItem('UserId');
    // AsyncStorage.removeItem('userName');
    // AsyncStorage.removeItem('todayTime');
    // AsyncStorage.removeItem('todayTimeOut');
    // AsyncStorage.removeItem('UserPic');

    navigation.replace('SignInScreen');
  };
  const Profile = () => {
    navigation.replace('Profile');
  };
  const Setting = () => {
    navigation.replace('Setting');
  };


  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const renderAttendanceStatus = () => {
    if (!todayTime && !todayTimeOut) {
      return (
        <Text style={{ fontSize: 20, color: 'red', margin: 15 }}>
          You are not mark attendence today.
        </Text>
      );
    }
    return null; 

    
  };

  return (
    <>
      <View>
        <FlatList
          data={filteredUserData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>

      <View>
        <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 15}}>
          <TouchableOpacity onPress={Attendance}>
            <View
              style={{
                backgroundColor: '#231f5c',
                height: 90,
                width: 180,
                borderRadius: 10,
                marginRight: 15,
              }}>
              <Image
                source={require('./Assets/attendence.png')}
                style={[styles.image, {tintColor: 'white'}]}
              />
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                Attendance
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={LeaveRequest}>
            <View
              style={{
                backgroundColor: '#231f5c',
                height: 90,
                width: 180,
                borderRadius: 10,
                marginLeft: 5,
              }}>
              <Image
                source={require('./Assets/leave.png')}
                style={[styles.image, {tintColor: 'white'}]}
              />
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                Leave Request
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 10, marginLeft: 130}}>
          <TouchableOpacity onPress={TimeTracking}>
            <View
              style={{
                backgroundColor: '#231f5c',
                height: 90,
                width: 180,
                borderRadius: 10,
                marginRight: 5,
              }}>
              <Image
                source={require('./Assets/time.png')}
                style={[styles.image, {tintColor: 'white'}]}
              />
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                Time Tracking
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.Card}>
  <Text style={{ fontWeight: 'bold', marginLeft: 60, fontSize: 28, color: 'black', textDecorationLine: 'underline' }}>
    Today Attendance.
  </Text>
  {renderAttendanceStatus()}

  {todayTime && (
    <View style={{ flexDirection: 'row', margin: 5 }}>
      <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Today Time_in Mark: </Text>
      <Text style={{ fontSize: 20, color: 'black' }}>{todayTime}</Text>
    </View>
  )}

  {todayTimeOut && (
    <View>
        <View style={{ flexDirection: 'row', margin: 5 }}>
          <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Today Time_Out Mark: </Text>
          <Text style={{ fontSize: 20, color: 'black' }}>{todayTimeOut}</Text> 
        </View>
      <View>
        <Text style={{ fontSize: 25, color: 'blue', fontWeight: 'bold' }}> Today Attendence Done!</Text>
      </View>
    </View>
  )}
</View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: 50,
    height: 50,
    marginLeft: 65,
    marginTop: 5,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginLeft: 'auto',
    marginTop:5
  },
  dropdownOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
 

  modalContainer: {
    backgroundColor: '#231f5c',
    padding: 20,
    marginTop: 85,
    marginLeft: 270,
    height: 220,
    width: 140,
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 15,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },

  optionText: {
    fontSize: 20,
    paddingVertical: 10,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 1.5,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'green',
  },
  Card: {
    margin:20,
    fontWeight: 'bold',
    borderWidth: 1.5,
    borderColor: 'black',
    borderRadius: 5,
    height: 150,
  }
});

export default Home;
