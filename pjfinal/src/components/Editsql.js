import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Table,Button,Modal,Form,Input,Space,Card,theme,Collapse,ConfigProvider } from 'antd';
import './URLlist.css'
import {PlusOutlined,ReloadOutlined,CloseOutlined,FormOutlined,RightOutlined} from '@ant-design/icons';
import { Link} from "react-router-dom";
import { CgDanger } from "react-icons/cg";
import Highlighter from 'react-highlight-words';
import './maindashboard.css';
import { useLocation } from 'react-router-dom';
import PDF from './PDF';

const Editsql = (props) => {
    const location = useLocation();
  // console.log(props.name);
  const project_name =props.id
  const project_name_n = props.name
    const { project_name_id } = useParams();
    const [projectOneDataSQL, setprojectOneDataSQL] = useState([]);
    const [projectOneDataXSSSQL, setprojectOneDataXSSSQL] = useState([]);
    const [traversal,settraversal] = useState([])
    const [httponly,sethttponly] = useState([])
    const [expire,setexpire] = useState([])
    const [samsite,setsamsite] = useState([])
    const [secure,setsecure] = useState([])
    const [server,setserver] = useState([])
    const [urls,setUrls] = useState([])
    const [Payload,setPayload] = useState([])
    const [Issue,setIssue] = useState([])
    const [url_target,seturl_target] = useState([])
    const [Details,setDetails] = useState([])
        const [isModalOpen, setIsModalOpen] = useState(false);
        const tokenuser= localStorage.getItem('token');
        const token = new URLSearchParams(location.search).get('token');


    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/edit-issue?token=${token}`, {
          headers: {
            'Authorization': `Bearer ${tokenuser}`
          }
        })
        .then(response => {
          console.log(response)
   
            seturl_target(response.data[0].url_target[0][0]);
            setDetails(response.data[0].url_target[0][1]);

            
            const Index = response.data[1].select_att_sql_DATA
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
            const IndexXss = response.data[2].select_att_ID_xsssql_DATA
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
            const Indextraversal = response.data[3].select_att_ID_select_att_traversal_DATA
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
              const IndexSecure= response.data[4].select_att_ID_select_att_secure_DATA
              .map((data, index) => {
                try {
                    let decodedURL = decodeURIComponent(data[0]);
                    return [index+1, decodedURL, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                  return [index+1, data[0] , ...data];
                }
              })
              .filter(item => item !== null);
              const httponly = response.data[5].select_att_ID_select_att_httponly_DATA
              .map((data, index) => {
                try {
                    let decodedURL = decodeURIComponent(data[0]);
                    return [index+1, decodedURL, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                  return [index+1, data[0], ...data];
                }
              })
              .filter(item => item !== null);
              const expire = response.data[6].select_att_ID_select_att_expire_DATA
              .map((data, index) => {
                try {
                    let decodedURL = decodeURIComponent(data[0]);
                    return [index+1, decodedURL, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                  return [index+1, data[0], ...data];
                }
              })
              .filter(item => item !== null);
              const samsite = response.data[7].select_att_ID_select_att_samsite_DATA
              .map((data, index) => {
                try {
                    let decodedURL = decodeURIComponent(data[0]);
                    return [index+1, decodedURL, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                  return [index+1, data[0], ...data];
                }
              })
              .filter(item => item !== null);

              const server = response.data[8].select_att_ID_select_att_server_DATA
              .map((data, index) => {
                try {
                    let decodedURL = decodeURIComponent(data[0]);
                    return [index+1, decodedURL, ...data];
                } catch (error) {
                  console.error("Error decoding URL:", error);
                  return [index+1, data[0], ...data];
                }
              })
              .filter(item => item !== null);



              setsamsite(samsite)
              setserver(server)
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
    }, []);

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


    const showModal = () => {
        setIsModalOpen(true);
      };
    //   const handleOk = () => {
    //     setIsModalOpen(false);
    //   };


      const handleCancel = () => {
        setIsModalOpen(false);
      };



      const Formsummit =()=>{


        axios
        .post(`http://127.0.0.1:5000/addIssue`,{urls,Payload,Issue,project_name_id})
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
    
    return (
        <div>
            <div>
              <div className='button-container'>
            <Button onClick={refreshData} icon={<ReloadOutlined />}>restart</Button>
           
              <Button  onClick={showModal} type="primary" style={{background:'red'} }icon={<PlusOutlined />}>Add to Issue</Button>
    
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

      </Modal>
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
          <h3 className="projname">SQL-injection</h3>
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
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname"  style={{color:"red"}}>{OneData[3]}</h3>
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
              <td style={{textAlign:"center"}}>{OneData[2]}</td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
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
          <h3 className="projname"> SQL-injection</h3>
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
          <h3 className="projname">Stored Cross Site Scriptng</h3>
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
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname"  style={{color:"red"}}>{OneData[3]}</h3>
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
              <td style={{textAlign:"center"}}>{OneData[2]}</td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
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
          <h3 className="projname">Stored Cross Site Scriptng</h3>
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
          <h3 className="projname">Directory Traversal File Include</h3>
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
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname"  style={{color:"red"}}>{OneData[2]}</h3>
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
              <td style={{textAlign:"center"}}>{OneData[4]}</td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
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
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Web Server Infomation Leakage through 'Server' header</h3>
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
          <h3 className="projname"  style={{color:"red"}}>{OneData[2]}</h3>
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
                <a href={OneData[2]} target="_blank" rel="noopener noreferrer">
                  {OneData[2]}
                </a>
              </td>
              <td style={{ textAlign: "center" }}>

<Highlighter
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
          <h3 className="projname">Web Server Infomation Leakage through 'Server' header</h3>
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
          <h3 className="projname">Missing Secure Attribute in Cookie Header</h3>
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
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname"  style={{color:"red"}}>{OneData[2]}</h3>
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
                <a href={OneData[2]} target="_blank" rel="noopener noreferrer">
                  {OneData[2]}
                </a>
              </td>
              <td style={{textAlign:"center"}}>{OneData[3]}</td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
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
          <h3 className="projname">Missing Secure Attribute in Cookie Header</h3>
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
          <h3 className="projname">Missing HttpOnly Attribute in Cookie Header</h3>
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
          <h3 className="projname"  style={{color:"red"}}>{OneData[2]}</h3>
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
                <a href={OneData[2]} target="_blank" rel="noopener noreferrer">
                  {OneData[2]}
                </a>
              </td>
              <td style={{textAlign:"center"}}>{OneData[3]}</td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
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
          <h3 className="projname">Missing HttpOnly Attribute in Cookie Header</h3>
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
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Missing Expires Attribute in Cookie Header</h3>
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
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname"  style={{color:"red"}}>{OneData[2]}</h3>
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
                <a href={OneData[2]} target="_blank" rel="noopener noreferrer">
                  {OneData[2]}
                </a>
              </td>
              <td style={{textAlign:"center"}}>{OneData[3]}</td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
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
          <h3 className="projname"> Missing Expires Attribute in Cookie Header</h3>
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
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} />
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname">Missing SameSite Attribute in Cookie Header</h3>
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
      <RightOutlined className="projcollaspe-ico" rotate={isActive ? 90 : 0} style={{ fontSize: '16px', marginTop: '40px' }} />
      {/* <CgDanger className="projcollaspe-ico" style={{ fontSize: '30px', marginTop: '40px', color: 'red' }} /> */}
    </>
  )}
  items={[
    {
      label: (
        <div className="projcollaspe-head">
          <h3 className="projname"  style={{color:"red"}}>{OneData[2]}</h3>
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
                <a href={OneData[2]} target="_blank" rel="noopener noreferrer">
                  {OneData[2]}
                </a>
              </td>
              <td style={{textAlign:"center"}}>{OneData[3]}</td>
      </tr>
      <tr>
        <td colSpan="2"  style={{ textAlign: 'left'}}>
          <strong style={{fontSize:"16px"}}>Risk Description:</strong> 
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
        </div>
      ),
    },
  ]}
/>
)
}
</>
            <PDF  id={project_name} name={project_name_n} url_target={url_target} Details={Details} ></PDF>
        </div>
    );
};

export default Editsql;