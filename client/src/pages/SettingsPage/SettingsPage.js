import React, { useEffect, useState, useContext } from "react";
import SettingsForm from "../../components/settingsform/settingsform";
import { Typography } from "@mui/material";
const SettingsPage = () => {
    return (
        <>
            <Typography variant="h1" color={"white"} align="center">
                Settings
            </Typography>
            <SettingsForm />
        </>
    );
};

export default SettingsPage;
