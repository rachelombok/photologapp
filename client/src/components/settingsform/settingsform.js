import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../context/UserContext.js";
import { toast } from "react-toastify";
import { Form, Button, Row, Col } from "react-bootstrap";
import useInput from "../../hooks/useInput.js";
import { changePassword } from "../../services/authenticationService.js";
import { validatePassword } from "../../utils/validation.js";

const SettingsForm = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { user, setUser } = useContext(UserContext);
    const token = localStorage.getItem("jwtToken");
    const newPassword = useInput("");
    const oldPassword = useInput("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newPasswordError = validatePassword(newPassword.value);
        if (newPasswordError) return toast.error(newPasswordError);

        try {
            setLoading(true);
            await changePassword(oldPassword.value, newPassword.value, token);
            toast.success(
                "Your password has been updated! You'll have to log in with the new one next time.",
                { hideProgressBar: true }
            );
            setLoading(false);
            history.push(`${user.username}`);
        } catch (e) {
            toast.error(e.message, {
                position: "top-right",
            });
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <div className="profile-page grid">
                <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalOldPassword"
                >
                    <Form.Label column sm={2}>
                        Old Password
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="password"
                            placeholder="Old Password"
                            defaultValue={oldPassword.value}
                            onChange={oldPassword.onChange}
                            required
                        />
                    </Col>
                </Form.Group>

                <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalNewPassword"
                >
                    <Form.Label column sm={2}>
                        New Password
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="password"
                            placeholder="New Password"
                            defaultValue={newPassword.value}
                            onChange={newPassword.onChange}
                            required
                        />
                    </Col>
                </Form.Group>
                <Button
                    variant="dark"
                    className="justshoot-btn"
                    type="submit"
                    disabled={loading}
                >
                    Update Profile
                </Button>
            </div>
        </Form>
    );
};

export default SettingsForm;
