import React, { useState, createContext } from "react";
import { useLocation, useHistory } from 'react-router-dom';
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    //const history = useHistory();
  const localSt = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(localSt ? localSt : null);

  /*history.listen(location =>{
    console.log('this is da loc', location);
    if (pathName === your_path_that_need_authentication) {
        // if token expired  then   history.push(login_page));


    if (localStorage.getItem("JWT_Token")) {
      const jwt_Token_decoded = Jwt_Decode(localStorage.getItem("JWT_Token"));
      console.log(jwt_Token_decoded.exp * 1000);
      console.log(Date.now());
      if (jwt_Token_decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
      } else {
        initialstate.user = jwt_Token_decoded;
      }
    }

    let token = localStorage.getItem('JWT_Token')
  const { exp } = jwtDecode(token)
  const expirationTime = (exp * 1000) - 60000
  if (Date.now() >= expirationTime) {
    localStorage.clear();
    history.push('/login');
  }
  }
  })*/
  

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};