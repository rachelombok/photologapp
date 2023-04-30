import React, { useContext } from 'react';
import { NavDropdown, Button} from 'react-bootstrap'
import { UserContext } from '../../context/UserContext';
import { Link, useHistory } from 'react-router-dom';
const HelpMenu = () => {
    const history = useHistory();
    const { user, setUser } = useContext(UserContext);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        history.push("/test");
        //toast.success("You are logged out");
        //
      };

    return (
        <>
        {user ? 
        <NavDropdown title={user.username} id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                Sign Out
              </NavDropdown.Item>
            </NavDropdown>
            : <Button variant="light" style={{border: '2px solid black'}} href='/test'>Sign in</Button>}</>
    );
}
export default HelpMenu;