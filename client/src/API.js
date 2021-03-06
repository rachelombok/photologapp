import axios from "axios";
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:1337' : 'https://photologapp.herokuapp.com';
//const API_URL = 'https://photologapp.herokuapp.com';
// https://photologapp.herokuapp.com
// http://localhost:1337
export async function listLogEntries(){
    const response = await fetch(`${API_URL}/api/logs`);
    console.log(API_URL);
    return response.json();
}

export async function createLogEntry(entry) {
    for (var key of entry.entries()) {
      console.log(key[0] + ', ' + key[1])
    }
    /*const response = await axios.post(`${API_URL}/api/logs`, {
      entry,
        headers: {
          "Content-Type": "multipart/form-data",
        },
  });*/

  
  await axios({
    method: 'post',
    url: `${API_URL}/api/logs`,
    data: entry,
    headers: {'Content-Type': 'multipart/form-data' }
    }).then(response => { 
      console.log(response);
      console.log('workedhere');
    })
    .catch(error => {
        console.log(error.response)
        console.log('didntworkedhere');
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
    const response = await fetch(`${process.env.API_URL}/api/logs/image-upload`, {
      method: 'POST',
      headers: {
        "content-type": "multipart/form-data",
      },
      body: formData
    });
    console.log(response);
    return response.data;
    
  }
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