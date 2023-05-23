import React, { useState, useEffect,  useContext } from "react";
import ReactMapGl,{  NavigationControl} from "react-map-gl";

import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import { listLogEntries } from "../../services/postService";
import MapMarker from './../mapmarker/mapmarker.js'
import Geocoder from "react-map-gl-geocoder";
import AddLocation from './../addlocation/addlocation.js';
import { useLocation } from "react-router-dom"
import { UserContext } from '../../context/UserContext.js';
import LoginModal from "../loginModal/loginModal";

const geostyle = {
  margin: '20px 20px 40px 40px',
  paddingTop: '30px',
  color: 'teal',
  fill: 'teal',
  backgroundColor: 'teal'
}


const Map = (props) => {
    const [logEntries, setLogEntries] = useState([]);
    const [showPopUp, setShowPopUp] = useState({});
    const [addLocation, setAddLocation] = useState(null);
    const [show, setShow] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const location = useLocation()
    const long = location.long;
    const lat = location.lat;
    const { user } = useContext(UserContext);
    const storageUser = localStorage.getItem('user');
  
    const [viewport, setViewport] = useState({
      width: "100vw", 
      height: "100vh",
      latitude: lat ? lat : 37.7749,
      longitude: long ? long : -122.4194,
      zoom: (long && lat) ? 5.5: 3.5,
    });
  
    const getTravelEntries = async () => {
      const logEntries = await listLogEntries();
      console.log('doesthisork', logEntries)
      setLogEntries(logEntries);
    };
  
  
    useEffect(() => {
      console.log("CALLING THIS????")
      getTravelEntries();
    }, []);
  
    const markVisited = (event) => {
      if (user || storageUser){
      const [longitude, latitude] = event.lngLat;
      setAddLocation({
        latitude,
        longitude,
      });
      setShow({
       show: true
      });
      } else{
        setShowLoginModal(true);
      }
    };
  
    const mapRef = React.createRef();
  
    const handleViewportChange = viewport => {
      this.setState({
        viewport: { ...this.state.viewport, ...viewport }
      });
    };
  
    const onSelected = (viewport, item) => {
      this.setState({...this.state.viewport, ...viewport});
      console.log('Selected: ', item);
    };
  
    // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
    const handleGeocoderViewportChange = viewport => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };
  
      return this.handleViewportChange({
        ...viewport,
        ...geocoderDefaultOverrides
      });
    };
  
  
    const myMap = React.useRef();
    const geocoderContainerRef = React.useRef();

  
    return (
      
      
      <ReactMapGl
      ref={myMap}
      {...viewport}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        onViewportChange={setViewport}
        onDblClick={markVisited}
        reuseMaps={true}
        maxZoom={10}
        minZoom={2}
        pitch={0}
      >
       
        <MapMarker
          logEntries={logEntries}
          viewport={viewport}
          showPopUp={showPopUp}
          setShowPopUp={setShowPopUp}
        />
        <div ref={geocoderContainerRef}
            style={{
              height: 50,
              backgroundColor: 'transparent',
              display: "flex",
              alignItems: "center",
              paddingLeft: 20,
              paddingTop: 135
        }}/>
  
            <Geocoder
              style={geostyle}
              mapRef={myMap}
              containerRef={geocoderContainerRef}
              onViewportChange={setViewport}
              mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
              viewport={viewport}
              showUserLocation={false}
              minLength={3}
             
              position="top-left"
            />
  <div style={{position: 'absolute', right: 10}}>
            <NavigationControl />
          </div>
            
  
        
        <AddLocation
          show={show}
          addLocation={addLocation}
          viewport={viewport}
          setAddLocation={setAddLocation}
          setShow={setShow}
          getTravelEntries={getTravelEntries}
        />

        {showLoginModal ? <LoginModal modal={showLoginModal} setModal={setShowLoginModal} message="You must have an account to add a Log Entry."/> : null}

      </ReactMapGl>
  
        
    );
    
  };

export default React.memo(Map);