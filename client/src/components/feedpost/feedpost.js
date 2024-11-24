import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Chip,
    Stack,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostModal from "../postmodal/postmodal";
import "../../css/pages/FeedPage.css";
import {
    formatDateString,
    calculateTimeDifference,
    formatLikeMessage,
} from "../../utils/logEntry";
import { getLogEntryLikes, toggleLike } from "../../services/postService";
import { UserContext } from "../../context/UserContext";

const FeedPost = ({ logEntry }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const date = new Date();
    const [likes, setLikes] = useState([]);
    const [isLogLiked, setIsLogLiked] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const { user } = useContext(UserContext);
    const token = localStorage.getItem("jwtToken");
    const [modal, setModal] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (callback) => {
        setAnchorEl(null);
    };
    const toggleModal = (e) => {
        setModal(!modal);
    };

    const handleLike = async (e) => {
        e.preventDefault();

        try {
            const res = await toggleLike(logEntry._id, token);
            setIsLogLiked(!isLogLiked);
            setRefetch(true);
        } catch (e) {
            setRefetch(false);
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
        const likeList = await getLogEntryLikes(logEntry._id);

        setLikes(likeList);
        isLiked();
        setRefetch(false);
    }, [refetch, likes?.length]);

    return (
        <div className="feed-post">
            <Card
                sx={{
                    backgroundColor: "#242424",
                    border: "2px solid white",
                    color: "white",
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar
                            aria-label="recipe"
                            src={logEntry.author.avatar}
                        >
                            R
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings" onClick={handleClick}>
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={logEntry.placeName}
                    subheader={
                        <span style={{ color: "white" }}>
                            Visited on {formatDateString(logEntry.visitDate)}
                        </span>
                    }
                />
                <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={() => handleClose()}
                >
                    <MenuItem
                        key="item"
                        onClick={handleClose}
                        href={`${logEntry.photographer}`}
                        component="a"
                    >
                        Go to Profile
                    </MenuItem>
                </Menu>
                {logEntry.image ? (
                    logEntry.image.length > 1 ? (
                        <Carousel variant="light" interval={null}>
                            {logEntry.image.map(function (e, i) {
                                return (
                                    <Carousel.Item
                                        interval={null}
                                        data-bs-interval="false"
                                        key={i}
                                    >
                                        <img
                                            className="d-block w-100 carousel-feed-post-img"
                                            src={e}
                                            alt="First slide"
                                            key={i}
                                            loading="lazy"
                                        />
                                    </Carousel.Item>
                                );
                            })}
                        </Carousel>
                    ) : (
                        <img
                            className="d-block w-100 carousel-feed-post-img"
                            src={logEntry.image[0]}
                        />
                    )
                ) : null}

                <CardContent>
                    <Typography variant="body2" color="white">
                        <Link
                            to={`${logEntry.photographer}`}
                            className="justshoot-link"
                        >
                            <b>{logEntry.photographer}</b>
                        </Link>{" "}
                        {logEntry.description}
                    </Typography>
                    {logEntry.tags > 0 ? (
                        <Stack direction="row" spacing={1}>
                            {logEntry.tags.split(",").map((tag) => (
                                <Chip
                                    label={`${tag}`}
                                    clickable
                                    key={tag}
                                    variant="outlined"
                                />
                            ))}
                        </Stack>
                    ) : null}
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton onClick={handleLike}>
                        {isLogLiked ? (
                            <FavoriteIcon sx={{ color: "#ba53f1" }} />
                        ) : (
                            <FavoriteBorderIcon sx={{ color: "#ba53f1" }} />
                        )}
                    </IconButton>
                    <small>{formatLikeMessage(likes.length)}</small>
                    <IconButton
                        aria-label="add to favorites"
                        onClick={toggleModal}
                    >
                        <ChatIcon sx={{ color: "#ba53f1" }} />
                    </IconButton>
                    <div className="date-posted">
                        {calculateTimeDifference(logEntry.createdAt, date)}
                    </div>
                </CardActions>
            </Card>
            {modal ? (
                <PostModal
                    logEntry={logEntry}
                    modal={modal}
                    setModal={setModal}
                />
            ) : null}
        </div>
    );
};

export default FeedPost;
