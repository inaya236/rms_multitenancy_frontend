import React, { useEffect, useRef, useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoReorderThree } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../config";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';


const MyNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [box, setBox] = useState(false)
  const [userData, setUserData] = useState({})

  const dropdownRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const email = localStorage.getItem("email")

  const getUserName = async () => {
    try {
      const accessToken=localStorage.getItem("accessToken")
      const res = await axios.get(`${BASE_URL}get-users/`,
        {
          headers:{
            Authorization:`Bearer ${accessToken}`
          }
        }
      );
      const users = res.data;

      const matchedUser = users.find(u => u.email === email);
      console.log("user res", matchedUser)
      setUserData(matchedUser || {})
    } catch (error) {
      console.error("error", error)
    }

  }

  // to format name
  const formatName = (name = "") => {
    return name.toLowerCase().split(" ").filter(Boolean).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  }

  useEffect(() => {
    getUserName()
  }, [])


  return (
    <nav className="h-full w-full flex  items-center justify-between px-4" ref={dropdownRef}>

      <IoReorderThree
        size={40}
        style={{ cursor: "pointer" }}
        onClick={toggleSidebar}
      />
      <div className="flex items-center justify-center gap-2">
        <span className="text-xl font-bold text-black">
          {userData?.first_name
            ? formatName(`${userData.first_name} ${userData.last_name}`)
            : ""}
        </span>
        <IoPersonCircleOutline size={40} onClick={() => setBox(!box)} />
      </div>


      {box && (
        <div className="absolute right-4 top-14 w-44 bg-white shadow-md rounded-md py-2 border">

          <button
            onClick={() => navigate("/adminProfile")}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            <FaUser size={16} className="text-[var(--primary-color)]" />
            Profile
          </button>

        </div>
      )}
    </nav>

  );
};

export default MyNavbar;




