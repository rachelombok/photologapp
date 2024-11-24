import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import "bootstrap/dist/css/bootstrap.min.css";
import { listLogEntries } from "./services/postService";
import "mapbox-gl/dist/mapbox-gl.css";
import LogEntryForm from "./components/form/LogEntryForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import LoginPage from "./pages/AuthPage/LoginPage";
import RegisterPage from "./pages/AuthPage/RegisterPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import EditProfilePage from "./pages/EditProfile/EditProfilePage";
import MapPage from "./pages/MapPage/MapPage";
import NotFoundPage from "./pages/NotFoundPage/NotFound";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import HomePage from "./pages/HomePage/HomePage";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useLocation,
    Redirect,
    withRouter,
} from "react-router-dom";
import { UserContext } from "./context/UserContext";
import "../src/css/misc/toast.css";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.token = localStorage.getItem("jwtToken");

        this.user = localStorage.getItem("user");

        this.pathName = this.props.location;
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        return (
            <div>
                <ToastContainer
                    autoClose={4000}
                    closeButton={false}
                    closeOnClick
                    theme="dark"
                />

                <Router>
                    <Switch>
                        <Route exact path="/" component={MapPage} />

                        {Boolean(this.user && this.token) ? (
                            <Route exact path="/:anyUrl" component={HomePage} />
                        ) : (
                            <>
                                <Route
                                    exact
                                    path="/login"
                                    component={LoginPage}
                                />
                                <Route
                                    exact
                                    path="/register"
                                    component={RegisterPage}
                                />
                                <Route
                                    exact
                                    path="/:anyUrl"
                                    render={(props) => (
                                        <ProfilePage
                                            url={props.match.params.anyUrl}
                                        />
                                    )}
                                />
                            </>
                        )}
                        <Route path="/*" component={NotFoundPage} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

function areEqual(prevProps, nextProps) {
    console.log(nextProps, prevProps);
}

export default App;
