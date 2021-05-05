import * as React from 'react';
import { useState, useEffect } from 'react';
import ReactMapGL,  {Marker, Popup} from 'react-map-gl';
import 'bootstrap/dist/css/bootstrap.min.css';
import { listLogEntries } from './API';
import 'mapbox-gl/dist/mapbox-gl.css';
import LogEntryForm from './components/form/LogEntryForm';
import LoginPage from './pages/LoginPage/LoginPage';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Map from './components/map/map.js';

class App extends React.Component{
  render(){
    return(
        <div>
          <Router>
            <Switch>
                <Route exact path='/' component={Map}/>
                <Route exact path='/test' component={LoginPage} />
            </Switch>
          </Router>
        </div>
    );
  }
}
///////

// const App = () => {
//   const [logEntries, setLogEntries ] = useState([]);
//   const [showPopup, setShowPopup] = useState({});
//   const [addEntryLocation, setAddEntryLocation] = useState(null);
//   const [viewport, setViewport] = useState({
//     width: '100vw',
//     height: '100vh',
//     latitude: 37.7577,
//     longitude: -122.4376,
//     zoom: 5
//   });


//   const getEntries = async () => {
//     const logEntries = await listLogEntries();
//     setLogEntries(logEntries);
//   };

//   useEffect(() => {
//     getEntries();
//   }, []);


//   const showAddMarkerPopup = (event) => {
//     const [ longitude, latitude ] = event.lngLat;
//     setAddEntryLocation({
//       latitude,
//       longitude,
//     });
//   };


//   return (
//     <div>
   
//     <ReactMapGL
//       {...viewport}
//       mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
//       mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
//       onViewportChange={nextViewport => setViewport(nextViewport)}
//       dynamicPosition={setViewport}
//       onDblClick={showAddMarkerPopup}
//     >
//       {
//         logEntries.map(entry => (
//           <React.Fragment key={entry._id}>
//           <Marker 
//           key={entry._id}
//           latitude={entry.latitude} 
//           longitude={entry.longitude} 
//           >
//             <div
//             onClick={() => setShowPopup({
//               [entry._id]: true,
//             })}>
//             <svg className='marker' 
//             style={{
//               width: `${5 * viewport.zoom}px`,
//               height: `${5 * viewport.zoom}px`
//             }}
//             viewBox="0 0 24 24" 
//             strokeWidth="2" 
//             fill="white" 
//             strokeLinecap="round" 
//             strokeLinejoin="round" 
//             >
//               <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
//               <circle cx="12" cy="10" r="3"></circle>
//               </svg>
//           </div>
//           </Marker>
//             {
//               showPopup[entry._id] ?(
//                 <Popup
//                 latitude={entry.latitude} 
//                 longitude={entry.longitude} 
//                   closeButton={true}
//                   closeOnClick={false}
//                   dynamicPosition={true}
//                   onClose={() => setShowPopup({})}
//                   anchor="top" >
//                   <div className='popup'>
//                     <h3>{entry.placeName}</h3>
//                     <p>{entry.description}</p>
//                     <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                    
//                     {entry.image && 
//                       entry.image.map(function(e, i){
//                         return <img src={e} alt={i} key={e}/>
//                       })
                    
//                     }
//                     {/*logEntries.map(entry => ( <img src={entry.image[0]} alt={entry.title} />*/}
                   
//                     {/* image[0].name*/ }
//                   </div>
//                 </Popup>
//               ) : null
//             }
//             </React.Fragment>
//         ))
//         }
//         {
//          addEntryLocation ? (
//            <>
//            <Marker
//              latitude={addEntryLocation.latitude}
//              longitude={addEntryLocation.longitude}
//            >
//              <div>
//                <svg
//                  className="marker red"
//                  style={{
//                    height: `${6 * viewport.zoom}px`,
//                    width: `${6 * viewport.zoom}px`,
//                  }}
//                  version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512">
//                  <g>
//                    <g>
//                      <path d="M256,0C153.755,0,70.573,83.182,70.573,185.426c0,126.888,165.939,313.167,173.004,321.035
//                        c6.636,7.391,18.222,7.378,24.846,0c7.065-7.868,173.004-194.147,173.004-321.035C441.425,83.182,358.244,0,256,0z M256,278.719
//                        c-51.442,0-93.292-41.851-93.292-93.293S204.559,92.134,256,92.134s93.291,41.851,93.291,93.293S307.441,278.719,256,278.719z"/>
//                    </g>
//                  </g>
//                </svg>
//              </div>
//            </Marker>
//            <Popup
//              latitude={addEntryLocation.latitude}
//              longitude={addEntryLocation.longitude}
//              closeButton={true}
//              closeOnClick={false}
//              dynamicPosition={true}
//              onClose={() => setAddEntryLocation(null)}
//              anchor="top" >
//              <div className="popup">
//                <LogEntryForm onClose={() => {
//                  setAddEntryLocation(null);
//                  getEntries();
//                }} location={addEntryLocation} />
//              </div>
//            </Popup>
//            </>
//          ) : null
//       }
        

//     </ReactMapGL>
//     </div>);
// }

export default App;