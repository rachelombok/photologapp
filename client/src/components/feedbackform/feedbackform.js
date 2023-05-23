import React, { useState, useContext, useRef } from 'react';
import { useHistory } from "react-router-dom";
 import { useForm } from 'react-hook-form';
import { Form,FormControl,Button, Popover, OverlayTrigger, Tooltip, Modal, InputGroup, Row, Col, FloatingLabel } from 'react-bootstrap'
import emailjs from '@emailjs/browser';
import { UserContext } from '../../context/UserContext.js';
import { toast } from "react-toastify";

const FeedbackForm = () => {
    const form = useRef();
    const { user, setUser } = useContext(UserContext);
    const history = useHistory();

    const sendEmail = (e) => {
        e.preventDefault();
    
        emailjs.sendForm('service_mwhljm6', 'template_nbyedsl', form.current, 'user_2wBZ9qESfc8nrcHgF0SKm')
          .then((result) => {
              console.log(result.text);
              toast.success("Thanks for your feedback!");
            history.push('/feed');
          }, (error) => {
              console.log(error.text);
              toast.error(`${error.text}`)
          });
    };

    return(
        <Form ref={form} onSubmit={sendEmail}>
           <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Email
        </Form.Label>
        <Col sm="10">
          <Form.Control defaultValue={user.email} name='email' required type='email'/>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formHorizontalName">
        <Form.Label column sm={2}>
          Full Name
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="text" placeholder="Name" name='fullname'/>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formHorizontalBio">
        <Form.Label column sm={2}>
          Message
        </Form.Label>
        <Col sm={10}>
          <Form.Control as="textarea" placeholder="Message" name='message' required/>
        </Col>
      </Form.Group>

      <Button variant="primary" type="submit">
        Send
      </Button>
        </Form>
    );
}

export default FeedbackForm;

/* 

New message from {{from_name}}

Hello {{to_name}},

You got a new message from {{from_name}} (via CovidForecasts):

{{message}}

Best wishes,
EmailJS team
*/