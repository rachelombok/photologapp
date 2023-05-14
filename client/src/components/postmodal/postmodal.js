import React, { useContext, useState, useEffect } from 'react';
import { Modal, Carousel, Figure, Container, Col, Row, Card, Form, InputGroup, Button } from 'react-bootstrap'
import { UserContext } from '../../context/UserContext';
import { Link, useHistory } from 'react-router-dom';
import defaultavi from '../../assets/images/defaultavi.jpeg';
import '../../css/components/PostModal.css';
import { calculateTimeDifference, formatDateString } from '../../utils/logEntry';
import {Rating} from '@mui/material';
const PostModal = ({modal, setModal, logEntry}) => {
    console.log('PostModal rendered');
    const date = new Date();
    //modal, setModal,
    
    // fetch user data using the user id on the logentry
    // display a modal with the post data
    // // will be used on map and profile, so make it general for both
    // pass logentry to Modal, check if on profile or on map, also send profile info
    // only update if logentry or show prop changes
    // new endpoint to just get avatar / username
    // if displaying modal on Map page, dont put Link to "see this on map"

    // DISPLAY
    // carousel of all images (lazy loaded) ✅
    // name of who posted and username (click link to go to their profile)✅
    // place Name and date it was visited✅
    // how long ago it was posted (move that function to utils file)
    // descritpion of place etc✅
    // location icon w/ name of where the photolog was left 
    // avi of user 
    // show hash tags (when ready)
    // border around carousel
    const toggleModal = () => {
        setModal(!modal);
      };

    useEffect(() => {
        console.log('only mount this once when clicked')
    }, [])

    return(
        <Modal show={modal} onHide={toggleModal} size='lg' >


<Modal.Header closeButton>
<Modal.Title>{logEntry.placeName}</Modal.Title> 
</Modal.Header>
<Modal.Body>
{logEntry.image ? logEntry.image.length > 1 ? 
                    <Carousel fade variant='dark'>
                        {logEntry.image.map(function(e, i) {
                            return (
                            
                            <Carousel.Item>
                                <img
                                  className="d-block w-100 carousel-post-img"
                                  src={e}
                                  alt="First slide"
                                  key={i}
                                  loading="lazy"
                                />
                              </Carousel.Item>
                              
                              );
                        })} </Carousel>: <img className="d-block w-100 carousel-post-img" src={logEntry.image[0]}/>
                    : null }

        
<Card >

<Container >
          <Row>
          <Figure.Caption >Posted by <Link to={`/${logEntry.photographer}`}>{logEntry.photographer}</Link></Figure.Caption>
            <Col xs={12} md={8}>
                <Card.Title>
                    Description
                </Card.Title>
                {logEntry.description} 
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget
            <Card.Title>
                        Tags
            </Card.Title>
            <Button variant="outline-dark">#tag1</Button>
            <Button variant="outline-dark">#tag2</Button>
            <Card.Link>#tag3</Card.Link>
            <Card.Link>#tag4</Card.Link>
            <Card.Title>
                        Visit Date
            </Card.Title>
            <p>{formatDateString(logEntry.visitDate)}
             </p>
            
            <Card.Title>Rating</Card.Title>
            <Rating name="read-only" value={logEntry.rating} readOnly />
            <Link to={{ pathname: "/", lat: logEntry.latitude, long: logEntry.longitude  }}> See this post on the map</Link>
            </Col>

            
            <Col xs={6} md={4} >
            <Card.Title>Comments</Card.Title>
            
         <div className='comments-section grid'>
            <div id='username'>
            <Card.Subtitle>@{logEntry.photographer}</Card.Subtitle> <small>3d</small>
            </div>
           
            
           <p>This is a cool photo!

           Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus ella vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. A
           </p>
           
            
           
           </div>
           
            <Form id='post-comment-button'>
                <InputGroup>
                <Form.Control placeholder='Comment your reaction!' type='text' size='sm'/>
                <Button size='sm'>Comment</Button>
                </InputGroup>
                </Form>
            </Col>
           
          </Row>
        </Container>


</Card>


</Modal.Body>

<Modal.Footer>

    <small>{calculateTimeDifference(logEntry.createdAt, date)}</small>
</Modal.Footer>
        </Modal>
    );

};

export default PostModal;