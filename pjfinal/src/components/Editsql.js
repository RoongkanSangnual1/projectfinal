import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Table,Button,Modal,Form,Input,Space,Card,theme,Collapse,ConfigProvider } from 'antd';
import './URLlist.css'
import {PlusOutlined,ReloadOutlined,CloseOutlined,FormOutlined,RightOutlined} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { Link} from "react-router-dom";
import { CgDanger } from "react-icons/cg";
import Highlighter from 'react-highlight-words';

import './maindashboard.css';
import PDF from './PDF';
import TextArea from 'antd/es/input/TextArea';
const Editsql = (props) => {
  // console.log(props.name);
  const project_name =props.id
  const project_name_n = props.name
    const { project_name_id } = useParams();
    const [projectOneDataSQL, setprojectOneDataSQL] = useState([]);
    const [projectOneDataXSSSQL, setprojectOneDataXSSSQL] = useState([]);
    const [responsedata, setresponsedata] = useState([]);
    const [traversal,settraversal] = useState([])
    const [httponly,sethttponly] = useState([])
    const [expire,setexpire] = useState([])
    const [samsite,setsamsite] = useState([])
    const [secure,setsecure] = useState([])
    const [server,setserver] = useState([])
    const [HSTS,setHSTS] = useState([])
    const [Payload,setPayload] = useState([])
    const [Issue,setIssue] = useState([])
    const [url_target,seturl_target] = useState([])
    const [Details,setDetails] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [Delete,setDelete] = useState("")
    const [urls,setUrls] = useState([])
    const [EVIDENCE,setEVIDENCE] = useState([])
    const [parameter,setparameter]= useState([])
    const [Risk,setRisk] = useState([])
    const [OID10, setOID10] = useState(10);
    const [OID1, setOID1] = useState(1);
    const [OID2, setOID2] = useState(2);
    const [OID3, setOID3] = useState(3);
    const [OID4, setOID4] = useState(4);
    const [OID5, setOID5] = useState(5);
    const [OID6, setOID6] = useState(6);
    const [OID8, setOID8] = useState(8);
    const [OID11, setOID11] = useState(11);
    const [OID, setOID] = useState('');
    const location = useLocation();
    const [Recommendation,setRecommendation]= useState([])
    const user = localStorage.user;


    useEffect(() => {
      const tokenuser = localStorage.getItem("token");
      const token = new URLSearchParams(location.search).get('token');
        axios.get(`http://127.0.0.1:5000/edit-issue?token=${token}`, {
          headers: {
            'Authorization': `Bearer ${tokenuser}`
          }
        })
        .then(response => {
          console.log("responseapi",response)
          // setresponsedata(response)
          setDelete(response.data[5].Role)
          console.log(Delete)
            seturl_target(response.data[1].url_target[0][0]);
            setDetails(response.data[1].url_target[0][1]);

            
            const Index = response.data[2].select_att_sql_DATA
              .map((data, index) => {
                try {
                    let decodedURL = decodeURIComponent(data[0]);
                    let decodedURL1 = decodeURIComponent(data[1]);
                    let decodedURL2 = decodeURIComponent(data[2]);
                    return [index+1, decodedURL,decodedURL1,decodedURL2, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                  return [index+1, data[0],data[2], ...data];
                }
              })
              .filter(item => item !== null);
            
            const IndexXss = response.data[3].select_att_ID_xsssql_DATA
              .map((data, index) => {
                try {
                  let decodedURL = decodeURIComponent(data[0]);
                  let decodedURL1 = decodeURIComponent(data[1]);
                  let decodedURL2 = decodeURIComponent(data[2]);
                  return [index+1, decodedURL,decodedURL1,decodedURL2, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                 return null;
                }
              })
              .filter(item => item !== null);
             
              console.log("IndexXss",IndexXss)
            const Indextraversal = response.data[4].select_att_ID_select_att_traversal_DATA
              .map((data, index) => {
                try {
                  let decodedURL = decodeURIComponent(data[0]);
                  let decodedURL1 = decodeURIComponent(data[1]);
                  let decodedURL2 = decodeURIComponent(data[2]);
                  return [index+1, decodedURL,decodedURL1,decodedURL2, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                  return [index+1, data[0],data[2], ...data];
                ;
                }
              })
              .filter(item => item !== null);


              const IndexSecure= response.data[6].select_att_ID_select_att_secure_DATA
              .map((data, index) => {
                try {
                    let decodedURL = decodeURIComponent(data[0]);
                    return [index+1, decodedURL, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                  return [index+1,data[0], ...data];
                }
              })
              .filter(item => item !== null);
              const httponly = response.data[7].select_att_ID_select_att_httponly_DATA
              .map((data, index) => {
                try {
                    let decodedURL = decodeURIComponent(data[0]);
                    return [index+1, decodedURL, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                  return [index+1,data[0], ...data];
                }
              })
              .filter(item => item !== null);
              const expire = response.data[8].select_att_ID_select_att_expire_DATA
              .map((data, index) => {
                try {
                    let decodedURL = decodeURIComponent(data[0]);
                    return [index+1, decodedURL, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                  return [index+1,data[0], ...data];
                }
              })
              .filter(item => item !== null);
              const samsite = response.data[9].select_att_ID_select_att_samsite_DATA
              .map((data, index) => {
                try {
                    let decodedURL = decodeURIComponent(data[0]);
                    return [index+1, decodedURL, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                  return [index+1,data[0], ...data];
                }
              })
              .filter(item => item !== null);

              const server = response.data[10].select_att_ID_select_att_server_DATA
              .map((data, index) => {
                try {
                    let decodedURL = decodeURIComponent(data[0]);
                    return [index+1, decodedURL, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                  return [index+1,data[0], ...data];
                }
              })
              .filter(item => item !== null);
              const HSTS = response.data[11].select_att_ID_select_att_HSTS_DATA
              .map((data, index) => {
                try {
                    let decodedURL = decodeURIComponent(data[0]);
                    return [index+1, decodedURL, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                  return [index+1,data[0], ...data];
                }
              })
              .filter(item => item !== null);
              setresponsedata([{"SQL Injection":Index},{"Stored Cross Site Scriptng":IndexXss},{"Directory Traversal File Include":Indextraversal},{"Missing Secure Attribute in Cookie Header":IndexSecure},{"Missing HttpOnly Attribute in Cookie Header":httponly},{"Missing Expires Attribute in Cookie Header":expire},{"Missing SameSite Attribute in Cookie Header":samsite},{"Web Server Infomation Leakage through Server header":server},{"Missing HTTP Strict Transport Security Header":HSTS}])
              setHSTS(HSTS)     
              setsamsite(samsite)
              setserver(server)
              console.log("server,",server)
              setexpire(expire)
              sethttponly(httponly)
              setsecure(IndexSecure)
              setprojectOneDataXSSSQL(IndexXss);
            setprojectOneDataSQL(Index);
            settraversal(Indextraversal)
        })
        .catch(error => {
            console.error(error);
        });
    }, [user, project_name_id]);

    // const columns = [
    //     {
    //         title: 'No.',
    //         dataIndex: '0',
    //         key: 'index'
    //     },
    //     {
    //         title: 'URL',
    //         dataIndex: '1',
    //         key: 'URL',
    //         render: (text, record) => <a href={(record[2])}>{text}</a>
    //     },
    //     {
    //         title: 'PAYLOAD',
    //         dataIndex: '3',
    //         key: 'METHOD'
    //     }
    //     ,
    //     // {
    //     //     title: 'Delete',
    //     //     dataIndex: '5',
    //     //     key: 'delete',
    //     //     render: (text, record) => (
    //     //       <Space size="middle">
    //     //         <Button type="danger" icon={<CloseOutlined   className="close-button"  style={{color:'red'}}/>} onClick={() => handleDelete(record[5])}> </Button>
    //     //       </Space>
    //     //     ),
    //     //   }
    // ];

    // const handleDelete = (iddelete) => {  
    //     /// ส่ง token user แบบheaders
    //   const token = localStorage.getItem("token")
    //   axios.delete(`http://127.0.0.1:5000/oneurlsdelete?project_name_id=${project_name_id}&record=${iddelete}`,{
    //     headers:{
    //       Authorization:`Bearer ${token}`,
    //     },
    //   }).then(response => {
    //     setProjectOneData(projectOneData.filter((project=>project[5] !==iddelete )))

    //   })
    //   };


    const showModal = (OID) => {
      setOID(OID);
      setIsModalOpen(true);
    };
    //   const handleOk = () => {
    //     setIsModalOpen(false);
    //   };


      const handleCancel = () => {
        setIsModalOpen(false);
      };



      const Formsummit =()=>{
        const token = localStorage.getItem('token')

        console.log("OID", OID);
      
        axios
        .post(`http://127.0.0.1:5000/addIssue`,{urls,EVIDENCE,parameter,Risk,Recommendation,OID},
        {
          headers:{
              Authorization: `Bearer ${token}`,
          },

      })
        .then(response=>{
            console.log(response)
            
        })
        .catch(err=>{
            alert(err.response.data)
        })   
        setIsModalOpen(false);   
    }





    
    const refreshData = () => {
       window.location.reload();
      };


      const handleDelete = (iddelete) => {  
        /// ส่ง token user แบบheaders
      const token = localStorage.getItem("token")
      axios.delete(`http://127.0.0.1:5000/oneVulsdelete?project_name_id=${project_name_id}&record=${iddelete}`,{
        headers:{
          Authorization:`Bearer ${token}`,
        },
      }).then(response => {
        setserver(server.filter((project=>project[7] !==iddelete )))
        setprojectOneDataSQL(projectOneDataSQL.filter((project=>project[10] !==iddelete)))
        setprojectOneDataXSSSQL(projectOneDataXSSSQL.filter((project=>project[10] !==iddelete)));
        settraversal(traversal.filter((project=> project[10]!==iddelete)))
        setHSTS(HSTS.filter((project=>project[7] !==iddelete )))     
        setsamsite(samsite.filter((project=>project[7] !==iddelete )))
        setserver(server.filter((project=>project[7] !==iddelete )))
        setexpire(expire.filter((project=>project[7] !==iddelete )))
        sethttponly(httponly.filter((project=>project[7] !==iddelete )))
        setsecure(secure.filter((project=>project[7] !==iddelete )))

      })
      };
    
    return (
        <div>
            <div>
              <div className='button-container'>
            {/* <Button onClick={refreshData} icon={<ReloadOutlined />}>restart</Button>
            {Delete==='Advance'&&(
              <Button  onClick={showModal} type="primary" style={{background:'red'} }icon={<PlusOutlined />}>Add to Issue</Button>
            )}
            <Modal title="Add Isuues " open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
              Issue:<Input type="text" className="forminput-control" value={Issue} onChange={(e)=>setIssue(e.target.value)}/>
              Location:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              Payload:<Input type="text" className="forminput-control" value={Payload} onChange={(e)=>setPayload(e.target.value)}/><br/>
                 </Form>

      </Modal> */}
            </div>
            </div>
            {/* <Table dataSource={projectOneData} columns={columns} /> */}
            <>{
              projectOneDataSQL && projectOneDataSQL.length> 0 ? (
            
            <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}

  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">


          <h3 className="projname">SQL-injection <per style={{color:"red"}}>  ({projectOneDataSQL.length})</per></h3> {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"red"}} onClick={() => showModal(10)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Add URL SQL-injection" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            {/* <Input type="text" className="forminput-control" value={OID10}  placeholder=' SQL-injection' disabled/> */}
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
          
        </div>
      ),
      children: (
        <>
        {
        projectOneDataSQL.map((OneData, index) => (
                  <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['10']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
       <a  style={{color:"red"}} href={OneData[3]} target="_blank" rel="noopener noreferrer">
                  {OneData[3]}
            </a>
            {Delete === 'Advance'&& ( 
            <Space size="middle">
              
              <Button type="danger" icon={<CloseOutlined className="close-button" style={{color:'red,',marginBottom: '20px' }}/>} onClick={() => handleDelete(OneData[10])}> </Button>
          </Space>)}
           
        </div>
      ),
      children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
<div className="collapse-content" style={{ overflow: 'auto' }}>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>EVIDENCE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
      <td style={{textAlign:"center"}}>
                <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                  {OneData[1]}
                </a>
              </td>
              <td style={{textAlign:"center",color:"red"}}>{OneData[2]}</td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
          <p> {OneData[7]}</p>
        </td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left' }}>
          <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
          <p>
          {OneData[8]}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  

        </div>
      ),
    },
  ]}
/>
               )) } </>
),
    },
  ]}
/>
):(
<Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname"> SQL-injection</h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"#47F777"}} onClick={() => showModal(10)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Add URL SQL-injection-" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID10}  placeholder=' SQL-injection' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
        </div>
      ),
    },
  ]}
