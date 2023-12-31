import React from "react";
import { DownOutlined, UserOutlined ,SettingOutlined,LogoutOutlined} from '@ant-design/icons';
import { Button, Dropdown, message, Space } from 'antd';
import logo from "./imgsrc/seclogo.svg";
import './navbar.css';
import {useNavigate} from "react-router-dom";

function Navbar(){
  const navigate = useNavigate()

  
const handleMenuClick = (e) => {


  if(e.key === '3'){
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    alert("Logout")
    navigate('/login')
  }
  else{
    message.info('Click on menu item.');
    console.log('click', e);

  }
    
  };
  const items = [
    {
      label: 'My plan',
      key: '1',
      icon: <UserOutlined />,
    },
    {
      label: 'Settings',
      key: '2',
      icon: <SettingOutlined />,
    },
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
  const user = localStorage.user
    return(
        <nav className="mynavbar">
            <img src={logo} alt="logo"></img>
            <h3>ROBOPentestGuide</h3>
            
            <div className="userdrop">
            <Space wrap>
    
    
                <Dropdown menu={menuProps}>
                <Button>
                    <Space>
                    {user}
                    <DownOutlined />
                    </Space>
                </Button>
                </Dropdown>
                
            </Space>
            </div>
        </nav>

    );
}

export default Navbar;