import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { Card,Button,Modal,Form,Input, Descriptions} from 'antd';
import { LeftCircleOutlined,ShareAltOutlined,FormOutlined } from '@ant-design/icons';
import './projectdash.css';
import Login from './Login';
import Navbar from './navbar';
import Dashboard from './dashboard.js';
import Issues from './Issues';
import URLlist from './URLlists';
import { useParams,useNavigate ,Link} from 'react-router-dom';
import { useDispatch } from "react-redux";
import SQlinject from './SQlinject';


import PDF from './PDF';

  
import Swal from 'sweetalert2'
    
    
    
const ProjectDash = () => {
    const [usershare,setUershare] = useState([])
    const project_name_id = useParams()
    const [showComplete, setShowComplete] = useState(false);
    const dispatch = useDispatch()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [url,setUrl] = useState("")
    const [Des,setDes] = useState("")
    const [start,setstart] = useState("")
    const [end,setend] = useState("")
    const [link_, setLink_] = useState("");
    const [titleText, settitleText] = useState("");
    const [showStopButton, setShowStopButton] = useState(true);
    const [reloadPage, setReloadPage] = useState(false);
    const project_name = project_name_id.project_name_id
    const project_name_n = project_name_id.project_name
    const user = localStorage.user;
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
    const navigate = useNavigate()

      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://127.0.0.1:5000/onedata?project_name_id=${project_name}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (response.data && response.data["server error"]) {
            Swal.fire({
              icon: 'error',
              title: 'User Error',
            });
    
            setUrl("error");
            navigate('/login');
          } else {
            if (response.data[1].url_target[0]) {
              setUrl(response.data[1].url_target[0][0]);
              setDes(response.data[1].url_target[0][1]);
              setstart(response.data[1].url_target[0][3]);
              setend(response.data[1].url_target[0][4]);
            } else {
              console.error("Unexpected response structure", response);
            }
          }
    
          console.log("response", response);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };


      useEffect(() => {
      fetchData(); 
   
    }, [user, project_name, setUrl, setstart, setend, navigate]);



useEffect(() => {
  const save = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://127.0.0.1:5000/save`, { project_name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setShowComplete(true); 
      setReloadPage(prevState => !prevState);
    } catch (error) {
      console.error('Save Error', error);
    }
  };

  const generateTitleText = () => {
    return (
      <>
<p style={{
  fontSize: '22px',
  color: 'grey',
  marginTop: '0px',
  whiteSpace: 'pre-line',
  marginBottom: '0',
  textAlign:"center"
}}> Name: {project_name_id.project_name}</p>

<p style={{
  fontSize: '22px',
  color: 'grey',
  marginTop: '0px',
  whiteSpace: 'pre-line',
  marginBottom: '0',
  textAlign:"center"
}}> URL: ({url})</p>

<p className="projdes" style={{
  fontSize: '15px',
  color: 'grey',
  marginTop: '0px',
  wordWrap: 'break-word',
  wordBreak: 'break-all',
  whiteSpace: 'pre-line',
  marginBottom: '0',
  maxWidth: '1000px'  
}}> Descriptions: {Des}</p>

<p style={{
  fontSize: '15px',
  color: 'grey',
  marginTop: '0px',
  whiteSpace: 'pre-line',
  marginBottom: '0',
  textAlign:"center"
}}> Start: {start}</p>

        {start !== end && (<p style={{
  fontSize: '15px',
  color: 'grey',
  marginTop: '0px',
  whiteSpace: 'pre-line',
  marginBottom: '0',
  textAlign:"center"
}}>  Complete {end}</p>)}
        {showComplete && (
          <>
            Complete
            <br />
          </>
        )}
        {start === end && !showComplete && <Button style={{backgroundColor:"red"}} onClick={save}>Stop Process</Button>}
      </>
    );
  };

  settitleText(generateTitleText());
}, [project_name, project_name_id.project_name, project_name_n, url, start, end, reloadPage, showComplete]);
    



    const tabList = [
      {
        key: 'tab1',
        tab: 'Scan URLs',
      },
      // {
      //   key: 'tab2',
      //   tab: 'Issues',
      // },
      {
          key: 'tab4',
          tab: 'Issues',
      },
      {
        key: 'tab5',
        tab: 'Dashboard',
    },
    ];
  const contentList = {
  tab1: <p><URLlist id={project_name} name={project_name_n} /> </p>,
  // tab2: <p><Issues/></p>,
  tab4: <SQlinject id={project_name} name={project_name_n} />,
  tab5:<Dashboard id={project_name} name={project_name_n}/>
  };
    
    dispatch({
      type:'id',
      payload:project_name_id.project_name_id
})