/>
)
}

</>

<>
{
              projectOneDataXSSSQL && projectOneDataXSSSQL.length> 0 ? (
            
            <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Stored Cross Site Scriptng<per style={{color:"red"}}>  ({projectOneDataXSSSQL.length})</per></h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"red"}} onClick={() => showModal(11)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Add URL Stored Cross Site Scriptng" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID11}  placeholder=' Stored Cross Site Scriptng' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
          
        </div>
      ),
      children: (
        <>
        {
        projectOneDataXSSSQL.map((OneData, index) => (
                  <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['10']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
                <a  style={{color:"red"}}   href={OneData[3]} target="_blank" rel="noopener noreferrer">
                  {OneData[3]}
            </a>
            {Delete === 'Advance'&& ( 
            <Space size="middle">
              
              <Button type="danger" icon={<CloseOutlined className="close-button" style={{color:'red,',marginBottom: '20px' }}/>} onClick={() => handleDelete(OneData[10])}> </Button>
          </Space>)}
        </div>
      ),
      children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
<div className="collapse-content" style={{ overflow: 'auto' }}>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>EVIDENCE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
      <td style={{textAlign:"center"}}>
                <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                  {OneData[1]}
                </a>
              </td>
              <td style={{textAlign:"center",color:"red"}}>{OneData[2]}</td>
      </tr>
      <tr>
      <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
          <p> {OneData[7]}</p>
        </td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left' }}>
          <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
          <p>
          {OneData[8]}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  

        </div>
      ),
    },
  ]}
