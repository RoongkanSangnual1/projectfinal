import { useParams } from 'react-router-dom';
import{ useState,useEffect }from "react";
import axios from 'axios'
import { Table } from 'antd';

const Dashboard=()=> {
    const { project_name_id } = useParams();
    const [projectOneData, setProjectOneData] = useState([]);
    const user = localStorage.user

    useEffect(() => {
      //ยิงtoken แทน user แบบheaders
      axios.get(`http://127.0.0.1:5000/dashboard?user=${user}&project_name_id=${project_name_id}`)
          .then(response => { 
            const urls = response.data.url.map((url, index) => ({ key: index, URL: url }));
            setProjectOneData(urls)
              console.log(response.data.url)
    
          })
          .catch(error => {
              console.error(error);
          });
  }, []);
  const columns= ([
    {
    title:'No.',
    dataIndex: '0',
    key:'index'
  },
{
    title: 'URL',
    dataIndex: 'URL',
    key: 'URL',
    render: (text, record) => (
      <p href={text} >
        {text}
      </p>
    ),
  },
  {
    title:'METHOD',
    dataIndex:'2',
    key:'METHOD'

  },

  {
    title: 'Status',
    dataIndex: '3',
      key: 'status',
          },
])
  
      return(
        <div>
        <Table dataSource={projectOneData} columns={columns} />;
        </div>
      );
      
};

export default Dashboard;