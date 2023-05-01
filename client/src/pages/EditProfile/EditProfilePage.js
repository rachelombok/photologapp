import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import EditProfileForm from '../../components/editprofileform/editprofileform';
import { getUserProfile
} from '../../services/userService';

const EditProfilePage = () => {
   

    return (
        
        <EditProfileForm/>
        
    )
};
export default EditProfilePage;