/>
               )) } </>
),
    },
  ]}
/>
):(
<Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Stored Cross Site Scriptng</h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"#47F777"}} onClick={() => showModal(11)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Add URL Stored Cross Site Scriptng-" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID11}  placeholder=' Stored Cross Site Scriptng' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
        </div>
      ),
    },
  ]}
/>
)
}

</>


<>
{
              traversal && traversal.length> 0 ? (
            
            <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Directory Traversal File Include<per style={{color:"red"}}> ({traversal.length})</per></h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"red"}} onClick={() => showModal(4)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Directory Traversal File Include" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID4}  placeholder=' Directory Traversal File Include' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
        </div>
      ),
      children: (
        <>
        {
        traversal.map((OneData, index) => (
                  <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['10']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
               <a  style={{color:"red"}}  href={OneData[3]} target="_blank" rel="noopener noreferrer">
                  {OneData[3]}
            </a>
            {Delete === 'Advance'&& ( 
            <Space size="middle">
              
              <Button type="danger" icon={<CloseOutlined className="close-button" style={{color:'red,',marginBottom: '20px' }}/>} onClick={() => handleDelete(OneData[10])}> </Button>
          </Space>)}
        </div>
      ),
      children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
<div className="collapse-content" style={{ overflow: 'auto' }}>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>EVIDENCE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
      <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
          <p> {OneData[7]}</p>
        </td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left' }}>
          <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
          <p>
          {OneData[8]}
          </p>
        </td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left' }}>
          <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  

        </div>
      ),
    },
  ]}
/>
               )) } </>
),
    },
  ]}
/>
):(
<Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname"> Directory Traversal File Include</h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"#47F777"}} onClick={() => showModal(4)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Directory Traversal File Include-" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID4}  placeholder='  Directory Traversal File Include' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
        </div>
      ),
    },
  ]}
/>
)
}

</>

<>
{
              server && server.length> 0 ? (
            
            <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px',marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Web Server Infomation Leakage through 'Server' header<per style={{color:"red"}}>  ({server.length})</per></h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"red"}} onClick={() => showModal(1)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Web Server Infomation Leakage through 'Server' header" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID1}  placeholder=" Web Server Infomation Leakage through 'Server' header" disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
        </div>
      ),
      children: (
        <>
        {
        server.map((OneData, index) => (
                  <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['10']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
     
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname"  style={{color:"red"}}>{OneData[1]}</h3>
          {Delete === 'Advance' && (
  <Space size="middle">
  <Button type="danger" icon={<CloseOutlined className="close-button" style={{color:'red,',marginBottom: '20px' }}/>} onClick={() => handleDelete(OneData[7])}> </Button>
</Space>
          )}
        
        </div>
      ),
      children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
<div className="collapse-content" style={{ overflow: 'auto' }}>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>EVIDENCE</th>
      </tr>
    </thead>
    <>
    </>
    <tbody>
      
      <tr>
      <td style={{textAlign:"center"}}>
                <a  style={{color:"red"}} href={OneData[1]} target="_blank" rel="noopener noreferrer">
                  {OneData[1]} 
                </a>
              </td>

<td style={{ textAlign: "center" }}>

    <Highlighter
     style={{color:"red"}}
      highlightClassName="YourHighlightClass"
      searchWords={['Server']} 
      autoEscape={true}
      textToHighlight={OneData[3]}
    />

</td>
      </tr>
      <tr>
      <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
          <p> {OneData[4]}</p>
        </td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left' }}>
          <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
          <p>
          {OneData[5]}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  

        </div>
      ),
    },
  ]}
/>
               )) } </>
),
    },
  ]}
/>
):(
  <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Web Server Infomation Leakage through 'Server' header</h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"#47F777"}}onClick={() => showModal(1)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Web Server Infomation Leakage through 'Server' header-" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID1}  placeholder=' Stored Cross Site Scriptng' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
        </div>
      ),
    },
  ]}
/>
)
}
</>

