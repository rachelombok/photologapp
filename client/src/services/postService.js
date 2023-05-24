import axios from "axios";
const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:1337"
        : "https://photologapp.herokuapp.com";
//const API_URL = 'https://photologapp.herokuapp.com';
// https://photologapp.herokuapp.com
// http://localhost:1337
export async function listLogEntries() {
    try {
        const response = await fetch(`${API_URL}/api/logs`);

        return response.json();
    } catch (e) {
        throw new Error(e.response.data.error);
    }
}

export async function createLogEntry(entry, token) {
    //const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "multipart/form-data",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    /*const response = await axios.post(`${API_URL}/api/logs`, {
      entry,
        headers: {
          "Content-Type": "multipart/form-data",
        },
  });*/

    await axios({
        method: "post",
        url: `${API_URL}/api/logs`,
        data: entry,
        headers: { ...headers },
    })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error.response);

            throw new Error(error.response.data.error);
        });

    /*.then(function (response) {
      console.log(response);
    });*/

    /*if (response.headers.get('content-type').includes('text/html')) {
    const message = await response.text();
    json = {
      message,
    };
  } else {
    json = await response.json();
  }
  if (response.ok) {
    return json;
  }
  const error = new Error(json.message);
  error.response = json;
  console.log('stillhere');
  throw error;*/
}

export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    try {
        const response = await fetch(
            `${process.env.API_URL}/api/logs/image-upload`,
            {
                method: "POST",
                headers: {
                    "content-type": "multipart/form-data",
                },
                body: formData,
            }
        );
        return response.data;
    } catch (e) {
        throw new Error(e.response.data.error);
    }
}

export async function createComment(logId, message, token) {
    let data = new FormData();
    data.append("message", message);
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
        const response = await axios(`${API_URL}/api/logs/${logId}/comments`, {
            method: "POST",
            headers: { ...headers },
            data: { message },
        });

        return response.data;
    } catch (e) {
        throw new Error(e.response.data.error);
    }
}

export const deleteComment = async (commentId, logId, token) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
        await axios(`${API_URL}/api/logs/${commentId}/${logId}/comments`, {
            method: "DELETE",
            headers: { ...headers },
        });
    } catch (err) {
        throw new Error(err);
    }
};

export const getComments = async (logId) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/logs/${logId}/comments`
        );
        return response.data;
    } catch (err) {
        throw new Error(err);
    }
};

export async function toggleLike(logId, token) {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
        const response = await axios(`${API_URL}/api/logs/${logId}/likes`, {
            method: "POST",
            headers: { ...headers },
        });

        return response.data;
    } catch (e) {
        throw new Error(e.response.data.error);
    }
}

export const getLogEntryLikes = async (logId) => {
    try {
        const response = await axios.get(`${API_URL}/api/logs/${logId}/likes`);
        return response.data;
    } catch (err) {
        throw new Error(err);
    }
};

export const getFeed = async (token, offset = 10) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
        const response = await axios(`${API_URL}/api/logs/feed/${offset}`, {
            method: "GET",
            headers: { ...headers },
        });
        return response.data;
    } catch (err) {
        throw new Error(err);
    }
};
/*
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const response = await axios.post(
    `${API_URL}/api/logs/image-upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(response);
  return response.data;
}*/
