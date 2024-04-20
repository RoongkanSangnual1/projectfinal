import React from 'react';
import {  MenuUnfoldOutlined,MenuFoldOutlined,FundOutlined,SignalFilled  } from '@ant-design/icons';
import { Menu,Button } from 'antd';
import { useState } from 'react';
import {useNavigate } from 'react-router-dom';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  
  getItem('EditPayload', '/Admin', <FundOutlined />),
  // getItem('EditData', '/Home', <SignalFilled />),
  
];

// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2'];
const Sidemenu = () => {


  const [openKeys, setOpenKeys] = useState(['sub1']);
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }

  };
  const navigate = useNavigate();
  const onClick = (e) =>{
    navigate(e.key)
  }

  return (
    <div>

    <Menu
      mode="inline"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      onClick={onClick} 
      className="sidemenu" 
      style={{
        marginTop:'100px',
        width: 200,
        height: 1000,
      }}
      
      items={items}
      theme='dark'
    />
    </div>
    
    
  );
};
export default Sidemenu;
