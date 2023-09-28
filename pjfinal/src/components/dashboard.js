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
                if (response.data && response.data.url) {
                    // ตรวจสอบว่า response.data.url มีค่าและเป็น array
                    setProjectOneData(response.data.url.map((data, index) => ({ key: index, URL: data })));
                    console.log(response.data.url);
                } else {
                    console.error("Invalid data format received from the server.");
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, []);
    const columns = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'index'
        },
        {
            title: 'URL',
            dataIndex: 'URL',
            key: 'URL',
            render: (text, record) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: 'METHOD',
            dataIndex: '2',
            key: 'METHOD'
        },
        {
            title: 'Status',
            dataIndex: '3',
            key: 'status',
        },
    ];

    return (
        <div>
            <Table dataSource={projectOneData} columns={columns} />
        </div>
    );
};

export default Dashboard;
