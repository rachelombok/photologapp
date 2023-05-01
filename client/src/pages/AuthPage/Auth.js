import React, { useState } from "react";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";

const Auth = () => {
  const [auth, setAuth] = useState("LOGIN");

  const login = () => setAuth("LOGIN");
  const register = () => setAuth("REGISTER");

  if (auth === "LOGIN") {
    return <LoginPage register={register} />;
  }

  if (auth === "REGISTER") {
    return <RegisterPage login={login} />;
  }
};

export default Auth;