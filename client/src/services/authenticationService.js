import axios from 'axios';
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://photologapp.herokuapp.com';

export const signOut = () => () => {
  localStorage.removeItem('token');
};

export const signInSuccess = (response) => {
  localStorage.setItem('jwtToken', response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  console.log("yazzzz signed in", response, localStorage);
  
};

export const signInFailure = (err) => ({
  
});

export const setAuthentication = (token) => {
	if (token) {
		axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
	} else {
		axios.defaults.headers.common['Authorization'] = null
	}
}

/**
 * Logs a user in with the provided credentials
 * @function login
 * @param {string} usernameOrEmail The username or email to login with
 * @param {string} password A password to log in with
 * @param {string} authToken A token to be used instead of a username/email or password
 * @returns {object} The user object
 */
export const login = async (usernameOrEmail, password, authToken) => {
  console.log('begin login', usernameOrEmail, password, authToken);
  try {
    const request =
      usernameOrEmail && password
        ? { data: { usernameOrEmail, password } }
        : { headers: { authorization: authToken } };
    const response = await axios(`${API_URL}/api/auth/login`, {
      method: 'POST',
      ...request,
    });
    signInSuccess(response);
    setAuthentication(response.data.token);
    //localStorage.setItem('jwtToken', response.data.token)
    console.log("loginres", response)
    // jwt.encode({ id: user._id }, "j2390jf09kjsalkj4r93"),
    return response.data;
  } catch (err) {
    console.log("login error");
    throw new Error(err.response.data.error);
  }
};

/**
 * Logs the user in or signs them up with their github account
 * @function githubLogin
 * @param {number} code Code provided by github to exchange for an access code
 * @returns {object} User object
 */
export const githubAuthentication = async (code) => {
  try {
    const response = await axios.post('/api/auth/login/github', {
      code,
      state: sessionStorage.getItem('authState'),
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};

/**
 * Registers a user with the provided credentials
 * @param {string} email A user's email address
 * @param {string} fullName A user's full name
 * @param {string} username A user's username
 * @param {string} password A user's password
 * @returns {object} The user object
 */
export const registerUser = async (email, fullname, username, password) => {
  console.log('begin reg', email, username, password);
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      email,
      fullname,
      username,
      password,
    });
    const res = await login(email, password, response.data.token);
    console.log(response.data);
    //response.data.token
    return response.data;
  } catch (err) {
    console.log("register error");
    throw new Error(err.response.data.error);
   
  }
};

/**
 * Changes a users password
 * @function changePassword
 * @param {string} oldPassword The user's current password
 * @param {string} newPassword The new password
 * @param {string} authToken A user's auth token
 */
export const changePassword = async (oldPassword, newPassword, authToken) => {
  try {
    await axios.put(
        `${API_URL}/api/auth/login`,
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          authorization: authToken,
        },
      }
    );
  } catch (err) {
    throw new Error(err.response.data.error);
  }
};