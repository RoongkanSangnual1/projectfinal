import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Table,Button,Modal,Form,Input,Space } from 'antd';
import './URLlist.css'
import {PlusOutlined,ReloadOutlined,CloseOutlined} from '@ant-design/icons';
import './maindashboard.css';
const URLlist = () => {
    const { project_name_id } = useParams();
    const [projectOneData, setProjectOneData] = useState([]);
    const [urls,setUrls] = useState([])
    const [method,setmethod] = useState([])
    const [parameter,setparameter] = useState([])
        const [isModalOpen, setIsModalOpen] = useState(false);
    const user = localStorage.user;


    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get(`http://127.0.0.1:5000/onedata?project_name_id=${project_name_id}`,{
            headers:{
                Authorization: `Bearer ${token}`,
            },

        })
        .then(response => {
            console.log(response)
            
            const Index = response.data.crawl_data.map((data, index) => {
                try {
                    // let decodedURLBase64 = atob(data[0]);
                    let decodedURL = decodeURIComponent(data[0]);
                    return [index+1, decodedURL, ...data];
                } catch (error) {
                    console.error("Error decoding URL:", error);
                    return null; 
                }
            }).filter(item => item !== null); 
            // console.log(Index); 
            setProjectOneData(Index);
        })
        .catch(error => {
            console.error(error);
        });
    }, [user, project_name_id]);

    const columns = [
        {
            title: 'No.',
            dataIndex: '0',
            key: 'index'
        },
        {
            title: 'URL',
            dataIndex: '1',
            key: 'URL',
            render: (text, record) => <a href={(record[2])}>{text}</a>
        },
        {
            title: 'METHOD',
            dataIndex: '3',
            key: 'METHOD'
        },
        {
            title: 'Status',
            dataIndex: '4',
            key: 'status',
        }
        ,
        {
            title: 'Delete',
            dataIndex: '5',
            key: 'delete',
            render: (text, record) => (
              <Space size="middle">
                {/* ปุ่มลบ */}
                <Button type="danger" icon={<CloseOutlined />} onClick={() => handleDelete(record[5])}> </Button>
              </Space>
            ),
          }
    ];

    const handleDelete = (iddelete) => {  
        /// ส่ง token user แบบheaders
      const token = localStorage.getItem("token")
      axios.delete(`http://127.0.0.1:5000/oneurlsdelete?project_name_id=${project_name_id}&record=${iddelete}`,{
        headers:{
          Authorization:`Bearer ${token}`,
        },
      }).then(response => {
        setProjectOneData(projectOneData.filter((project=>project[5] !==iddelete )))

      })
      };


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
        .post(`http://127.0.0.1:5000/addurls`,{urls,method,parameter,project_name_id})
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
            <Button  onClick={showModal} type="primary" icon={<PlusOutlined />}>Add to URLs</Button>
            </div>
            <Modal title="Add URL" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
            <Form className='input-container'
            onFinish={Formsummit}
            labelCol={{
                span: 5,
              }}
            >
              Location:<Input type="url" className="forminput-control" value={urls} onChange={(e)=>setUrls(e.target.value)}/> <br/>
              METHOD:<Input type="text" className="forminput-control" value={method} onChange={(e)=>setmethod(e.target.value)}/><br/>
              Parameter:<Input type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/>
                 </Form>

      </Modal>

            </div>
            <Table dataSource={projectOneData} columns={columns} />
        </div>
    );
};

export default URLlist;
