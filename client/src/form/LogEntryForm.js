import React, { useState } from 'react';
 import { useForm } from 'react-hook-form';

 import { createLogEntry } from '../API';

 const LogEntryForm = ({ location, onClose }) => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   //const [file, setFileName] = useState(null);
   const [photo, setPhoto] = useState(null);
   const { register, handleSubmit } = useForm();

   const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      //console.log(location);
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
      await createLogEntry(formData);
      
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
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
     <form onSubmit={handleSubmit(onSubmit)} className="entry-form" encType='multipart/form-data'>
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
     </form>
   );
 };

 export default LogEntryForm; 