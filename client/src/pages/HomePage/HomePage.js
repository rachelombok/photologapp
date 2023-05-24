
import React, { useEffect, useState, useContext } from 'react';
import { Tab, Nav, Row, Col } from 'react-bootstrap'
import {  useHistory,  Route, Redirect } from 'react-router-dom';
import ProfilePage from '../Profile/ProfilePage';
import EditProfilePage from '../EditProfile/EditProfilePage';
import SettingsPage from '../SettingsPage/SettingsPage';
import FeedPage from '../FeedPage/FeedPage';
import FeedbackPage from '../FeedbackPage/FeedbackPage';
import { UserContext } from '../../context/UserContext';
import { parseJwt } from '../../utils/miscUtils';
import { toast } from "react-toastify";

const ProtectedNavItem = ({eventKey, tabTitle, isAuthenticatedUser}) => {
if (isAuthenticatedUser){
  <Nav.Item>
  <Nav.Link eventKey={eventKey}>{tabTitle}</Nav.Link>
</Nav.Item>
} else{
  return <Redirect to='/'/>
}
}
const HomePage = ({match}) => {
    const { user, setUser } = useContext(UserContext);
    const [key, setKey] = useState('');
    const token = localStorage.getItem('jwtToken');
    const history = useHistory();

    useEffect(() => {
        setKey(match.params.anyUrl);
        handleLogout();
    }, [match.params.anyUrl, user, token]);

    const isAuthenticatedUser = () => {
      return Boolean(token && user);
    }

    const handleLogout = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (isAuthenticatedUser()){
        const decodedJwt = parseJwt(token);
        if (decodedJwt.exp * 1000 < Date.now()) {
         
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("jwtToken");
          history.push("/login");
          toast.warn('Session timed out. Please login again.');
        }
      }
     
    };

    return(
        <>
        <Route path="/:tab">
      {({ match, history }) => {
        const { tab } = match ? match.params : {};

        return (
            <>
         
          <Tab.Container activeKey={tab} onSelect={nextTab => history.replace(nextTab)}>
            <Row className='justshoot-main'>
               <Col sm={3} >
               <Nav variant="pills" className="flex-column justshoot-tabs" >

               <Nav.Item>
            <Nav.Link eventKey='map'>Back to Map</Nav.Link>
          </Nav.Item>

           <Nav.Item>
            <Nav.Link eventKey='feed' >Feed</Nav.Link>
          </Nav.Item>

             <Nav.Item>
            <Nav.Link eventKey='edit' >Edit</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey='settings'>Settings</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey='feedback'>Feedback</Nav.Link>
          </Nav.Item>
          

          {user && <Nav.Item>
            <Nav.Link eventKey={`${user.username}`} to={`/${user.username}`}>MyProfile</Nav.Link>
          </Nav.Item>}
              

            <Nav.Item hidden>
              <Nav.Link eventKey={`${key}`} to={`${key}`} ></Nav.Link>
            </Nav.Item>
               </Nav>
               </Col >
               <Col sm={9}>
               <Tab.Content >

            <div style={{paddingTop: '20px'}}>
               
            {Boolean(key) ?
            key == 'feed' ? <Tab.Pane eventKey='feed'>
              <FeedPage/>
            </Tab.Pane> :
                key == 'settings' ? <Tab.Pane eventKey='settings'>
                <SettingsPage/>
                    </Tab.Pane> : key == 'edit' ? <Tab.Pane eventKey='edit'>
        <EditProfilePage/>
            </Tab.Pane> : key == 'feedback' ? <Tab.Pane eventKey='feedback'>
              <FeedbackPage/>
            </Tab.Pane> :

            key == 'register' || key == 'login' ? <Redirect to='/'/>:
            
            key == 'map' ? <Tab.Pane eventKey='map' as={Redirect} to='/'/> :
            
            key == user.username ? <Tab.Pane eventKey={`${user.username}`}>
        <ProfilePage url={key}/>
            </Tab.Pane> : <Tab.Pane eventKey={`${key}`}>
            <ProfilePage url={key}/>
            </Tab.Pane>
            : null}

</div>
               </Tab.Content>
               
               </Col>
            </Row>
          </Tab.Container>
          </>
        );
      }}
    </Route>
        
        </>
    

    );
};

export default HomePage;