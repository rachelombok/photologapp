import React, { useContext, useState, useEffect } from "react";
import {
    Modal,
    Carousel,
    Figure,
    Container,
    Col,
    Row,
    Card,
    Button,
} from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import "../../css/components/PostModal.css";
import {
    calculateTimeDifference,
    formatDateString,
    calculateCommentTimeDifference,
} from "../../utils/logEntry";
import { Rating, Avatar, AvatarGroup, Chip, Stack } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { toast } from "react-toastify";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import CommentForm from "../commentform/commentform";
import {
    getComments,
    getLogEntryLikes,
    toggleLike,
} from "../../services/postService";

const PostModal = ({ modal, setModal, logEntry, fromMap = false }) => {
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [isLogLiked, setIsLogLiked] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const { user } = useContext(UserContext);
    const token = localStorage.getItem("jwtToken");
    const date = new Date();

    const toggleModal = () => {
        setModal(!modal);
    };

    const handleLike = async (e) => {
        e.preventDefault();

        try {
            if (!Boolean(user))
                return toast.error("Must have an account to leave a like.", {
                    hideProgressBar: true,
                });
            const res = await toggleLike(logEntry._id, token);
            setIsLogLiked(!isLogLiked);
            setRefetch(true);
        } catch (e) {
            setRefetch(false);
            toast.error(e.message);
        }
    };

    const isLiked = () => {
        let found = false;
        if (user && token && likes) {
            likes.forEach((like) => {
                if (like.author._id == user._id) {
                    found = true;
                    setIsLogLiked(true);
                    setRefetch(false);
                    return;
                }
            });
        }
        if (!found) {
            setIsLogLiked(false);
        }
    };

    useEffect(async () => {
        const commentList = await getComments(logEntry._id);
        const likeList = await getLogEntryLikes(logEntry._id);

        setComments(commentList);
        setLikes(likeList);
        isLiked();
        setRefetch(false);
    }, [comments.length, likes?.length, refetch]);

    return (
        <Modal
            show={modal}
            onHide={toggleModal}
            size="lg"
            className="post-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title className="post-modal-title">
                    {logEntry.placeName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {logEntry.image ? (
                    logEntry.image.length > 1 ? (
                        <Carousel fade variant="light">
                            {logEntry.image.map(function (e, i) {
                                return (
                                    <Carousel.Item key={i}>
                                        <img
                                            className="d-block w-100 carousel-post-img"
                                            src={e}
                                            alt="First slide"
                                            key={i}
                                            loading="lazy"
                                        />
                                    </Carousel.Item>
                                );
                            })}{" "}
                        </Carousel>
                    ) : (
                        <img
                            className="d-block w-100 carousel-post-img"
                            src={logEntry.image[0]}
                        />
                    )
                ) : null}

                <Card className="post-modal-card">
                    <Container>
                        <Row>
                            <Figure.Caption>
                                Posted by{" "}
                                <Link
                                    to={`${logEntry.photographer}`}
                                    className="justshoot-link"
                                >
                                    {logEntry.photographer}
                                </Link>
                            </Figure.Caption>
                            <Col
                                xs={12}
                                md={8}
                                style={{
                                    borderLeft: "2px solid #999999",
                                    borderRight: "2px solid #999999",
                                }}
                            >
                                <Card.Title className="post-modal-title">
                                    Description
                                </Card.Title>
                                <p>{logEntry.description} </p>
                                {logEntry.tags ? (
                                    <>
                                        <Card.Title className="post-modal-title">
                                            Tags
                                        </Card.Title>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{ marginBottom: "10px" }}
                                        >
                                            {logEntry.tags
                                                .split(",")
                                                .map((tag) => (
                                                    <Chip
                                                        label={`#${tag}`}
                                                        clickable
                                                        key={tag}
                                                        sx={{ color: "white" }}
                                                        variant="outlined"
                                                    />
                                                ))}
                                        </Stack>
                                    </>
                                ) : null}
                                <Card.Title className="post-modal-title">
                                    Visit Date
                                </Card.Title>
                                <p>{formatDateString(logEntry.visitDate)}</p>
                                <Card.Title className="post-modal-title">
                                    Rating
                                </Card.Title>
                                <Rating
                                    name="read-only"
                                    value={logEntry.rating}
                                    readOnly
                                />
                                <br></br>
                                {!fromMap ? (
                                    <Link
                                        to={{
                                            pathname: "/",
                                            lat: logEntry.latitude,
                                            long: logEntry.longitude,
                                        }}
                                        className="justshoot-link"
                                    >
                                        {" "}
                                        See this post on the map
                                    </Link>
                                ) : null}
                                {likes?.length > 0 ? (
                                    <>
                                        <Card.Title className="post-modal-title">
                                            Liked By
                                        </Card.Title>
                                        <div>
                                            <AvatarGroup
                                                max={10}
                                                appearance="stack"
                                                sx={{ display: "inline-flex" }}
                                            >
                                                {likes.map((like) => (
                                                    <Avatar
                                                        src={`${like.author.avatar}`}
                                                        key={like}
                                                    />
                                                ))}
                                            </AvatarGroup>
                                        </div>
                                    </>
                                ) : null}
                                <br></br> <br></br>
                                <Button
                                    variant="dark"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={`http://maps.google.com?q=${logEntry.latitude},${logEntry.longitude}&z=6`}
                                    className="justshoot-btn"
                                >
                                    {" "}
                                    Get Directions
                                </Button>
                            </Col>

                            <Col xs={6} md={4}>
                                <Card.Title>Comments</Card.Title>

                                <div className="comments-section grid">
                                    {comments?.length > 0 ? (
                                        comments.map((comment) => (
                                            <div>
                                                <div
                                                    style={{
                                                        display: "inline-flex",
                                                    }}
                                                >
                                                    <Avatar
                                                        src={
                                                            comment.author
                                                                .avatar
                                                        }
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            marginRight: "3px",
                                                        }}
                                                    />
                                                    <div id="username">
                                                        <Card.Subtitle>
                                                            <Link
                                                                to={`${comment.author.username}`}
                                                                className="justshoot-link"
                                                            >
                                                                {" "}
                                                                @
                                                                {
                                                                    comment
                                                                        .author
                                                                        .username
                                                                }
                                                            </Link>
                                                        </Card.Subtitle>{" "}
                                                        <small>
                                                            {calculateCommentTimeDifference(
                                                                comment.createdAt,
                                                                date
                                                            )}
                                                        </small>
                                                    </div>
                                                </div>

                                                <p>{comment.message}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <h6 style={{ bottom: 0 }}>
                                            Add the first comment!
                                        </h6>
                                    )}
                                </div>

                                <CommentForm
                                    logId={logEntry._id}
                                    setRefetch={setRefetch}
                                    user={user}
                                />
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </Modal.Body>

            <Modal.Footer className="post-modal-title">
                <p className="mr-auto">
                    <IconButton onClick={handleLike}>
                        {isLogLiked ? (
                            <FavoriteIcon sx={{ color: "#ba53f1" }} />
                        ) : (
                            <FavoriteBorderIcon sx={{ color: "#ba53f1" }} />
                        )}
                    </IconButton>
                    {isLogLiked ? "You liked this." : ""}
                </p>
                <small className="post-modal-title">
                    {calculateTimeDifference(logEntry.createdAt, date)}
                </small>
            </Modal.Footer>
        </Modal>
    );
};

export default PostModal;
