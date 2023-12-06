import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Table } from 'antd';

const Dashboard = () => {
    const { project_name_id } = useParams();
    const [projectOneData, setProjectOneData] = useState([]);
    const user = localStorage.user;

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/dashboard?user=${user}&project_name_id=${project_name_id}`)
            .then(response => { 
                console.log(response);
                setProjectOneData(response); 
            })
            .catch(error => {
                console.error(error);
            });
    }, [user, project_name_id]); 
    
    const columns= ([{
        title:'Secure',
        dataIndex: 'Secure',
        key:'Secure'
      },
      {
        title:'HttpOnly',
        dataIndex:'HttpOnly',
        key:'HttpOnly'
      },
      {
        title:'Expires',
        dataIndex:'Expires',
        key:'Expires'
    
      },
    
      {
        title: 'SameSite',
        dataIndex: 'SameSite',
          key: 'SameSite',
              },
    ])

    return (
        <div>
            <Table dataSource={projectOneData} columns={columns} />
        </div>
    );
};

export default Dashboard;
