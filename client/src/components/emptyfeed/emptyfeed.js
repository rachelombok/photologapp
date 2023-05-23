import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

const EmptyFeed = () => {

    return(
       
        <div className='not-found'>
       <Typography variant='h1' color={'white'} align='center'>Your feed is empty</Typography><br></br>
       <Typography variant='subtitle1' color={'white'} align='center'>When you follow others, their most recent posts will show up here!</Typography><br></br>
        </div>
        
    )
};

export default EmptyFeed;