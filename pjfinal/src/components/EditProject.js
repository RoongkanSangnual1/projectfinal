import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { Table,Button,Modal,Form,Input,Space } from 'antd';
import './URLlist.css'
import {PlusOutlined,ReloadOutlined,CloseOutlined} from '@ant-design/icons';
import './maindashboard.css';

const EditProject = () => {
  const location = useLocation();
  // const { project_name_id } = useParams();
  const [projectOneData, setProjectOneData] = useState([]);
  const [urls, setUrls] = useState([]);
  const [method, setMethod] = useState([]);
  const [parameter, setParameter] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tokenuser= localStorage.getItem('token');
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/edit-project?token=${token}`, {
          headers: {
            'Authorization': `Bearer ${tokenuser}`
          }
        })
    .then(response => {
      console.log(response);
      
      const Index = response.data.crawl_data.map((data, index) => {
        try {
          let decodedURL = decodeURIComponent(data[0]);
          return [index+1, decodedURL, ...data];
        } catch (error) {
          console.error("Error decoding URL:", error);
          return null;
        }
      }).filter(item => item !== null);

      setProjectOneData(Index);
    })
    .catch(error => {
      console.error( error.message);
    });
  }, []);

  const columns = [
    {
      title: 'No.',
      dataIndex: '0',
      key: 'index',
    },
    {
      title: 'URL',
      dataIndex: '1',
      key: 'URL',
      render: (text, record) => <a href={(record[2])}>{text}</a>,
    },
    {
      title: 'METHOD',
      dataIndex: '3',
      key: 'METHOD',
    },
    {
      title: 'Status',
      dataIndex: '4',
      key: 'status',
    },
    {
      title: 'Delete',
      dataIndex: '5',
      key: 'delete',
      render: (text, record) => (
        <Space size="middle">
          <Button type="danger" i icon={<CloseOutlined   className="close-button"  style={{color:'red'}}/>}  onClick={() => handleDelete(record[5])}> </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = (iddelete) => {
    axios.delete(`http://127.0.0.1:5000/edit-oneurlsdelete?token=${token}&record=${iddelete}`, {
      headers: {
        Authorization: `Bearer ${tokenuser}`,
      },
    })
    .then(response => {
      console.log(response.data)
      setProjectOneData(projectOneData.filter((project => project[5] !== iddelete)))
    });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const Formsummit = () => {
    console.log(urls, method, parameter, token,tokenuser)
    axios
    .post(`http://127.0.0.1:5000/addurlsedit`, { urls, method, parameter, token },
    {
      headers: {
        "Content-Type": "application/json",
         Authorization:`Bearer ${tokenuser}`,
      },})

    .then(response => {
      console.log(response);
    })
    .catch(err => {
      alert(err.response.data);
    });

    setIsModalOpen(false);
  };

  const refreshData = () => {
    window.location.reload();
  };

  return (
    <div>
      <div>
        <div className='button-container'>
          <Button onClick={refreshData} icon={<ReloadOutlined />}>Restart</Button>
          <Button onClick={showModal} type="primary" icon={<PlusOutlined />}>Add to URLs</Button>
        </div>
        <Modal title="Add URL" open={isModalOpen} onOk={Formsummit} onCancel={handleCancel}>
          <Form className='input-container' onFinish={Formsummit} labelCol={{ span: 5 }}>
            Location:<Input type="url" className="forminput-control" value={urls} onChange={(e) => setUrls(e.target.value)}/> <br/>
            METHOD:<Input type="text" className="forminput-control" value={method} onChange={(e) => setMethod(e.target.value)}/><br/>
            Parameter:<Input type="text" className="forminput-control" value={parameter} onChange={(e) => setParameter(e.target.value)}/>
          </Form>
        </Modal>
      </div>
      <Table dataSource={projectOneData} columns={columns} />
    </div>
  );
};

export default EditProject;
