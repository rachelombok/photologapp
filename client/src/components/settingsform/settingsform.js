import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from "react-router-dom";
 import { useForm } from 'react-hook-form';
 import { UserContext } from '../../context/UserContext.js';
 import { toast } from "react-toastify";
 import { Form,FormControl,Button, Popover, OverlayTrigger, Tooltip, Modal, InputGroup, Row, Col, FloatingLabel } from 'react-bootstrap'
import useInput from '../../hooks/useInput.js';
import { changePassword } from '../../services/authenticationService.js';
import { validatePassword } from '../../utils/validation.js';

 const SettingsForm = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   //const [newPassword, setNewPassword] = useState("");
   const { user, setUser } = useContext(UserContext);
   //const [oldPassword, setOldPassword] = useState('');
   const token = localStorage.getItem('jwtToken');
   const newPassword = useInput("");
  const oldPassword = useInput("");
  // const bio = useInput(user.bio);
  // const website = useInput(user.website);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(oldPassword, newPassword);
    const newPasswordError = validatePassword(newPassword.value);
    if (newPasswordError) return toast.error(newPasswordError);
    
    try{
        setLoading(true);
        await changePassword(oldPassword.value, newPassword.value, token);
        // await change pass(old pass, new pass, token)
        //toast.success
        toast.success("Your password has been updated! You'll have to log in with the new one next time.", {hideProgressBar: true});
        setLoading(false);
        history.push(`${user.username}`)
    }catch(e){
        // toast.error
        console.log(e.message);
        toast.error(e.message, {
            position: "top-right"
        });
        setLoading(false);
    }
  }

  return(
<Form onSubmit={handleSubmit}>
<div className="profile-page grid">
<Form.Group as={Row} className="mb-3" controlId="formHorizontalOldPassword">
        <Form.Label column sm={2}>
          Old Password
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="password"  placeholder="Old Password" defaultValue={oldPassword.value} onChange={oldPassword.onChange}/>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formHorizontalNewPassword">
        <Form.Label column sm={2}>
          New Password
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="password"  placeholder="New Password" defaultValue={newPassword.value} onChange={newPassword.onChange}/>
        </Col>
      </Form.Group>
      <Button variant="primary" type="submit" disabled={loading}>
        Update Profile
      </Button>
</div>
</Form>
  );
 };

export default SettingsForm;