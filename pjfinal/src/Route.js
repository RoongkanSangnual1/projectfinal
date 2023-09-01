import {BrowserRouter , Routes , Route } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";
import Target_url from "./components/Target_url";
import Startpage from "./components/startpage";

import ProjectDash from "./components/projectdash";

const Router = () =>{
    return(
        <BrowserRouter>
        <Routes>
            <Route></Route>
            <Route path="/" element={<Startpage/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/home" element={<App/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/create" element={<Target_url/>}></Route>
            {/* <Route path="/:project_name" element={<Onedata/>}></Route> */}
            <Route path="/myproject/:project_name/:project_name_id" element={<ProjectDash/>}></Route>
            

        </Routes>
        </BrowserRouter>
    )
}
export default Router ;