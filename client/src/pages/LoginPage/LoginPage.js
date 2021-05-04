import React, { useEffect } from 'react';
import './loginpage.css';

class LoginPage extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
          animationClass: 'day', loginClass: 'login-box-day'
        }
        this.changeState = this.changeState.bind(this);
    }
    changeState(){
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
    }

    render(){
        return(
            <div className={this.state.animationClass}>
                <p>Yo</p>
                <div className={this.state.loginClass}></div>
                <button onClick={this.changeState}>Stop / Start</button>
            </div>

        );
    }
}

export default LoginPage;