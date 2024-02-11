import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { useLocation } from 'react-router-dom';
import './Dashboard.css'
const EditDashboard = () => {
    const location = useLocation();
  const { project_name_id } = useParams();
  const [projectOneDataSQL, setProjectOneDataSQL] = useState([]);
  const [projectOneDataXSS, setProjectOneDataXSS] = useState([]);
  const [projectOneDataTravel, setProjectOneDataTravel] = useState([]);
  const user = localStorage.user;
  const tokenuser= localStorage.getItem('token');
  const token = new URLSearchParams(location.search).get('token');
  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/edit-Dashboard?token=${token}`, {
      headers: {
        'Authorization': `Bearer ${tokenuser}`
      }
    })
    .then(response => { 
        console.log("response",response)
      setProjectOneDataSQL(response.data[1].select_att_sql_DATA.length);
      setProjectOneDataXSS(response.data[2].select_att_ID_xsssql_DATA.length);
      setProjectOneDataTravel(response.data[3].select_att_ID_select_att_traversal_DATA.length);
    })
    .catch(error => {
      console.error(error);
    });
  }, [user, project_name_id]); 

  const classifyVulnerabilities = () => {
    const counts = {
      high: projectOneDataSQL + projectOneDataXSS,
      medium: projectOneDataTravel,
      low: 0,
    };
  
    return counts;
  };

  const vulnerabilityCounts = classifyVulnerabilities();
  const pieChartData = [
    { type: 'High', value: vulnerabilityCounts.high },
    { type: 'Medium', value: vulnerabilityCounts.medium },
    { type: 'Low', value: vulnerabilityCounts.low },
  ];
  const RADIAN = Math.PI / 180;
  const COLORS = ['#FF0000', '#FFBB28',  '#6F77B1 '];
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    // return (
    //   <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
    //     {`${(percent * 100).toFixed(0)}%`}
    //   </text>
    // );
  };
   
  return (
    <div className='dashboardd'>
      <div className='dashboard'>
        <ResponsiveContainer width="100%" height={400}>
        <h1>Current Issue</h1>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="47%"
              cy="35%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
         <div className='highlight-container'>
        <div className='circle-red'></div>
        <p>high</p>
        <div className='circle-yellow'></div>
        <p>medium</p>
        <div className='circle-blue'></div>
        <p>low</p>
      </div>
      </div>
      <h1>Summary</h1>
      <div className='Sum'>
      
      

        <div className="collapse-content" style={{ overflow: 'auto' }}>
          <table>
          <thead>
              <tr>
                <th>Vulnerability</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {projectOneDataSQL>0 &&( <tr>
                <td>SQL injection</td>
                <td style={{color:"#FF0000"}}> High</td>
                </tr>)}

            {projectOneDataXSS>0 &&( <tr>
              <td>  XSS     </td>
              <td style={{color:"#FF0000"}}> High</td>
       
            </tr>)}
            {projectOneDataTravel>0 &&(<tr>
              <td >
              traversal
              </td>
              <td style={{color:" #FFBB28"}}>
                Medium
              </td>
            </tr>)}
            </tbody>
            </table>
            </div>
          
     
        </div>
      </div>

  );
  
};

export default EditDashboard;
