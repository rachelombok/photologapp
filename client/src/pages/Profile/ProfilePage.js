import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Card, Form, Button } from 'react-bootstrap'
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  registerUser,
  login,
} from '../../services/authenticationService';
import { UserContext } from '../../context/UserContext';
import { getUserProfile
 } from '../../services/userService';
const ProfilePage = () => {
    // profile header
    // profile post content
    const { username } = useParams();
    const [profile, setProfile] = useState({});
    const token = localStorage.getItem('token'); // we can also usecontext isntead

    useEffect(() => {
        getUserProfile(username, token).then((res) => {
            console.log('setting profile', res)
            setProfile(res.user);
        }).catch((err) => console.log(err));
      }, [username]);

      return (
        <div>
            <h1>This is a users profile</h1>
            {console.log(profile)}
            <p>{JSON.stringify(profile)}</p>
        </div>
      )
    
};
export default ProfilePage;