import React, { useState, useEffect } from "react";
import { DownOutlined, UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space } from 'antd';
import logo from "./imgsrc/robo.svg";
import './navbar.css';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = localStorage.user;
  const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollPosition = window.scrollY;
  //     if (scrollPosition > 30) {
  //       setIsScrolled(true);
  //     } else {
  //       setIsScrolled(false);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  const handleMenuClick = (e) => {
    if (e.key === '3') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      Swal.fire("Logout");
      navigate('/');
    } else {
      message.info('Click on menu item.');
      console.log('click', e);
    }
  };

  const items = [
    // {
    //   label: 'My plan',
    //   key: '1',
    //   icon: <UserOutlined />,
    // },
    // {
    //   label: 'Settings',
    //   key: '2',
    //   icon: <SettingOutlined />,
    // },
    {
      label: 'Logout',
      key: '3',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <nav className="mynavbar">
    {/* <nav className={`mynavbar ${isScrolled ? 'sticky' : ''}`}> */}
      
      <Link to="/home">  <img src={logo} alt="logo" style={{ width: '60px', height: '40px' }}></img></Link> 
      <h3>ROBOPentestGuide</h3>

      <div className="userdrop" >
        <Space wrap>
          {token ? (
            <Dropdown menu={menuProps}>
              <Button>
                <Space>
                  {user}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          ) : (
            <>
              <Button onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          )}
        </Space>
      </div>
    </nav>
  );
}

export default Navbar;