// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Card, Button, Modal, Form, Input } from 'antd';
// import { ShareAltOutlined } from '@ant-design/icons';
// import './projectdash.css';
// import Login from './Login';
// import Navbar from './navbar';
// import EditDashboard from './EditDashboard';
// import Issues from './Issues';
// import EditProject from './EditProject';
// import { useLocation, useParams } from 'react-router-dom';
// import { useDispatch } from "react-redux";
// import Editsql from './Editsql';



// const EditPrjectDash = () => {
//   const [activeTabKey1, setActiveTabKey1] = useState('tab1');
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const [auth, setAuth] = useState("");
//   const [auth2, setAuth2] = useState("");
//   const [name_pj,setname_pj] = useState("")
//   const [owner,setOwner]= useState("")

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     setAuth(user);

//     const token = new URLSearchParams(location.search).get('token');
//     const [header, payload,signature] = token.split('.');
//     const decodedHeader = atob(header);
//     const decodedPayload = JSON.parse(atob(payload));
//     // console.log("Decoded Header:", decodedHeader);
//     // console.log("Decoded Payload:", decodedPayload);
//     // console.log("Signature:", signature);

//     setAuth2(decodedPayload.user_id);
//     setname_pj(decodedPayload.project_name[0][0])
//     setOwner(decodedPayload.username[0][0])

//     dispatch({
//       type: 'id',
//       payload: decodedPayload.project_id
//     });
//   }, [location.search, dispatch]);

//   const onTab1Change = (key) => {
//     setActiveTabKey1(key);
//   };
//   const tabList = [
//     {
//       key: 'tab1',
//       tab: 'Dashboard',
//     },
//     {
//       key: 'tab2',
//       tab: 'Scan URLs',
//     },
//     {
//       key: 'tab3',
//       tab: 'Issues',
//     },
//   ];
  
//   const contentList = {
//     tab1: <p><EditDashboard /></p>,
//     tab2: <p><EditProject  id={auth2} name={name_pj}/></p>,
//     tab3: <p><Editsql id={auth2} name={name_pj}/></p>,
//   };
//   return auth !== auth2 ? (
//     <div>
//       <Login/>
//     </div>
//   ) : (
//     <div className='ProjectDash'>
//       <Navbar />
//       <div className="ProjectDashLayout">
//         <Card
//           style={{
//             width: '100%',
//           }}
//           title={`${name_pj}  (Owner) : ${owner}`}
//           tabList={tabList}
//           activeTabKey={activeTabKey1}
//           onTabChange={onTab1Change}
//         >
//           {contentList[activeTabKey1]}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default EditPrjectDash;






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
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import SQlinject from './SQlinject';

import { useHistory } from 'react-router-dom';
import PDF from './PDF';

  
import Swal from 'sweetalert2'
    
    
    
