import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../context/UserContext.js";
import { toast } from "react-toastify";
import { Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import useInput from "../../hooks/useInput.js";
import {
    updateUserProfile,
    updateUserAvatar,
} from "../../services/userService.js";
const EditProfileForm = () => {
    const history = useHistory();
    const [error, setError] = useState("");
    const [newAvatar, setNewAvatar] = useState("");
    const { user, setUser } = useContext(UserContext);
    const token = localStorage.getItem("jwtToken");
    const fullname = useInput(user.fullname);
    const username = useInput(user.username);
    const bio = useInput(user.bio);
    const website = useInput(user.website);

    const setFile = (e) => {
        if (e.target.files[0]) {
            setNewAvatar(e.target.files[0]);
        }
    };

    const handleEditProfile = async (e) => {
        e.preventDefault();
        const nothingChanged =
            fullname.value == user.fullname &&
            username.value == user.username &&
            bio.value == user.bio &&
            website.value == user.website &&
            !newAvatar;

        if (nothingChanged)
            return toast.info("Nothing to update", { hideProgressBar: true });
        try {
            if (newAvatar) {
                let formData = new FormData();
                formData.append("image", newAvatar, newAvatar.name);

                await updateUserAvatar(formData, token);
            }

            const body = {
                fullName: fullname.value,
                username: username.value,
                bio: bio.value,
                website: website.value,
            };
            const res = await updateUserProfile(body, token);
            setUser(res.user);
            const redirectProfile = username.value
                ? username.value
                : user.username;

            toast.success("Profile updated!", { hideProgressBar: true });
            history.push(`/${redirectProfile}`);
        } catch (err) {
            toast.error(err.message, {
                position: "top-right",
            });
        }
    };
    return (
        <Form onSubmit={handleEditProfile} encType="multipart/form-data">
            <div className="profile-page grid">
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
                            plaintext
                            readOnly
                            defaultValue={user.email}
                        />
                    </Col>
                </Form.Group>

                <Form.Group
                    controlId="formHorizontalFile"
                    className="mb-3"
                    as={Row}
                >
                    <Form.Label column sm={2}>
                        Avatar
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="file"
                            name="avatar"
                            onChange={setFile}
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
                            defaultValue={fullname.value}
                            onChange={fullname.onChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalName"
                >
                    <Form.Label column sm={2}>
                        Username
                    </Form.Label>
                    <Col sm={10}>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">
                                @
                            </InputGroup.Text>

                            <Form.Control
                                placeholder="Username"
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                defaultValue={username.value}
                                onChange={username.onChange}
                            />
                        </InputGroup>
                    </Col>
                </Form.Group>

                <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formHorizontalBio"
                >
                    <Form.Label column sm={2}>
                        Bio
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            as="textarea"
                            placeholder="Bio"
                            defaultValue={bio.value}
                            onChange={bio.onChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group
                    as={Row}
                    className="mb-3"
                    controlId="formBasicEmail"
                >
                    <Form.Label column sm={2}>
                        Website
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control
                            type="text"
                            placeholder="Website"
                            defaultValue={website.value}
                            onChange={website.onChange}
                        />
                    </Col>
                </Form.Group>
                <Button variant="dark" type="submit" className="justshoot-btn">
                    Update Profile
                </Button>
            </div>
        </Form>
    );
};
export default EditProfileForm;
