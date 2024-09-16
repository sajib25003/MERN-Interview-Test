import { Outlet } from "react-router-dom";
import NavBar from "../Components/NavBar";

const Main = () => {
    return (
        <div className="bg-gray-200 min-h-screen">
            <NavBar></NavBar>
            <Outlet></Outlet>
        </div>
    );
};

export default Main;