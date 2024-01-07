// import { useParams } from 'react-router-dom';
// import { useState, useEffect } from "react";
// import axios from 'axios';
// import { Table } from 'antd';

// const Dashboard = () => {
//     // const { project_name_id } = useParams();
//     // const [projectOneData, setProjectOneData] = useState([]);
//     // const user = localStorage.user;

//     // useEffect(() => {
//     //   const token = localStorage.getItem("token")
//     //     axios.get(`http://127.0.0.1:5000/dashboard?project_name_id=${project_name_id}`,{
//     //       headers:{
//     //         Authorization: `Bearer ${token}`,
//     //       },
//     //     })
//     //         .then(response => { 
//     //             console.log(response);
//     //             setProjectOneData(response.data); 
//     //         })
//     //         .catch(error => {
//     //             console.error(error);
//     //         });
//     // }, [user, project_name_id]); 
    
//     const columns= ([{
//         title:'Secure',
//         dataIndex: 'Secure',
//         key:'Secure'
//       },
//       {
//         title:'HttpOnly',
//         dataIndex:'HttpOnly',
//         key:'HttpOnly'
//       },
//       {
//         title:'Expires',
//         dataIndex:'Expires',
//         key:'Expires'
    
//       },
    
//       {
//         title: 'SameSite',
//         dataIndex: 'SameSite',
//           key: 'SameSite',
//               },
//     ])

//     return (
//         <div>
//             <Table dataSource={projectOneData} columns={columns} />
//         </div>
//     );
// };
import React from 'react';
import { Pie } from '@ant-design/charts';

const data = [
  { type: 'Category A', value: 30, },
  { type: 'Category B', value: 50,  },
  { type: 'Category C', value: 20, },
];

const Dashboard = () => {
  const config = {
    data,
    width: 400,
    height: 400,
    autoFit: false,
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.5,
    interactions: [{ type: 'element-active' }],
    meta: {
      value: {
        formatter: (v) => `${v}%`,
      },
      type: {  
        alias: 'Category Type',
        values: ['#FFCCFF', '#3F57', '#57FF'],
      },
    },
  };

  return <Pie {...config} />;
};

export default Dashboard;
