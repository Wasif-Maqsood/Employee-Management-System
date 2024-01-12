
import axios from 'axios';
const UpdateUserattendance = async id =>{
    const userId = (id.UserAttendanceData);
    const ide=userId
    const now = new Date();
    const longitud= 74.34689634627284 
    const latitud = 31.529319725960054
    //const longitud= id.longitude
    //const latitud = id.latitude
    const fiveHoursEarlier = new Date(now.getTime() + 5 * 3600 * 1000);
    const timeIn = fiveHoursEarlier.toISOString();
    //const timeIn = '2023-10-25T10:13:00Z';
    console.log("if",id)
    let addr = 'http://39.61.57.232:8003/api/v1/accounts/updateattendance/';
    let id_Att = String(ide)
    address = addr.concat(id_Att)
    const data = {
        time_out: timeIn,
        longitude:longitud,
        latitude:latitud,
      };
      try
      {
      const response = await axios.put(address, data)
      const atte = response.data
      console.log(atte)
      return atte;
      }
      catch(error){
        error.response.data;
        console.log(error.response.data)

    }
    
}
export default UpdateUserattendance