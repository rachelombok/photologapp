import React, { useContext, useState, useEffect } from 'react';
import { Modal, Carousel, Figure, Container, Col, Row, Card, Form, InputGroup, Button } from 'react-bootstrap'
import { UserContext } from '../../context/UserContext';
import { Link, useHistory } from 'react-router-dom';
import defaultavi from '../../assets/images/defaultavi.jpeg';
import '../../css/components/PostModal.css';
import { calculateTimeDifference, formatDateString } from '../../utils/logEntry';
import {Rating} from '@mui/material';
import { retrieveUserFollowers, retrieveUserFollowing } from '../../services/profileService';
import { toast } from "react-toastify";
const UserListModal = ({ userId, token, userListName, userListCount, show, setShow }) => {
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
            //if (userId != response.user) throw new Error('Request user and response user are not the same.')
            console.log('thsi is our studd', response);

            setListOfUsers(response);
            //console.log(`this is our ${userListName} :`, response);
            //if (userListName == 'Following')
        }catch(err){
            toast.error(err.message);
        }
        console.log('only mount following/follower list this once when clicked');
    }, [listOfUsers.users.length]);

    return(
        <Modal show={show} onHide={toggleModal}>
            <Modal.Header closeButton><Modal.Title>{userListName}</Modal.Title></Modal.Header>
            <Modal.Body>This is the users {userListName}, {userListCount}
            {listOfUsers.users?.map((user) => (
                <>{console.log(user.user._id)}
            <div>{user.user.username} and they are following? {user.user.isFollowing ? 'true' : 'false'} is me? {reqUserName == user.user.username ? 'yes its me' : 'no its some else'}</div>
            </>))}
            </Modal.Body>
                {console.log()}
       
        </Modal>
    );
};

export default UserListModal;