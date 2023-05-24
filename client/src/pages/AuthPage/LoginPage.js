import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import './authpage.css';
import { Card, Form, Button } from 'react-bootstrap'
import { Link, useHistory, Redirect } from 'react-router-dom';
import {
  registerUser,
  login,
} from '../../services/authenticationService';
import { UserContext } from '../../context/UserContext';
import { toast } from "react-toastify";

const LoginPage = () => {
  const history = useHistory();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(()=>{
    if(Boolean(user)){
      history.push('/');
    }
  }, [user]);
   


    const handleOnChange = (event) => {
      const { name, value } = event.target;
      
    };

    const onSubmit = async (data) => {
    
      try{
        const res = await login(data.email, data.password);
       
        setUser(res.user);
        toast(`📸 Welcome back ${res.user.fullname}!`, {hideProgressBar: true, progressClassName:'justshoot-notification-progress-bar'});
        history.push("/");
      } catch(error){
        toast.error(error.message, {position: "top-right"});
        console.error(error);
      }
    }

    
        return(
          
            <div className='day'>
              
          <div >
          <Link to="/register"><Button variant="outline-light" className='switch-btn'>Sign Up</Button>{' '}</Link>
          </div>

          <div className='center'>
            <Form 
            className='login-container'
            onSubmit={handleSubmit(onSubmit)}
            encType='multipart/form-data'
            >
              <h3>Login</h3>

            
            <Form.Group controlId="formBasicEmail" className="btn-block" >
          <Form.Label >Email address/Username</Form.Label>
          <Form.Control 
          name='email'
          placeholder="Enter email or username" 
          size="lg"
          ref={register}
          onChange={handleOnChange}
          required
          />
        </Form.Group>


        <Form.Group controlId="formBasicPassword" className="btn-block">
          <Form.Label>Password</Form.Label>
          <Form.Control 
          name='password'
          type="password" 
          placeholder="Enter password" 
          size="lg"
          ref={register}
          onChange={handleOnChange}
          required
          minLength={8}
          />
        </Form.Group><br></br>
        
        <Button variant="light" type="submit" size='md'>
          Submit
        </Button>
        <p className="forgot-password ">
                    Forgot <a href="#" style={{color: '#fff'}}>password?</a>
                </p>
               
                
        </Form>
        </div>

            </div>
            


        );
}

export default LoginPage;