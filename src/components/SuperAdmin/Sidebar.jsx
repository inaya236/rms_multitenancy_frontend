import React, { useState } from 'react';
import { PiMonitorLight } from "react-icons/pi";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { IoIosRestaurant } from "react-icons/io";

import { LiaHospitalSolid } from "react-icons/lia";
import { FaHospital, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import backgroundimg from '../../assets/backgroundimg.png';
import { GiForkKnifeSpoon } from "react-icons/gi";

const Sidebar = ({ sidebarOpen }) => {
  const [open, setOpen] = useState(true)
  const [dashOpen, setDashOpen] = useState(true)
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  // bg-gradient-to-br from-[#8AA1B7] to-[#284D6E]

    const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  
  return (
    <>
      <div className="relative z-10">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full overflow-y-auto z-40 
            bg-white shadow-xl border-r border-gray-200
            transition-all duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"}
            `}
        >
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <img
              src={backgroundimg}
              alt="bg"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-white/20"></div>
          </div>
          <div className="relative mb-4">
            {sidebarOpen && (
              <div className="text-center mt-4">
                <GiForkKnifeSpoon className="text-4xl mx-auto text-[#ff5722]"/>
                <h2 className="text-2xl font-bold text-[#1F1F1F] tracking-wide">
                  Restaurant<span className='text-[#ff5722]'>Panel</span>
                </h2>
                <p className='text-xs text-gray-500 mt-1'>Super Admin Panel</p>
                {/* <GiForkKnifeSpoon className="text-4xl mx-auto text-[#ff5722]"/> */}
              </div>
            )}
          </div>

          <ul className="menu flex flex-col gap-6  text-sm">

            <li
              className='relative'
            //  onMouseEnter={()=>setDashOpen(true)}
            // onMouseLeave={()=>setDashOpen(false)}
            >
              <Link to="/"
                // onClick={()=>setDashOpen(!dashOpen)}
                className={`flex items-center gap-3 text-[16px] font-medium p-3 rounded-xl
                        transition-all duration-300
                       hover:bg-[#306784]/15 hover:text-[#3D5A40]
                        ${currentPath === "/" ? "bg-[#306784]/15 text-[#3D5A40]" : "text-gray-700"}
                        `}
              >
                <PiMonitorLight className={`text-xl ${!sidebarOpen ? "text-black mt-6" : ""}`} />
                <span className={`transition-all duration-300 whitespace-nowrap ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-o overflow-hidden"}`}>
                  {sidebarOpen && 'Dashboard'}
                </span>
              </Link>
              {/* {sidebarOpen && dashOpen && (
                <ul className='ml-6 mt-2 flex flex-col gap-2 transition-all duration-300'>
                  <li>
                    <Link to="/adminDashDemo" className={`flex items-center gap-3 text-[16px] font-medium p-3 rounded-xl
                        transition-all duration-300
                         hover:bg-[#306784]/15 hover:text-[#3D5A40]
                        ${currentPath === "/superadminDash" ? "bg-[#306784]/15 text-[#3D5A40]" : "text-gray-700"}
                        `}
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                </ul>
              )} */}
            </li>

            <li
              className='relative'
            // onMouseEnter={()=>setOpen(true)}
            // onMouseLeave={()=>setOpen(false)}
            >
              <Link
                to="/restaurantList"
                className={`flex items-center gap-3 text-[16px] font-medium p-3 rounded-xl
                 transition-all duration-300
                 hover:bg-[#306784]/15 hover:text-[#3D5A40]
                 ${currentPath === "/restaurantList" ? "bg-[#306784]/15 text-[#3D5A40]" : "text-gray-700"}
                 `}

              >
                <IoIosRestaurant className={`text-xl ${!sidebarOpen ? "text-black mt-6" : ""}`} />
                <span
                >
                  {sidebarOpen && 'Restaurant Management'}
                </span>
              </Link>
            </li>

            <li>
              <Link
                to="/subscriptionBilling"
                className={`flex items-center gap-3 text-[16px] font-medium p-3 rounded-xl
                        transition-all duration-300 no-underline
                        hover:bg-[#306784]/15 hover:text-[#3D5A40]
                        ${currentPath === "/subscriptionBilling" ? "bg-[#306784]/15 text-[#3D5A40]" : "text-gray-700"}
                        `}

              >
                <FaMoneyBill1Wave className={`text-xl ${!sidebarOpen ? "text-white mt-6" : ""}`} />
                <span className={`transition-all duration-300 whitespace-nowrap no-underline ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-o overflow-hidden"}`}>
                  {sidebarOpen && 'Subscription & Billing'}
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/reportsAnalytics"
                className={`flex items-center gap-3 text-[16px] font-medium p-3 rounded-xl
                        transition-all duration-300
                        hover:bg-[#306784]/15 hover:text-[#3D5A40]
                        ${currentPath === "/superadminDash" ? "bg-[#306784]/15 text-[#3D5A40]" : "text-gray-700"}
                        `}

              >
                {/* <a className="flex items-center gap-2 text-lg"> */}
                  <FaChartBar className={`text-xl ${!sidebarOpen ? "text-white mt-6" : ""}`} />
                  <span className={`transition-all duration-300 whitespace-nowrap ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-o overflow-hidden"}`}>
                    {sidebarOpen && 'Reports & Analytics'}
                  </span>
                {/* </a> */}
              </Link>
            </li>


            <li>
              <Link to="/systemSettings" className={`flex items-center gap-3 text-[16px] font-medium p-3 rounded-xl
                        transition-all duration-300
                        hover:bg-[#306784]/15 hover:text-[#3D5A40]
                        ${currentPath === "/superadminDash" ? "bg-[#306784]/15 text-[#3D5A40]" : "text-gray-700"}
                        `}
              >
                <FaCog className={`text-xl ${!sidebarOpen ? "text-white mt-6" : ""}`} />
                <span className={`transition-all duration-300 whitespace-nowrap ${sidebarOpen ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"}`}>
                  {sidebarOpen && 'System Settings'}
                </span>
              </Link>
            </li>

            <li>
              <button
                className="mt-4 text-white text-center p-2 flex items-center justify-center m-2 rounded-md bg-[#ff5722]"
                onClick={() => {
                  localStorage.removeItem("username");
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");

                handleLogout()
                }}
              >
                {sidebarOpen && 'Log Out'}
              </button>
            </li>

          </ul>
        </aside>
      </div>
    </>

  )
}
export default Sidebar;