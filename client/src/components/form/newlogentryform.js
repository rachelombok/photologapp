import React, { useState } from "react";
import { useForm } from "react-hook-form";
//import { createTravelEntry, uploadImage } from "../API";
//import { addLog } from '../API';
import "./logentryform.css";
import {
    Form,
    FormControl,
    Button,
    Popover,
    OverlayTrigger,
    Tooltip,
    Modal,
    InputGroup,
} from "react-bootstrap";

const NewLogEntryForm = (props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [rangeValue, setRangeValue] = useState(0);
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        if (data.images.length > 5) {
            window.alert("Do not submit more than 5 images.");
        } else {
            console.log("okie okie");
            let uploadedimage;
            try {
                setLoading(true);
            } catch (error) {
                console.log("newerr");
                console.error(error);
                setError(error.message);
                setLoading(false);
            }

            try {
                data.latitude = props.coordinates.latitude;
                data.longitude = props.coordinates.longitude;
                props.onFormClose();
            } catch (error) {
                console.error(error);
                setError(error.message);
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <style type="text/css">
                {`
      .btn-flat {
      background: linear-gradient(90deg, rgba(18,21,168,1) 0%, rgba(163,0,232,1) 100%);
      background-color: rgb(18,21,168);
      color: white;
    }

      .btn-xxl {
      padding: 1rem 1.5rem;
      font-size: 1.5rem;
    }
    `}
            </style>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Place Name</Form.Label>
                    <Form.Control
                        name="title"
                        type="text"
                        placeholder="Ex: Central Park"
                        required
                        ref={register}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Photographer (Instagram)</Form.Label>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>@</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            name="photographer"
                            placeholder="rachelombok"
                            ref={register}
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="images">Images</Form.Label>
                    <Form.File
                        name="images"
                        type="file"
                        accept="image/png, image/jpeg"
                        required
                        ref={register}
                        multiple
                        label="5 images MAX"
                    />
                    {/*on change, check image size */}
                    <Form.Text className="text-muted">
                        {/*Select up to 5 images.*/}
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        name="description"
                        as="textarea"
                        placeholder="Ex: Nice greenery shots in the heart of NYC, taken with a Nikon D3200 with f/11,
          ISO 200, shutter 1/16. Very beautiful during the summer."
                        ref={register}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                        name="tags"
                        placeholder="landscape NYC nature sun"
                        ref={register}
                    />
                    <Form.Text className="text-muted">
                        Separate by whitespace, up to 10 tags.
                    </Form.Text>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Visit Date</Form.Label>
                    <Form.Control name="date" type="date" ref={register} />
                </Form.Group>

                <Button
                    disabled={loading}
                    type="submit"
                    {...(loading ? "Creating..." : "Created")}
                    variant="flat"
                    block
                    size="lg"
                >
                    <b>Submit</b>
                </Button>
            </Form>
        </div>
    );
};

export default LogEntryForm;
