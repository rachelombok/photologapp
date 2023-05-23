import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Button, Figure } from 'react-bootstrap';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton, Typography, Menu, MenuItem, Chip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PostModal from '../postmodal/postmodal';
import '../../css/pages/FeedPage.css';
import { formatDateString, calculateTimeDifference,formatLikeMessage } from '../../utils/logEntry';
import { getComments, getLogEntryLikes, toggleLike } from '../../services/postService';
import { UserContext } from '../../context/UserContext';
const FeedPost = ({logEntry}) => {
    console.log('o[pys')
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const date = new Date();
    const [likes, setLikes] = useState([]);
    const [isLogLiked, setIsLogLiked] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const { user } = useContext(UserContext);
    const token = localStorage.getItem('jwtToken');
    const [modal, setModal] = useState(false);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
       };
    const handleClose = (callback) => {
        setAnchorEl(null);
        // callback && callback();
    };
    const toggleModal = (e) => {
        //console.log(e.target.id, e);
        //console.log(getDisplayLog(e.target.id));
        //setModalLog(getDisplayLog(e.target.id));
        setModal(!modal);
      };

    const handleLike = async (e) =>{
        e.preventDefault();
        
        try {
            //const res = await createComment(logId, commentMessage.value, token);
            const res = await toggleLike(logEntry._id, token);
            setIsLogLiked(!isLogLiked);
            setRefetch(true);
        } catch(e){
            setRefetch(false);
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

    useEffect(async()=>{
        const likeList = await getLogEntryLikes(logEntry._id);
        console.log('only mount this once when clicked', likeList);
        setLikes(likeList);
        isLiked();
        setRefetch(false);
    }, [refetch, likes?.length]);
    

    // add a more drop down list in top right with 'copy link to post' option once post pages are made
    // liking can be done from here but commenting must open the modal
    // populate feedpost api with user avi


    return(
        <div className='feed-post'>
        <Card>
            <CardHeader
        avatar={
          <Avatar aria-label="recipe" > 
            R
          </Avatar>
        }
        action={
            <IconButton aria-label="settings" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          }
        title={logEntry.placeName}
        subheader={`Visited on ${formatDateString(logEntry.visitDate)}`}
      />
      <Menu
    id="long-menu"
    anchorEl={anchorEl}
    keepMounted
    open={open}
    onClose={() => handleClose()}
    
   >
     <MenuItem key='item' onClick={handleClose} href={`${logEntry.photographer}`} component='a' >
      Go to Profile
     </MenuItem>
   </Menu>
   {logEntry.image ? logEntry.image.length > 1 ? 
        <Carousel variant='dark' interval={null}>
            {logEntry.image.map(function(e, i) {
                            return (
                            <Carousel.Item interval={null} data-bs-interval="false">
                                <img
                                  className="d-block w-100 carousel-feed-post-img"
                                  src={e}
                                  alt="First slide"
                                  key={i}
                                  loading="lazy"
                                />
                              </Carousel.Item>
                              
                              );
                        })}
        </Carousel> : <img className="d-block w-100 carousel-feed-post-img" src={logEntry.image[0]}/>
   : null }
      
      <CardContent>
      
        <Typography variant="body2" color="text.secondary">
        <Link to={`${logEntry.photographer}`}><b>{logEntry.photographer}</b></Link> {logEntry.description}
        </Typography>
        <Chip label="#tag1" variant="outlined"/>{' '}
        <Chip label="#tag2" variant="outlined"/>
      </CardContent>
      <CardActions disableSpacing>
      <IconButton onClick={handleLike}>
                    {isLogLiked ? (
                        <FavoriteIcon sx={{ color: '#ba53f1'}}/>
                    ) : (
                        
                    <FavoriteBorderIcon sx={{ color: '#ba53f1'}}/>
                    
                    ) } 
                    </IconButton>
                    <small>{formatLikeMessage(likes.length)}</small>
        <IconButton aria-label="add to favorites" onClick={toggleModal}>
         <ChatIcon />
        </IconButton>
        <div className='date-posted'>
            {calculateTimeDifference(logEntry.createdAt, date)}
        </div>
      </CardActions>
        </Card>
        {modal ? <PostModal logEntry={logEntry} modal={modal} setModal={setModal} /> : null}
        </div>
    )
};

export default FeedPost;