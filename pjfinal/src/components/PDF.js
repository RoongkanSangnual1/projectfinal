import {jsPDF} from 'jspdf'
import autoTable from 'jspdf-autotable'
import {Button} from 'antd';
import axios from 'axios'
import { FaRegFilePdf } from "react-icons/fa6";
const PDF = (props) => {
    // console.log(`pdf${props.id}`);
    // console.log(`pdf${props.url_target}`);
    const token = localStorage.getItem('token')
    const name_id =props.id
    const doc = new jsPDF();
    const showModal = () => {
        // axios.post(`http://127.0.0.1:5000/generate_pdf`,{name_id})
        // .then(response=>{
        //     if(response){
        //         console.log(response);
        //     }
        //     })
        // .catch(err=>{
        //     alert(err.response.data)
        // }) 


      doc.setFontSize(16)
      doc.text(`Penetration Testing ${props.name}`, 14, 10);
      doc.setFontSize(12)
      doc.text(`vulnerability Targets`, 14, 17);
      

      let content = {startY: 20,
        head: [['ID', 'Targets', 'Details']],
        body: [
          ['1', ` ${props.url_target}`, ` ${props.Details}`],
        
          // ...
        ]}
        let content2 = {startY: 45,
            head: [['ID', 'vulnerability Details', 'Severity']],
            body: [
              ['1', `Web Server Infomation Leakage through Server header`,],
              ['2', `Web Application Framework Infomation Leakage`,],
              ['3', `Directory Traversal File Include`,],
              ['4', `Missing Secure Attribute in Cookie Header`,],
              ['5', `Missing HttpOnly Attribute in Cookie Header`,],
              ['6', `Missing Expires Attribute in Cookie Header`,],
              ['7', `Missing SameSite Attribute in Cookie Header`,],
              ['8', `Reflected Cross Site Scripting`,],
              ['9', `Stored Cross Site Scriptng`,],
              ['10', `SQL Injection`,],
              ['11', `Command Injection`,],
              ['12', `Missing HTTP Strict Transport Security Header`, ],
              ['13', `Sensitive File Disclosure`, ],
            //   ['14', `Penetration Testing ${props.name}`, 'Sweden'],

            
              // ...
            ]}
      // Create the table with didDrawCell callback
      doc.autoTable(content);

      doc.setFontSize(12)
      doc.text(`vulnerability ISSUE`, 14, 42);
      doc.autoTable(content2);
  
      doc.save(`Penetration Testing ${props.name}`);
      
    };

    return(
        <div>
<Button  icon={<FaRegFilePdf/>} onClick={showModal} type="primary"style={{ transform: 'translateX(850px) scale(1.5)', marginTop: '20px',background:'red' }} > PDF
 </Button>

        </div>
    )
}

export default PDF;