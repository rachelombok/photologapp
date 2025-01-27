import axios from "axios";
const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:1337"
        : "https://photologapp.herokuapp.com";

export const signOut = () => () => {
    localStorage.removeItem("jwtToken");
};

export const signInSuccess = (response) => {
    localStorage.setItem("jwtToken", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
};

export const signInFailure = (err) => ({});

export const setAuthentication = (token) => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
        axios.defaults.headers.common["Authorization"] = null;
    }
};

/**
 * Logs a user in with the provided credentials
 * @function login
 * @param {string} usernameOrEmail The username or email to login with
 * @param {string} password A password to log in with
 * @param {string} authToken A token to be used instead of a username/email or password
 * @returns {object} The user object
 */
export const login = async (usernameOrEmail, password, authToken) => {
    try {
        const request =
            usernameOrEmail && password
                ? { data: { usernameOrEmail, password } }
                : { headers: { authorization: authToken } };
        const response = await axios(`${API_URL}/api/auth/login`, {
            method: "POST",
            ...request,
        });
        signInSuccess(response);
        setAuthentication(response.data.token);
        return response.data;
    } catch (err) {
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
        const response = await axios.post("/api/auth/login/github", {
            code,
            state: sessionStorage.getItem("authState"),
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
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            email,
            fullname,
            username,
            password,
        });
        const res = await login(email, password, response.data.token);

        return response.data;
    } catch (err) {
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
    const headers = {
        "Content-Type": "application/json",
    };

    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    const data = {
        oldPassword: oldPassword,
        newPassword: newPassword,
    };
    try {
        await axios({
            method: "patch",
            url: `${API_URL}/api/auth/password`,
            data: data,
            headers: { ...headers },
        });
    } catch (err) {
        if (err.response.data?.message)
            throw new Error(err.response.data?.message);
        throw new Error(err.response.data.error);
    }
};
