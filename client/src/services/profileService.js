import axios from 'axios';
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://photologapp.herokuapp.com';

/**
 * Follows or unfollows a user with a given id depending on
 * whether they are already followed
 * @function followUser
 * @param {string} userId The id of the user to follow/unfollow
 * @param {string} authToken A user's auth token
 */
export const followUser = async (userId, authToken) => {
    const headers ={};

    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    try {
      const response = await axios(`${API_URL}/api/user/${userId}/follow`, {
        method: 'POST',
        headers: {...headers}
      });
      return response.data;
    } catch (err) {
      throw new Error(err);
    }
  };


export const retrieveUserFollowing = async (userId, offset, authToken) => {
    const headers ={};

    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    try {
      const response = await axios(
        `${API_URL}/api/user/${userId}/${offset}/following`,
        {
            method: 'GET',
          headers: {...headers}
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(err);
    }
  };
  
  /**
   * Retrieves who is following the user
   * @function retrieveUserFollowing
   * @param {string} userId The id of the user to retrieve followers from
   * @param {number} offset The offset of how many users to skip for the next fetch
   * @param {string} authToken A user's auth token
   */
  export const retrieveUserFollowers = async (userId, offset, authToken) => {
   
    const headers ={};

    if (authToken) headers.Authorization = `Bearer ${authToken}`;
  
    try {
      const response = await axios(
        `${API_URL}/api/user/${userId}/${offset}/followers`,
        {
          method: 'GET',
          headers: {...headers },
        }
      );
     
      return response.data;
    } catch (err) {
    
      throw new Error(err.response.data.error);
    }
  };