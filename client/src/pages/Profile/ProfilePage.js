import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Card, Form, Button, Image } from 'react-bootstrap'
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  registerUser,
  login,
} from '../../services/authenticationService';
import { UserContext } from '../../context/UserContext';
import { getUserProfile
 } from '../../services/userService';
import ProfileHeader from '../../components/profileheader/profileheader';
import ProfilePostSection from '../../components/profilepostsection/profilepostsection';
import '../../css/pages/ProfilePage.css';
import pic from '../../assets/images/defaultavi.jpeg';
import NotFoundPage from '../NotFoundPage/NotFound';
const ProfilePage = ({url}) => {
    // profile header
    // profile post content
    // set up this page to work for without authentication
    console.log(url);
    let { username } = useParams();
    const [profile, setProfile] = useState({});
    const token = localStorage.getItem('jwtToken'); // we can also usecontext isntead
    const { user, setUser } = useContext(UserContext);
    const [deadend, setDeadend] = useState(false);
    const [refetch, setRefetch] = useState(false);
    if (!username) username = url;
    console.log('arewegetting params?', username);

    useEffect(async() => {
        await getUserProfile(username, token).then((res) => {
            console.log('setting profile', res)
            // console.log(console.log(user._id, res.user._id)); // this causes ou deadend
            if (Boolean(user)){ // if user is authenticated
              res.user.isMe = user._id == res.user._id ? true : false;
              res.user.isFollowing = res.isFollowing;
            }
            setDeadend(false);
            setProfile(res.user);
            
        }).catch((err) => {setDeadend(true); console.log(err);});
        setRefetch(false);
      }, [refetch, username, url]);
// pass to profile header
// localStorage.get('user')

      if (deadend){
        console.log('wdeasdaend',deadend);
        return (
            <NotFoundPage/>
        )
      }
      return (
<div style={{overflow: 'visible !important'}}> 
<Button as={Link} to='/'>Back to Map</Button>
        <div className="profile-page grid">
            
            <ProfileHeader profile={profile} setRefetch={setRefetch}/>
            
        {console.log("fteched logs", profile.logs)}
    <ProfilePostSection logs={profile.logs}/>
        </div>
        </div>
      )
    
};
export default ProfilePage;