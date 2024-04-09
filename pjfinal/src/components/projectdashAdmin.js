import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { Card,Button,Modal,Form,Input} from 'antd';
import { LeftCircleOutlined,ShareAltOutlined,FormOutlined } from '@ant-design/icons';
import './projectdash.css';
import Login from './Login.js';
import Navbar from './navbar.js';
import Admin1 from './Admin1.js';
import Admin2 from './Admin2.js';
import Admin3 from './Admin3.js';
import Admin4 from './Admin4.js';
import Issues from './Issues.js';
import URLlist from './URLlists.js';
import { useParams,useNavigate ,Link} from 'react-router-dom';
import { useDispatch } from "react-redux";
import SQlinject from './SQlinject.js';

import PDF from './PDF.js';

  
import Swal from 'sweetalert2'
    
    
    
const ProjectDashAdmin = () => {
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
    const [usershare,setUershare] = useState([])
    const project_name_id = useParams()
    const [showComplete, setShowComplete] = useState(false);
    const dispatch = useDispatch()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [url,setUrl] = useState("")
    const [start,setstart] = useState("")
    const [end,setend] = useState("")
    const [link_, setLink_] = useState("");
    const [titleText, settitleText] = useState("");
    const [showStopButton, setShowStopButton] = useState(true);
    const [reloadPage, setReloadPage] = useState(false);
    const project_name = project_name_id.project_name_id
    const project_name_n = project_name_id.project_name
    const user = localStorage.user;
    const navigate = useNavigate()


    

    const onTab1Change = (key) => {
      setActiveTabKey1(key);
  };

    const tabList = [
      {
        key: 'tab1',
        tab: 'Show paylaod',
      },
      // {
      //   key: 'tab2',
      //   tab: 'Issues',
      // },
      {
          key: 'tab3',
          tab: 'Add Value payload',
      },
      {
        key: 'tab4',
        tab: 'Add payload',
    },
    {
      key: 'tab5',
      tab: 'Delete payload',
  },
    ];
  const contentList = {
  tab1: <><Admin1/></>,
  // tab2: <p><Issues/></p>,
  tab3: <Admin2 />,
  tab4: <Admin3 />,
  tab5: <Admin4 />,
  };


      

  return (
    <div className='ProjectDash'>
      <Navbar />
      <div className='ProjectDash-Head'>
      </div>
      
      <div className="ProjectDashLayout">
        
        <Card
          style={{
            width: '100%',
          }}
          title={titleText}
          extra={<p></p>}
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

export default ProjectDashAdmin;
