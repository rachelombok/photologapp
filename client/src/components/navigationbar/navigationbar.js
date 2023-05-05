import React from 'react';
import { Navbar,Nav,Button, Popover, OverlayTrigger, NavDropdown} from 'react-bootstrap'
import './navigationbar.css';
//import logo from '../../assets/images/digcamtrans.jpeg';
import logo from '../../assets/images/digicamtrans.jpeg';
import HelpMenu from '../helpmenu/helpmenu';
 

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Add Point</Popover.Header>
      <Popover.Body style={{color: 'white'}}>
      To share photos with the community, double click the map and upload your photo, set the correct location, and add a little writeup + details.
      </Popover.Body>
      <Popover.Header as="h3">Browse Points</Popover.Header>
      <Popover.Body style={{color: 'white'}}>
      Browse the map and search for snap spots posted by the JustShoot community, and click to see each one.
      </Popover.Body>
    </Popover>
  );


class NavigationBar extends React.Component{
    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.state = {
          dropdownOpen: false
        };
      }
    
      toggle() {
        this.setState(prevState => ({
          dropdownOpen: !prevState.dropdownOpen
        }));
      }
    
      onMouseEnter() {
        this.setState({dropdownOpen: true});
      }
    
      onMouseLeave() {
        this.setState({dropdownOpen: false});
      }

      shouldComponentUpdate(){
        return false;
      }
      render(){
          return(
              <div>
                  <Navbar className='navgradient' fixed="top">
                  <Navbar.Brand style={{fontSize:'30px', color:'white'}} className='navfont' ><a href='/'><img src={logo} width='60px' alt='logo'></img></a> JustShoot </Navbar.Brand>
                      <Nav className='mr-auto'>
                     {console.log('render navbar')}
                      <OverlayTrigger trigger="click" placement="right" overlay={popover}>
    <Button variant="light" style={{border: '2px solid black'}}><strong>Click me!</strong></Button>
          </OverlayTrigger>


          <HelpMenu/>
                      </Nav>
                     
                  </Navbar>

              </div>

          );
      }
  }

  export default NavigationBar;