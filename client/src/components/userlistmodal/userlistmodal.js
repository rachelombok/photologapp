import React, { useContext, useState, useEffect } from 'react';
import { Modal, Container } from 'react-bootstrap'
import { UserContext } from '../../context/UserContext';
import '../../css/components/PostModal.css';
import { retrieveUserFollowers, retrieveUserFollowing } from '../../services/profileService';
import { toast } from "react-toastify";
import UserListItem from '../userlistitem/userlistitem';
const UserListModal = ({ userId, token, userListName, userListCount, show, setShow, follow }) => {
    const [listOfUsers, setListOfUsers] = useState({user: {}, users: []});
    // listOfUsers = following or followers ids?
    // string saying which list 'Followers' or 'Following'
    // userid for person making the request (use context), token
    // or just user
    // listCount = follower or following count
    const { user } = useContext(UserContext);
    const reqUserName = user.username;
    const toggleModal = () => {
        setShow(!show);
      };

    useEffect(async() => {
        console.log('these are the params', userId, token, userListCount);
        try{
            const response = userListName == 'Following' ? await retrieveUserFollowing(userId, userListCount, token) :
            await retrieveUserFollowers(userId, userListCount, token);
            
            console.log('thsi is our studd', response);

            setListOfUsers(response);
        }catch(err){
            toast.error(err.message);
        }
        console.log('only mount following/follower list this once when clicked');
    }, [listOfUsers.users.length]);

    return(
        <Modal show={show} onHide={toggleModal} className='post-modal'>
            <Modal.Header closeButton><Modal.Title className='post-modal-title'>{userListName}</Modal.Title></Modal.Header>
            <Modal.Body className='post-modal-title'>
            
            {listOfUsers.users?.map((user) => (
              
                <UserListItem user={user.user} reqUserName={reqUserName} follow={follow}/>
                
             ))}
            
            </Modal.Body>
       
        </Modal>
    );
};

export default UserListModal;