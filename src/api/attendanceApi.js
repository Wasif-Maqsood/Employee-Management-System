import { useState } from 'react';
import axios from 'axios';

const Userattendance = async (id) =>{
    const userId = id.timeUserId;
    const now = new Date();
    const longitud= 74.34689634627284
    const latitud = 31.529319725960054
    //const longitud= id.longitude
    //const latitud = id.latitude
    const fiveHoursEarlier = new Date(now.getTime() + 5 * 3600 * 1000);
    const timeIn = fiveHoursEarlier.toISOString();
    //const timeIn = '2023-10-25T10:13:00Z';
    //console.log(longitud,latitud)
    console.log('userId',userId)
    console.log('id',id)
    
    const data = {
        user_id: userId,
        time_in: timeIn,
        longitude:longitud,
        latitude:latitud,
      };
      try
      {
      const response = await axios.post('http://39.61.57.232:8003/api/v1/accounts/markattendance/', data)
      //const atte = response.data
      console.log(response)
      return response.data;
      }
      catch(error){
        error.response.data;
        console.log(error.response.data)

    }
        
    
}
export default Userattendance