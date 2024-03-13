import React from 'react';
import Navbar from './navbar.js';
import { Button, Carousel } from 'antd';
import { BugFilled, SmileFilled, FileTextFilled, ClockCircleFilled,CheckOutlined } from '@ant-design/icons';
import "./startpage.css"
import { useNavigate} from "react-router-dom"
import fsp1 from "./imgsrc/rm373batch4-15.jpg"
import fsp2 from "./imgsrc/7971777_3807687.png"
import owasplogo from "./imgsrc/owasplogo.png"
import robologo from "./imgsrc/logo.png"
import robo from "./imgsrc/robo.png"
import robowebdemo from "./imgsrc/robopentestguide-demo.png"
import webscan from "./imgsrc/availability-svgrepo-com.svg"
import radar from "./imgsrc/radar-svgrepo-com.svg"

const Startpage = () => {
    const navigate = useNavigate()
    return( <div>
        <Navbar />
        <div className='firstSection'>
           <Carousel autoplay autoplaySpeed={10000} className='contentStyle'>
                <div className='fs-1'>
                    <div className='fs-1-t1'>
                        <h1>Let's&nbsp;</h1>
                        <h1 className='fs-1-t1-appname'>RoboPentestGuide&nbsp;</h1>
                        <h1>secure your websites</h1>
                    </div>
                    <img className='fs-1-image' src={fsp1}></img>
                    <div className='fs-1-t2'>
                        <h2>Empower your security journey with RoboPentestGuide. Discover, fortify, and report vulnerabilities effortlessly.<br></br>Unleash your creative potential in securing web applications with confidence.</h2>
                        <div className='fs-1-t2-d'>
                            <BugFilled style={{fontSize: '20px'}} className='fs-1-t2-d-i'/>
                            <h3>Enhance efficiency by automating the discovery of common vulnerabilities</h3>
                        </div>
                        <div className='fs-1-t2-d'>
                            <SmileFilled style={{fontSize: '20px'}} className='fs-1-t2-d-i'/>
                            <h3>Simplify redundant pentesting efforts</h3>
                        </div>
                        <div className='fs-1-t2-d'>
                            <FileTextFilled style={{fontSize: '20px'}} className='fs-1-t2-d-i'/>
                            <h3>Collaborate on the creation of reports with colleagues</h3>
                        </div>
                        <div className='fs-1-t2-d'>
                            <ClockCircleFilled style={{fontSize: '20px'}} className='fs-1-t2-d-i'/>
                            <h3>Minimize the duration of testing</h3>
                        </div>    
                    </div>
                
                </div>
                <div className='fs-2'>
                <img className='fs-2-image' src={fsp2}></img>
                    <div className='fs-2-t2'>
                        <img className='fs-2-t2-d-i' src={owasplogo} />
                        <h1>Referring to OWASP Web Security Testing Guide for testing guidance</h1>
                    </div>
                </div>
                
            </Carousel>
            <Button onClick={() => navigate('/login')} className='CButton'>Get Started</Button> 
        </div>
        <div className='secondSection'>
            <div className='ss-p1'>
                <img className='ss-p1-hi' src={robo}></img>
                <h1>What can ROBOPentestGuide do</h1>
                <h3>RoboPentestGuide, a web-based platform, expedites standard procedures in web application vulnerability scanning based on the OWASP Web Security Testing Guide, and  facilitating efficient report composition.</h3>
            </div>

            <img className='webimgdemo' src={robowebdemo}></img>


        </div>
        <div className='thirdSection'>
            <div className='ts-p1'>
               <img className='ts-p1-hi' src={radar}></img> 
               <h1>Discover Entry Points</h1>
               <h3>Take a close look at your targets for vulnerabilities using crawling and directory enumerating</h3>
            </div>
            <div className='ts-p2'>
               <img className='ts-p2-hi' src={owasplogo}></img> 
               <h1>Automate Web Application Penetration Testing</h1>
               <h3>Scan for common issues following the guidance in the OWASP Web Security Testing Guide.</h3>
               <div className='ts-p2-c1'>
                <div className='ts-p2-c1-t'>
                    <div className='ts-p2-c1-l1'>
                        <CheckOutlined style={{fontSize: '20px'}} className='ts-p2-c1-l1-t1-i'/>
                        <h3 className='ts-p2-c1-l1-t1-t'>Web Server Infomation Leakage through 'Server' header</h3>
                    </div>
                    <div className='ts-p2-c1-r1'>
                        <CheckOutlined style={{fontSize: '20px'}} className='ts-p2-c1-r1-t1-i'/>
                        <h3 className='ts-p2-c1-r1-t1-t'>Web Application Framework Infomation Leakage</h3>
                    </div>
                </div>
                <div className='ts-p2-c1-t'>
                    <div className='ts-p2-c1-l1'>
                        <CheckOutlined style={{fontSize: '20px'}} className='ts-p2-c1-l1-t1-i'/>
                        <h3 className='ts-p2-c1-l1-t1-t'>Missing HTTP Strict Transport Security Header</h3>
                    </div>
                    <div className='ts-p2-c1-r1'>
                        <CheckOutlined style={{fontSize: '20px'}} className='ts-p2-c1-r1-t1-i'/>
                        <h3 className='ts-p2-c1-r1-t1-t'>Sensitive File Disclosure</h3>
                    </div>
                </div>
                <div className='ts-p2-c1-t'>
                    <div className='ts-p2-c1-l1'>
                        <CheckOutlined style={{fontSize: '20px'}} className='ts-p2-c1-l1-t1-i'/>
                        <h3 className='ts-p2-c1-l1-t1-t'>Directory Traversal File Include</h3>
                    </div>
                    <div className='ts-p2-c1-r1'>
                        <CheckOutlined style={{fontSize: '20px'}} className='ts-p2-c1-r1-t1-i'/>
                        <h3 className='ts-p2-c1-r1-t1-t'>Missing Secure Attribute in Cookie Header</h3>
                    </div>
                </div>
                <div className='ts-p2-c1-t'>
                    <div className='ts-p2-c1-l1'>
                        <CheckOutlined style={{fontSize: '20px'}} className='ts-p2-c1-l1-t1-i'/>
                        <h3 className='ts-p2-c1-l1-t1-t'>Missing HttpOnly Attribute in Cookie Header</h3>
                    </div>
                    <div className='ts-p2-c1-r1'>
                        <CheckOutlined style={{fontSize: '20px'}} className='ts-p2-c1-r1-t1-i'/>
                        <h3 className='ts-p2-c1-r1-t1-t'>Missing Expires Attribute in Cookie Header</h3>
                    </div>
                </div>
                <div className='ts-p2-c1-t'>
                    <div className='ts-p2-c1-l1'>
                        <CheckOutlined style={{fontSize: '20px'}} className='ts-p2-c1-l1-t1-i'/>
                        <h3 className='ts-p2-c1-l1-t1-t'>Missing SameSite Attribute in Cookie Header</h3>
                    </div>
                    <div className='ts-p2-c1-r1'>
                        <CheckOutlined style={{fontSize: '20px'}} className='ts-p2-c1-r1-t1-i'/>
                        <h3 className='ts-p2-c1-r1-t1-t'>Reflected Cross Site Scripting</h3>
                    </div>
                </div>
                <div className='ts-p2-c1-t'>
                    <div className='ts-p2-c1-l1'>
                        <CheckOutlined style={{fontSize: '20px'}} className='ts-p2-c1-l1-t1-i'/>
                        <h3 className='ts-p2-c1-l1-t1-t'>SQL Injection</h3>
                    </div>
                    <div className='ts-p2-c1-r1'>
                        <CheckOutlined style={{fontSize: '20px'}} className='ts-p2-c1-r1-t1-i'/>
                        <h3 className='ts-p2-c1-r1-t1-t'>Command Injection</h3>
                    </div>
                </div>
               </div>
            </div>
            <div className='ts-p3'>
                <h1>RoboPentestGuide caters to...</h1>
                    <div class='ts-p3-cc'>
                        <div class='ts-p3-c'>
                            <h3>General User</h3>
                            <ul className='ts-p3-c-l'>
                                <li>Quickly scan your target for potential attack surfaces with a web spider and directory enumeration</li>
                                <li>Automate web application penetration testing and obtain scanning results.</li>
                                <li>Export scanning results as a PDF</li>
                            </ul>
                            <Button type="primary" className='ts-p3-c-b'>Start Now</Button>


                        </div>
                        <div class='ts-p3-c'>
                            <h3>Penetration Tester</h3>
                            <ul className='ts-p3-c-l'>
                                <li>Quickly scan your target for potential attack surfaces with a web spider and directory enumeration</li>
                                <li>Able to manually add attack surfaces</li>
                                <li>Able to export all entry points as CSV for convenient use in manual penetration testing</li>
                                <li>Automate web application penetration testing and obtain scanning results.</li>
                                <li>Able to modify penetration testing results</li>
                                <li>Collaboratively write penetration reports with your colleagues 24/7</li>
                                <li>Export scanning results as a PDF</li>
                            </ul>
                            <Button type="primary" className='ts-p3-c-b'>Start Now</Button>


                        </div>
                    </div>
            </div>


        </div>
        </div>
)
}
export default Startpage;