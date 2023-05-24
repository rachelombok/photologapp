import React from "react";
import { Marker } from "react-map-gl";
import { Modal } from "react-bootstrap";
import LogEntryForm from "../form/LogEntryForm.js";
import "./addlocation.css";

const AddLocation = (props) => {
    const {
        addLocation,
        viewport,
        setAddLocation,
        getTravelEntries,
        show,
        setShow,
    } = props;
    //let show = props.show
    //const [show, setShow] = useState(false);

    //const handleClose = () => setShow(false);
    //const handleShow = () => setShow(true);

    return (
        <div>
            {addLocation ? (
                <>
                    <Marker
                        latitude={addLocation.latitude}
                        longitude={addLocation.longitude}
                        offsetLeft={-20}
                        offsetTop={-10}
                    >
                        <svg
                            className="marker"
                            style={{
                                height: `${4 * viewport.zoom}`,
                                width: `${4 * viewport.zoom}`,
                            }}
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            fill="rgb(18, 21, 168)"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                    </Marker>
                    <Modal
                        size="lg"
                        show={show}
                        onHide={() => {
                            setShow(false);
                            setAddLocation(null);
                        }}
                        dialogClassName="modal-90w"
                        aria-labelledby="custom-modal"
                        latitude={addLocation.latitude}
                        longitude={addLocation.longitude}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>New Photo Location</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <LogEntryForm
                                    location={addLocation}
                                    onFormClose={() => {
                                        setAddLocation(null);
                                        getTravelEntries();
                                    }}
                                />
                            </div>
                        </Modal.Body>
                    </Modal>{" "}
                </>
            ) : null}
        </div>
    );
};

export default AddLocation;
