import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { Component } from "react";
import Geocoder from "react-map-gl-geocoder";

class GeocoderSearch extends Component {
    state = {
        viewport: {
            latitude: 37.7577,
            longitude: -122.4376,
            zoom: 8,
        },
        logEntries: [],
        showPopUp: {},
        addLocation: null,
    };

    handleGeocoderViewportChange = (viewport) => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 };

        return this.handleViewportChange({
            ...viewport,
            ...geocoderDefaultOverrides,
        });
    };

    render() {
        const { viewport } = this.state;
        return (
            <div>
                <Geocoder
                    onViewportChange={this.handleGeocoderViewportChange}
                    mapboxApiAccessToken={
                        process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
                    }
                    viewport={viewport}
                    position="top-left"
                />
            </div>
        );
    }
}

export default GeocoderSearch;
