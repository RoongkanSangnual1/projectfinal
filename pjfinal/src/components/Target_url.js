import { useState } from "react";
import './createproject.css'
import axios from "axios";
import Navbar from "./navbar";
import Sidemenu from './sidemenu';
import { Alert, Button, Form, Input } from "antd";
import { Link ,useNavigate} from "react-router-dom";
import { CloseOutlined, RobotOutlined } from '@ant-design/icons';
import ClipLoader  from "react-spinners/ClipLoader";
import Swal from 'sweetalert2'

const Target_url = () => {
    const [project_name, setProject_name] = useState("");
    const [url, setUrl] = useState("");
    const [project_name_id, setProject_name_id] = useState();
    const [ProjectChange, setProjectChange] = useState("");
    const [load, setLoad] = useState(false);
    const [error, setError] = useState(false);
    const [description, setDescription] = useState("");
    const authUser = localStorage.user;
    const [loadingButton, setLoadingButton] = useState(false);
    const token = localStorage.getItem('token')

    const navigate = useNavigate()
    if (!token) {
        navigate('/login');
        Swal.fire({
            icon: 'error',
            title: 'User Error',
        });
    }


    const Formsummit = async () => {
        setLoad(true);
        setLoadingButton(true);
    
        try {
            const res = await axios.post(`http://127.0.0.1:5000/crawl`, { project_name, url, description }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            console.log(res);
            setLoad(false);
            setLoadingButton(false);
            setProject_name_id(res.data.project_name_id_result[0][0]);
    
            if (res.data.Change) {
                console.log(res.data.Change.length);
                setProjectChange(res.data.Change);
                Swal.fire(res.data.Change);
            }
            else if(res.data["server error"])
            {
                Swal.fire({
                    icon: 'error',
                    title: 'crawling Error',
                  });
            }
        } catch (error) {
            console.error("Error crawling:", error);
    
            if (project_name_id) {
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'crawling Error',
                  });
            }
        }
    };
    return (
        <div>
            <Navbar />
            <div className='Applayout'>
            
            <div className="container2">
                <Link to='/home' className="exit"><CloseOutlined style={{color:"red"}} /></Link>
                <h2>Create Project</h2>
                <div className="createproject-form">
                    <Form
                        onFinish={Formsummit}
                        layout="vertical"
                    >
                        <Form.Item label="Project Name">
                            <Input type="text" className="form-input" value={project_name} onChange={(e) => setProject_name(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Scope url">
                            <Input type="url" className="form-input" value={url} onChange={(e) => setUrl(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Project details">
                            <Input.TextArea rows={5} className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Item>
                        <Form.Item>
                        <button className="btn" type="submit" disabled={loadingButton}>
                            {loadingButton ?(
                            <>
                                <ClipLoader 
                                color={"#white"}
                                loading={loadingButton}
                                size={30}
                                aria-label="Loading Spinner"
                               data-testid="loader"
                                />  <br/>  Scanning...
                            </>)  : "Scan"}
                        </button>
</Form.Item>
                    </Form>
                </div>
                {load ? null : (
                    <div className="gotobtn">
                        {/* {error} */}
                        {project_name_id && (
                            <Link to={`/myproject/${project_name}/${project_name_id}`}>
                                <Button type="primary" icon={<RobotOutlined />}>Go to Project</Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
            </div>

        </div>
    )
}

export default Target_url;
