import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { Card,theme,Collapse,ConfigProvider,Button,Form,Select,Input} from 'antd';
import {PlusOutlined,ReloadOutlined,CloseOutlined,FormOutlined,RightOutlined,ToTopOutlined,ShareAltOutlined,DoubleLeftOutlined} from '@ant-design/icons';

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
import Sidemenu from './sidemenu';

import PDF from './PDF.js';

  
import Swal from 'sweetalert2'
    
    
    
const ProjectDashAdmin = () => {
   
  const [projectdata, setProjectData] = useState([]);
  const [projectdata2, setProjectData2] = useState([]);
  const [deletee,setDelete] = useState([]);
  const [vesion,setvesion] = useState([]);
  const [options, setOptions] = useState([]);
    const [Owasp, setOwasp] = useState([]);
    const [payloadone, setPayloadone] = useState(null);
    const [payloadall, setPayloadall] = useState([]);
    const [pay, setPay] = useState(null);
    const[show,setShow] = useState([]);
    const [role, setrole] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
    const [inputKey, setInputKey] = useState('');
  
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/Admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin' : '*',
            'Content-Type': 'application/json'
          },
        });
        console.log(response.data.user_role[0][0])
        setrole(response.data.user_role[0][0])
        if (response.data && response.data["server error"]) {
          navigate('/login');
          Swal.fire({
            icon: 'error',
            title: 'User Error',
          });
        }
        if(response.data.user_role[0][0] !== 'Admin' ){
          navigate('/login');
          Swal.fire({
            icon: 'error',
            title: 'User Error',
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  const ShowFormsummit = async () => {
    try {
      console.log(`4${Owasp}`);
      setPay(Owasp)
      const response = await axios.post(`http://127.0.0.1:5000/payload4`, { Owasp }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });
      // console.log(response.data.Owasp_payloadlist[0][0]);
      setShow(response.data.Owasp_payloadlist[0][0]);
      const jsonData = response.data.Owasp_payloadlist[0][0]; 
      const payloadData = JSON.parse(jsonData); 
      setShow(payloadData);
      const updatedShow = { ...payloadData };
    
      Object.keys(payloadData).forEach(key => {
        if (key !== 'pathraversal' && key !== 'sql' && key!=='common_inject'&&key!=='xss_sql') { 
          const parsedPayloads = JSON.parse(payloadData[key]); 
          updatedShow[key] = parsedPayloads;
        }
      });
      setShow(updatedShow);
      // // console.log(keys)
      // const pathTraversalList = payloadData.keys;
      // const payloadData2 = JSON.parse(jsonData[1]); 
      console.log(updatedShow);
      // console.log()
    } catch (error) {
      console.log(error);
    }
  };

  const Formsummit2 = async (payloadone) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (result.isConfirmed) {     
      try {
        const response = await axios.post(`http://127.0.0.1:5000/payload5`, { payloadone, Owasp }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
        });
        console.log(response);
        setOptions(options);
      } catch (error) {
        console.log(error);
      }
    }
  };
  

  const fileSelected = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      const payloadall = reader.result;
      console.log(payloadall); 

    }
    reader.readAsText(file);
  }
console.log(show.length)


const handleFileSelected = (event) => {
  const file = event.target.files[0];
 const reader = new FileReader();
    reader.onload = function(e) {
      const payloadall = reader.result;
      console.log(payloadall); 
      setSelectedFile(payloadall)

    }
    reader.readAsText(file);
};

const handleKeyInput = (event) => {
  const key = event.target.value;
  setInputKey(key);
};

const handleSubmit = async (event) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  });

  if (result.isConfirmed) {
    if (selectedFile && inputKey) {
      try {
        const response = await axios.post(`http://127.0.0.1:5000/payload3`, { selectedFile, Owasp, inputKey }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
        });
        Swal.fire({
          icon: 'success',
          title: response.data, 
      });
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.log('Please select both key and file');
    }
  }
};


  return (
    <div>
      {role === 'Admin' && (
        <div className="App">
          <Navbar />
          <div className="Applayout2">
            <Sidemenu className="Sidemenu" />
            <div className="payload">
  <h3>Show Payload</h3>
  <Form onFinish={ShowFormsummit} labelCol={{ span: 10 }}>
    <Form.Item className="select-container" label=" " name="Owasp-Show">
      <Select
      style={{marginLeft:"330px"}}
        value={Owasp}
        onChange={(value) => setOwasp(value)}
        placeholder="Select an item"
        options={[
          { value: "4", label: "Directory Traversal File Include" },
          { value: "10", label: "Stored Cross Site Scripting" },
          { value: "11", label: "SQL Injection" },
          { value: "12", label: "Command Injection" },
        ]}
      />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit">
        OK
      </Button>
    </Form.Item>
  </Form>
  { show.length !== 0 &&(
     <div className="valuepayload">
             {/* <p>Add payload(.txt)</p>
             <Input type="file" onChange={fileSelected} style={{width:'220px',marginLeft:'400px'}} /> */}
  <Form onFinish={handleSubmit} labelCol={{ span: 10 }} style={{ width: '700px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' , marginLeft: '300px' } }>
    <Form.Item className="select-container" label="Add payload(.txt)" name="Add payload(.txt)" style={{ marginBottom: '20px' }}>
      <Input type="text" value={inputKey} onChange={handleKeyInput} placeholder="Enter key" style={{ width: '100%', marginBottom: '20px' }} />
      <Input type="file" onChange={handleFileSelected} style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" style={{ width: '100px' ,marginLeft: '200px' }}>
        OK
      </Button>
    </Form.Item>
  </Form>
     {Object.entries(show).map(([key, values]) => (
       <div key={key}>
         <h3>KEY: {key}
         <Button
           style={{ backgroundColor: "white", marginLeft: "5px" }}
           type="danger"
           icon={<CloseOutlined style={{ color: "red" }} />}
           onClick={() => Formsummit2(key)}
         />
      </h3>
         <ul>
           {values.map((value, index) => (
             <p key={index}>
               {index + 1}. {value}
             </p>
           ))}
         </ul>
       </div>
     ))}
   </div>
  )
    }
 
</div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default ProjectDashAdmin;
