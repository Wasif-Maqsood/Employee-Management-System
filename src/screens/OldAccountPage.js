import React, { useEffect, useState } from 'react';
import  {View, StyleSheet,Text, PanResponder} from 'react-native';

import userLocation from '../location/Location';
import Userattendance from '../api/attendanceApi'
import UpdateUserattendance from '../api/updateattendance'
import {
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES, images } from "../../constants";
import { StatusBar } from "react-native";
import { Icon } from 'react-native-elements'
import { SceneMap, TabBar } from "react-native-tab-view";
import { photos } from "../../constants/data";

import Geolocation from 'react-native-geolocation-service';


import Button from './components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PhotosRoutes = () => (
  <View style={{ flex: 1 }}>
    <FlatList
      data={photos}
      numColumns={3}
      renderItem={({ item, index }) => (
        <View
          style={{
            flex: 1,
            aspectRatio: 1,
            margin: 3,
          }}
        >
          <Image
            key={index}
            source={item}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
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
      backgroundColor: "blue",
    }}
  />
);

const renderScene = SceneMap({
  first: PhotosRoutes,
  second: LikesRoutes,
});

const AccountScreen= ({ navigation }) => {


  const [userData,setUserData] = useState(null)
  const [userLogin,setUserLogin] = useState(false)
  const [UserAttendanceData, setUserAttendanceData] = useState(null)
  const [loading, setLoading] = useState(true);
  const [canMarkTimeOut, setCanMarkTimeOut] = useState(false)
  
  const [AlreadyAttendanceout,setAlreadyAttendanceout]=useState(false)
  const [AlreadyAttendancein,setAlreadyAttendancein]=useState(false)
  const [canMarkAttendance,setCanMarkAttendance] = useState(true)
  const [longitude,setLongitude] = useState(0)
  const [latitude , setLatitude] = useState(0)
  const [location,setLocation] = useState(0)
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
  
  useEffect(()=>{
    getLocation();
  
  },[]);
  
  useEffect(()=>{
    checkExistingUser();
  
  },[]);
  
  useEffect(()=>{
    console.log('canMarkTimeOut',canMarkTimeOut);
    
  },[canMarkTimeOut]);
  useEffect(() => {
    console.log('AlreadyAttendancein',AlreadyAttendancein);
  }, [AlreadyAttendancein]);
  useEffect(() => {
    console.log('latitude',latitude);
  }, [latitude]);
  useEffect(() => {
    console.log('longitude',longitude);
  }, [longitude]);
  
  useEffect(() => {
    console.log('AlreadyAttendanceout',AlreadyAttendanceout);
  }, [AlreadyAttendanceout]);
  
  useEffect(() => {
    console.log('attendance',canMarkAttendance);
  }, [canMarkAttendance]);
  
  useEffect(() => {
    console.log('UserAttendanceData',UserAttendanceData);
  }, [UserAttendanceData]);    
  const checkExistingUser = async () => {
    const id =await AsyncStorage.getItem('id')
    const useId = `user${JSON.parse(id)}`;
    
    try {
      const currentUser = await AsyncStorage.getItem(useId);

      if(currentUser != null){
        const parsedData = JSON.parse(currentUser)
        setUserData(parsedData)
        setUserLogin(true)
      }else{
        navigation.navigate('Login')
      } 
    }
    catch (error) {
      console.log("Error Retrieving the Data",error)

    }
      
  };
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "first", title: "Photos" },
    { key: "second", title: "Likes" },
  ]);

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: COLORS.primary,
      }}
      style={{
        backgroundColor: COLORS.white,
        height: 44,
      }}
      renderLabel={({ focused, route }) => (
        <Text style={[{ color: focused ? COLORS.black : COLORS.gray }]}>
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
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
          },
          error => {
            // See error code charts below.
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
      time_att=false
      const userData = JSON.parse(await AsyncStorage.getItem("attendance_id"))
      if(userData != null){
        const parsedData = JSON.parse(userData)
        setUserAttendanceData(parsedData)
        
      }else{
        //alert('Please Mark Attendance')
      }
      return userData;
    } catch (error) {
    console.log(error); 
    }
  };

  const timeIn = async () => {
    if (canMarkAttendance) {
      var timeUserId = userData.user_id;
  
      if (AlreadyAttendancein) {
        alert('Already Click on Time In');
      } else {
        const currentTime = new Date();
        const formattedDate = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}`;
  
        // Check if user already marked time in today
        const lastTimeInDate = await AsyncStorage.getItem('lastTimeInDate');
  
        if (lastTimeInDate === formattedDate) {
          alert('You have already marked Time In today.');
        } else {
          Userattendance({ timeUserId, longitude, latitude }).then(response => {
            if (response != undefined) {
              setCanMarkAttendance(false);
  
              const formattedTime = currentTime.toLocaleTimeString();
  
              AsyncStorage.setItem('lastTimeIn', formattedTime);
              AsyncStorage.setItem('lastTimeInDate', formattedDate);
  
              console.log('Time In Marked at:', formattedTime);
  
              AsyncStorage.setItem(`attendance${response.attendance_id}`, JSON.stringify(response));
              AsyncStorage.setItem('attendance_id', JSON.stringify(response.attendance_id));
  
              setAlreadyAttendancein(true);
              setAlreadyAttendanceout(false);
              setCanMarkTimeOut(false);
  
              alert('Time In Marked');
            } else {
              alert('You are not at the college zone');
            }
          });
        }
        getUser();
      }
    } else {
      alert('Already marked Time In.');
    }
  };
  
  const timeOut = async () => {
    try {
      // Check if the user has marked Time In today
      const lastTimeInDate = await AsyncStorage.getItem('lastTimeInDate');
      const currentTime = new Date();
      const formattedDate = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')}`;
  
      if (lastTimeInDate !== formattedDate) {
        alert('You have not marked Time In today. Cannot mark Time Out.');
        return;
      }
  
      // Check if Time Out has already been marked today
      const lastTimeOutDate = await AsyncStorage.getItem('lastTimeOutDate');
      if (lastTimeOutDate === formattedDate) {
        alert('Time Out already marked today');
        return;
      }
  
      // Get the location
      const result = await requestLocationPermission();
      if (result) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
  
            // Call the API to update the attendance data for Time Out
            UpdateUserattendance({ UserAttendanceData, longitude, latitude }).then(atte => {
              if (atte !== undefined) {
                // Update state and show success message
                setAlreadyAttendanceout(true);
                setAlreadyAttendancein(false);
                setCanMarkTimeOut(false);
                setCanMarkAttendance(true);
  
                alert('Time Out Marked successfully');
  
                const formattedTime = currentTime.toLocaleTimeString();
                console.log('Time Out Mark:', formattedTime);
  
                // Reset location coordinates
                setLatitude(0);
                setLongitude(0);
  
                // Update lastTimeInDate and lastTimeOutDate
                AsyncStorage.setItem('lastTimeInDate', formattedDate);
                AsyncStorage.setItem('lastTimeOutDate', formattedDate);
              } else {
                // If the user is not at the expected location, show an error
                alert('You are not at the office Zone');
                setAlreadyAttendanceout(false);
              }
            });
          },
          error => {
            // Handle error when getting location
            console.log(error.code, error.message);
            alert('Error getting location. Please try again.');
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } 
      else {
        // Handle case when location permission is not granted
        alert('Location permission not granted. Please try again.');
      }
    } catch (error) {
      console.error('Error in timeOut:', error);
      alert('Error marking Time Out');
    }
  };
  
  
  
  
  
  
  // Call the timeOut function and log the result in the console
  // useEffect(() => {
  //   if (!canMarkTimeOut && AlreadyAttendanceout) {
  //     timeOut().then((result) => {
  //       console.log('Time Out Result:', result);
  //     });
  //   }
  // }, [canMarkTimeOut, AlreadyAttendanceout]);
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      <StatusBar backgroundColor={COLORS.gray} />
      <View style={{ width: "100%" }}>
        <Image
          source={images.cover}
          resizeMode="cover"
          style={{
            height: 228,
            width: "100%",
          }}
        />
      </View>

      <View style={{ flex: 1, alignItems: "center" }}>
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
            
            color: COLORS.primary,
            marginVertical: 8,
            fontWeight:'bold',
              fontSize:20,
          }}
        >
          {userData ? userData.name : 'XYZ'}
        </Text>
        <Text
          style={{
            color: COLORS.black,
            fontWeight:'bold',
          }}
        >
          Employee
        </Text>

        <View
          style={{
            flexDirection: "row",
            marginVertical: 6,
            alignItems: "center",
          }}
        >
          <Image source={require('../screens/Assets/location.png')}
                style={{ width: 30, height: 30, tintColor:'#231f5c',  }}
              />
          <Text
            style={{
              marginLeft: 4,
              fontWeight:'bold',
              fontSize:20,
              color:"#231f5c"
            }}
          >
            {userData ? userData.location : 'XYZ'}
            
          </Text>
        </View>

        
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              width: 124,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.primary,
              borderRadius: 10,
              marginHorizontal: SIZES.padding * 2,
            }}
            onPress={timeIn}
          >
            
            <Text
              style={{
                color: COLORS.white,
              }}
            >
              Time In
            </Text>
            
          </TouchableOpacity>
          
          <TouchableOpacity
            style={{
              width: 124,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.primary,
              borderRadius: 10,
              marginHorizontal: SIZES.padding * 2,
            }}
            onPress={timeOut}
          >
            <Text
              style={{
                color: COLORS.white,
              }}
            >
              Time Out
            </Text>
          </TouchableOpacity>
        
        </View>
        
      </View>
      <View style={styles.container}>
        <TouchableOpacity
            style={{
              width: 124,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.primary,
              borderRadius: 50,
              marginBottom:70,
            }}
            onPress={() => {navigation.navigate('HomePage')}}
          >
            <Text
              style={{
                color: COLORS.white,
              }}
            >
            Go Back
            </Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
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
});
export default AccountScreen;