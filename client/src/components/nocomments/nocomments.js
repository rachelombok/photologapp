import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';

const NoComments = () => {

    return(
        <>
        <h1>Your feed is empty :(</h1>
        <div>When you follow others, their most recent posts will show up here!</div>
        <Link to="/" className="link">
          Go back to JustShoot.
        </Link>
        </>
    )
};

export default NoComments;