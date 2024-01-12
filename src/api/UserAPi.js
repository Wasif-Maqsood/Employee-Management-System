import ApiManager from '../api/ApiManager';

const UserLogin = async data =>{
    
    try{
        
        const result = await ApiManager('Emplogin/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            data: data,
        });
        //console.log(result)
        return result;

    }catch(error){
        error.response.data;
        console.log(error.response.data)

    }
}
export default UserLogin