const EditPrjectDash = () => {
    const [usershare,setUershare] = useState([])
    const project_name_id = useParams()
    const [showComplete, setShowComplete] = useState(false);
    const dispatch = useDispatch()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [url,setUrl] = useState("")
    const [Des,setDes] = useState("")
    const location = useLocation();
    const [start,setstart] = useState("")
    const [urlsAll, setUrlsAll] = useState([]);
    const [end,setend] = useState("")
    const [time,settiime] = useState("")
    const [link_, setLink_] = useState("");
    const [titleText, settitleText] = useState("");
    const [showStopButton, setShowStopButton] = useState(true);
    const [reloadPage, setReloadPage] = useState(false);
    // const project_name = project_name_id.project_name_id
    // const project_name_n = project_name_id.project_name
    // const user = localStorage.user;
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
    const navigate = useNavigate();
  const [auth, setAuth] = useState("");
  const [auth2, setAuth2] = useState("");
  const [name_pj,setname_pj] = useState("")
  const [owner,setOwner]= useState("")
    const user = localStorage.getItem("user");
    setAuth(user);
console.log("user",user)
    const tokenuser = localStorage.getItem("token");
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
      const fetchData = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:5000/edit-issue?token=${token}`, {
              headers: {
                'Authorization': `Bearer ${tokenuser}`,
                'Access-Control-Allow-Origin' : '*',
                'Content-Type': 'application/json'
              }
            })
    
          if (response.data && response.data["server error"]) {
            Swal.fire({
              icon: 'error',
              title: 'User Error',
            });
    
            setUrl("error");
            navigate('/login');
          } else {
            if (response.data[1].url_target[0]) {
              setUrlsAll(response.data[0].crawl_data.length)
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
   
    }, [user, name_pj, setUrl, setstart, setend]);


  
      

//     useEffect(() => {
//       const handleTabChange = () => {
//         const pathName = location.pathname;
    
//         if (pathName.endsWith('tab4')) {
//           setActiveTabKey1('tab4');
//         } else if (pathName.endsWith('tab4')) {
//           setActiveTabKey1('tab4');
//         } else {
//           setActiveTabKey1('tab4');
//         }
//       };
    
//       handleTabChange();
//     }, [location.pathname]);

    

// console.log(activeTabKey1)
// const pathName = location.pathname;
// console.log(pathName)

// useEffect(() => {
//   const { pathname } = location;
//   if (activeTabKey1 === 'tab5' && pathname.includes('/tab4')) {
//     setActiveTabKey1('tab4');
//     const trimmedPath = pathname.replace('/tab4', '');
//     navigate(trimmedPath, { replace: true });
//   }
// }, [activeTabKey1, location.pathname, navigate]);

// useEffect(() => {
//   const save = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`http://127.0.0.1:5000/save`, { name_pj }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       setShowComplete(true); 
//       setReloadPage(prevState => !prevState);
//     } catch (error) {
//       console.error('Save Error', error);
//     }
//   };
  
//   console.log(start, end);

 
//   const startDate = new Date(start);
//   const endDate = new Date(end);
  
  
//   const timeDifference = endDate.getTime() - startDate.getTime(); 
//   const seconds = Math.floor(timeDifference / 1000);
//   const minutes = Math.floor(seconds / 60);
//   const hours = Math.floor(minutes / 60);
  
//   const remainingMinutes = minutes % 60;
//   const remainingSeconds = seconds % 60;
  

//   const timeText = `Time : ${hours} hours: ${remainingMinutes} minutes: ${remainingSeconds} seconds`;
  
//   const timeText2= ` ${hours} hours: ${remainingMinutes} minutes: ${remainingSeconds} seconds`;
//   settiime(timeText2);
//   const generateTitleText = () => {
//     return (
//       <>
// <p style={{
//   fontSize: '22px',
//   color: 'grey',
//   marginTop: '0px',
//   whiteSpace: 'pre-line',
//   marginBottom: '0',
//   textAlign:"center"
// }}> Name: {project_name_id.project_name}</p>

// <p style={{
//   fontSize: '22px',
//   color: 'grey',
//   marginTop: '0px',
//   whiteSpace: 'pre-line',
//   marginBottom: '0',
//   textAlign:"center"
// }}> URL: ({url})</p>

// <p className="projdes" style={{
//   fontSize: '15px',
//   color: 'grey',
//   marginTop: '0px',
//   wordWrap: 'break-word',
//   wordBreak: 'break-all',
//   whiteSpace: 'pre-line',
//   marginBottom: '0',
//   maxWidth: '1000px'  
// }}> Descriptions: {Des}</p>

// <p style={{
//   fontSize: '15px',
//   color: 'grey',
//   marginTop: '0px',
//   whiteSpace: 'pre-line',
//   marginBottom: '0',
//   textAlign:"center"
// }}> Start: {start}</p>

//         {start !== end && (<p style={{
//   fontSize: '15px',
//   color: 'grey',
//   marginTop: '0px',
//   whiteSpace: 'pre-line',
//   marginBottom: '0',
//   textAlign:"center"
// }}>  Complete {end}<br/> {timeText}</p>)}
//         {showComplete && (
//           <>
//             Complete
//             <br />
//           </>
//         )}
//         {start === end && !showComplete && <Button style={{backgroundColor:"red"}} onClick={save}>Stop Process</Button>}
//       </>
//     );
//   };

//   settitleText(generateTitleText());
// },[]);
    



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
        path: 'tab4', 
      },
      {
        key: 'tab5',
        tab: 'Dashboard',
        
    },
    ];
  // const contentList = {
  // tab1: <p><URLlist id={name_pj} name={project_name_n} /> </p>,
  // // tab2: <p><Issues/></p>,
  // tab4: <SQlinject id={name_pj} name={project_name_n} />,
  // tab5:<Dashboard id={name_pj} name={project_name_n} time={time} start={start} end={end} urlsAll={urlsAll}/>
  // };
    
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
          'Authorization': `Bearer ${token}`,
          'Access-Control-Allow-Origin' : '*',
          'Content-Type': 'application/json'
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
      {/* <Navbar />
      <div className='ProjectDash-Head'>
      <Link to={`/home`} className="projedit-btn" style={{ fontSize: '30px', color: '#064061', marginRight: '20px',marginTop:'20px' }}>
                             <LeftCircleOutlined />
                            </Link>
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
      </div> */}
    </div>
  );
  
};
export default EditPrjectDash;
