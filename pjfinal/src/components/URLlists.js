import { useParams } from 'react-router-dom';
import{ useState,useEffect }from "react";
import axios from 'axios'
import { Table } from 'antd';

const URLlist=()=> {
    const { project_name_id } = useParams();
    const [projectOneData, setProjectOneData] = useState([]);
    const user = localStorage.user

    useEffect(() => {
      //ยิงtoken แทน user แบบheaders
      axios.get(`http://127.0.0.1:5000/onedata?user=${user}&project_name_id=${project_name_id}`)
          .then(response => {
            const Index = response.data.crawl_data.map((data, index) => [index + 1, ...data])
              setProjectOneData(Index);
              console.log(response)
    
          })
          .catch(error => {
              console.error(error);
          });
  }, []);
  const columns= ([{
    title:'No.',
    dataIndex: '0',
    key:'index'
  },
  {
    title:'URL',
    dataIndex:'1',
    key:'URL'
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

export default URLlist;