import Geolocation from 'react-native-geolocation-service';
const userLocation = async() => {
    let currentLocations = Geolocation.getCurrentPosition({
    });
    console.log(currentLocations)
    return currentLocations;
}
export default userLocation;