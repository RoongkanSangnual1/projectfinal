import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Form, Input } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import './projectdash.css';
import Login from './Login';
import Navbar from './navbar';
import EditDashboard from './EditDashboard';
import Issues from './Issues';
import EditProject from './EditProject';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import Editsql from './Editsql';


const tabList = [
  {
    key: 'tab1',
    tab: 'Dashboard',
  },
  {
    key: 'tab2',
    tab: 'Scan URLs',
  },
  {
    key: 'tab3',
    tab: 'Issues',
  },
];

const contentList = {
  tab1: <p><EditDashboard /></p>,
  tab2: <p><EditProject /></p>,
  tab3: <p><Editsql /></p>,
};

const EditPrjectDash = () => {
  const [activeTabKey1, setActiveTabKey1] = useState('tab1');
  const dispatch = useDispatch();
  const location = useLocation();
  const [auth, setAuth] = useState("");
  const [auth2, setAuth2] = useState("");
  const [name_pj,setname_pj] = useState("")
  const [owner,setOwner]= useState("")

  useEffect(() => {
    const user = localStorage.getItem("user");
    setAuth(user);

    const token = new URLSearchParams(location.search).get('token');
    const [header, payload,signature] = token.split('.');
    const decodedHeader = atob(header);
    const decodedPayload = JSON.parse(atob(payload));
    // console.log("Decoded Header:", decodedHeader);
    // console.log("Decoded Payload:", decodedPayload);
    // console.log("Signature:", signature);

    setAuth2(decodedPayload.user_id);
    setname_pj(decodedPayload.project_name[0][0])
    setOwner(decodedPayload.username[0][0])

    dispatch({
      type: 'id',
      payload: decodedPayload.project_id
    });
  }, [location.search, dispatch]);

  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  return auth !== auth2 ? (
    <div>
      <Login/>
    </div>
  ) : (
    <div className='ProjectDash'>
      <Navbar />
      <div className="ProjectDashLayout">
        <Card
          style={{
            width: '100%',
          }}
          title={`${name_pj}  (Owner) : ${owner}`}
          tabList={tabList}
          activeTabKey={activeTabKey1}
          onTabChange={onTab1Change}
        >
          {contentList[activeTabKey1]}
        </Card>
      </div>
    </div>
  );
};

export default EditPrjectDash;
