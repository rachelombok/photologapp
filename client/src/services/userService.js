import axios from 'axios';
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://photologapp.herokuapp.com';

export const updateUserAvatar = async (formData, token) => {
    const headers ={
        'Content-Type': 'multipart/form-data'
      };
    if (token) headers.Authorization = `Bearer ${token}`;
    console.log('wtfsetthis', headers, token);
    console.log('our data', formData);
    await axios({
        method: 'patch',
        url: `${API_URL}/api/user/avatar`,
        data: formData,
        headers: {...headers}
        });
    return;
    /*const response = await axios.patch(`${API_URL}/api/user/avatar`, formData , {
        headers: {...headers},
        data: formData
      });*/
    // axios patch to avatar
}

export const getUserProfile = async (username, authToken) => {
    const response = await axios.get(`${API_URL}/api/user/${username}`,
    authToken && { headers: { authorization: authToken } }
    );
    /*const response = await axios.post('/api/auth/login/github', {
        code,
        state: sessionStorage.getItem('authState'),
      });*/
    console.log(response);
    return response.data;
};

export const updateUserProfile = async (data, token) => {
    const headers ={
        'Content-Type': 'application/json'
      };

    if (token) headers.Authorization = `Bearer ${token}`;
      console.log('we got a token', token, headers.Authorization);
      console.log('our data', data);
      const response = await axios(`${API_URL}/api/user/edit`, {
        method: 'patch',
        headers: {...headers},
        data: data
      });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem('jwtToken', response.data.token);
      console.log("yazzzz updateprofile work in", JSON.stringify(response.data.user), response.data.token, localStorage);
      return response.data;
      
}