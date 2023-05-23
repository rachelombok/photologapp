import React, { useContext, useState, useEffect } from 'react';
import { Button, Container, Col, Row } from 'react-bootstrap'
import { Box, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';

const UserListItem = ({user, reqUserName, follow}) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    console.log(user);
    return(
      <Box component="span" sx={{ display: 'flex', bgcolor: 'black', color: 'grey', borderRadius: 2,p: 1,
      m: 0, marginBottom: '5px'}}>
        <Box >
        <Avatar src={user?.avatar}>R</Avatar>
        </Box>
        <Box sx={{ flexGrow: 1, paddingLeft: '8px' }}>
        
        <Link to={user?.username} className='justshoot-link'>@{user?.username}</Link><br></br>
        {user?.fullname}
        </Box>
        <Box sx={{ alignSelf: 'center'}}>
        { user?.isFollowing ? <Button size='sm' className='user-btn justshoot-btn' variant='dark' >Following</Button> : 
reqUserName == user?.username ? null : <Button size='sm' className='user-btn justshoot-btn' variant='dark' >Follow</Button>
}
        </Box>
     
      </Box>
    );

};
export default UserListItem;
