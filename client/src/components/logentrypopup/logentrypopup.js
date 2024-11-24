import React, { useState, useEffect } from "react";
import { Popup } from "react-map-gl";
import { Card, Carousel, Button, Figure } from "react-bootstrap";
import "../../css/components/LogEntryPopUp.css";
import PostModal from "../postmodal/postmodal";
import { calculateTimeDifference } from "../../utils/logEntry";
import { Link } from "react-router-dom";

const LogEntryPopUp = ({ logEntry, setShowPopUp }) => {
    const [log, setLog] = useState();
    const [modal, setModal] = useState(false);
    const date = new Date();

    const toggleModal = () => {
        setModal(!modal);
    };

    useEffect(async () => {
        const getEntry = await logEntry;
        setLog(getEntry);
    }, [log]);

    return (
        <Popup
            latitude={logEntry.latitude}
            longitude={logEntry.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={() => {
                setShowPopUp({});
            }}
            anchor="top"
            maxWidth="200px"
            className="popup"
        >
            <Card className="popup-card">
                {logEntry.image ? (
                    logEntry.image.length > 1 ? (
                        <Carousel fade style={{ border: "2px solid #8641da" }}>
                            {logEntry.image.map(function (e, i) {
                                return (
                                    <Carousel.Item key={`${e}-${i}`}>
                                        <img
                                            className="d-block w-100 popup-carousel-img"
                                            src={e}
                                            alt="First slide"
                                            key={`${e}-${i}`}
                                            loading="lazy"
                                        />
                                    </Carousel.Item>
                                );
                            })}{" "}
                        </Carousel>
                    ) : (
                        <img src={logEntry.image[0]} />
                    )
                ) : null}

                <Card.Body>
                    <Card.Title className="popup-title">
                        {logEntry.placeName}
                    </Card.Title>
                    <Figure.Caption>
                        {calculateTimeDifference(logEntry.createdAt, date)}
                    </Figure.Caption>
                    <Card.Text className="popup-description">
                        {logEntry.description}
                    </Card.Text>
                    <Figure.Caption style={{ marginBottom: "10px" }}>
                        By:{" "}
                        <Link
                            to={`${logEntry.photographer}`}
                            className="justshoot-link"
                        >
                            {logEntry.photographer}
                        </Link>
                    </Figure.Caption>{" "}
                    <Button
                        variant="dark"
                        onClick={toggleModal}
                        className="justshoot-btn"
                    >
                        See more
                    </Button>
                </Card.Body>
            </Card>

            {modal ? (
                <PostModal
                    modal={modal}
                    setModal={setModal}
                    logEntry={logEntry}
                    fromMap={true}
                />
            ) : null}
        </Popup>
    );
};

export default LogEntryPopUp;
