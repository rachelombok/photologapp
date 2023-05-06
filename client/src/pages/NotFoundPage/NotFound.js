import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {

    return(
        <>
        <h1>Sorry, this page isn't available.</h1>
        <div>The link you followed may be broken, or the page may have been removed.</div>
        <Link to="/" className="link">
          Go back to JustShoot.
        </Link>
        </>
    )
};

export default NotFoundPage;

