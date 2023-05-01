import React, { useContext } from 'react';
import { NavDropdown, Button, Row, Col, Image } from 'react-bootstrap'

const ProfilePostSection = ({logs}) => {

    return (
        <Row xs={1} md={3} className='post-grid'>
            {logs?.map((log)=>(
                <Col key={log._id}>
                <Image src={log.image} alt={log.rating} className='post-img' rounded >
                    
                </Image>
            </Col>
            ))}
            
        </Row>
    );
};

export default ProfilePostSection;