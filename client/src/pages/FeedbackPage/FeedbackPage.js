import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Card, Form, Button, Image } from 'react-bootstrap'
import { Link, useHistory, useParams } from 'react-router-dom';
import FeedbackForm
 from '../../components/feedbackform/feedbackform';
 import { Typography } from '@mui/material'
const FeedbackPage = () => {

    return (
        <div className="profile-page grid">
<Typography variant='h1' color={'white'} align='center'>Feedback</Typography>
    <FeedbackForm/>
    </div>
    );
}

export default FeedbackPage;