<>
{
              secure && secure.length> 0 ? (
            
            <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Missing Secure Attribute in Cookie Header <per style={{color:"red"}}> ({secure.length})</per></h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"red"}} onClick={() => showModal(2)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title=">Missing Secure Attribute in Cookie Header" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID2}  placeholder=' Missing Secure Attribute in Cookie Header' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
        </div>
      ),
      children: (
        <>
        {
        secure.map((OneData, index) => (
                  <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['10']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px',marginTop: '5px'}} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
           <a  style={{color:"red"}}  href={OneData[1]} target="_blank" rel="noopener noreferrer">
                  {OneData[1]}
                </a>
                {Delete === 'Advance' && (
  <Space size="middle">
  <Button type="danger" icon={<CloseOutlined className="close-button" style={{color:'red,',marginBottom: '20px' }}/>} onClick={() => handleDelete(OneData[7])}> </Button>
</Space>
          )}
        </div>
      ),
      children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
<div className="collapse-content" style={{ overflow: 'auto' }}>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>EVIDENCE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
      <td style={{textAlign:"center"}}>
                <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                  {OneData[1]}
                </a>
              </td>
              <td style={{ textAlign: "center", color: "red" }}>
    <Highlighter
     style={{color:"red"}}
      highlightClassName="YourHighlightClass"
      searchWords={['Set-Cookie']} 
      autoEscape={true}
      textToHighlight={OneData[3]}
    />
</td>
      </tr>
      <tr>
      <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
          <p> {OneData[4]}</p>
        </td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left' }}>
          <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
          <p>
          {OneData[5]}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  

        </div>
      ),
    },
  ]}
/>
               )) } </>
),
    },
  ]}
/>
):(
<Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Missing Secure Attribute in Cookie Header</h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"#47F777"}}onClick={() => showModal(2)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title=">Missing Secure Attribute in Cookie Header-" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID2}  placeholder='Missing Secure Attribute in Cookie Header' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
        </div>
      ),
    },
  ]}
/>
)
}

</>

<>
{
              httponly && httponly.length> 0 ? (
            
            <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Missing HttpOnly Attribute in Cookie Header <per style={{color:"red"}}> ({httponly.length})</per></h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"red"}}onClick={() => showModal(3)}type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Missing HttpOnly Attribute in Cookie Header" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID3}  placeholder='Missing HttpOnly Attribute in Cookie Header ' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
        </div>
      ),
      children: (
        <>
        {
        httponly.map((OneData, index) => (
                  <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['10']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
         <a  style={{color:"red"}} href={OneData[1]} target="_blank" rel="noopener noreferrer">
                  {OneData[1]}
                </a>
                {Delete === 'Advance' && (
  <Space size="middle">
  <Button type="danger" icon={<CloseOutlined className="close-button" style={{color:'red,',marginBottom: '20px' }}/>} onClick={() => handleDelete(OneData[7])}> </Button>
</Space>
          )}
        </div>
      ),
      children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
<div className="collapse-content" style={{ overflow: 'auto' }}>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>EVIDENCE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
      <td style={{textAlign:"center"}}>
                <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                  {OneData[1]}
                </a>
              </td>
              <td style={{ textAlign: "center", color: "red" }}>
    <Highlighter
     style={{color:"red"}}
      highlightClassName="YourHighlightClass"
      searchWords={['Set-Cookie']} 
      autoEscape={true}
      textToHighlight={OneData[3]}
    />
</td>
      </tr>
      <tr>
      <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
          <p> {OneData[4]}</p>
        </td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left' }}>
          <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
          <p>
          {OneData[5]}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  

        </div>
      ),
    },
  ]}
/>
               )) } </>
),
    },
  ]}
/>
):(
<Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Missing HttpOnly Attribute in Cookie Header</h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"#47F777"}} onClick={() => showModal(3)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Missing HttpOnly Attribute in Cookie Header-" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID3}  placeholder=' Missing HttpOnly Attribute in Cookie Header' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
        </div>
      ),
    },
  ]}
/>
)
}

</>


<>
{
              expire && expire.length> 0 ? (
            
            <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px',marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
           <h3 className="projname">Missing Expires Attribute in Cookie Header <per style={{color:"red"}}> ({expire.length})</per></h3>
           {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"red"}} onClick={() => showModal(5)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Missing Expires Attribute in Cookie Header" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID5}  placeholder=' Missing Expires Attribute in Cookie Header' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
        </div>
      ),
      children: (
        <>
        {
        expire.map((OneData, index) => (
                  <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['10']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
        <a  style={{color:"red"}} href={OneData[1]} target="_blank" rel="noopener noreferrer">
                  {OneData[1]}
                </a>
                {Delete === 'Advance' && (
  <Space size="middle">
  <Button type="danger" icon={<CloseOutlined className="close-button" style={{color:'red,',marginBottom: '20px' }}/>} onClick={() => handleDelete(OneData[7])}> </Button>
</Space>
          )}
        </div>
      ),
      children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
<div className="collapse-content" style={{ overflow: 'auto' }}>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>EVIDENCE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
      <td style={{textAlign:"center"}}>
                <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                  {OneData[1]}
                </a>
              </td>
              <td style={{ textAlign: "center", color: "red" }}>
    <Highlighter
     style={{color:"red"}}
      highlightClassName="YourHighlightClass"
      searchWords={['Set-Cookie']} 
      autoEscape={true}
      textToHighlight={OneData[3]}
    />
</td>
      </tr>
      <tr>
      <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
          <p> {OneData[4]}</p>
        </td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left' }}>
          <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
          <p>
          {OneData[5]}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  

        </div>
      ),
    },
  ]}
/>
               )) } </>
),
    },
  ]}
/>
):(
  <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname"> Missing Expires Attribute in Cookie Header</h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"#47F777"}} onClick={() => showModal(5)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Missing Expires Attribute in Cookie Header-" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID5}  placeholder='  Missing Expires Attribute in Cookie Header' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
          
        </div>
      ),
    },
  ]}
/>
)
}
</>


