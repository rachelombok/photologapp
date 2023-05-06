import React, { useState, useEffect, useCallback, Component } from "react";
import ReactMapGl,{ Marker, Popup, NavigationControl} from "react-map-gl";
//import { listLogEntries } from './API';
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import { listLogEntries } from "../../services/postService";
import MapMarker from './../mapmarker/mapmarker.js'
import Geocoder from "react-map-gl-geocoder";
import AddLocation from './../addlocation/addlocation.js';
import NavigationBar from "../navigationbar/navigationbar";
import { useLocation } from "react-router-dom"
//import 'bootstrap/dist/css/bootstrap.min.css';
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
    const location = useLocation()
    const long = location.long;
    const lat = location.lat;
    console.log('map props', location, lat, long);
  
    const [viewport, setViewport] = useState({
      width: "100vw", // window.innerWidth
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
      const [longitude, latitude] = event.lngLat;
      setAddLocation({
        latitude,
        longitude,
      });
      setShow({
       show: true
      });
    };
  
    const mapRef = React.createRef();
    //const geocoderContainerRef = React.useRef();
  
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
  
  
    const myMap = React.useRef()
    const geocoderContainerRef = React.useRef();
    /* const setCoordinate = useCallback((event) => {
      console.log(event);
    }, []); */
  
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
              paddingTop: 95
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
              //onSelected={this.onSelected}
              //queryParams={queryParams}
              //hideOnSelect={true}
              position="top-left"
            />
  <div style={{position: 'absolute', right: 10}}>
            <NavigationControl />
          </div>
            
  
  {/*<Search setViewport={setViewport} />*/}
  
        
        <AddLocation
          show={show}
          addLocation={addLocation}
          viewport={viewport}
          setAddLocation={setAddLocation}
          setShow={setShow}
          getTravelEntries={getTravelEntries}
        />
  
      </ReactMapGl>
  
      
    );
    
  };

export default React.memo(Map);