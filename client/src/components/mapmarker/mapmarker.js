import React, { memo, useMemo } from "react";
import { Marker } from "react-map-gl";
import LogEntryPopUp from "../logentrypopup/logentrypopup";

const MapMarker = (props) => {
    const markers = useMemo(
        () =>
            props.logEntries.map((entry) => (
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
                        <LogEntryPopUp
                            logEntry={entry}
                            setShowPopUp={props.setShowPopUp}
                        />
                    ) : null}
                </React.Fragment>
            )),
        [props.showPopUp]
    );

    return (
        <div>
            {console.log("map marker level 2 call", props)}
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
                        <LogEntryPopUp
                            logEntry={entry}
                            setShowPopUp={props.setShowPopUp}
                        />
                    ) : null}
                </React.Fragment>
            ))}
        </div>
    );
};

function areEqual(prevProps, nextProps) {
    //console.log(nextProps.showPopUp, prevProps.showPopUp);
    if (nextProps.logEntries.length > prevProps.logEntries.length) return false;
    if (prevProps.showPopUp == nextProps.showPopUp) return true;
    return false;
    // true if no rerender should occur
    // false if should rerender
    /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
}

export default memo(MapMarker, areEqual);
