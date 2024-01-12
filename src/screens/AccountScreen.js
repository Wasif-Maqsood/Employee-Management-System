import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import userLocation from '../location/Location';

import Userattendance from '../api/attendanceApi';
import UpdateUserattendance from '../api/updateattendance';
import {
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, SIZES, images} from '../../constants';
import {StatusBar} from 'react-native';
import {Icon} from 'react-native-elements';
import {SceneMap, TabBar} from 'react-native-tab-view';
import {photos} from '../../constants/data';

import Geolocation from 'react-native-geolocation-service';

import Button from './components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PhotosRoutes = () => (
  <View style={{flex: 1}}>
    <FlatList
      data={photos}
      numColumns={3}
      renderItem={({item, index}) => (
        <View
          style={{
            flex: 1,
            aspectRatio: 1,
            margin: 3,
          }}>
          <Image
            key={index}
            source={item}
            style={{width: '100%', height: '100%', borderRadius: 12}}
          />
        </View>
      )}
    />
  </View>
);

const LikesRoutes = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'blue',
    }}
  />
);

const renderScene = SceneMap({
  first: PhotosRoutes,
  second: LikesRoutes,
});

const AccountScreen = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [userLogin, setUserLogin] = useState(false);
  const [UserAttendanceData, setUserAttendanceData] = useState(null);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [location, setLocation] = useState(0);
  const [status, setStatus] = useState();
  const [timeInInfo, setTimeInInfo] = useState(null);

  const [timeInD, setTimeInD] = useState(true);
  const [timeOutD, setTimeOutD] = useState(true);

  const [UserId, setUserId] = useState(null);
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
// console.log("user id ", UserId)

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
      return false;
    }
  };
  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    getLocation();
  }, []);
  useEffect(() => {
    const fetchTimeInStatus = async () => {
      const statu = await getTimeInStatus();
      console.log('status of getTimeInStatus', statu);
      setStatus(statu);
    };
    fetchTimeInStatus();
  }, []);

  useEffect(() => {
    checkExistingUser();
  }, []);
  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    console.log('latitude', latitude);
  }, [latitude]);
  useEffect(() => {
    console.log('longitude', longitude);
  }, [longitude]);
  useEffect(() => {
    console.log('timeInD', timeInD);
  }, [timeInD]);

  useEffect(() => {
    console.log('timeOutD', timeOutD);
  }, [timeOutD]);

  useEffect(() => {
    console.log('UserAttendanceData', UserAttendanceData);
  }, [UserAttendanceData]);
  const checkExistingUser = async () => {
    const id = await AsyncStorage.getItem('id');
    const useId = `user${JSON.parse(id)}`;

    try {
      const currentUser = await AsyncStorage.getItem(useId);

      if (currentUser != null) {
        const parsedData = JSON.parse(currentUser);
        setUserData(parsedData);
        setUserLogin(true);
      } else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log('Error Retrieving the Data', error);
    }
  };
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {key: 'first', title: 'Photos'},
    {key: 'second', title: 'Likes'},
  ]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary,
      }}
      style={{
        backgroundColor: COLORS.white,
        height: 44,
      }}
      renderLabel={({focused, route}) => (
        <Text style={[{color: focused ? COLORS.black : COLORS.gray}]}>
          {route.title}
        </Text>
      )}
    />
  );

  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          error => {
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
    console.log(location);
  };

  const getUser = async () => {
    try {
      time_att = false;
      const userData = JSON.parse(await AsyncStorage.getItem('attendance_id'));
      if (userData != null) {
        const parsedData = JSON.parse(userData);
        setUserAttendanceData(parsedData);
      } else {
        //alert('Please Mark Attendance')
      }
      return userData;
    } catch (error) {
      console.log(error);
    }
  };
  const saveTimeInStatus = async status => {
    try {
      await AsyncStorage.setItem('timeInStatus', JSON.stringify(status));
    } catch (error) {
      console.error('Error saving time in status:', error);
    }
  };
  const getTimeInStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('timeInStatus');
      return status !== null ? JSON.parse(status) : false;
    } catch (error) {
      console.error('Error getting time in status:', error);
      return false;
    }
  };


  const [currentTime, setCurrentTime] = useState('');
  const [currentTimeout, setCurrentTimeout] = useState('');

