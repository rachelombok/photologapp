import React, { useContext, useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import UserListModal from "../userlistmodal/userlistmodal";
import LoginModal from "../loginModal/loginModal";
import { followUser } from "../../services/profileService";
import { toast } from "react-toastify";
import { Avatar } from "@mui/material";

const ProfileHeader = ({ profile, setRefetch }) => {
    const [showFollowersModal, setFollowersModal] = useState(false);
    const [showFollowingModal, setFollowingModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false);
    const { user } = useContext(UserContext);

    const token = localStorage.getItem("jwtToken");
    // avatar, following, followers, post #
    // edit profile or following/follow button
    //  useContext is for checking if logged in or not
    // get(/:username) is for fetching user
    // dont allow click on following/follower unless authenticated

    const follow = async () => {
        try {
            // check if user exists, if not redirect to login page/register page
            if (user || token) {
                // refactor tjis function to accept a username/profile
                const alreadyFollowing = profile?.isFollowing;
                await followUser(profile?._id, token);
                //if (alreadyFollowing) toast.success('')
                //toast.success('you followed them!');
                //window.location.reload(); //figure out how to refresh
                setRefetch(true);
            } else {
                setShowLoginModal(true);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        if (user && token) {
            setIsAuthenticatedUser(true);
        } else {
            setIsAuthenticatedUser(false);
        }

        // use refetch instead when a user follows
    }, [
        profile?.followersCount,
        profile?.followingCount,
        profile?.isFollowing,
    ]);

    const toggleModal = (e) => {
        // console.log(e.target.id, e);
        //console.log(getDisplayLog(e.target.id));
        //setModalLog(getDisplayLog(e.target.id));
        setFollowersModal(false);
        setFollowingModal(false);
    };

    return (
        <>
            <Card border="dark">
                <Card.Body className="profile-header">
                    <Avatar src={profile?.avatar} className="avatar" />
                    <div>
                        <Card.Title as="h2" style={{ margin: "10px 0 0 0" }}>
                            {profile?.fullname}

                            {profile.isMe ? (
                                <Button
                                    variant="dark"
                                    style={{ margin: "10px" }}
                                    size="sm"
                                    href="/edit"
                                    className="justshoot-btn"
                                >
                                    Edit Profile
                                </Button>
                            ) : profile?.isFollowing ? (
                                <Button
                                    variant="dark"
                                    style={{ margin: "10px" }}
                                    size="sm"
                                    onClick={follow}
                                    className="justshoot-btn"
                                >
                                    Unfollow
                                </Button>
                            ) : (
                                <Button
                                    variant="dark"
                                    style={{ margin: "10px" }}
                                    size="sm"
                                    onClick={follow}
                                    className="justshoot-btn"
                                >
                                    Follow
                                </Button>
                            )}

                            {!isAuthenticatedUser && (
                                <Button
                                    variant="dark"
                                    as={Link}
                                    to="/"
                                    size="sm"
                                    className="justshoot-btn"
                                >
                                    Back to Map
                                </Button>
                            )}
                        </Card.Title>

                        <Card.Subtitle className="mb-2 text-muted">
                            @{profile?.username}
                        </Card.Subtitle>
                        <Card.Link
                            onClick={() => console.log("this link was clicked")}
                            className="justshoot-link"
                        >
                            {profile?.logCount} posts
                        </Card.Link>
                        <Card.Link
                            onClick={() => setFollowersModal(true)}
                            className="justshoot-link"
                            style={{ cursor: "pointer" }}
                        >
                            {profile?.followersCount} followers
                        </Card.Link>
                        <Card.Link
                            onClick={() => setFollowingModal(true)}
                            className="justshoot-link"
                            style={{ cursor: "pointer" }}
                        >
                            {profile?.followingCount} following
                        </Card.Link>

                        <Card.Text>{profile?.bio}</Card.Text>
                        <Card.Link
                            href={profile?.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="justshoot-link"
                        >
                            {profile?.website}
                        </Card.Link>
                        <br></br>
                    </div>
                    {showFollowersModal &&
                    profile?.followersCount &&
                    isAuthenticatedUser ? (
                        <UserListModal
                            userId={profile?._id}
                            token={token}
                            userListName={"Followers"}
                            userListCount={profile?.followersCount}
                            show={showFollowersModal}
                            setShow={setFollowersModal}
                            follow={follow}
                        />
                    ) : null}
                    {showFollowingModal &&
                    profile?.followingCount &&
                    isAuthenticatedUser ? (
                        <UserListModal
                            userId={profile?._id}
                            token={token}
                            userListName={"Following"}
                            userListCount={profile?.followersCount}
                            show={showFollowingModal}
                            setShow={setFollowingModal}
                            follow={follow}
                        />
                    ) : null}
                    {showLoginModal ? (
                        <LoginModal
                            modal={showLoginModal}
                            setModal={setShowLoginModal}
                            message="You must have an account to follow others."
                        />
                    ) : null}
                </Card.Body>
            </Card>
        </>
    );
};
export default ProfileHeader;
