import axios from 'axios';
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://photologapp.herokuapp.com';

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