<>
{
              samsite && samsite.length> 0 ? (
            
            <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px'}} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Missing SameSite Attribute in Cookie Header<per style={{color:"red"}}> ({samsite.length})</per></h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"red"}}onClick={() => showModal(6)}type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Missing SameSite Attribute in Cookie Header" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID6}  placeholder='Missing SameSite Attribute in Cookie Header' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
          
        </div>
      ),
      children: (
        <>
        {
        samsite.map((OneData, index) => (
                  <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['10']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
        <a  style={{color:"red"}}  href={OneData[1]} target="_blank" rel="noopener noreferrer">
                  {OneData[1]}
                </a>
                {Delete === 'Advance' && (
  <Space size="middle">
  <Button type="danger" icon={<CloseOutlined className="close-button" style={{color:'red,',marginBottom: '20px' }}/>} onClick={() => handleDelete(OneData[7])}> </Button>
</Space>
          )}
        </div>
      ),
      children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
<div className="collapse-content" style={{ overflow: 'auto' }}>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>EVIDENCE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
      <td style={{textAlign:"center"}}>
                <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                  {OneData[1]}
                </a>
              </td>
              <td style={{ textAlign: "center", color: "red" }}>
    <Highlighter
     style={{color:"red"}}
      highlightClassName="YourHighlightClass"
      searchWords={['Set-Cookie']} 
      autoEscape={true}
      textToHighlight={OneData[3]}
    />
</td>
      </tr>
      <tr>
      <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
          <p> {OneData[4]}</p>
        </td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left' }}>
          <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
          <p>
          {OneData[5]}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  

        </div>
      ),
    },
  ]}
/>
               )) } </>
),
    },
  ]}
/>
): (
  <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname"> Missing SameSite Attribute in Cookie Header</h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"#47F777"}}onClick={() => showModal(6)} type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Missing SameSite Attribute in Cookie Header-" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID6}  placeholder=' Missing SameSite Attribute in Cookie Header' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
          
        </div>
      ),
    },
  ]}
/>
)
}
</>



<>
{
              HSTS && HSTS.length> 0 ? (
            
            <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px'}} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Missing HTTP Strict Transport Security Header<per style={{color:"red"}}> ({HSTS.length})</per></h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"red"}}onClick={() => showModal(8)}type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Missing HTTP Strict Transport Security Header" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID8}  placeholder=' Missing HTTP Strict Transport Security Headerr' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
          
        </div>
      ),
      children: (
        <>
        {
        HSTS.map((OneData, index) => (
                  <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['10']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '5px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
        <a  style={{color:"red"}}  href={OneData[1]} target="_blank" rel="noopener noreferrer">
                  {OneData[1]}
                </a>
                {Delete === 'Advance' && (
  <Space size="middle">
  <Button type="danger" icon={<CloseOutlined className="close-button" style={{color:'red,',marginBottom: '20px' }}/>} onClick={() => handleDelete(OneData[7])}> </Button>
</Space>
          )}
        </div>
      ),
      children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
<div className="collapse-content" style={{ overflow: 'auto' }}>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>EVIDENCE</th>
      </tr>
    </thead>
    <tbody>
      <tr>
      <td style={{textAlign:"center"}}>
                <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
                  {OneData[1]}
                </a>
              </td>
              <td style={{ textAlign: "center", color: "red" }}>
    <Highlighter
     style={{color:"red"}}
      highlightClassName="YourHighlightClass"
      searchWords={['Set-Cookie']} 
      autoEscape={true}
      textToHighlight={OneData[3]}
    />
</td>
      </tr>
      <tr>
      <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
          <p> {OneData[4]}</p>
        </td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left' }}>
          <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
          <p>
          {OneData[5]}
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  

        </div>
      ),
    },
  ]}
/>
               )) } </>
),
    },
  ]}
/>
): (
  <Collapse
  className="projcollaspe"
  collapsible="header"
  size="small"
  defaultActiveKey={['1']}
  style={{ marginTop: '5px' }}
  expandIcon={({ isActive }) => (
    <>
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname"> Missing HTTP Strict Transport Security Header</h3>
          {Delete ==='Advance'&&(
               <Button  style={{backgroundColor:"#47F777"}} onClick={() => showModal(8)}type="primary" icon={<PlusOutlined   />}>Add to URL Issue </Button>
            )}   
            <Modal title="Missing HTTP Strict Transport Security Header-" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
            <Input type="text" className="forminput-control" value={OID5}  placeholder=' Missing HTTP Strict Transport Security Header' disabled/>
              URL:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              EVIDENCE:<TextArea type="text" className="forminput-control" value={EVIDENCE} onChange={(e)=>setEVIDENCE(e.target.value)}/><br/>
              Parameter:<TextArea type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/><br/>
              Risk Description:<TextArea type="text" className="forminput-control" value={Risk} onChange={(e)=>setRisk(e.target.value)}/><br/>
              Recommendation:<TextArea type="text" className="forminput-control" value={Recommendation} onChange={(e)=>setRecommendation(e.target.value)}/>
          
  
                 </Form>

      </Modal>
          
        </div>
      ),
    },
  ]}
/>
)
}
</>










            <PDF  id={project_name} name={project_name_n} url_target={url_target} Details={Details} responsedata={responsedata}></PDF>
        </div>
    );
};

export default Editsql;






// import { useParams } from 'react-router-dom';
// import { useState, useEffect } from "react";
// import axios from 'axios';
// import { Table,Button,Modal,Form,Input,Space,Card,theme,Collapse,ConfigProvider } from 'antd';
// import './URLlist.css'
// import {PlusOutlined,ReloadOutlined,CloseOutlined,FormOutlined,RightOutlined} from '@ant-design/icons';
// import { Link} from "react-router-dom";
// import { CgDanger } from "react-icons/cg";
// import Highlighter from 'react-highlight-words';
// import './maindashboard.css';
// import { useLocation } from 'react-router-dom';
// import PDF from './PDF';

// const Editsql = (props) => {
//     const location = useLocation();
//   // console.log(props.name);
//   const project_name =props.id
//   const project_name_n = props.name
//     const { project_name_id } = useParams();
//     const [projectOneDataSQL, setprojectOneDataSQL] = useState([]);
//     const [projectOneDataXSSSQL, setprojectOneDataXSSSQL] = useState([]);
//     const [traversal,settraversal] = useState([])
//     const [httponly,sethttponly] = useState([])
//     const [expire,setexpire] = useState([])
//     const [samsite,setsamsite] = useState([])
//     const [secure,setsecure] = useState([])
//     const [server,setserver] = useState([])
//     const [urls,setUrls] = useState([])
//     const [Payload,setPayload] = useState([])
//     const [Issue,setIssue] = useState([])
//     const [url_target,seturl_target] = useState([])
//     const [Details,setDetails] = useState([])
//         const [isModalOpen, setIsModalOpen] = useState(false);
//         const tokenuser= localStorage.getItem('token');
//         const token = new URLSearchParams(location.search).get('token');


