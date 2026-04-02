import React, { useState, useEffect, useRef } from 'react';
import { FaUserAlt } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { IoReorderThree } from 'react-icons/io5';


const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const role = localStorage.getItem("role")
  const dropdownRef = useRef(null);
  const [box, setBox] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Navbar */}
      <div className={`relative navbar fixed sticky top-0 z-30 w-full bg-[#FBF7F2] shadow-md px-6 py-2 flex items-center ${sidebarOpen ? "justify-between" : "justify-between ml-0 w-full"}`}>
    <nav className="h-full w-full flex  items-center justify-between px-4">

        {/* Left: Hamburger */}
        {/* <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl text-gray-600 btn btn-ghost"
        >
          <MdMenu />
        </button> */}

         <IoReorderThree
        size={40}
        style={{ cursor: "pointer" }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        // onClick={toggleSidebar}
      />

        {/* Right: Dashboard text + User Icon */}
        <div className="flex absolute items-center gap-4 relative" ref={dropdownRef}>
          <span className="text-xl font-bold text-black">
            Super-Admin  Dashboard
          </span>

          {/* User Icon */}
          <div className="w-10 h-10 rounded-full  font-bold text-gray-500 bg-[#FBF7F2] flex items-center justify-center">
            <button onClick={() => setBox(!box)}>
              <FaUserAlt />
            </button>
          </div>
          {/* Dropdown */}
          {box && (
            <div className="absolute top-full mt-2 right-0 w-50 bg-white  shadow-lg rounded-md py-2">
              <div className="flex items-center justify-center border-b border-cyan-600 hover:bg-gray-300">
                <FaUser size={20} className="text-black" />
                <button onClick={() => {
                  navigate("/adminProfile")
                }}>
                  <p className="px-4 py-1 text-xl cursor-pointer text-black">Profile</p>
                </button>
              </div>

              <div className="flex items-center justify-center hover:bg-gray-300">
                <RiLogoutBoxRFill size={20} className="text-black" />
                <button
                  className="px-2 py-1 text-xl cursor-pointer text-black"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      </div>
    </>
  )
}

export default Navbar;