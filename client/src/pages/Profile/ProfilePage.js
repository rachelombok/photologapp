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
import ProfileHeader from '../../components/profileheader/profileheader';
import '../../css/pages/ProfilePage.css';
const ProfilePage = () => {
    // profile header
    // profile post content
    const { username } = useParams();
    const [profile, setProfile] = useState({});
    const token = localStorage.getItem('token'); // we can also usecontext isntead
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        getUserProfile(username, token).then((res) => {
            console.log('setting profile', res)
            console.log(console.log(user._id, res.user._id))
            res.user.isMe = user._id == res.user._id ? true : false;
            setProfile(res.user);
        }).catch((err) => console.log(err));
      }, [username]);
// pass to profile header
// localStorage.get('user')
      return (

        <div className="profile-page grid">
            <ProfileHeader profile={profile} />
            
        </div>
      )
    
};
export default ProfilePage;