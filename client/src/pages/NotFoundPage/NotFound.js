import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
const NotFoundPage = () => {
    return (
        <div className="not-found">
            <Typography variant="h1" color={"white"} align="center">
                Sorry, this page isn't available.
            </Typography>
            <br></br>
            <Typography variant="subtitle1" color={"white"} align="center">
                The link you followed may be broken, or the page may have been
                removed, or you simply don't have access to it.
            </Typography>
            <br></br>
            <Link to="/" className="justshoot-link">
                <Typography variant="h4" align="center">
                    Go back to JustShoot.
                </Typography>
            </Link>
        </div>
    );
};

export default NotFoundPage;
