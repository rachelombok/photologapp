import React, { useContext, useEffect } from 'react';
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
        localStorage.removeItem("jwtToken");
        history.push("/login");
        //toast.success("You are logged out");
        //
      };

    useEffect(() => {
        console.log('mount help menu')
    }, [user])

    return (
        <>{' '}
        {console.log('render help menu')}
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
            : <Button variant="light" style={{border: '2px solid black', marginLeft: '10px'}} href='/login'>Sign in</Button>}</>
    );
}
export default HelpMenu;