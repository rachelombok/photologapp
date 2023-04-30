import React, { useContext } from 'react';
import { NavDropdown, Button} from 'react-bootstrap'
import { UserContext } from '../../context/UserContext';
import { Link, useHistory } from 'react-router-dom';
import defaultavi from '../../assets/images/defaultavi.jpeg';

const ProfileHeader = ({profile}) => {
// avatar, following, followers, post #
// edit profile or following/follow button
//  useContext is for checking if logged in or not
// get(/:username) is for fetching user

    return (
        <header className="profile-header">
            <img className="avatar" src={defaultavi} alt="avatar"/>
            <div className="profile-header__info">
            <div className="profile-buttons">
            <h2 className="heading-1 font-thin">{profile?.username}</h2>
            {profile.isMe ? (
            <div>'This is your profile'
            <Button>Edit Profile</Button>
            </div>
            ) : (
            <div>'This is someone elses profile'
                <Button>Follow</Button>
            </div> 
            )}
            </div>

            <div className="profile-stats">
            <span>0 posts</span>
            <span>0 followers</span>
            <span>0 following</span>
            </div>
            <h4>{profile?.fullname}</h4>
            <p>{JSON.stringify(profile)}</p>
            </div>
            
            
        </header>
    );
};
export default ProfileHeader;