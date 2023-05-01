import React, { useContext } from 'react';
import { NavDropdown, Button} from 'react-bootstrap'
import { UserContext } from '../../context/UserContext';
import { Link, useHistory } from 'react-router-dom';
import '../../css/components/HelpMenu.css';
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
              <NavDropdown.Item as={Link} to={`/${user.username}`}>Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to='edit'>
                Edit Profile
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