//     useEffect(() => {
//         axios.get(`http://127.0.0.1:5000/edit-issue?token=${token}`, {
//           headers: {
//             'Authorization': `Bearer ${tokenuser}`
//           }
//         })
//         .then(response => {
//           console.log(response)
   
//             seturl_target(response.data[0].url_target[0][0]);
//             setDetails(response.data[0].url_target[0][1]);

            
//             const Index = response.data[1].select_att_sql_DATA
//               .map((data, index) => {
//                 try {
//                   let decodedURL = decodeURIComponent(data[0]);
//                   let decodedURL1 = decodeURIComponent(data[1]);
//                   let decodedURL2 = decodeURIComponent(data[2]);
//                   return [index+1, decodedURL,decodedURL1,decodedURL2, ...data];
//                 } catch (error) {
//                   console.error("Error decoding URL:", error);
//                   return [index+1, data[0],data[2], ...data];
//                 }
//               })
//               .filter(item => item !== null);
//             const IndexXss = response.data[2].select_att_ID_xsssql_DATA
//               .map((data, index) => {
//                 try {
//                   let decodedURL = decodeURIComponent(data[0]);
//                   let decodedURL1 = decodeURIComponent(data[1]);
//                   let decodedURL2 = decodeURIComponent(data[2]);
//                   return [index+1, decodedURL,decodedURL1,decodedURL2, ...data];
//                 } catch (error) {
//                   console.error("Error decoding URL:", error);
//                   return [index+1, data[0],data[2], ...data];
//                 }
//               })
//               .filter(item => item !== null);
//             const Indextraversal = response.data[3].select_att_ID_select_att_traversal_DATA
//               .map((data, index) => {
//                 try {
//                   let decodedURL = decodeURIComponent(data[0]);
//                   let decodedURL1 = decodeURIComponent(data[1]);
//                   let decodedURL2 = decodeURIComponent(data[2]);
//                   return [index+1, decodedURL,decodedURL1,decodedURL2, ...data];
//                 } catch (error) {
//                   console.error("Error decoding URL:", error);
//                   return [index+1, data[0],data[2], ...data];
//                 }
//               })
//               .filter(item => item !== null);
//               const IndexSecure= response.data[4].select_att_ID_select_att_secure_DATA
//               .map((data, index) => {
//                 try {
//                     let decodedURL = decodeURIComponent(data[0]);
//                     return [index+1, decodedURL, ...data];
//                 } catch (error) {
//                   console.error("Error decoding URL:", error);
//                   return [index+1, data[0] , ...data];
//                 }
//               })
//               .filter(item => item !== null);
//               const httponly = response.data[5].select_att_ID_select_att_httponly_DATA
//               .map((data, index) => {
//                 try {
//                     let decodedURL = decodeURIComponent(data[0]);
//                     return [index+1, decodedURL, ...data];
//                 } catch (error) {
//                   console.error("Error decoding URL:", error);
//                   return [index+1, data[0], ...data];
//                 }
//               })
//               .filter(item => item !== null);
//               const expire = response.data[6].select_att_ID_select_att_expire_DATA
//               .map((data, index) => {
//                 try {
//                     let decodedURL = decodeURIComponent(data[0]);
//                     return [index+1, decodedURL, ...data];
//                 } catch (error) {
//                   console.error("Error decoding URL:", error);
//                   return [index+1, data[0], ...data];
//                 }
//               })
//               .filter(item => item !== null);
//               const samsite = response.data[7].select_att_ID_select_att_samsite_DATA
//               .map((data, index) => {
//                 try {
//                     let decodedURL = decodeURIComponent(data[0]);
//                     return [index+1, decodedURL, ...data];
//                 } catch (error) {
//                   console.error("Error decoding URL:", error);
//                   return [index+1, data[0], ...data];
//                 }
//               })
//               .filter(item => item !== null);

//               const server = response.data[8].select_att_ID_select_att_server_DATA
//               .map((data, index) => {
//                 try {
//                     let decodedURL = decodeURIComponent(data[0]);
//                     return [index+1, decodedURL, ...data];
//                 } catch (error) {
//                   console.error("Error decoding URL:", error);
//                   return [index+1, data[0], ...data];
//                 }
//               })
//               .filter(item => item !== null);



//               setsamsite(samsite)
//               setserver(server)
//               setexpire(expire)
//               sethttponly(httponly)
//               setsecure(IndexSecure)
//               setprojectOneDataXSSSQL(IndexXss);
//             setprojectOneDataSQL(Index);
//             settraversal(Indextraversal)
//         })
//         .catch(error => {
//             console.error(error);
//         });
//     }, []);

//     // const columns = [
//     //     {
//     //         title: 'No.',
//     //         dataIndex: '0',
//     //         key: 'index'
//     //     },
//     //     {
//     //         title: 'URL',
//     //         dataIndex: '1',
//     //         key: 'URL',
//     //         render: (text, record) => <a href={(record[2])}>{text}</a>
//     //     },
//     //     {
//     //         title: 'PAYLOAD',
//     //         dataIndex: '3',
//     //         key: 'METHOD'
//     //     }
//     //     ,
//     //     // {
//     //     //     title: 'Delete',
//     //     //     dataIndex: '5',
//     //     //     key: 'delete',
//     //     //     render: (text, record) => (
//     //     //       <Space size="middle">
//     //     //         <Button type="danger" icon={<CloseOutlined   className="close-button"  style={{color:'red'}}/>} onClick={() => handleDelete(record[5])}> </Button>
//     //     //       </Space>
//     //     //     ),
//     //     //   }
//     // ];

//     // const handleDelete = (iddelete) => {  
//     //     /// ส่ง token user แบบheaders
//     //   const token = localStorage.getItem("token")
//     //   axios.delete(`http://127.0.0.1:5000/oneurlsdelete?project_name_id=${project_name_id}&record=${iddelete}`,{
//     //     headers:{
//     //       Authorization:`Bearer ${token}`,
//     //     },
//     //   }).then(response => {
//     //     setProjectOneData(projectOneData.filter((project=>project[5] !==iddelete )))

//     //   })
//     //   };


