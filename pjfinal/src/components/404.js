import React from 'react';
import { Button, Result } from 'antd';
import Navbar from './navbar';
import './errorpage.css';
const Notfound = () => (
    <div>
        <Navbar />
        <div className='spaceUp'></div>
        <Result
            className='err404'
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary" href='/home'>Back Home</Button>}
            
        />
  </div>
);
export default Notfound;