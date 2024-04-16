// import { useParams } from 'react-router-dom';
// import{ useState,useEffect }from "react";
// import axios from 'axios'
// import Navbar from './navbar';
// const Onedata =()=>{
//     const { project_name_id } = useParams();
//     console.log(project_name_id)
//     const [projectOneData, setProjectOneData] = useState([]);
//     //ส่งเปนtokenแทน
//     const user = localStorage.user
//     useEffect(() => {
//         axios.get(`http://localhost:5000/onedata?user=${user}&project_name=${project_name_id }`)
//             .then(response => {
//                 setProjectOneData(response.data.crawl_data);
//                 console.log(response.data)                  
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//     }, []);
//     return(  
//         <div>
//          <Navbar/>
//          {projectOneData.map((data,index)=>(

//            <div key ={index}> 

//            <p>no. {index+1}</p>
//            <p>url: {data[0]}    </p> 
//            <p>method: {data[1]}    </p>
//            <p>status:{data[2]}    </p>
           
//           </div>
          
//          ))}
//         </div>
//     )
// } 

// export default  Onedata; ไม่ได้ใช้