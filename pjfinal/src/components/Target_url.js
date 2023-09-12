import { useState } from "react";
import './createproject.css'
import axios from "axios";
import Navbar from "./navbar";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import { CloseOutlined,RobotOutlined} from '@ant-design/icons';
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
const Target_url=()=>{
    const [project_name,setProjet_name] = useState("")
    const [url,setUrl] = useState("")
    const [crawl,setCrawl] = useState()
    const [load,setLoad] = useState(false)
    const [Er,setEr] = useState(false)
    const [description,setDescription] = useState("")
    const authUser = localStorage.user
    // const project_name_id = useSelector((state) => state);

  
    const Formsummit=()=>{
        setLoad(true)
        axios.post(`http://127.0.0.1:5000/crawl`,{project_name,authUser,url,description} )
        .then(res => {
            setLoad(false)
            setCrawl(res.data.project_name_id_result)
        })        
      .catch(error => {
        setEr("ไม่สามารถทำการได้")
        console.error("Error crawling:", error);
      });
        
    
    }
    return( 
        <div>   
            <Navbar/>
        <div className="container2">
            <Link to='/home' className="exit" ><CloseOutlined  /></Link>
            <h2>Create Project</h2>
            <div className="createproject-form">
            <Form
                onFinish={Formsummit}
            
                layout="vertical"
            >
                <Form.Item label="Project Name">
                <Input type="text" className="form-input" value={project_name} onChange={(e)=>setProjet_name(e.target.value)} />
                </Form.Item>
                <Form.Item label="Scope url">
                <Input type="url" className="form-input"  value={url} onChange={(e)=>setUrl(e.target.value)}/>
                </Form.Item>
                <Form.Item label="Project details">
                <Input.TextArea rows={5} className="form-input" value={description} onChange={(e)=>setDescription(e.target.value)} />
                </Form.Item>
                <Form.Item>
                <button className="btn" type="submit">crawl</button>
                </Form.Item>
            </Form>
            
            </div>
            { load?(<div>
                loading url... </div>):(<div className="gotobtn">
                    {Er}
                {crawl && (
                <Link to={`/myproject/${project_name}/${crawl}`}> <Button type="primary"  icon={<RobotOutlined />}>Go to Project{crawl}</Button></Link>)}
            </div>)

            }
            
            </div>
        </div>
    )
}

export default Target_url;