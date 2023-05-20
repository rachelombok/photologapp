import React, { useState, useContext } from 'react';
 import { useForm } from 'react-hook-form';
import { UserContext } from '../../context/UserContext.js';
 import { listLogEntries, createLogEntry } from '../../services/postService.js';
import { Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { toast } from "react-toastify";

 const LogEntryForm = ({ location, onFormClose }) => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   //const [file, setFileName] = useState(null);
   const [photo, setPhoto] = useState(null);
   const { register, handleSubmit } = useForm();
   const { user } = useContext(UserContext);
   const token = localStorage.getItem('jwtToken');
   // add tags n rating input too, then change dis play of these in postmodal

   const onSubmit = async (data) => {
    try {
      if (photo.length > 5) return toast.error('Max of 5 images', {hideProgressBar: true});
      setLoading(true);
      console.log('onsubmit', loading);
      console.log(data);
      console.log(location);
      let formData = new FormData();
      formData.append('placeName', data.placeName);
      formData.append('description', data.description);
      formData.append('photographer', data.photographer);
      //formData.append('image', photo);
      for ( let i = 0; i < photo.length; i++ ) {
				formData.append( 'image', photo[ i ], photo[ i ].name );
			}
      formData.append('rating', 5);
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('visitDate', data.visitDate);
      
      //for (var key of formData.entries()) {
        //console.log(key[0] + ', ' + key[1])
      //}
      
      //data.latitude = location.latitude;
      //data.longitude = location.longitude;
      //data.image = photo;
      console.log(data);
      console.log(formData);
      console.log(token);
      setLoading(false);
      await createLogEntry(formData, token);
      toast.success('New entry added!', {hideProgressBar: true});
      onFormClose();

    } catch (error) {
      console.error(error);
      toast.error(error.message, {position: "top-right"});
      setLoading(false);
    }
     /*
     try {
       console.log(data);
       setLoading(true);
       const formData = new FormData();
       formData.append('image', photo);
       formData.set('title', data.title);
       data.latitude = location.latitude;
       data.longitude = location.longitude;
       data.image = data.image[0];
       console.log(photo);
       await createLogEntry(data);
       //await uploadImage(formData);
       onClose();
     } catch (error) {
       console.error(error);
       setError(error.message);
       setLoading(false);
     }*/
   };

   const setFile = evt => {
    setPhoto(evt.target.files);
    //setFileName(evt.target.files[0].name);
  };


   return (
    <div>
      <style type='text/css'>
      {`
      .btn-flat {
      background: linear-gradient(90deg, rgba(18,21,168,1) 0%, rgba(163,0,232,1) 100%);
      background-color: rgb(18,21,168);
      color: white;
      min-width: 100%;
      margin: 10px 0 0 0;
    }

      .btn-xxl {
      padding: 1rem 1.5rem;
      font-size: 1.5rem;
    }
    `}

    </style>
     {/*<form onSubmit={handleSubmit(onSubmit)} className="entry-form" encType='multipart/form-data'>
       { error ? <h3 className="error">{error}</h3> : null}
       <label htmlFor="placeName">Title</label>
       <input name="placeName" required ref={register} />
       <label htmlFor="photographer">Photograher</label>
       <textarea name="photographer" rows={3} ref={register}></textarea>
       <label htmlFor="description">Description</label>
       <textarea name="description" rows={3} ref={register}></textarea>
       <label htmlFor="image">Image</label>
       <input name="image" type='file' multiple onChange={setFile} placeholder="Pase an image URL" ref={register} />
       <label htmlFor="visitDate">Visit Date</label>
       <input name="visitDate" type="date" required ref={register} />
       <button disabled={loading}>{loading ? 'Loading...' : 'Create Entry'}</button>
  </form>*/}
     <Form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
     <Form.Group controlId="formBasicEmail">
          <Form.Label>Place Name</Form.Label>
          <Form.Control name='placeName' type="text" placeholder="Ex: Central Park" required ref={register} maxLength={40}/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Photographer</Form.Label>
          <InputGroup>
          <InputGroup.Text>@</InputGroup.Text>
          <Form.Control name='photographer' readOnly placeholder="rachelombok" ref={register} defaultValue={user.username}/>
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor='images' >Images</Form.Label>
          <Form.Control type="file" name='image' accept="image/png, image/jpeg" required ref={register} multiple label="5 images MAX" onChange={setFile}/>
          <Form.Text className="text-muted">
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control name='description' as='textarea' placeholder='Ex: Nice greenery shots in the heart of NYC, taken with a Nikon D3200 with f/11,
          ISO 200, shutter 1/16. Very beautiful during the summer.' ref={register}/>
        </Form.Group>
        <Form.Group>
          <Form.Label>Tags</Form.Label>
          <Form.Control name='tags' placeholder='landscape NYC nature sun' />
          <Form.Text className="text-muted">
            Separate by whitespace, up to 10 tags.
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>Visit Date</Form.Label>
          <Form.Control name='visitDate' type="date" ref={register} required/>
        </Form.Group>
        <Button disabled={loading} type='submit' className="d-grid gap-2" variant='flat' size='lg'>
            {!loading ? 
            <b>Submit</b> : 
            <>
            <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          variant="light"
          aria-hidden="true"
        />{"    "}
            <b>Creating...</b>
            </>
            }
</Button>
      
       {/* 
        
        <Button disabled={loading} type='submit' {...loading ? "Creating..." : "Created"} variant='flat' block size='lg'>
            <b>Submit</b>
</Button>*/}
     </Form>
     </div>
   );
 };

 export default LogEntryForm; 