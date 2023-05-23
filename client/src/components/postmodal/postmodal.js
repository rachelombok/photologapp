import React, { useContext, useState, useEffect } from 'react';
import { Modal, Carousel, Figure, Container, Col, Row, Card, Form, InputGroup, Button } from 'react-bootstrap'
import { UserContext } from '../../context/UserContext';
import { Link, useHistory } from 'react-router-dom';
import defaultavi from '../../assets/images/defaultavi.jpeg';
import '../../css/components/PostModal.css';
import { calculateTimeDifference, formatDateString, calculateCommentTimeDifference } from '../../utils/logEntry';
import {Rating, Avatar, AvatarGroup, Chip, Stack } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { toast } from "react-toastify";
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import CommentForm from '../commentform/commentform';
import { getComments, getLogEntryLikes, toggleLike } from '../../services/postService';

const PostModal = ({modal, setModal, logEntry, fromMap = false}) => {
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [isLogLiked, setIsLogLiked] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const { user } = useContext(UserContext);
    console.log('PostModal rendered', logEntry);
    const token = localStorage.getItem('jwtToken');
    const date = new Date();
    //modal, setModal,
    
    // fetch user data using the user id on the logentry
    // display a modal with the post data
    // // will be used on map and profile, so make it general for both
    // pass logentry to Modal, check if on profile or on map, also send profile info
    // only update if logentry or show prop changes
    // new endpoint to just get avatar / username
    // if displaying modal on Map page, dont put Link to "see this on map"
    // dont allow someone to comment if not logged in 
    // fetch who liked the post, use refetch here too
    // list of who liked, userlistmodal

    // DISPLAY
    // carousel of all images (lazy loaded) ✅
    // name of who posted and username (click link to go to their profile)✅
    // place Name and date it was visited✅
    // how long ago it was posted (move that function to utils file)
    // descritpion of place etc✅
    // location icon w/ name of where the photolog was left 
    // avi of user 
    // show hash tags (when ready)
    // border around carousel
    // add key to carousel.item
    // add avatar to each comment
    // add href link to username subtitle, no underline or blue color
    // if comment section is empty, put an 'add your comment' message
    // add border to like list avatars


    const toggleModal = () => {
        setModal(!modal);
      };
    
    const handleLike = async (e) =>{
        e.preventDefault();
        
        try {
            if (!Boolean(user)) return toast.error('Must have an account to leave a like.', {hideProgressBar: true});
            //const res = await createComment(logId, commentMessage.value, token);
            const res = await toggleLike(logEntry._id, token);
            toast.success("liked!");
            setIsLogLiked(!isLogLiked);
            setRefetch(true);
        } catch(e){
            setRefetch(false);
            toast.error(e.message);
        }
        // wrap this all around try n catch
        // also grey out submit button if no comment
        // grey out if only spaces, strip comment message

        
          // call function to create comment
          // toast success
          //
    }

    const isLiked = () => {
        let found = false;
        if (user && token && likes){
            likes.forEach((like)=>{
                if (like.author._id == user._id){
                    console.log('found our user in list of likes!');
                    found = true
                    setIsLogLiked(true);
                    setRefetch(false);
                    return;
                }
            })
        }
        if (!found){
            console.log('shouldnt make it here if user has liked')
            setIsLogLiked(false);
        }
      };

    useEffect( async () => {
        // retrieve comments here w logId
        const commentList = await getComments(logEntry._id);
        const likeList = await getLogEntryLikes(logEntry._id);
        console.log('only mount this once when clicked', commentList, likeList);
        setComments(commentList);
        setLikes(likeList);
        isLiked();
        setRefetch(false);
    }, [comments.length, likes?.length, refetch])

    return(
        <Modal show={modal} onHide={toggleModal} size='lg' className='post-modal' >


<Modal.Header closeButton>
<Modal.Title className='post-modal-title'>{logEntry.placeName}</Modal.Title> 
</Modal.Header>
<Modal.Body>
{logEntry.image ? logEntry.image.length > 1 ? 
                    <Carousel fade variant='light'>
                        {logEntry.image.map(function(e, i) {
                            return (
                            
                            <Carousel.Item key ={i}>
                                <img
                                  className="d-block w-100 carousel-post-img"
                                  src={e}
                                  alt="First slide"
                                  key={i}
                                  loading="lazy"
                                />
                              </Carousel.Item>
                              
                              );
                        })} </Carousel>: <img className="d-block w-100 carousel-post-img" src={logEntry.image[0]}/>
                    : null }

        
<Card className='post-modal-card'>

<Container >
          <Row>
          <Figure.Caption >Posted by <Link to={`/${logEntry.photographer}`} className='justshoot-link'>{logEntry.photographer}</Link></Figure.Caption>
            <Col xs={12} md={8} style={{borderLeft: '2px solid #999999', borderRight: '2px solid #999999'}}>
                <Card.Title className='post-modal-title'>
                    Description
                </Card.Title>
                <p>{logEntry.description} </p>
                  
            {logEntry.tags ? 
            
            <>
    <Card.Title className='post-modal-title'>
                        Tags
            </Card.Title>
            <Stack direction="row" spacing={1}>
            {logEntry.tags.split(',').map((tag) =>(
                <Chip label={`${tag}`} clickable key={tag}/>
            ))}
            </Stack>
            </>: null}

            <Card.Title className='post-modal-title'>
                        Visit Date
            </Card.Title>
            <p>{formatDateString(logEntry.visitDate)}
             </p>
            
            <Card.Title className='post-modal-title'>Rating</Card.Title>
            <Rating name="read-only" value={logEntry.rating} readOnly />
            {!fromMap ? <Link to={{ pathname: "/", lat: logEntry.latitude, long: logEntry.longitude  }}> See this post on the map</Link> : null}
            
            
            {likes?.length > 1 ? (<>
            <Card.Title className='post-modal-title'>Liked By</Card.Title>
            <div>
           
            <AvatarGroup max={10} appearance="stack" sx={{display: 'inline-flex'}}>
                
                {likes.map((like) => (
                    <Avatar src={`${like.author.avatar}`} key={like}/>
                ))}
            </AvatarGroup>
           </div></>) : null

                    }
            <br></br> <br></br>
            <Button variant='dark' target="_blank" rel="noopener noreferrer" href={`http://maps.google.com?q=${logEntry.latitude},${logEntry.longitude}&z=6`} className="justshoot-btn"> Get Directions</Button>
            {/*{likes ? 
            ( <AvatarGroup max={5}>
                {likes.likes.map((like) => (
                    <Avatar src={`${like.author.avatar}`}/>
                ))}
             </AvatarGroup>) : null }
            </Col>*/}
</Col>
            
            <Col xs={6} md={4} >
            <Card.Title>Comments</Card.Title>
            
         <div className='comments-section grid'>
            {comments?.length > 0 ? comments.map((comment) => (
                <div >
                    <div style={{ display: 'inline-flex'}}>
                 <Avatar src={comment.author.avatar} sx={{ width: 24, height: 24, marginRight: '3px' }}/>
                <div id='username'>
               
                <Card.Subtitle ><Link to={`${comment.author.username}`} className='justshoot-link'> @{comment.author.username}</Link></Card.Subtitle>{' '}
                <small>{calculateCommentTimeDifference(comment.createdAt,date)}</small>
                </div>
                </div>

                <p>{comment.message}</p>
                </div>
            )): <h6 style={{bottom: 0}}>Add the first comment!</h6>}

           
           </div>
           
            <CommentForm logId={logEntry._id} setRefetch={setRefetch} user={user}/>
            </Col>
           
          </Row>
        </Container>


</Card>


</Modal.Body>

<Modal.Footer>
    {console.log('likestatus', isLogLiked)}
                <p className='mr-auto'>
                <IconButton onClick={handleLike}>
                    {isLogLiked ? (
                        <FavoriteIcon sx={{ color: '#ba53f1'}}/>
                    ) : (
                        
                    <FavoriteBorderIcon sx={{ color: '#ba53f1'}}/>
                    
                    ) }
                    </IconButton>
                    {isLogLiked ? 'You liked this.' : ''}
                    </p>
    <small className='post-modal-title'>{calculateTimeDifference(logEntry.createdAt, date)}</small>
</Modal.Footer>
        </Modal>
    );

};

export default PostModal;