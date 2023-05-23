import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import EditProfileForm from '../../components/editprofileform/editprofileform';
import { getUserProfile
} from '../../services/userService';
import { Typography } from '@mui/material'
const EditProfilePage = () => {
   

    return (
        <>
    <Typography variant='h1' color={'white'} align='center'>Edit Profile</Typography>
        <EditProfileForm/>
        </>
    )
};
export default EditProfilePage;