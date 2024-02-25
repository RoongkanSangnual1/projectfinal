import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Table,Button,Modal,Form,Input,Space } from 'antd';
import './URLlist.css'
import {PlusOutlined,ReloadOutlined,CloseOutlined} from '@ant-design/icons';
import './maindashboard.css';
import Swal from 'sweetalert2'
import PDF from './PDF';
const URLlist = (props) => {
  // console.log(props.name);
  const project_name =props.id
  const project_name_n = props.name
    const { project_name_id } = useParams();
    const [projectOneData, setProjectOneData] = useState([]);
    const [urls,setUrls] = useState([])
    const [method,setmethod] = useState([])
    const [parameter,setparameter] = useState([])
    const [url_target,seturl_target] = useState([])
    const [Details,setDetails] = useState([])
    const [Delete,setDelete] = useState("")
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
    
          setDelete(response.data[5].Role)
            seturl_target(response.data[1].url_target[0][0])
            setDetails(response.data[1].url_target[0][1])
            const Index = response.data[0].crawl_data.map((data, index) => {
                try {
                    // let decodedURLBase64 = atob(data[0]);
                    let decodedURL = decodeURIComponent(data[0]);
                    return [index+1, decodedURL, ...data];
                } catch (error) {
                    console.error("Error decoding URL:", error);
                    return null;
                }
            }).filter(item => item !== null);
            console.log(Index); 
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
       
    ];
if(Delete==='Advance'){
  columns.push({
    title: 'Delete',
    dataIndex: '5',
    key: 'delete',
    render: (text, record) => (
        <Space size="middle">
            <Button type="danger" icon={<CloseOutlined className="close-button" style={{color:'red'}}/>} onClick={() => handleDelete(record[5])}> </Button>
        </Space>
    )
});
}

const handleDelete = (iddelete) => {  

  const token = localStorage.getItem("token");

  Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
  }).then((result) => {
     
      if (result.isConfirmed) {
          
          axios.delete(`http://127.0.0.1:5000/oneurlsdelete?project_name_id=${project_name_id}&record=${iddelete}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          })
          .then((response) => {
             
              if (response.status === 200) {
                 
                  setProjectOneData((prevData) =>
                      prevData.filter((project) => project[5] !== iddelete)
                  );

                 
                  Swal.fire({
                      title: "Deleted!",
                      text: "Your URL has been deleted.",
                      icon: "success",
                  });
              } else {
                 
                  Swal.fire({
                      title: "Error!",
                      text: "Unable to delete the URL. Please try again.",
                      icon: "error",
                  });
              }

            
              // console.log(response);
          })
          .catch((error) => {
              // Show an error message if there was an error during the delete operation
              Swal.fire({
                  title: "Error!",
                  text: "An error occurred while deleting the URL.",
                  icon: "error",
              });

              // Log the error
              console.log(error);
          });
      }
  });
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

        const token = localStorage.getItem('token')
        axios
        .post(`http://127.0.0.1:5000/addurls`,{urls,method,parameter,project_name_id},{
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
    
    return (
        <div>
            <div>
              <div className='button-container'>
            <Button onClick={refreshData} icon={<ReloadOutlined />}>restart</Button>
            {Delete ==='Advance'&&(
               <Button  onClick={showModal} type="primary" icon={<PlusOutlined />}>Add to URLs</Button>
            )}
      
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
              Status:<Input type="text" className="forminput-control" value={parameter} onChange={(e)=>setparameter(e.target.value)}/>
                 </Form>

      </Modal>
            </div>
            <Table dataSource={projectOneData} columns={columns} />
            {/* <PDF  id={project_name} name={project_name_n} url_target={url_target} Details={Details} ></PDF> */}
        </div>
    );
};

export default URLlist;