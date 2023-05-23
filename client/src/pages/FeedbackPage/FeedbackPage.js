import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Card, Form, Button, Image } from 'react-bootstrap'
import { Link, useHistory, useParams } from 'react-router-dom';
import FeedbackForm
 from '../../components/feedbackform/feedbackform';
const FeedbackPage = () => {

    return (
        <div className="profile-page grid">
    <FeedbackForm/>
    </div>
    );
}

export default FeedbackPage;