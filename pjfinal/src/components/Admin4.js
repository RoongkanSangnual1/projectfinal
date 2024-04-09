import React from "react";
import './maindashboard.css';
import { Card,theme,Collapse,ConfigProvider,Button,Form,Select,Input} from 'antd';
import { PlusOutlined,RightOutlined,CloseOutlined,FormOutlined } from '@ant-design/icons';
import { Link,useNavigate} from "react-router-dom";
import TextArea from 'antd/es/input/TextArea';
import axios from "axios";
import { useState,useEffect } from "react";
import Navbar from "./navbar";
import './Admin.css'
import Login from "./Login";

const Admin4 = () => {
    const user = localStorage.user
    const [projectdata, setProjectData] = useState([]);
    const [options, setOptions] = useState([]);
    const [Owasp, setOwasp] = useState([]);
    const [payloadone, setPayloadone] = useState(null);
    const [payloadall, setPayloadall] = useState([]);
    const [pay, setPay] = useState(null);
    const[show,setShow] = useState([]);
    const [valuepayload, setvaluepayload] = useState(null);
    const token = localStorage.getItem("token")
    const navigate = useNavigate()
  
    useEffect(() => {
      console.log(token)
        axios.get(`http://127.0.0.1:5000/check`,{
            headers: {
                Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              'Access-Control-Allow-Origin' : '*',
            },})
            .then(response => {
                console.log(response.data[1].Admin)
                setProjectData(response.data[1].Admin);
    

            
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    //   const Deleteprojuct=(id)=>{
    //             /// ส่ง token user แบบheaders
    //       const token = localStorage.getItem("token")
    //       axios.delete(`http://127.0.0.1:5000/onedelete?project_name_id=${id}`,{
    //         headers:{
    //           Authorization:`Bearer ${token}`,
    //         },
    //       })



    //     .then(response => {
    //       setProjectData(projectdata.filter((project=>project[2] !==id )))
    //       console.log(deletee)

    //     })
    //     .catch(error => {
    //     });


    const Formsummit = () => {
        console.log(`1${Owasp}`);
        setPay(Owasp)
        axios
            .post(`http://127.0.0.1:5000/payload`, { Owasp },{
                headers: {
                    Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                  'Access-Control-Allow-Origin' : '*',
                },})
            .then(response => {
                const options =JSON.parse(response.data.value[0][0]).map(value => ({
                    value,
                    label: value,
                }));
                setOptions(options);
            });
    };


const Formsummit2 = () => {
    console.log(`2${Owasp}`);
        setPay(Owasp)
        axios
            .post(`http://127.0.0.1:5000/payload5`, { payloadone,Owasp },{
                headers: {
                    Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                  'Access-Control-Allow-Origin' : '*',
                },})
            .then(response => {
                console.log(response)
                setOptions(options);
                alert("บันทึกสำเร็จ")
                
            });
    };



    const FormsummitAll = () => {
        console.log(`3${Owasp}`);
        setPay(Owasp)
        // axios
        //     .post(`http://127.0.0.1:5000/payload`, { Owasp })
        //     .then(response => {
        //         const options =JSON.parse(response.data.value[0][0]).map(value => ({
        //             value,
        //             label: value,
        //         }));
        //         setOptions(options);
                
        //     });
    };

    const FormsummitAll2 = () => {
        console.log(`3${Owasp}`);
        setPay(Owasp)
        axios
            .post(`http://127.0.0.1:5000/payload3`, { Owasp,payloadall },{
                headers: {
                    Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                  'Access-Control-Allow-Origin' : '*',
                },})
            .then(response => {
            alert("บันทึกสำเร็จ")
                
            });
    };


    const ShowFormsummit = () => {
        console.log(`4${Owasp}`);
        setPay(Owasp)
        axios
            .post(`http://127.0.0.1:5000/payload4`, {Owasp},{
                headers: {
                    Authorization:`Bearer ${token}`,
                  "Content-Type": "application/json",
                },})
            .then(response => {
                console.log(response.data.Owasp_payloadlist)
                setShow(response.data.Owasp_payloadlist)                
            }).catch(error=>{
                console.log(error)
            });
    };


    // const showFormsummit2 = () => {
    //     console.log(`3${Owasp}`);
    //     setPay(Owasp)
    //     axios
    //         .post(`http://127.0.0.1:5000/payload3`, { Owasp })
    //         .then(response => {
    //         alert("บันทึกสำเร็จ")
                
    //         });
    // };

        return (
            <div>
                {/* <Navbar/>
                 */}
                {
    projectdata==='Admin' ? <div className="inputt-container">
    {/* <div className="form-container">     
    <h3>Show Payload</h3>      
<Form onFinish={ShowFormsummit} labelCol={{span: 10,}} >
     <Form.Item className="select-container"
    label="Show Payload"
    name="Owasp-Show">

<Select    value={Owasp} onChange={(value)=>setOwasp(value)} placeholder="โปรดเลือกรายการ" options={[
    //  { value: '1', label: 'Web Server Infomation Leakage through Server header' },
    // { value: '2', label: 'Missing Secure Attribute in Cookie Header' },
    // { value: '3', label: 'Missing HttpOnly Attribute in Cookie Header' },
    { value: '4', label: 'Directory Traversal File Include' },
    // { value: '5', label: 'Missing Expires Attribute in Cookie Header' },
    // { value: '6', label: 'Missing SameSite Attribute in Cookie Header' },
    // { value: '7', label: 'Sensitive File Disclosure' },
    // { value: '8', label: 'Missing HTTP Strict Transport Security Header' },
    // { value: '9', label: 'Web Application Framework Infomation Leakage' },
    { value: '10', label: 'Stored Cross Site Scriptng' },
    { value: '11', label: 'SQL Injection' }, 
    { value: '12', label: 'Command Injection' },  
    // { value: '13', label: 'FUZZ' },   
    ]}>                    
    </Select>
    </Form.Item>
    <Form.Item>                
    <button  className='btn'type="submit" value="บันทึก">OK</button>
    </Form.Item>
</Form>



{pay&& (show)
}
    </div> */}

    <div className="form-container">     
    <h3>Delete payload</h3>      
<Form onFinish={Formsummit} labelCol={{span: 10,}} >
     <Form.Item className="select-container"
    label="Owasp"
    name="Owasp">

<Select style={{width:"570px"}}    value={Owasp} onChange={(value)=>setOwasp(value)} placeholder="โปรดเลือกรายการ" options={[
    //  { value: '1', label: 'Web Server Infomation Leakage through Server header' },
    // { value: '2', label: 'Missing Secure Attribute in Cookie Header' },
    // { value: '3', label: 'Missing HttpOnly Attribute in Cookie Header' },
    { value: '4', label: 'Directory Traversal File Include' },
    // { value: '5', label: 'Missing Expires Attribute in Cookie Header' },
    // { value: '6', label: 'Missing SameSite Attribute in Cookie Header' },
    { value: '7', label: 'Sensitive File Disclosure' },
    // { value: '8', label: 'Missing HTTP Strict Transport Security Header' },
    // { value: '9', label: 'Web Application Framework Infomation Leakage' },
    { value: '10', label: 'Stored Cross Site Scriptng' },
    { value: '11', label: 'SQL Injection' }, 
    { value: '12', label: 'Command Injection' },  
    // { value: '13', label: 'FUZZ' },   
    ]}>                              
    </Select>
    </Form.Item>
    <Form.Item>                
    <button  className='btn'type="submit" value="บันทึก">OK</button>
    </Form.Item>

</Form>

{pay&& (
        <Form onFinish={Formsummit2} labelCol={{   span: 10, }}>
<Form.Item  className="select-container" label="Key" name="Owasp">
<Select  style={{width:"570px"}}  value={payloadone} onChange={value => setPayloadone(value)} options={options} />
</Form.Item>
    {/* <Form.Item  className="select-container"placeholder="EX:<cprips>"  label="Value" name="Osp">
    <Input  style={{width:"570px"}}  type="text" className="from-control" value={valuepayload} onChange={(e)=>setvaluepayload(e.target.value)}/>
    </Form.Item> */}
    <Form.Item>                
    <button  className='btn'type="submit" value="บันทึก">OK</button>
    </Form.Item>
</Form>)
}
  </div>


  {/* <div className="form-container">
  <h3>เพิ่ม Payload</h3>    
<Form onFinish={FormsummitAll} labelCol={{span: 10,}} >
     <Form.Item className="select-container"
    label="Owasp-payload"
    name="Owasp2">

<Select    value={Owasp} onChange={(value)=>setOwasp(value)} placeholder="โปรดเลือกรายการ" options={[
    //  { value: '1', label: 'Web Server Infomation Leakage through Server header' },
    // { value: '2', label: 'Missing Secure Attribute in Cookie Header' },
    // { value: '3', label: 'Missing HttpOnly Attribute in Cookie Header' },
    { value: '4', label: 'Directory Traversal File Include' },
    // { value: '5', label: 'Missing Expires Attribute in Cookie Header' },
    // { value: '6', label: 'Missing SameSite Attribute in Cookie Header' },
    // { value: '7', label: 'Sensitive File Disclosure' },
    // { value: '8', label: 'Missing HTTP Strict Transport Security Header' },
    // { value: '9', label: 'Web Application Framework Infomation Leakage' },
    { value: '10', label: 'Stored Cross Site Scriptng' },
    { value: '11', label: 'SQL Injection' }, 
    { value: '12', label: 'Command Injection' },  
    // { value: '13', label: 'FUZZ' },   
    ]}>                          
    </Select>
    </Form.Item>
    <Form.Item>                
    <button  className='btn'type="submit" value="บันทึก">OK</button>
    </Form.Item>
</Form>

{pay&& (
        <Form onFinish={FormsummitAll2} labelCol={{   span: 10, }}>
    <Form.Item  className="select-container" label="Payload" name="Osp2">
    <TextArea placeholder='{"KEY":["Value","Value"","Value"","Value"","Value"","Value"","Value"","Value"]}' type="text" className="from-control" e={payloadall} onChange={(e)=>setPayloadall(e.target.value)}/>
    </Form.Item>
    <Form.Item>                
    <button  className='btn'type="submit" value="บันทึก">OK</button>
    </Form.Item>
</Form>)
}
    </div> */}



    


  </div>


:( navigate('/login'))}
</div>    
          );
}


export default Admin4;