const timeIn = async () => {
  if ((status == true || status == null) && timeInD == true) {
    var timeUserId = userData.user_id;
    try {
      const response = await Userattendance({
        timeUserId,
        longitude,
        latitude,
      });

      if (response != undefined) {
        const currentTime = new Date();
        // console.log('Current Time:', currentTime);
        console.log('Time In marked at:', currentTime.toLocaleTimeString());
        setCurrentTime(currentTime.toLocaleTimeString());

        setTimeInInfo(response.time_In);

        await AsyncStorage.setItem(
          `attendance${response.attendance_id}`,
          JSON.stringify(response)
        );
        await AsyncStorage.setItem(
          'attendance_id',
          JSON.stringify(response.attendance_id)
        );

        alert(`Time In Marked`,);
        saveTimeInStatus(false);
        getTimeInStatus();
        setTimeInD(false);
      } else {
        alert('You are not at the college zone');
      }
    } catch (error) {
      console.error('Error marking time in:', error);
    }
    getUser();
  } else {
    alert('Already marked Time In.');
  }
};


const todayTime = currentTime;
 AsyncStorage.setItem('todayTime', todayTime.toString());



  const timeOut = async () => {
    getTimeInStatus();
    // console.log('Inside time out', status);
    if (status == false && timeOutD == true) {
      try {
        await UpdateUserattendance({
          UserAttendanceData,
          longitude,
          latitude,
        }).then(atte => {
          console.log('atte', atte);
          const currentTimeout = new Date();
        // console.log('Current Time:', currentTimeout);
        setCurrentTimeout(currentTimeout.toLocaleTimeString());
        
          if (atte != undefined) {
            alert('Time Out Marked');
            setLatitude(0);
            setLongitude(0);
            saveTimeInStatus(true);
            getTimeInStatus();
            setTimeOutD(false);
          } else {
            alert('You are not at office Zone');

            saveTimeInStatus(true);
            getTimeInStatus();
          }
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('Please first Click on time in');
    }
  };

  const todayTimeOut = currentTimeout;
 AsyncStorage.setItem('todayTimeOut', todayTimeOut.toString());
//  console.log('Time out mark today const', todayTimeOut);


  const goBack = () => {
    navigation.replace('BottomBar');
  };

  return (
    <>
      <View
        style={{flexDirection: 'row', backgroundColor: '#231f5c', height: 60}}>
        <TouchableOpacity onPress={goBack}>
          <View>
            <Image
              source={require('./Assets/backword.png')}
              style={[styles.image, {tintColor: 'white'}]}
            />
          </View>
        </TouchableOpacity>
        <Text
          style={{
            color: 'white',
            fontSize: 28,
            fontWeight: 'bold',
            marginTop: 9.9,
            marginLeft: 90,
          }}>
          Attendance
        </Text>
      </View>

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',

        }}>

        <StatusBar />
        
        <View style={{width: '100%'}}>
          <Image
            source={images.cover}
            resizeMode="cover"
            style={{
              height: 228,
              width: '100%',
            }}
          />
        </View>

        <View style={{flex: 1, alignItems: 'center'}}>
          <Image
            source={images.profile}
            resizeMode="contain"
            style={{
              height: 155,
              width: 155,
              borderRadius: 999,
              borderColor: COLORS.primary,
              borderWidth: 2,
              marginTop: -90,
            }}
          />

          <Text
            style={{
              marginTop: 5,
              fontSize: 15,
              color: '#231f5c',
              fontWeight: 'bold',
            }}>
            {userData ? userData.name : 'XYZ'}
          </Text>
          <Text
            style={{
              color: COLORS.black,
            }}>
            Employee
          </Text>

          <View
            style={{
              flexDirection: 'row',
              marginVertical: 6,
              alignItems: 'center',
            }}>
            <Image
              source={require('./Assets/location.png')}
              style={{width: 20, height: 20, tintColor: '#231f5c'}}
            />
            <Text
              style={{
                marginLeft: 4,
                fontSize: 15,
                color: '#231f5c',
                fontWeight: 'bold',
              }}>
              {userData ? userData.location : 'XYZ'}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={{
                width: 124,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.primary,
                borderRadius: 10,
                marginHorizontal: SIZES.padding * 2,
              }}
              onPress={timeIn}>
              <Text
                style={{
                  color: COLORS.white,
                }}>
                Time In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 124,
                height: 36,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.primary,
                borderRadius: 10,
                marginHorizontal: SIZES.padding * 2,
              }}
              onPress={timeOut}>
              <Text
                style={{
                  color: COLORS.white,
                }}>
                Time Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

  	  <View style={{backgroundColor:"#231f5c", height:130}} >
        

      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  image: {
    width: 30,
    height: 30,
    marginLeft: 10,
    marginTop: 14,
  },
 
});
export default AccountScreen;
