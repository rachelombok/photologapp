import React, { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
 import { useForm } from 'react-hook-form';
//import { UserContext } from '../../context/UserContext.js';
 import { listLogEntries, createLogEntry } from '../../services/postService.js';
 import { UserContext } from '../../context/UserContext.js';
 import { toast } from "react-toastify";
 import { Form,FormControl,Button, Popover, OverlayTrigger, Tooltip, Modal, InputGroup, Row, Col, FloatingLabel } from 'react-bootstrap'
import useInput from '../../hooks/useInput.js';
import { updateUserProfile, updateUserAvatar } from '../../services/userService.js';
 const EditProfileForm = ({ location, onFormClose }) => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [newAvatar, setNewAvatar] = useState("");
   const { user, setUser } = useContext(UserContext);
   const token = localStorage.getItem('jwtToken');
   const fullname = useInput(user.fullname);
  const username = useInput(user.username);
  const bio = useInput(user.bio);
  const website = useInput(user.website);

  const setFile = (e) => {
    if (e.target.files[0]) {
        setNewAvatar(e.target.files[0]);
        console.log(e.target.files[0].name);
      /*uploadImage(e.target.files[0]).then((res) =>
        setNewAvatar(res.secure_url)
      );*/
    }
  };

    const handleEditProfile = async (e) =>{
        e.preventDefault();
        const nothingChanged = (fullname.value == user.fullname) && (username.value == user.username) && (bio.value == user.bio) && (website.value == user.website) && !newAvatar;
        console.log(nothingChanged);
        if (nothingChanged) return toast.info('Nothing to update', {hideProgressBar: true});
            try {
                if (newAvatar){
                    let formData = new FormData();
                formData.append('image', newAvatar, newAvatar.name);
                console.log(formData, newAvatar);
                await updateUserAvatar(formData, token);
                }
                console.log('oke we needa do this too');
                const body = {
                    fullName: fullname.value,
                    username: username.value,
                    bio: bio.value,
                    website: website.value,
                    //avatar: newAvatar || user.avatar,
                    //isNewAvi: newAvatar ? true : false,
                  };
                const res = await updateUserProfile(body, token);
                setUser(res.user);
                console.log(body);
                console.log('SUCESS!');
                const redirectProfile = username.value ? username.value : user.username;
                console.log('SUCESS!', redirectProfile);
                toast.success('Profile updated!', {hideProgressBar: true});
                history.push(`/${redirectProfile}`);
            } catch(err){
                toast.error(err.message, {
                    position: "top-right"
                });
                console.log(error.name, error.message);
            }
        
        
        // use context or storage to get user details
        // preproulate fields with these data
        // update data with an endpoint call
        // history push to users username or new username
        // update fiels that are different in form
        // service func

    }
    // change fullname, password, avatar, bio, website
   return(
    
    <Form onSubmit={handleEditProfile} encType='multipart/form-data'>
        
        <div className="profile-page grid">
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
        <Form.Label column sm="2">
          Email
        </Form.Label>
        <Col sm="10">
          <Form.Control plaintext readOnly defaultValue={user.email} />
        </Col>
      </Form.Group>

      <Form.Group controlId="formHorizontalFile" className="mb-3" as={Row}>
        <Form.Label column sm={2}>Avatar</Form.Label>
        <Col sm={10}>
        <Form.Control type="file" name='avatar' onChange={setFile}/>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formHorizontalName">
        <Form.Label column sm={2}>
          Full Name
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="text" placeholder="Name" defaultValue={fullname.value} onChange={fullname.onChange}/>
        </Col>
      </Form.Group>

      {/*<Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
        <Form.Label column sm={2}>
          Password
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="password" placeholder="Password" autoComplete='new-password'/>
        </Col>
   </Form.Group>*/}

      

      <Form.Group as={Row} className="mb-3" controlId="formHorizontalName">
        <Form.Label column sm={2}>Username</Form.Label>
      <Col sm={10}>
      <InputGroup className="mb-3">
      
        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
        
        <Form.Control
          placeholder="Username"
          aria-label="Username"
          aria-describedby="basic-addon1"
          defaultValue={username.value}
          onChange={username.onChange}
        />
        
      </InputGroup></Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formHorizontalBio">
        <Form.Label column sm={2}>
          Bio
        </Form.Label>
        <Col sm={10}>
          <Form.Control as="textarea" placeholder="Bio" defaultValue={bio.value} onChange={bio.onChange}/>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
        <Form.Label column sm={2}>Website</Form.Label>
        <Col sm={10}>
        <Form.Control type="text" placeholder="Website" defaultValue={website.value} onChange={website.onChange}/>
        </Col>
      </Form.Group>
      <Button variant="primary" type="submit">
        Update Profile
      </Button>
      </div>
    </Form>
   );
 }
 export default EditProfileForm; 