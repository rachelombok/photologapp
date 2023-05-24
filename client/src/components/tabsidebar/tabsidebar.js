import React, { useContext, useState, useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";

const TabSidebar = () => {
    return (
        <Nav className="flex-column" variant="pills">
            <Nav.Link href="/home">Active</Nav.Link>
            <Nav.Link eventKey="link-1">Link</Nav.Link>
            <Nav.Link eventKey="link-2">Link</Nav.Link>
        </Nav>
    );
};
export default TabSidebar;
