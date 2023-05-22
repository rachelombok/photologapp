import React, { useContext, useEffect, useState } from 'react';
import { NavDropdown, Button, Card, Image} from 'react-bootstrap'
import { UserContext } from '../../context/UserContext';
import { Link, useHistory } from 'react-router-dom';
import defaultavi from '../../assets/images/defaultavi.jpeg';
import UserListModal from '../userlistmodal/userlistmodal';
import { followUser } from '../../services/profileService';
import { toast } from "react-toastify";
const ProfileHeader = ({profile, setRefetch}) => {
    const [showFollowersModal, setFollowersModal] = useState(false);
    const [showFollowingModal, setFollowingModal] = useState(false);
    
    const token = localStorage.getItem('jwtToken');
// avatar, following, followers, post #
// edit profile or following/follow button
//  useContext is for checking if logged in or not
// get(/:username) is for fetching user
// dont allow click on following/follower unless authenticated

const follow = async () => {
    try{
        // check if user exists, if not redirect to login page/register page
        const alreadyFollowing = profile?.isFollowing;
        await followUser(profile?._id, token);
        //if (alreadyFollowing) toast.success('')
        //toast.success('you followed them!');
        //window.location.reload(); //figure out how to refresh
       setRefetch(true);
    }catch(err){
        toast.error(err.message);
    }
}

    useEffect(() => {
        console.log("we'll need to update when a user follows someone");
        // use refetch instead when a user follows
    }, [profile?.followersCount, profile?.followingCount, profile?.isFollowing])

const toggleModal = (e) => {
    // console.log(e.target.id, e);
    //console.log(getDisplayLog(e.target.id));
    //setModalLog(getDisplayLog(e.target.id));
    setFollowersModal(false);
    setFollowingModal(false);
  };


    return (
        <>
       {/*  <header className="profile-header">
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
            <span>0 <br></br>posts</span>
            <span>0 followers</span>
            <span>0 following</span>
            </div>
            <h4>{profile?.fullname}</h4>
            {console.log(JSON.stringify(profile))}
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
            </div>
            
            
        </header>*/}
        <Card border="light" >
      <Card.Body className='profile-header'>
      
      <Image src={profile?.avatar} className='avatar'/>
      <div>
        <Card.Title as='h2' style={{ margin: '10px 0 0 0' }}>{profile?.fullname}

        {profile.isMe ? (
            
            <Button style={{ margin: '10px' }} size='sm' href='/edit'>Edit Profile</Button>
            
            ) : profile?.isFollowing ? 
            (
                <Button style={{ margin: '10px' }} size='sm' onClick={follow}>Unfollow</Button>
            )
            : (
            
                <Button style={{ margin: '10px' }} size='sm' onClick={follow}>Follow</Button>
           
            )}
        </Card.Title>
        
        <Card.Subtitle className="mb-2 text-muted">@{profile?.username}</Card.Subtitle>
        <Card.Link onClick={() => console.log('this link was clicked')}>{profile?.logCount} posts</Card.Link>
        <Card.Link onClick={() => setFollowersModal(true)}>{profile?.followersCount} followers</Card.Link>
        <Card.Link onClick={() => setFollowingModal(true)}>{profile?.followingCount} following</Card.Link>
        
        <Card.Text>
        {profile?.bio}
         </Card.Text>
        <Card.Link href={profile?.website}>{profile?.website}</Card.Link><br></br>
        
        </div>
        {showFollowersModal && profile?.followersCount ? <UserListModal userId={profile?._id} token={token} userListName={'Followers'} userListCount={profile?.followersCount} show={showFollowersModal} setShow={setFollowersModal}/> : null}
        {showFollowingModal && profile?.followingCount ? <UserListModal userId={profile?._id} token={token} userListName={'Following'} userListCount={profile?.followersCount} show={showFollowingModal} setShow={setFollowingModal}/> : null}
      </Card.Body>
    </Card>
        </>
    );
};
export default ProfileHeader;