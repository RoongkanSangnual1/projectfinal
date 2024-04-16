import {BrowserRouter , Routes , Route } from "react-router-dom";
import App from "./App";
import Login from "./components/Login";
import Register from "./components/Register";
import Target_url from "./components/Target_url";
import Startpage from "./components/startpage";
import Admin from "./components/Admin";
import EditPrjectDash from "./components/Editprjectall";
import ProjectDash from "./components/projectdash";
import DashboardAll from "./components/DashboardAll";
import Edithome from "./components/Edithome";
import ProjectDashAdmin from "./components/projectdashAdmin";
// import ForgotPassword from "./components/ForgotPassword";
import OTPInput from "./components/OTPInput";
import SQlinject from "./components/SQlinject";
import Notfound from "./components/404";

const Router = () =>{
    return(
        <BrowserRouter>
        <Routes>
            <Route></Route>
            <Route path="/" element={<Startpage/>}></Route>
            <Route path="/register" element={<Register/>}></Route>
            <Route path="/home" element={<App/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/Dashboard" element={<DashboardAll/>}></Route>
            <Route path="/OTP" element={<OTPInput />} />
            <Route path="/create" element={<Target_url/>}></Route>
            <Route path="/Admin" element={<ProjectDashAdmin/>}></Route>
            {/* <Route path="/:project_name" element={<Onedata/>}></Route> */}
            <Route path="/myproject/:project_name/:project_name_id" element={<ProjectDash/>}></Route>
            <Route path="/myproject/:project_name/:project_name_id/tab4" element={<ProjectDash/>}></Route>

            <Route path="/myproject/edit/:project_name/:project_name_id" element={<Edithome/>}></Route>
            {/* <Route path="/edit-project/" element={<EditProject/>}></Route> */}
             <Route path="/edit-project/" element={<EditPrjectDash/>}></Route>
            <Route path="/404" element={<Notfound />}/>
            
            

        </Routes>
        </BrowserRouter>
    )
}
export default Router ;