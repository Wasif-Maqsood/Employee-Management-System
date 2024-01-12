import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View,Image, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LeaveCount } from './LeaveCount';

export const TimeTracking = () => {
  const [firstButtonClicked, setFirstButtonClicked] = useState(true);
  const [secondButtonClicked, setSecondButtonClicked] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [UserId, setUserId] = useState(null);
  const [CountfilteredData, SetCountfilteredData] = useState(CountfilteredData);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedCountfilteredData = await AsyncStorage.getItem('CountfilteredData'); 
        if (storedCountfilteredData) {
          SetCountfilteredData(storedCountfilteredData);
          // console.log('leave count fetch from time tracking page ', CountfilteredData)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://39.61.57.232:8003/api/v1/accounts/listattendance/');
        const data = await response.json();
        setAttendanceData(data.results);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };
    fetchData();
  }, []);

  const handleFirstButtonClick = () => {
    setFirstButtonClicked(true);
    setSecondButtonClicked(false);
  };

  const handleSecondButtonClick = () => {
    setFirstButtonClicked(false);
    setSecondButtonClicked(true);
  };

  const navigation = useNavigation();

  const goBack = () => {
    navigation.replace('BottomBar');
  };

  const filteredLateData = attendanceData.filter((item) => {
    const timeInHours = parseInt(item.time_in.split(':')[0], 10);
    return String(item.user_id) === UserId && timeInHours >= 9;
  });
  
  const userLateAttendanceCount = filteredLateData.length;
  

  const totalAttendanceCount = attendanceData.length;

  const filteredData = attendanceData.filter(item => String(item.user_id) === UserId);
  // const userAttendanceCount = filteredData.length;
  const filteredCompleteAttendanceData = attendanceData.filter(item => {
    return String(item.user_id) === UserId && item.time_in && item.time_out;
  });
  
  const userCompleteAttendanceCount = filteredCompleteAttendanceData.length; 

// absent count
  const filteredAbsentData = attendanceData.filter(item => {
    return String(item.user_id) === UserId && (!item.time_in || !item.time_out);
  });
  const userAbsentCount = filteredAbsentData.length;


  return (
    <>
    
    <View style={{ marginBottom: 10, flexDirection: 'row' }} >

      <TouchableOpacity onPress={goBack} >
        <View>
        <Image source={require('./Assets/backword.png')} style={[styles.image, { tintColor: '#231f5c' }]} />
        </View>
      </TouchableOpacity>
        <View>
          <Text style={{fontSize:40, color:'#231f5c', fontWeight:"bold", marginLeft:50}} >Attendance</Text>
        </View>
    </View>

      <View style={styles.container}>
  <View style={{ margin: 10, flexDirection: 'row' }}>
    <TouchableOpacity
      style={{ ...styles.button1, backgroundColor: firstButtonClicked ? 'green' : '#231f5c' }}
      onPress={() => {
        handleFirstButtonClick();
      }}
    >
      <Text style={{ color: 'white', fontSize: 20 }}>Attendance</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={{ ...styles.button2, backgroundColor: secondButtonClicked ? 'green' : '#231f5c' }}
      onPress={() => {
        handleSecondButtonClick();
      }}
    >
      <Text style={{ color: 'white', fontSize: 20 }}>Leave</Text>
    </TouchableOpacity>
  </View>
</View>

<View >
  {firstButtonClicked && (
      <View>
        <View  >
            <View style={{ flexDirection: 'row' }} >
              <View style={styles.attendence}>
              <View style={{ backgroundColor: 'green', height: 30, width: 30, marginTop: 8, marginLeft: 8, borderRadius: 8 }}></View>
              <Text style={{ color: 'white', marginLeft: 10, fontSize: 20 }}>Present</Text>
              <Text style={{ color: 'white', marginLeft: 10, fontSize: 50 }}>{userCompleteAttendanceCount}</Text>
            </View>
            <View style={styles.attendence}>
              <View style={{ backgroundColor: 'orange', height: 30, width: 30, marginTop: 8, marginLeft: 8, borderRadius: 8 }}></View>
              <Text style={{ color: 'white', marginLeft: 10, fontSize: 20 }}>Late</Text>
              <Text style={{ color: 'white', marginLeft: 10, fontSize: 50 }}>{userLateAttendanceCount}</Text>
            </View>
          </View>

          <View style={{}}>
            <Text style={{ fontSize: 20,marginLeft:10, fontWeight: 'bold', color:"#231f5c" }}>Attendance List</Text>
            <FlatList
              data={attendanceData.filter(item => (item.user_id) == UserId)}
              keyExtractor={(item) => item.attendance_id.toString()}
              renderItem={({ item }) => (
                <View style={styles.FlatListcontainer}>
                  <Text style={styles.text}>User ID: {item.user_id}</Text>
                  <Text style={styles.text}>Time In: {item.time_in}</Text>
                  <Text style={styles.text}>Time Out: {item.time_out}</Text>
              </View>              
              )} />
          </View>
       </View>
      </View>
  )}
  {secondButtonClicked && (
    <View >
          <View style={{flexDirection:'row'}} >
            <View style={styles.attendence}>
              <View style={{ backgroundColor: 'aqua', height: 30, width: 30, marginTop: 8, marginLeft: 8, borderRadius: 8 }}></View>
              <Text style={{ color: 'white', marginLeft: 10, fontSize: 20 }}>Apsent</Text>
              <Text style={{ color: 'white', marginLeft: 10, fontSize: 50 }}>{CountfilteredData} </Text>
            </View>
            <View style={styles.attendence}>
              <View style={{ backgroundColor: 'red', height: 30, width: 30, marginTop: 8, marginLeft: 8, borderRadius: 8 }}></View>
              <Text style={{ color: 'white', marginLeft: 10, fontSize: 20 }}>Leave</Text>
              <Text style={{ color: 'white', marginLeft: 10, fontSize: 50 }}>{CountfilteredData}</Text>
            </View>
        </View>
        
        <View>
        <View style={styles.attendenceLeaveList}>
          <LeaveCount/>
        </View>
        </View>
    </View>
  )}
  </View> 
      
    </>
  );
};

const styles = StyleSheet.create({
  FlatListcontainer: {
    backgroundColor: '#231f5c',
    flexGrow: 1,
    margin:10,
    padding: 16,
    marginBottom: 10, // Adjust this value to leave more space at the bottom
    borderRadius: 8,
    elevation: 3,
  },
  image: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginTop: 10
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
    color:"white",
    fontWeight:'bold'
    
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginVertical: 5,
  },
  container: {
    borderRadius: 10,
    backgroundColor: '#231f5c',
    height: 60,
    width: '100%',
  },
  button1: {
    width: 190,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  button2: {
    width: 190,
    marginLeft: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  attendence: {
    backgroundColor: '#231f5c',
    height: 140,
    width: 190,
    marginTop: 15,
    margin: 5,
    borderRadius: 10,
    marginBottom: 11,
  },
  attendenceLeave: {
    backgroundColor: '#231f5c',
    height: 95,
    width:  '98%',
    marginTop: 15,
    margin: 5,
    borderRadius: 10,
    marginBottom: 11,
  },
  attendenceLeaveList: {
    marginTop: 15,
    marginBottom: 55,   
    
  },
});
