import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import FeedPost from '../../components/feedpost/feedpost';
import '../../css/pages/FeedPage.css';
import { getFeed } from '../../services/postService';
import EmptyFeed from '../../components/emptyfeed/emptyfeed';
const FeedPage = () => {
    const [feed, setFeed] = useState([]);
    const token = localStorage.getItem('jwtToken');
    console.log('feed page loaded');

        useEffect(async () => {
            const feedPosts = await getFeed(token);
            console.log('ourfeed', feedPosts);

            setFeed(feedPosts)
        },[]);
    return(
       <div className='feed-page'>
       {feed && feed.length > 0 ? feed.map((logEntry) => (
        <FeedPost logEntry={logEntry} key={logEntry._id}/>
       )): 
       
       <EmptyFeed/>}
       </div>
    );
};

export default FeedPage;
