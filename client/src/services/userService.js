import axios from 'axios';
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://photologapp.herokuapp.com';

export const updateUserAvatar = async (formData, token) => {
    const headers ={
        'Content-Type': 'multipart/form-data'
      };
    if (token) headers.Authorization = `Bearer ${token}`;
    console.log('wtfsetthis', headers, token);
    console.log('our data', formData);
    try {
        await axios({
            method: 'patch',
            url: `${API_URL}/api/user/avatar`,
            data: formData,
            headers: {...headers}
            });
        return 'ok';
    }catch(err){
        throw new Error(err.response.data.error);
    }
    
    /*const response = await axios.patch(`${API_URL}/api/user/avatar`, formData , {
        headers: {...headers},
        data: formData
      });*/
    // axios patch to avatar
}

export const getUserProfile = async (username, authToken) => {
  const headers ={};

if (authToken) headers.Authorization = `Bearer ${authToken}`;
    try{
      console.log('heders', authToken)
        const response = await axios(`${API_URL}/api/user/${username}`,
        {
          method: 'GET',
          headers: {...headers }
        } 
        );
        console.log(response);
    return response.data;
    }catch(err){
        throw new Error(err.response.data.error);
    }
    
};

export const updateUserProfile = async (data, token) => {
    const headers ={
        'Content-Type': 'application/json'
      };

    if (token) headers.Authorization = `Bearer ${token}`;
      console.log('we got a token', token, headers.Authorization);
      console.log('our data', data);
      try{
        const response = await axios(`${API_URL}/api/user/edit`, {
            method: 'patch',
            headers: {...headers},
            data: data
          });
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem('jwtToken', response.data.token);
          console.log("yazzzz updateprofile work in", JSON.stringify(response.data.user), response.data.token, localStorage);
          return response.data;
      }catch(err){
        throw new Error(err.response.data.error);
      }
      
      
}