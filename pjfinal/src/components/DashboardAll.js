import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import './Dashboard.css'
import Sidemenu from './sidemenu';
import Navbar from './navbar';
import { FormOutlined } from '@ant-design/icons';
import { Link} from "react-router-dom";
import { IoEarth } from "react-icons/io5";
import { MdOutlineExpandMore } from "react-icons/md";
const DashboardAll = () => {
  const { project_name_id } = useParams();
  const [projectOneData, setProjectOneData] = useState({ data10: [], data11: [],data4:[] ,data2:[] ,data3:[] ,data5:[] ,data6:[] ,data1:[]});
  const [alldata, setAlldata] = useState([]);
  const [projectOneDataTravel, setProjectOneDataTravel] = useState([]);
  const user = localStorage.user;
  const [visibleCount, setVisibleCount] = useState(4);

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 4);
  };
  useEffect(() => {
    const token = localStorage.getItem("token")
    console.log(token)
      axios.get(`http://127.0.0.1:5000/DashboardAll`,{
        headers:{
          Authorization:`Bearer ${token}`,
        },
      })
    .then(response => { 
    console.log(response.data.project_data_DashboardAll)
    const data = response.data.project_data_DashboardAll
const result = {};

data.forEach(array => {
  const [PName, PTarget, OID, URL,PID] = array;
  if (OID === 10 || OID === 11 || OID === 4 || OID === 1 || OID === 2 || OID === 3 || OID === 5 || OID === 6 || OID === 1) {
    if (!result[PID]) {
      result[PID] = { PName, PTarget, data10: [], data11: [] , data4:[], data2:[], data3:[], data5:[], data6:[],data1:[], PID};
    }

    if (!result[PID][`data${OID}`]) {
      result[PID][`data${OID}`] = [];
    }

    result[PID][`data${OID}`].push(URL);
  }
});

const finalResult = Object.values(result);
setAlldata(finalResult)
console.log(finalResult)
let sum10 = 0;
let sum11 = 0;
let sum4 = 0;
let sum2 = 0;
let sum3 = 0;
let sum5 = 0;
let sum6 = 0;
let sum1 = 0;

finalResult.forEach(data => {
  sum10 =sum10 + data.data10.length;
  sum11 =sum11 + data.data11.length;
  sum4 = sum4 + data.data4.length;
  sum2 = sum2 + data.data2.length;
  sum3 = sum3 + data.data3.length;
  sum5 = sum5 + data.data5.length;
  sum6 = sum6 + data.data6.length;
  sum1 = sum1 + data.data1.length;
});

setProjectOneData({ data10: sum10, data11: sum11 ,data4:sum4 ,data2:sum2 ,data3:sum3 ,data5:sum5 ,data6:sum6,data1:sum1});
    })
    .catch(error => {
      console.error(error);
    });
  }, []); 

  const classifyVulnerabilities = () => {
    const counts = {
      high: projectOneData.data10 + projectOneData.data11,
      medium: projectOneData.data4,
      low: projectOneData.data2+projectOneData.data3+projectOneData.data5+projectOneData.data6+projectOneData.data1
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
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
   
  return (
    <div>
            <Navbar/>
            <div className='dashboard-All'>
  <Sidemenu />
  <div className='content-container'>
    <h1 style={{color:'#1B337A'}}>Dashboard</h1>
    <div className='dashboardAll'>
    <div className='dashboardAll2'>
      <ResponsiveContainer width="100%" height={400}>
      <h1 style={{color:'#1B337A'}}>Current Issue</h1>
        <PieChart>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="30%"
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
      
      <div className='highlightAll-container'>
        <div className='circle-redd'></div>
        <p>High </p>
        <p > ({projectOneData.data10+projectOneData.data11})</p>
        <div className='circle-yelloww'></div>
        <p>Medium</p>
        <p > ({projectOneData.data4})</p>
        <div className='circle-bluee'></div>
        <p>Low</p>
         <p > ({projectOneData.data2+projectOneData.data3+projectOneData.data5+projectOneData.data6+projectOneData.data1})</p>
      </div>
    </div>
    <div className='dashboardAll3'>
    <h1 style={{color:'#1B337A'}}>Current Process</h1>
    </div>
    
    </div>
        <div className='dashboardAll4'>
        <h1 style={{color:'#1B337A'}}>Most vulnerability</h1>
        {alldata
        .sort((a, b) => (b.data1.length + b.data2.length+b.data3.length + b.data4.length+b.data5.length + b.data6.length+b.data10.length + b.data11.length) - (a.data1.length + a.data2.length+a.data3.length + a.data4.length+a.data5.length + a.data6.length+a.data10.length + a.data11.length))
        .slice(0, visibleCount)
        .map((data, index) => (
          <Link className="projedit-btn" to={`/myproject/${data.PName}/${data.PID}`}>
          <div className='dashboard4mini' key={index}>

            <div className='left-content'>
                <div className="project-link-container">
                  <IoEarth className="earth-icon" />
                  <p className="project-name">{data.PName}</p>
                </div>
            
            </div>
            <div className='right-content'>
              <div className='circle-redmini'>
              <p className='circle-text'>{data.data10.length + data.data11.length}</p>
              </div>
              <div className='circle-yellowmini'>
                <p className='circle-text'>{data.data4.length}</p>
              </div>
              <div className='circle-bluemini'>
                <p className='circle-text'>{data.data2.length+data.data3.length+data.data6.length+data.data5.length+data.data1.length}</p>
              </div>
            </div>
          </div>
          </Link>
        ))}
      {alldata.length > visibleCount && (
      <>
         <MdOutlineExpandMore className="show-more-btn" onClick={handleShowMore} />
         </>
      )}
 
  

    
        </div>
 
  </div>
</div>

    </div>
  );
  
};

export default DashboardAll;
