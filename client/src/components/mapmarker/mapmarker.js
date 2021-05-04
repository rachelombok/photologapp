import React from "react";
import { Marker, Popup } from "react-map-gl";


const MapMarker = (props) => {

  return (

    <div>
      {props.logEntries.map((entry) => (
        <React.Fragment key={entry._id}>
          <Marker
            key={entry._id}
            latitude={entry.latitude}
            longitude={entry.longitude}
            offsetLeft={-20}
            offsetTop={-10}
          >
            <svg
              className="marker"
              style={{
                height: `${3 * props.viewport.zoom}`,
                width: `${3 * props.viewport.zoom}`,
              }}
              viewBox="0 0 24 24"
              fill="rgb(18, 21, 168)"
              onClick={() => {
                props.setShowPopUp({
                  [entry._id]: true,
                });
              }}
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </Marker>
          {props.showPopUp[entry._id] ? (
            <Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => {
                props.setShowPopUp({});
              }}
              anchor="top"
            >
              <div className='popup'>
                   <h3>{entry.placeName}</h3>
                    <p>{entry.description}</p>
                    <small>Visited on: {new Date(entry.visitDate).toLocaleDateString()}</small>
                    
                     {entry.image && 
                       entry.image.map(function(e, i){
                         return <img src={e} alt={i} key={e}/>
                       })
                    
                     }
                     {/*logEntries.map(entry => ( <img src={entry.image[0]} alt={entry.title} />*/}
                   
                     {/* image[0].name*/ }
                   </div>
            </Popup>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MapMarker;