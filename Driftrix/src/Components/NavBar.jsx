import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const navLinks = (
    <>
      <li className="font-bold  ">
        <NavLink to="/">Home</NavLink>
      </li>
      <li className="font-bold  ">
        <NavLink to="/drawings">All Drawings</NavLink>
      </li>
    </>
  );
  return (
    <div className="navbar shadow-2xl text-white  py-1 px-2 md:px-6 lg:px-10 sticky top-0 z-30 bg-gray-900">
      <div className="navbar-start">
        <div className="dropdown dropdown-start">
        <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden text-lg md:text-xl hover:rotate-90"
          >
            <GiHamburgerMenu />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[2] p-2 shadow bg-black text-white lg:text-black rounded-box w-52"
          >
            {navLinks}
          </ul>
        </div>
        <a
          href="/"
          className="flex items-center gap-3 text-lg md:text-xl lg:text-3xl font-extrabold "
        >
          <p>Draftrix</p>
        </a>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>
    </div>
  );
};

export default NavBar;
