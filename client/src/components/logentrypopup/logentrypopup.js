import React , {useState, useEffect} from "react";
import { Marker, Popup } from "react-map-gl";
import { Card, Carousel, Button, Figure } from 'react-bootstrap';
import '../../css/components/LogEntryPopUp.css';
const LogEntryPopUp = ({logEntry, setShowPopUp}) => {
    const [log, setLog] = useState();
    
    // new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
// "Friday, Jul 2, 2021"
    const date = new Date();
    useEffect(async() => {
        
        const getEntry = await logEntry;
        setLog(getEntry);
    }, [log])

    const calculateTimeDifference = (postDate, currentDate) => {
        postDate = new Date(postDate);
        const seconds = (currentDate.getTime() - postDate.getTime()) / 1000;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;
        const weeks = days / 7;
        if (weeks > 4) return postDate.toLocaleDateString('en-us', { year:"numeric", month:"short", day:"numeric"});
        if (weeks >= 1) return `${Math.abs(Math.round(weeks))} week${weeks > 1 ? 's' : ''} ago`;
        if (1 < days && days < 7) return `${Math.abs(Math.round(days))} day${days > 1 ? 's' : ''} ago`;
        if (1 < hours && hours < 24) return `${Math.abs(Math.round(hours))} hour${hours > 1 ? 's' : ''} ago`;
        if (1 < minutes && minutes < 60) return `${Math.abs(Math.round(minutes))} minute${minutes > 1 ? 's' : ''} ago`;
        if (seconds < 60) return `${Math.abs(Math.round(seconds))} second${seconds > 1 ? 's' : ''} ago`;
    }
    return(
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
              maxWidth='200px'
              className="popup"
        >
            <Card>
                
                {console.log('map marker level 3 call?')}
                    {logEntry.image ? logEntry.image.length > 1 ? 
                    <Carousel fade>
                        {logEntry.image.map(function(e, i) {
                            return (
                            
                            <Carousel.Item>
                                <img
                                  className="d-block w-100 popup-carousel-img"
                                  src={e}
                                  alt="First slide"
                                  key={i}
                                  loading="lazy"
                                />
                              </Carousel.Item>
                              
                              );
                        })} </Carousel>: <img src={logEntry.image[0]}/>
                    : null }
            
            
      <Card.Body>
        <Card.Title>{logEntry.placeName}</Card.Title>
        <Figure.Caption>{calculateTimeDifference(logEntry.createdAt, date)}</Figure.Caption>
        <Card.Text className="popup-description">
          {logEntry.description}Lm dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore 
          sectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore 
          sectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore 
         
        </Card.Text>
        <Figure.Caption>By: {logEntry.photographer} </Figure.Caption>
        <Button variant="primary">See more</Button>
      </Card.Body>
            </Card>
        </Popup>
    );
};

export default LogEntryPopUp;