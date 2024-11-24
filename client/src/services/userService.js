import axios from "axios";
const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:1337"
        : "https://photologapp.herokuapp.com";

export const updateUserAvatar = async (formData, token) => {
    const headers = {
        "Content-Type": "multipart/form-data",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
        await axios({
            method: "patch",
            url: `${API_URL}/api/user/avatar`,
            data: formData,
            headers: { ...headers },
        });
        return "ok";
    } catch (err) {
        throw new Error(err.response.data.error);
    }
};

export const getUserProfile = async (username, authToken) => {
    const headers = {};

    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    try {
        const response = await axios(`${API_URL}/api/user/${username}`, {
            method: "GET",
            headers: { ...headers },
        });

        return response.data;
    } catch (err) {
        throw new Error(err.response.data.error);
    }
};

export const updateUserProfile = async (data, token) => {
    const headers = {
        "Content-Type": "application/json",
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    try {
        const response = await axios(`${API_URL}/api/user/edit`, {
            method: "patch",
            headers: { ...headers },
            data: data,
        });
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("jwtToken", response.data.token);

        return response.data;
    } catch (err) {
        throw new Error(err.response.data.error);
    }
};
