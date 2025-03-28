import React, { useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import emailjs from "@emailjs/browser";
import { UserContext } from "../../context/UserContext.js";
import { toast } from "react-toastify";

const FeedbackForm = () => {
    const form = useRef();
    const { user } = useContext(UserContext);
    const history = useHistory();

    const sendEmail = (e) => {
        e.preventDefault();
        emailjs
            .sendForm(
                "service_mwhljm6",
                "template_nbyedsl",
                form.current,
                "user_2wBZ9qESfc8nrcHgF0SKm"
            )
            .then(
                (result) => {
                    toast.success("Thanks for your feedback!");
                    history.push("/feed");
                },
                (error) => {
                    toast.error(`${error.text}`);
                }
            );
    };

    return (
        <Form ref={form} onSubmit={sendEmail}>
            <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextEmail"
            >
                <Form.Label column sm="2">
                    Email
                </Form.Label>
                <Col sm="10">
                    <Form.Control
                        defaultValue={user.email}
                        name="email"
                        required
                        type="email"
                    />
                </Col>
            </Form.Group>

            <Form.Group
                as={Row}
                className="mb-3"
                controlId="formHorizontalName"
            >
                <Form.Label column sm={2}>
                    Full Name
                </Form.Label>
                <Col sm={10}>
                    <Form.Control
                        type="text"
                        placeholder="Name"
                        name="fullname"
                    />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalBio">
                <Form.Label column sm={2}>
                    Message
                </Form.Label>
                <Col sm={10}>
                    <Form.Control
                        as="textarea"
                        placeholder="Feedback? Feature request? Support questions? Contact us here!"
                        name="message"
                        required
                    />
                </Col>
            </Form.Group>

            <Button variant="dark" type="submit" className="justshoot-btn">
                Send
            </Button>
        </Form>
    );
};

export default FeedbackForm;
