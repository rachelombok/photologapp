import React, { useEffect, useState, useContext } from 'react';
import Map from '../../components/map/map'
import NavigationBar from '../../components/navigationbar/navigationbar';
const MapPage = () => {

    useEffect(() => {
        console.log('map page mounted')
    }, [])

    return(
        <>
        <NavigationBar/>
        <Map/>
        </>
    );
}
export default MapPage;