import React, { useContext, useState, useEffect } from 'react';
import { NavDropdown, Button, Row, Col, Image } from 'react-bootstrap'
import PostModal from '../postmodal/postmodal';

const ProfilePostSection = ({logs}) => {

    const [modal, setModal] = useState(false);
    const [modalLog, setModalLog] = useState({});

    const getDisplayLog = (clickedLog) => {
        const foundLog = logs.find(log => log._id == clickedLog);
        return foundLog;
    };

    const toggleModal = (e) => {
        // console.log(e.target.id, e);
        //console.log(getDisplayLog(e.target.id));
        setModalLog(getDisplayLog(e.target.id));
        setModal(!modal);
      };

      useEffect(() =>{
        console.log('Profile post secion rendered');
      }, [logs])

    return (
        
        <Row xs={1} md={3} className='post-grid'>
            {console.log("log images",logs)}
            {logs?.map((log)=>(
                <Col key={log._id}>
                <Image src={log.image[0]} alt={log.rating} className='post-img' rounded loading="lazy" onClick={toggleModal} id={log._id}/>
                    
                

            </Col>
            ))}
            {modal ? <PostModal logEntry={modalLog} modal={modal} setModal={setModal} /> : null}
        </Row>
    );
};

export default ProfilePostSection;