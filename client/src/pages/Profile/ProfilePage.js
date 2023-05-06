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
const ProfilePage = ({url}) => {
    // profile header
    // profile post content
    console.log(url);
    let { username } = useParams();
    const [profile, setProfile] = useState({});
    const token = localStorage.getItem('token'); // we can also usecontext isntead
    const { user, setUser } = useContext(UserContext);
    const [deadend, setDeadend] = useState(false);
    if (!username) username = url;
    console.log('arewegetting params?', username);

    useEffect(async() => {
        await getUserProfile(username, token).then((res) => {
            console.log('setting profile', res)
            console.log(console.log(user._id, res.user._id))
            res.user.isMe = user._id == res.user._id ? true : false;
            setDeadend(false);
            setProfile(res.user);
            
        }).catch((err) => setDeadend(true));
      }, [username, url]);
// pass to profile header
// localStorage.get('user')
      if (deadend){
        return (
            <div> The username you searched does not exist, try another</div>
        )
      }
      return (
<div style={{overflow: 'visible !important'}}> 
<Button as={Link} to='/'>Back to Map</Button>
        <div className="profile-page grid">
            
            <ProfileHeader profile={profile} />
            
        {console.log("fteched logs", profile.logs)}
    <ProfilePostSection logs={profile.logs}/>
        </div>
        </div>
      )
    
};
export default ProfilePage;