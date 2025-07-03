import React from "react";
import { useDispatch } from "react-redux";
import "../layout.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userMenu, teacherMenu } from "../data/data";
import {setUser} from "../redux/userSlice";


function Layout({ children }) {
   const navigate = useNavigate(); // ✅ this must be inside component
  const dispatch = useDispatch(); // ✅ valid hook call  
  const { user } = useSelector((state) => state.user);
  const menuToBeRendered = user?.role === "teacher" ? teacherMenu : userMenu;

  const handleLogout = () => {
  localStorage.clear(); // clear token
  dispatch(setUser(null)); // clear Redux user
  navigate("/login"); // redirect
};

  return (
    <div className="main vh-100 p-3">
      <div className="d-flex h-100">
        <div
          className="sidebar text-white bg-primary rounded me-3 p-3"
          style={{ width: "300px", boxShadow: "0 0 2px gray" }}
        >
          <div className="sidebar-header pb-2"></div>
          <div className="menu text-white mt-5">
            {menuToBeRendered.map((menuItem) => (
              <div className="d-flex" key={menuItem.path}>
                <i className={menuItem.icon}></i>
                <Link
                  to={menuItem.path}
                  className="text-white ms-2 text-decoration-none mb-3 mt-3"
                >
                  {menuItem.name}
                </Link>
              </div>
            ))}
            <div className="d-flex" onClick={handleLogout}>
              <i className="ri-logout-box-r-line mt-auto mb-auto"></i>
              <Link
                to="/login"
                className="text-white ms-2 text-decoration-none mb-3 mt-3"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
        <div className="content bg-light rounded w-100">
          <div
            className="header bg-black text-white d-flex justify-content-center align-items-center"
            style={{ height: "7vh" }}
          >
            Book your Session
          </div>
          <div className="body w-100">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