//     const showModal = () => {
//         setIsModalOpen(true);
//       };
//     //   const handleOk = () => {
//     //     setIsModalOpen(false);
//     //   };


//       const handleCancel = () => {
//         setIsModalOpen(false);
//       };



//       const Formsummit =()=>{


//         axios
//         .post(`http://127.0.0.1:5000/addIssue`,{urls,Payload,Issue,project_name_id})
//         .then(response=>{
//             console.log(response)
            
//         })
//         .catch(err=>{
//             alert(err.response.data)
//         })   
//         setIsModalOpen(false);   
//     }
//     const refreshData = () => {
//        window.location.reload();
//       };
    
//     return (
//         <div>
//             <div>
//               <div className='button-container'>
//             <Button onClick={refreshData} icon={<ReloadOutlined />}>restart</Button>
           
//               <Button  onClick={showModal} type="primary" style={{background:'red'} }icon={<PlusOutlined />}>Add to Issue</Button>
    
//             <Modal title="Add Isuues " open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
//             <Form className='input-container'
//             onFinish={Formsummit}
//             labelCol={{
//                 span: 5,
//               }}
//             >
//               Issue:<Input type="text" className="forminput-control" value={Issue} onChange={(e)=>setIssue(e.target.value)}/>
//               Location:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
//               Payload:<Input type="text" className="forminput-control" value={Payload} onChange={(e)=>setPayload(e.target.value)}/><br/>
//                  </Form>

//       </Modal>
//             </div>
//             </div>
//             {/* <Table dataSource={projectOneData} columns={columns} /> */}
//             <>{
//               projectOneDataSQL && projectOneDataSQL.length> 0 ? (
            
//             <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}

//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname">SQL-injection</h3>
//         </div>
//       ),
//       children: (
//         <>
//         {
//         projectOneDataSQL.map((OneData, index) => (
//                   <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['10']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname"  style={{color:"red"}}>{OneData[3]}</h3>
//         </div>
//       ),
//       children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
// <div className="collapse-content" style={{ overflow: 'auto' }}>
//   <table>
//     <thead>
//       <tr>
//         <th>URL</th>
//         <th>EVIDENCE</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//       <td style={{textAlign:"center"}}>
//                 <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
//                   {OneData[1]}
//                 </a>
//               </td>
//               <td style={{textAlign:"center"}}>{OneData[2]}</td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left'}}>
//           <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
//         </td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left' }}>
//           <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
//         </td>
//       </tr>
//     </tbody>
//   </table>
// </div>

  

//         </div>
//       ),
//     },
//   ]}
// />
//                )) } </>
// ),
//     },
//   ]}
// />
// ):(
// <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname"> SQL-injection</h3>
//         </div>
//       ),
//     },
//   ]}
// />
// )
// }

// </>

// <>
// {
//               projectOneDataXSSSQL && projectOneDataXSSSQL.length> 0 ? (
            
//             <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname">Stored Cross Site Scriptng</h3>
//         </div>
//       ),
//       children: (
//         <>
//         {
//         projectOneDataXSSSQL.map((OneData, index) => (
//                   <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['10']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname"  style={{color:"red"}}>{OneData[3]}</h3>
//         </div>
//       ),
//       children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
// <div className="collapse-content" style={{ overflow: 'auto' }}>
//   <table>
//     <thead>
//       <tr>
//         <th>URL</th>
//         <th>EVIDENCE</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//       <td style={{textAlign:"center"}}>
//                 <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
//                   {OneData[1]}
//                 </a>
//               </td>
//               <td style={{textAlign:"center"}}>{OneData[2]}</td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left'}}>
//           <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
//         </td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left' }}>
//           <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
//         </td>
//       </tr>
//     </tbody>
//   </table>
// </div>

  

//         </div>
//       ),
//     },
//   ]}
// />
//                )) } </>
// ),
//     },
//   ]}
// />
// ):(
// <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname">Stored Cross Site Scriptng</h3>
//         </div>
//       ),
//     },
//   ]}
// />
// )
// }

// </>


// <>
// {
//               traversal && traversal.length> 0 ? (
            
//             <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname">Directory Traversal File Include</h3>
//         </div>
//       ),
//       children: (
//         <>
//         {
//         traversal.map((OneData, index) => (
//                   <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['10']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname"  style={{color:"red"}}>{OneData[2]}</h3>
//         </div>
//       ),
//       children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
// <div className="collapse-content" style={{ overflow: 'auto' }}>
//   <table>
//     <thead>
//       <tr>
//         <th>URL</th>
//         <th>EVIDENCE</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//       <td style={{textAlign:"center"}}>
//                 <a href={OneData[1]} target="_blank" rel="noopener noreferrer">
//                   {OneData[1]}
//                 </a>
//               </td>
//               <td style={{textAlign:"center"}}>{OneData[4]}</td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left'}}>
//           <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
//         </td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left' }}>
//           <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
//         </td>
//       </tr>
//     </tbody>
//   </table>
// </div>

  

//         </div>
//       ),
//     },
//   ]}
// />
//                )) } </>
// ),
//     },
//   ]}
// />
// ):(
// <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname"> Directory Traversal File Include</h3>
//         </div>
//       ),
//     },
//   ]}
// />
// )
// }

// </>

// <>
// {
//               server && server.length> 0 ? (
            
//             <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname">Web Server Infomation Leakage through 'Server' header</h3>
//         </div>
//       ),
//       children: (
//         <>
//         {
//         server.map((OneData, index) => (
//                   <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['10']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname"  style={{color:"red"}}>{OneData[2]}</h3>
//         </div>
//       ),
//       children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
// <div className="collapse-content" style={{ overflow: 'auto' }}>
//   <table>
//     <thead>
//       <tr>
//         <th>URL</th>
//         <th>EVIDENCE</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//       <td style={{textAlign:"center"}}>
//                 <a href={OneData[2]} target="_blank" rel="noopener noreferrer">
//                   {OneData[2]}
//                 </a>
//               </td>
//               <td style={{ textAlign: "center" }}>

// <Highlighter
//   highlightClassName="YourHighlightClass"
//   searchWords={['Server']} 
//   autoEscape={true}
//   textToHighlight={OneData[3]}
// />

