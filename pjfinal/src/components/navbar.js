import React from "react";
import { DownOutlined, UserOutlined ,SettingOutlined,LogoutOutlined} from '@ant-design/icons';
import { Button, Dropdown, message, Space } from 'antd';
import logo from "./imgsrc/robo.svg";
import './navbar.css';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = localStorage.user;

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
      <img src={logo} alt="logo"></img>
      <h3>ROBOPentestGuide</h3>

      <div className="userdrop">
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
