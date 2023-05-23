import React, { useContext, useState, useEffect } from 'react';
import { Modal, Carousel, Figure, Container, Col, Row, Card, Form, InputGroup, Button } from 'react-bootstrap'
import { UserContext } from '../../context/UserContext';
import { Link, useHistory } from 'react-router-dom';
import defaultavi from '../../assets/images/defaultavi.jpeg';
import '../../css/components/PostModal.css';
import { calculateTimeDifference, formatDateString, calculateCommentTimeDifference } from '../../utils/logEntry';
import {Rating, Avatar, AvatarGroup } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { toast } from "react-toastify";
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import CommentForm from '../commentform/commentform';
import { getComments, getLogEntryLikes, toggleLike } from '../../services/postService';

const LoginModal = ({modal, setModal, message}) => {

    const toggleModal = () => {
        setModal(!modal);
      };

    return(
        <Modal show={modal} onHide={toggleModal} size='sm' centered className='post-modal'>
            <Modal.Header closeButton/>
            <Modal.Body className='post-modal-title'>
          <p>{message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button as={Link} to='/register' variant="secondary">Register</Button>
          <Button as={Link} to='/login' variant="dark" className='justshoot-btn'>Login</Button>
        </Modal.Footer>
        </Modal>
    )
}

export default LoginModal;