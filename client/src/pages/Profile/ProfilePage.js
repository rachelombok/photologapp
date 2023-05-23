import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { UserContext } from '../../context/UserContext';
import { getUserProfile
 } from '../../services/userService';
import ProfileHeader from '../../components/profileheader/profileheader';
import ProfilePostSection from '../../components/profilepostsection/profilepostsection';
import '../../css/pages/ProfilePage.css';
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
    const history = useHistory();
    if (!username) username = url;
   

    useEffect(async() => {
      
        await getUserProfile(username, token).then((res) => {
            console.log('setting profile', res)
            
            if (Boolean(user)){ // if user is authenticated
              res.user.isMe = user._id == res.user._id ? true : false;
              res.user.isFollowing = res.isFollowing;
            }
            setDeadend(false);
            setProfile(res.user);
            
        }).catch((err) => {setDeadend(true); console.log(err);});
        setRefetch(false);
      }, [refetch, username, url, token]);

      if (deadend){
        return (
            <NotFoundPage/>
        )
      }
      return (
<div style={{overflow: 'visible !important'}}> 
        <div className="profile-page grid">
            
            <ProfileHeader profile={profile} setRefetch={setRefetch}/>
            
       
    <ProfilePostSection logs={profile.logs}/>
        </div>
       
        </div>
      )
    
};
export default ProfilePage;