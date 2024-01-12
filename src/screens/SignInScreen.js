// SignInScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from './components/Button';
import COLORS from '../constants/COLORS';
import UserLogin from '../api/UserAPi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNCheckBox from '@react-native-community/checkbox';

const SignInScreen = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkValidEmail, setCheckValidEmail] = useState(false);

  useEffect(() => {
    retrieveStoredCredentials();
  }, []);

  const retrieveStoredCredentials = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('rememberedEmail');
      const storedPassword = await AsyncStorage.getItem('rememberedPassword');

      if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setPassword(storedPassword);
        setIsChecked(true);
      }
    } catch (error) {
      console.error('Error retrieving stored credentials', error);
    }
  };

  const storeCredentials = async () => {
    try {
      if (isChecked) {
        await AsyncStorage.setItem('rememberedEmail', email);
        await AsyncStorage.setItem('rememberedPassword', password);
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
        await AsyncStorage.removeItem('rememberedPassword');
      }
    } catch (error) {
      console.error('Error storing credentials', error);
    }
  };

  const handleCheckEmail = (text) => {
    let re = /\S+@\S+\.\S+/;
    setEmail(text);
    if (re.test(text)) {
      setCheckValidEmail(false);
    } else {
      setCheckValidEmail(true);
    }
  };

  const checkPasswordValidity = (value) => {
    const isNonWhiteSpace = /^\S*$/;
    if (!isNonWhiteSpace.test(value)) {
      return 'Password must not contain whitespaces.';
    }
    return null;
  };

  const handleLogin = async () => {
    const checkPassword = checkPasswordValidity(password);
    if (!checkPassword) {
      try {
        const result = await UserLogin({
          email: email.toLowerCase(),
          password: password,
        });

        if (result !== undefined) {

          AsyncStorage.setItem(`user${result.data.user_id}`, JSON.stringify(result.data));
          AsyncStorage.setItem('id', JSON.stringify(result.data.user_id));
          console.log('User Data:', result.data);
          storeCredentials();
            
            const userName = result.data.name;
            const UserPic = result.data.avatar;
            
            const UserId = result.data.user_id;
            
            await AsyncStorage.setItem('userData', JSON.stringify(result.data));
            await AsyncStorage.setItem('loginTime', new Date().toISOString());       
            await AsyncStorage.setItem('userName', userName);
            await AsyncStorage.setItem('UserPic', UserPic);
            await AsyncStorage.setItem('UserId', UserId.toString());
              
            navigation.replace('BottomBar');

        } else {
          alert('Email & Password does not match');
        }
      } catch (error) {
        console.error('Login error', error);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <View style={{ marginVertical: 12 }}>
          <Image
            source={require('../screens/Assets/loginMobile.png')}
            style={{ width: 120, height: 120, marginLeft: 100, tintColor:'#231f5c', }}
          />
          <Text style={{ fontSize: 40, fontWeight: 'bold', marginLeft: 110, color: '#231f5c' }}> Login</Text>
          <Text style={{ fontSize: 22, fontWeight: 'bold', marginLeft: 115, marginTop:10, color: '#231f5c',  }}> WellCome! </Text>
          <Text style={{ fontSize: 15, fontWeight: 'bold', marginLeft: 100, color: '#231f5c' }}> Sing in your account </Text>
        </View>

        <View style={{ marginBottom: 1 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 400,
            marginVertical: 8
          }}>Email address</Text>

          <View style={{
            width: "100%",
            height: 48,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 22,
            backgroundColor: '#231f5c'
          }}>
            <View style={styles.inputContainer}>
              <Image source={require('../screens/Assets/email.png')}
                style={{ width: 30, height: 30, tintColor:'white', marginRight:10  }}
              />
              <TextInput
                placeholder='Enter your email address'
                value={email}
                placeholderTextColor='white'
                keyboardType='email-address'
                style={styles.input}
                onChangeText={(text) => handleCheckEmail(text)}
              />
            </View>
          </View>
          {checkValidEmail ? (
            <Text style={COLORS.red}>Wrong Email Format</Text>) :
            (<Text style={COLORS.red}></Text>)}

        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 400,
            marginVertical: 8
          }} value={password}>Password</Text>

          <View style={{
            width: "100%",
            height: 48,
            borderColor: COLORS.black,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: 22,
            backgroundColor: '#231f5c'
          }}>
            <View style={styles.inputContainer}>            
            <Image source={require('../screens/Assets/lock.png')}
                style={{ width: 40, height: 40, tintColor:'white',marginLeft:30, marginRight:5  }}
              />
            <TextInput
              placeholder='Enter your password'
              placeholderTextColor={COLORS.white}
              secureTextEntry={isPasswordShown}
              style={{
                width: "100%",
                color: 'white'
              }}
              value={password}
              onChangeText={text => setPassword(text)}
            />
            </View>

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12
              }}
            >
              {
                isPasswordShown == true ? (
                  
                  <Image source={require('../screens/Assets/unhide.png')}
                style={{ width: 30, height: 30, tintColor:'white', marginRight:5  }}
              />
                ) : (
                  <Image source={require('../screens/Assets/hide.png')}
                style={{ width: 30, height: 30, tintColor:'white', marginRight:5  }}
              />
                )}

            </TouchableOpacity>
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          marginVertical: 6
        }}>
          <RNCheckBox
            style={{ marginRight: 8,  }}
            value={isChecked}
            onValueChange={(newValue) => {
              setIsChecked(newValue);

              // Clear stored credentials when unchecked
              if (!newValue) {
                AsyncStorage.removeItem('rememberedEmail');
                AsyncStorage.removeItem('rememberedPassword');
              }
            }}
          />
          <Text style={{color:"black", fontSize:18, marginTop:2}}>Remember Me</Text>
        </View>

        <Button
          title="Login"
          filled
          style={{
            marginTop: 18,
            marginBottom: 4,
            backgroundColor:'#231f5c'
          }}
          onPress={handleLogin}
        />
      </View>
    </SafeAreaView>
  );
};
export default SignInScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    borderBottomColor: 'gray',
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
});