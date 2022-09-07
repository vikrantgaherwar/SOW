import React from 'react';
import { Navbar } from 'react-bootstrap';
import hp_brand_logo from '../../Images/hp_brand_logo.png';
import '../../CSS/sow-admin.css'

const Header = (props) => {

    return <>
        <Navbar className='navbar-bg-black' variant="dark">
            <Navbar.Brand href="/">
                <img src={hp_brand_logo} className='navbar-logo-size' alt="Home" href="/" />
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
                <Navbar.Text className="navbar-sow-header">
                    <span style={{color:'white',fontSize:'15px'}}>{props.userInfo.employeeName}</span>
                    <div style={{ marginTop: '5px' }}>
                        <span  style={{color:'white',fontSize:'12px'}}>{props.roleInfo.join(", ")}</span>
                    </div>
                </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
    </>
};

export default Header
