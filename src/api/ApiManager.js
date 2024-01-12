import axios from "axios"
const ApiManager =axios.create({
    baseURL: 'http://39.61.57.232:8003/api/v1/accounts/',
    responseType: 'json',
    withCredentials: true


})



export default ApiManager

