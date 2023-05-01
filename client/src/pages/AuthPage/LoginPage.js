import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import './authpage.css';
import { Card, Form, Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom';
import {
  registerUser,
  login,
} from '../../services/authenticationService';
import { UserContext } from '../../context/UserContext';

const LoginPage = () => {
  const history = useHistory();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
    /*constructor (props) {
        super(props);
        this.state = {
          animationClass: 'day', loginClass: 'login-box-day', fullname:'', email: '', username: '', password: '', loginStatus: false
        }
        this.changeState = this.changeState.bind(this);
    }*/


    const changeState = () => {
      /*
        if(this.state.animationClass === 'day'){
          this.setState({
            animationClass: 'day night'
          });
        }else{
          this.setState({
            animationClass: 'day'
          });
        }

        if(this.state.loginClass === 'login-box-day'){
            this.setState({
                loginClass: 'login-box-day login-box-night'
            });
          }else{
            this.setState({
                loginClass: 'login-box-day'
            });
          }
          */
    }

    const handleOnChange = (event) => {
      const { name, value } = event.target;
      //console.log(this.state);
      //this.setState({ [name]: value });
    };

    const onSubmit = async (data) => {
      console.log(data);
      try{
        const res = await login(data.email, data.password);
        console.log(res);
        setUser(res.user);
        //localStorage.setItem("jwt",data.token)
        history.push("/");
      } catch(error){
        console.error(error);
      }
    }

    /*const handleSubmit(event) {
      event.preventDefault();
      console.log(event);
      let formData = new FormData();
      //await this.saveLogin(this.state.nam, this.state.email, this.state.username, this.state.password);
      //await this.updateLoginState();
      this.setState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        email_error: '',
        password_error: ''
      });
      console.log(this.state);
    }*/

    
        return(
          
            <div className='day'>
              {/* button for darkmode
                <p>Yo</p>
                <div className={this.state.loginClass}></div>
                <button onClick={this.changeState}>Stop / Start</button>
          */}
          <div >
          <Link to="/test2"><Button variant="outline-light" className='switch-btn'>Sign Up</Button>{' '}</Link>
          </div>

          <div className='center'>
            <Form 
            className='login-container'
            onSubmit={handleSubmit(onSubmit)}
            encType='multipart/form-data'
            >
              <h3>login</h3>

            
            <Form.Group controlId="formBasicEmail" className="btn-block" >
          <Form.Label >Email address</Form.Label>
          <Form.Control 
          name='email'
          type="email" 
          placeholder="Enter email" 
          size="lg"
          ref={register}
          //value={this.state.email}
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
          //value={this.state.password}
          onChange={handleOnChange}
          required
          minLength={8}
          />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox" >
          <Form.Check type="checkbox" label="Remember Me" />
        </Form.Group>
        
        <Button variant="light" type="submit" block size='md'>
          Submit
        </Button>
        <p className="forgot-password ">
                    Forgot <a href="#" style={{color: '#fff'}}>password?</a>
                </p>
               
                
        </Form>
        </div>

        {/*<Form 
            className='login-container-test'
            
            >
              <h3 className='centeraligntext'>Log in2</h3>
            
            <Form.Group controlId="formBasicEmail" className="btn-block">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="btn-block">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>
        
        <Button variant="dark" type="submit" block>
          Submit
        </Button>
        <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
        </Form>*/}
            </div>
            


        );
}

export default LoginPage;