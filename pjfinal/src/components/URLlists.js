import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Table } from 'antd';

const URLlist = () => {
    const { project_name_id } = useParams();
    const [projectOneData, setProjectOneData] = useState([]);
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
    ];

    return (
        <div>
            <Table dataSource={projectOneData} columns={columns} />
        </div>
    );
};

export default URLlist;
