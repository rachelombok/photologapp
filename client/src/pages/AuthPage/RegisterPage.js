import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import "./authpage.css";
import { Card, Form, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { registerUser, login } from "../../services/authenticationService";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";

const RegisterPage = ({ login }) => {
    const history = useHistory();
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        if (Boolean(user)) {
            history.push("/");
        }
    }, [user]);

    const handleOnChange = (event) => {
        const { name, value } = event.target;
    };

    const onSubmit = async (data) => {
        try {
            const res = await registerUser(
                data.email,
                data.fullname,
                data.username,
                data.password
            );

            setUser(res.user);
            toast(`📸 Welcome ${res.user.fullname}!`, {
                hideProgressBar: true,
                progressClassName: "justshoot-notification-progress-bar",
            });
            history.push("/");
        } catch (error) {
            toast.error(error.message, { position: "top-right" });
            console.error(error);
        }
    };

    return (
        <div className="day">
            <div>
                <Link to="/login">
                    <Button variant="outline-light" className="switch-btn">
                        Login
                    </Button>{" "}
                </Link>
            </div>

            <div className="center">
                <Form
                    className="login-container"
                    onSubmit={handleSubmit(onSubmit)}
                    encType="multipart/form-data"
                    autoComplete="off"
                >
                    <h3>Create Account</h3>

                    <Form.Group
                        controlId="formBasicTextArea"
                        className="btn-block"
                    >
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            name="fullname"
                            type="text"
                            placeholder="Enter name"
                            size="lg"
                            ref={register}
                            onChange={handleOnChange}
                            required
                            maxLength={50}
                        />
                    </Form.Group>

                    <Form.Group
                        controlId="formBasicEmail"
                        className="btn-block"
                    >
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            name="email"
                            type="email"
                            placeholder="Enter email"
                            size="lg"
                            ref={register}
                            onChange={handleOnChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group
                        controlId="formBasicTextArea"
                        className="btn-block"
                    >
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            name="username"
                            type="text"
                            placeholder="Enter username"
                            size="lg"
                            ref={register}
                            autoComplete="username"
                            onChange={handleOnChange}
                            required
                            minLength={3}
                            maxLength={30}
                        />
                    </Form.Group>

                    <Form.Group
                        controlId="formBasicPassword"
                        className="btn-block"
                    >
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            size="lg"
                            ref={register}
                            autoComplete="new-password"
                            onChange={handleOnChange}
                            required
                            minLength={8}
                            maxLength={30}
                        />
                    </Form.Group>
                    <br></br>

                    <Button variant="light" type="submit" size="md">
                        Submit
                    </Button>
                    <Form.Label muted className="text-right"></Form.Label>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;
