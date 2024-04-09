import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Table } from 'antd';

const Issues = () => {
    const { project_name_id } = useParams();
    const [projectOneData, setProjectOneData] = useState([]);
    const user = localStorage.user;

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/jsonn?user=${user}&project_name_id=${project_name_id}`)
            .then(response => { 
                const jsonData = JSON.parse(response.data.message[0]);
                console.lof(jsonData.payload)
                setProjectOneData(jsonData.payload);
                
            })
            .catch(error => {
                console.error(error);
            });
    }, [user, project_name_id]); 
    
   

    return (
        <div>
         
        </div>
    );
};

export default Issues;
