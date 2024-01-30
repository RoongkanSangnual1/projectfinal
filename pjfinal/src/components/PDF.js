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
      doc.text(`Penetration Testing - ${props.name}`, 14, 10);
      doc.setFontSize(12)
      doc.text(`Vulnerability Targets`, 14, 17);
      

      let content = {startY: 20,
        head: [['ID', 'Targets', 'Details']],
        body: [
          ['1', ` ${props.url_target}`, ` ${props.Details}`],
        
          // ...
        ]}
        let content2 = {startY: 45,
            head: [['ID', 'Vulnerability Details', 'Severity']],
            body: [
              ['1', `Web Server Infomation Leakage through 'Server' header`,],
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
      doc.text(`Vulnerability Issues`, 14, 42);
      doc.autoTable(content2);
      
      doc.addPage(); //new page
      doc.setFontSize(16)
      doc.text(`1. Web Server Infomation Leakage through 'Server' header`, 14, 15);
      let vulcontent = {startY: 20,
        head: [['ID', 'URL', 'Severity']],
        body: [
          ['1',`\/*`,'Low'],
        ]}

      doc.autoTable(vulcontent)
      doc.setFontSize(14)
      doc.text(`Vulnerability details`, 14, 45)
      let vuldetailtext = `Web server fingerprinting is the task of identifying the type and version of web server that a target is running on. While web server fingerprinting is often encapsulated in automated testing tools, it is important for researchers to understand the fundamentals of how these tools attempt to identify software, and why this is useful.`
      let fontSize = 12;
      var x = 20;
      var y = 55;
      //var maxWidth = doc.internal.pageSize.width * 2 ; // Adjust as needed
      let maxWidth = 450; // Adjust as needed
      console.log(maxWidth)
      var lineHeight = 7; // Adjust as needed
      doc.setFontSize(12)
      y = addWrappedText(doc, vuldetailtext, fontSize, x, y, maxWidth, lineHeight);
      y += 10
      
      let vulevidence = `{'Server': 'Apache-Coyote/1.1', 'Set-Cookie': 'JSESSIONID=71EDF125B3D572CDA3F6D8D3CA13C36C; Path=/; Secure; HttpOnly', 'Content-Type': 'text/html;charset=ISO-8859-1', 'Transfer-Encoding': 'chunked', 'Date': 'Mon, 25 Dec 2023 10:47:30 GMT'}`
      doc.setFontSize(14)
      doc.text(`Evidence`, 14, y)
      doc.setFontSize(10)
      y += 10
      fontSize = 5
      y = addWrappedTextResponseHeader(doc, vulevidence, fontSize, x, y, maxWidth, lineHeight);
      y += 10
      doc.setFontSize(14)
      doc.text(`Solutions`, 14, y)
      y += 10
      doc.setFontSize(12)
      maxWidth = doc.internal.pageSize.width ;
      console.log(maxWidth)
      let vulsol =`While exposed server information is not necessarily in itself a vulnerability, it is information that can assist attackers in exploiting other vulnerabilities that may exist. Exposed server information can also lead attackers to find version-specific server vulnerabilities that can be used to exploit unpatched servers. For this reason it is recommended that some precautions be taken. These actions include:
      - Obscuring web server information in headers, such as with Apaches mod_headers module.
      - Using a hardened reverse proxy server to create an additional layer of security between the
        web server and the Internet.
      - Ensuring that web servers are kept up-to-date with the latest software and security patches.`;
      y = addWrappedTextBullet(doc, vulsol, fontSize, x, y, maxWidth, lineHeight);
      y += 10
      doc.setFontSize(14)
      doc.text(`Reference`, 14, y)
      y += 10
      doc.setFontSize(10)
      maxWidth = 160;
      let vulref = `https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/01-Information_Gathering/02-Fingerprint_Web_Server`
      y = addWrappedTextNormal(doc, vulref, fontSize, x, y, maxWidth, lineHeight);
      
      
      
      doc.save(`Penetration_Testing_Report-${props.name}`);
      
    };

    return(
        <div>
<Button  icon={<FaRegFilePdf/>} onClick={showModal} type="primary"style={{ transform: 'translateX(850px) scale(1.5)', marginTop: '20px',background:'red' }} > PDF
 </Button>

        </div>
    )
}

export default PDF;

function addWrappedTextNormal(doc, text, fontSize, x, y, maxWidth, lineHeight) {
  var lines = doc.splitTextToSize(text, maxWidth);

  lines.forEach(function(line) {
      doc.text(x, y, line);
      y += lineHeight;
  });

  return y;
}


function addWrappedText(doc, text,fontSize, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var currentLine = '';

    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        var currentWidth = doc.getStringUnitWidth(currentLine + word) * fontSize;

        if (currentWidth < (maxWidth)) {
            // Add the word to the current line
            currentLine += (currentLine === '' ? '' : ' ') + word;
        } else {
            // Start a new line
            console.log(currentLine)
            doc.text(x, y, currentLine);
            y += lineHeight;
            currentLine = word;
        }
    }

    // Add the last line
    doc.text(x, y, currentLine);
    return y;
}



function addWrappedTextBullet(doc, text, fontSize, x, y, maxWidth, lineHeight) {
  var paragraphs = text.split('\n'); // Split by newline character

  paragraphs.forEach(function(paragraph) {
      var lines = paragraph.split('\n');

      lines.forEach(function(line) {
          // Check if the line starts with a bullet point
          var isBulletPoint = /^\s*-\s*/.test(line);

          // Set initial indentation for bullet points
          var indentation = isBulletPoint ? '  - ' : '';

          // Remove bullet point characters for further processing
          var textWithoutBullet = line.replace(/^\s*-\s*/, '');

          var words = textWithoutBullet.trim().split(' ');

          var currentLine = indentation;

          for (var i = 0; i < words.length; i++) {
              var word = words[i];
              var currentWidth = doc.getStringUnitWidth(currentLine + word) * fontSize;

              if (i > 0 && currentWidth > maxWidth) {
                  // Start a new line with proper indentation
                  doc.text(x + doc.getStringUnitWidth(indentation), y, currentLine);
                  y += lineHeight;
                  currentLine = indentation + word;
              } else {
                  currentLine += (currentLine === indentation ? '' : ' ') + word;
              }
          }

          // Add the last line
          doc.text(x + doc.getStringUnitWidth(indentation), y, currentLine);
          y += lineHeight;
      });
  });

  // Return the final y value
  return y;
}

function addWrappedTextResponseHeader(doc, text, fontSize, x, y, maxWidth, lineHeight) {
  var lines = text.split(', ');

  lines.forEach(function(line) {
    var words = line.split(' ');

    var currentLine = '';
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      var currentWidth = doc.getStringUnitWidth(currentLine + word) * fontSize;

      if (i > 0 && currentWidth > maxWidth) {
        // Start a new line
        doc.text(x, y, currentLine);
        y += lineHeight;
        currentLine = word;
      } else {
        currentLine += (currentLine === '' ? '' : ' ') + word;
      }
    }

    // Add the last line
    doc.text(x, y, currentLine);
    y += lineHeight;
    
  });
  return y;
}