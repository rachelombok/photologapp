import React from "react";
import FeedbackForm from "../../components/feedbackform/feedbackform";
import { Typography } from "@mui/material";
const FeedbackPage = () => {
    return (
        <div className="profile-page grid">
            <Typography variant="h1" color={"white"} align="center">
                Feedback
            </Typography>
            <FeedbackForm />
        </div>
    );
};

export default FeedbackPage;