// </td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left'}}>
//           <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
//         </td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left' }}>
//           <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
//         </td>
//       </tr>
//     </tbody>
//   </table>
// </div>

  

//         </div>
//       ),
//     },
//   ]}
// />
//                )) } </>
// ),
//     },
//   ]}
// />
// ):(
//   <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname">Web Server Infomation Leakage through 'Server' header</h3>
//         </div>
//       ),
//     },
//   ]}
// />
// )
// }
// </>

// <>
// {
//               secure && secure.length> 0 ? (
            
//             <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname">Missing Secure Attribute in Cookie Header</h3>
//         </div>
//       ),
//       children: (
//         <>
//         {
//         secure.map((OneData, index) => (
//                   <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['10']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname"  style={{color:"red"}}>{OneData[2]}</h3>
//         </div>
//       ),
//       children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
// <div className="collapse-content" style={{ overflow: 'auto' }}>
//   <table>
//     <thead>
//       <tr>
//         <th>URL</th>
//         <th>EVIDENCE</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//       <td style={{textAlign:"center"}}>
//                 <a href={OneData[2]} target="_blank" rel="noopener noreferrer">
//                   {OneData[2]}
//                 </a>
//               </td>
//               <td style={{textAlign:"center"}}>{OneData[3]}</td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left'}}>
//           <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
//         </td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left' }}>
//           <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
//         </td>
//       </tr>
//     </tbody>
//   </table>
// </div>

  

//         </div>
//       ),
//     },
//   ]}
// />
//                )) } </>
// ),
//     },
//   ]}
// />
// ):(
// <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname">Missing Secure Attribute in Cookie Header</h3>
//         </div>
//       ),
//     },
//   ]}
// />
// )
// }

// </>

// <>
// {
//               httponly && httponly.length> 0 ? (
            
//             <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname">Missing HttpOnly Attribute in Cookie Header</h3>
//         </div>
//       ),
//       children: (
//         <>
//         {
//         httponly.map((OneData, index) => (
//                   <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['10']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname"  style={{color:"red"}}>{OneData[2]}</h3>
//         </div>
//       ),
//       children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
// <div className="collapse-content" style={{ overflow: 'auto' }}>
//   <table>
//     <thead>
//       <tr>
//         <th>URL</th>
//         <th>EVIDENCE</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//       <td style={{textAlign:"center"}}>
//                 <a href={OneData[2]} target="_blank" rel="noopener noreferrer">
//                   {OneData[2]}
//                 </a>
//               </td>
//               <td style={{textAlign:"center"}}>{OneData[3]}</td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left'}}>
//           <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
//         </td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left' }}>
//           <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
//         </td>
//       </tr>
//     </tbody>
//   </table>
// </div>

  

//         </div>
//       ),
//     },
//   ]}
// />
//                )) } </>
// ),
//     },
//   ]}
// />
// ):(
// <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname">Missing HttpOnly Attribute in Cookie Header</h3>
//         </div>
//       ),
//     },
//   ]}
// />
// )
// }

// </>


// <>
// {
//               expire && expire.length> 0 ? (
            
//             <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname">Missing Expires Attribute in Cookie Header</h3>
//         </div>
//       ),
//       children: (
//         <>
//         {
//         expire.map((OneData, index) => (
//                   <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['10']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname"  style={{color:"red"}}>{OneData[2]}</h3>
//         </div>
//       ),
//       children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
// <div className="collapse-content" style={{ overflow: 'auto' }}>
//   <table>
//     <thead>
//       <tr>
//         <th>URL</th>
//         <th>EVIDENCE</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//       <td style={{textAlign:"center"}}>
//                 <a href={OneData[2]} target="_blank" rel="noopener noreferrer">
//                   {OneData[2]}
//                 </a>
//               </td>
//               <td style={{textAlign:"center"}}>{OneData[3]}</td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left'}}>
//           <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
//         </td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left' }}>
//           <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
//         </td>
//       </tr>
//     </tbody>
//   </table>
// </div>

  

//         </div>
//       ),
//     },
//   ]}
// />
//                )) } </>
// ),
//     },
//   ]}
// />
// ):(
//   <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname"> Missing Expires Attribute in Cookie Header</h3>
//         </div>
//       ),
//     },
//   ]}
// />
// )
// }
// </>


// <>
// {
//               samsite && samsite.length> 0 ? (
            
//             <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname">Missing SameSite Attribute in Cookie Header</h3>
//         </div>
//       ),
//       children: (
//         <>
//         {
//         samsite.map((OneData, index) => (
//                   <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['10']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname"  style={{color:"red"}}>{OneData[2]}</h3>
//         </div>
//       ),
//       children: ( <div className="collapse-content" style={{ overflow: 'auto' }}>
// <div className="collapse-content" style={{ overflow: 'auto' }}>
//   <table>
//     <thead>
//       <tr>
//         <th>URL</th>
//         <th>EVIDENCE</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//       <td style={{textAlign:"center"}}>
//                 <a href={OneData[2]} target="_blank" rel="noopener noreferrer">
//                   {OneData[2]}
//                 </a>
//               </td>
//               <td style={{textAlign:"center"}}>{OneData[3]}</td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left'}}>
//           <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
//         </td>
//       </tr>
//       <tr>
//         <td colSpan="2"  style={{ textAlign: 'left' }}>
//           <strong  style={{fontSize:"16px"}}>Recommendation:</strong>
//         </td>
//       </tr>
//     </tbody>
//   </table>
// </div>

  

//         </div>
//       ),
//     },
//   ]}
// />
//                )) } </>
// ),
//     },
//   ]}
// />
// ): (
//   <Collapse
//   className="projcollaspe"
//   collapsible="header"
//   size="small"
//   defaultActiveKey={['1']}
//   style={{ marginTop: '5px' }}
//   expandIcon={({ isActive }) => (
//     <>
//       <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
//       <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: '#47F777' }} />
//     </>
//   )}
//   items={[
//     {
//       label: (
//         <div className="projcollaspe-head">
//           <h3 className="projname"> Missing SameSite Attribute in Cookie Header</h3>
//         </div>
//       ),
//     },
//   ]}
// />
// )
// }
// </>
//             <PDF  id={project_name} name={project_name_n} url_target={url_target} Details={Details} ></PDF>
//         </div>
//     );
// };

// export default Editsql;
