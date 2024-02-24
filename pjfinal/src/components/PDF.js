import {jsPDF} from 'jspdf'
import autoTable from 'jspdf-autotable'
import {Button} from 'antd';
import axios from 'axios'
import { FaRegFilePdf } from "react-icons/fa6";
import {font} from "./THSarabunNew-normal"
const PDF = (props) => {
  const token = localStorage.getItem('token');
  const name_id = props.id;

  console.log("responsedata", props.responsedata);

  const data = props.responsedata.filter(item => Object.values(item)[0]?.length !== 0);
  console.log("data", data);

  let body2 = [];
  function getSeverityByKey(key) {
    const severityMapping = {
      "Web Server Infomation Leakage through Server header": "Low",
      "Web Application Framework Infomation Leakage": "Medium",
      "Directory Traversal File Include": "Medium",
      "Missing Secure Attribute in Cookie Header": "Low",
      "Missing HttpOnly Attribute in Cookie Header": "Low",
      "Missing Expires Attribute in Cookie Header": "Low",
      "Missing SameSite Attribute in Cookie Header": "Low",
      "Reflected Cross Site Scripting": "High",
      "Stored Cross Site Scriptng": "High",
      "SQL Injection": "High",
      "Command Injection": "High",
      "Missing HTTP Strict Transport Security Header": "Low",
      "Sensitive File Disclosure": "High",
    
    };
  
    return severityMapping[key] || "High"; 
  }
  
  data.forEach((item, index) => {
    const key = Object.keys(item)[0];
    const severity = getSeverityByKey(key); 
    body2.push([`${index + 1}`, key, severity, ...Object.values(item)[0]]);
  });
  
console.log(body2)
  const doc = new jsPDF();
  doc.addFileToVFS("MyFont.ttf", font);
  doc.addFont("MyFont.ttf", "MyFont", "normal");
  doc.setFont("MyFont");

  const showModal = () => {
    doc.setFontSize(16);
    doc.text(`Penetration Testing  ${props.name}`, 14, 10);
    doc.setFontSize(12);
    doc.text(`vulnerability Targets`, 14, 17);

    let content = {
      startY: 20,
      head: [['ID', 'Targets', 'Details']],
      body: [['1', ` ${props.url_target}`, ` ${props.Details}`]],
    };

    let content2 = {
      startY: 45,
      head: [['ID', 'vulnerability Details', 'Severity']],
      body: body2,
    };

    doc.autoTable(content);

    doc.setFontSize(12);
    doc.text(`vulnerability ISSUE`, 14, 42);
    doc.autoTable(content2);

    // doc.save(`Penetration Testing ${props.name}`);


  
data.forEach((item, index) => {
  const key = Object.keys(item)[0];
  const vulnerabilities = Object.values(item)[0];
  console.log("vulnerabilities", vulnerabilities);

  doc.addPage();

  doc.setFontSize(16);
  doc.text(`${key}`, 14, 15);

  let vulcontent = {
    startY: 20,
    head: [['ID', 'URL', 'EVidence']],
    body: vulnerabilities.map((vulnerability, innerIndex) => {
      let url, evidence;

      if (key === "SQL Injection" || key === "Directory Traversal File Include" || key === "Stored Cross Site Scriptng") {
        url = vulnerability[4];
        evidence = vulnerability[5];
      } else {
        url = vulnerability[2];
        evidence = vulnerability[3];
      }

      return [`${innerIndex + 1}`, url, evidence];
    }),
    columnStyles: {
      0: {
        cellWidth: 20,
      },
      1: {
        cellWidth: 100,
      },
      2: {
        cellWidth: 60,
      },
    },
  };

  doc.autoTable(vulcontent);
    doc.setFontSize(12);
    let details, Evidence,Solutions,owasp;

      if (key === "SQL Injection" || key === "Directory Traversal File Include" || key === "Stored Cross Site Scriptng") {
        details = vulnerabilities[0][7];
        Evidence = vulnerabilities[0][6];
        Solutions= vulnerabilities[0][8];
        owasp= vulnerabilities[0][9];
      
      } 
      else {
        details = vulnerabilities[0][4];
        Evidence = vulnerabilities[0][3];
        Solutions= vulnerabilities[0][5];
        owasp= vulnerabilities[0][6];
      
      }
    doc.setFontSize(12);

    // แยกข้อความและเก็บไว้ในอาร์เรย์
    const detailsLines = doc.splitTextToSize(`Vulnerability details \n ${details}`, 180);
    const evidenceLines = doc.splitTextToSize(`Vulnerability Evidence \n ${Evidence}`, 180);
    const solutionsLines = doc.splitTextToSize(`Vulnerability Solutions \n ${Solutions}`, 180);
    const owaspLines = doc.splitTextToSize(`Vulnerability Owasp \n ${owasp}`, 180);
    console.log("detailsLines",detailsLines)
    
    // แสดงแต่ละบรรทัด
    detailsLines.forEach((line, index) => {
      doc.text(line, 14, doc.autoTable.previous.finalY + 10 + index * 10);
    });
    
    evidenceLines.forEach((line, index) => {
      doc.text(line, 14, doc.autoTable.previous.finalY + 60 + index * 10);
    });
    
    solutionsLines.forEach((line, index) => {
      doc.text(line, 14, doc.autoTable.previous.finalY + 100 + index * 10);
    });
    
    owaspLines.forEach((line, index) => {
      doc.text(line, 14, doc.autoTable.previous.finalY + 170 + index * 10);
    });





});

      doc.save(`Penetration Testing ${props.name}`);
  };

  return (
    <div>
      <Button
        icon={<FaRegFilePdf />}
        onClick={showModal}
        type="primary"
        style={{ transform: 'translateX(850px) scale(1.5)', marginTop: '20px', background: 'red' }}
      >
        PDF
      </Button>
    </div>
  );
};

export default PDF;