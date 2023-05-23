
import React, { useEffect, useState, useContext } from 'react';
// import TabSidebar from '../../components/tabsidebar/tabsidebar';
import { Tab, Nav, Row, Col, Tabs } from 'react-bootstrap'
import { Link, useHistory, useParams, Route, Redirect } from 'react-router-dom';
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
        console.log('paramssssssss', match.params.anyUrl, key);
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
          console.log(decodedJwt);
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
          {/*<Tabs activeKey={tab} onSelect={nextTab => history.replace(nextTab)}>
            <Tab eventKey="home" title="Home">
              The first tab
            </Tab>
            <Tab eventKey="people" title="People">
              The second tab
            </Tab>
        </Tabs>*/}
          <Tab.Container activeKey={tab} onSelect={nextTab => history.replace(nextTab)}>
            <Row>
               <Col sm={3}>
               <Nav variant="pills" className="flex-column">
              

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

          <Nav.Item>
            <Nav.Link eventKey={`${user.username}`} to={`/${user.username}`}>MyProfile</Nav.Link>
          </Nav.Item>
              

            <Nav.Item hidden>
              <Nav.Link eventKey={`${key}`} to={`${key}`} ></Nav.Link>
            </Nav.Item>
               </Nav>
               </Col >
               <Col sm={9}>
               <Tab.Content>


                {console.log(key)}
               
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
            
            
            
            key == user.username ? <Tab.Pane eventKey={`${user.username}`}>
        <ProfilePage url={key}/>
            </Tab.Pane> : <Tab.Pane eventKey={`${key}`}>
                {console.log('you try her?')}
            <ProfilePage url={key}/>
            </Tab.Pane>
            : null}

               </Tab.Content>
               </Col>
            </Row>
          </Tab.Container>
          </>
        );
      }}
    </Route>
        {/*<Tab.Container>
            <Row>
                <Col sm={3}>
                <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first" href='/rachomb688'>MyProfile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} eventKey="second" to='/rachombie'>Feed</Nav.Link>
            </Nav.Item>
          </Nav>
                </Col>
                <Col sm={9}>
                <Tab.Content>
            <Tab.Pane eventKey="first">
        first
            </Tab.Pane>
            <Tab.Pane eventKey="second">
              <EditProfilePage/>
            </Tab.Pane>
          </Tab.Content>
                </Col>
            </Row>
    </Tab.Container>*/}
    {/*<Tabs>
        {user?.username ? <Tab eventKey="home" title="Home">
        <ProfilePage/>
      </Tab> : null }
    
      <Tab eventKey="profile" title="Profile">
        <EditProfilePage/>
      </Tab>
</Tabs>*/}
        </>
    

    );
};

export default HomePage;