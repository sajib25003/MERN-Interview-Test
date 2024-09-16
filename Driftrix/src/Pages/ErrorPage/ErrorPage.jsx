import { NavLink } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className=" flex flex-col items-center justify-center max-h-screen bg-black pb-28 text-white">
        <div className="justify-center">
          <img className=" h-[500px]" src="404-1.png" alt="404-error" />
        </div>
        <div className=" flex flex-col items-center justify-center gap-8">
          <p className="  text-3xl font-semibold">
            Page Not Found!
          </p>
          <NavLink to="/">
            <button className="btn bg-white text-black hover:text-white  text-xl font-bold ">
              Go to Home
            </button>
          </NavLink>
        </div>
      </div>
  
    );
};

export default ErrorPage;