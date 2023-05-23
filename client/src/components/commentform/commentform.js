import React, { useState, useContext, useRef } from 'react';
import { useHistory } from "react-router-dom";
 import { useForm } from 'react-hook-form';
 import { UserContext } from '../../context/UserContext.js';
 import { toast } from "react-toastify";
 import { Form,FormControl,Button, Popover, OverlayTrigger, Tooltip, Modal, InputGroup, Row, Col, FloatingLabel } from 'react-bootstrap'
import useInput from '../../hooks/useInput.js';
import { createComment } from '../../services/postService.js';
const CommentForm = ({ logId, setRefetch, user }) => {
    // user, logid
    const history = useHistory();
    const formRef = useRef(null);
    const [error, setError] = useState('');
    const commentMessage = useInput("");
    const token = localStorage.getItem('jwtToken');

    const handleComment = async (e) =>{
        e.preventDefault();
        console.log('you commented!', commentMessage);
        if (commentMessage.value.length == 0) return;
        try {
            if (!Boolean(user)) return toast.error('Must have an account to leave a comment.',  {hideProgressBar: true});
            const res = await createComment(logId, commentMessage.value, token);
        console.log(res);
            toast.success("Commented!");
            commentMessage.setValue("");
            console.log(commentMessage.value);
            formRef.current.reset();
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
    return(
        <Form id='post-comment-button' ref={formRef} onSubmit={handleComment}>
                <InputGroup>
                <Form.Control placeholder='Comment your reaction!' type='text' size='sm' onChange={commentMessage.onChange}/>
                <Button size='sm' type="submit">Comment!</Button>
                </InputGroup>
        </Form>
    );
};

export default CommentForm;