const handleCopy = () => {
  navigator.clipboard.writeText(link_).then(() => {
    alert("Copy successful");
  }).catch((error) => {
    console.error('Unable to copy link', error);
  });
};

    const onTab1Change = (key) => {
        setActiveTabKey1(key);
    };

    const showModal = () => {
      setIsModalOpen(true);
    };


    const handleCancel = () => {
      setIsModalOpen(false);
    };



    const Formsummit =()=>{
      const project_name = project_name_id.project_name_id
      const token = localStorage.getItem("token")


      

      axios.post(`http://127.0.0.1:5000/generate-link`, { project_name, usershare }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log(response)
        setLink_(response.data.link)
        if (response.data && response.data.userError) {
          Swal.fire({
            icon: 'error',
            title: 'This user does not exist.',
          });
        }
        setUershare([])
      })
      
      .catch(err=>{
          alert(err.response.data)
      })   
      setIsModalOpen(false);   
  }

      

  return (

        <div className={activeTabKey1 === 'tab5' ? 'ProjectDashh' : 'ProjectDash'}>
      <Navbar />
      <div className='ProjectDash-Head'>
        <LeftCircleOutlined style={{ fontSize: '30px', color: '#064061', marginRight: '80px' }}/>
        <h2>{project_name_n}</h2>
      </div>
      
      <div className={activeTabKey1 === 'tab5' ? 'ProjectDashLayoutt' : 'ProjectDashLayout'}>
        {(activeTabKey1 === 'tab1' || activeTabKey1 === 'tab4' ||activeTabKey1 === 'tab5') && (
          <> 
            <Card
              style={{
                width: '100%',
              }}
              title={titleText}
              extra={<Link to={`/myproject/edit/${project_name_n}/${project_name}`} className="projedit-btn" style={{ marginLeft: '50px', color:"blue" }}>
                <FormOutlined style={{ fontSize: '20px', color: 'grey' }} />
              </Link>}
              tabList={tabList}
              activeTabKey={activeTabKey1}
              onTabChange={onTab1Change}
            >
              {contentList[activeTabKey1]}
  
              {link_ && (
                <div>
                  <p>{link_}</p>
                  <Button type="primary" style={{ transform: 'translateX(850px) scale(0.8)', marginTop: '20px' }} onClick={handleCopy}>
                    Copy Link
                  </Button>
                </div>
              )}

              {(activeTabKey1 === 'tab1' || activeTabKey1 === 'tab4') &&(
                <Button onClick={showModal} type="primary" icon={<ShareAltOutlined />} style={{ transform: 'translateX(1000px) scale(1.5)', marginTop: '20px', marginLeft: '35px' }}>
                Share
              </Button>
              )}
  
              
            </Card>
  
            <Modal title="SHARE" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
              <Form className='input-container'
                onFinish={Formsummit}
                labelCol={{
                  span: 5,
                }}
              >
                user:<Input type="text" style={{ marginRight:"20px" }} className="forminput-control" value={usershare} onChange={(e) => setUershare(e.target.value)} /> <br/>
              </Form>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
  
};
export default ProjectDash;
