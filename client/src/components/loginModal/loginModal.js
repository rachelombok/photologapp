import React from 'react';
import { Modal, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import '../../css/components/PostModal.css';

const LoginModal = ({modal, setModal, message}) => {

    const toggleModal = () => {
        setModal(!modal);
      };

    return(
        <Modal show={modal} onHide={toggleModal} size='sm' centered className='post-modal'>
            <Modal.Header closeButton/>
            <Modal.Body className='post-modal-title'>
          <p>{message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button as={Link} to='/register' variant="secondary">Register</Button>
          <Button as={Link} to='/login' variant="dark" className='justshoot-btn'>Login</Button>
        </Modal.Footer>
        </Modal>
    )
}

export default LoginModal;