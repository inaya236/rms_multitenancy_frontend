import React, { useState } from "react";
import { LuBadgePercent } from "react-icons/lu";
import { GrConfigure } from "react-icons/gr";
import 'bootstrap/dist/css/bootstrap.min.css';
import Base_URL from "../../../config";

import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaPlusCircle,
  FaShoppingCart,
  FaFileInvoiceDollar,
  FaUsers,
  FaChartLine,
  FaUtensils,
  FaUserTie,
  FaChair

} from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";
import { RiDiscountPercentLine } from "react-icons/ri";
import logo from '../../assets/rms_logo2.jpg'
import { useRestaurant } from "../../context/RestaurantContext";



const Sidebar = ({ isOpen, closeSidebar, setOpenGstModal }) => {
  // const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  const [openConfig, setOpenConfig] = useState(false);

  const { restaurant } = useRestaurant();

const features = restaurant?.subscription?.features || [];
const restaurantName = restaurant?.name;
const restaurantLogo = restaurant?.logo;
console.log("logo value:", restaurantLogo);

  // const features = JSON.parse(localStorage.getItem("features")) || [];
  // const restaurantName=localStorage.getItem("name")
  // const restaurantLogo=localStorage.getItem("logo")


  return (
    <>

      {/* <MyNavbar toggleSidebar={toggleSidebar} /> */}

      <div className={`sidebar ${isOpen ? "open" : "closed"}  flex flex-col`}
        style={{
          backgroundColor: "white",
          // overflowY: "auto",
          // height: "100vh",

        }}
      >
        <div className="flex-1 overflow-y-auto ">
          <div className={`sidebar-content ${isOpen ? "show" : "hide"} p-4`}>
            <div className="flex gap-3 mb-4">

              <img src={restaurantLogo ? `https://xqlhcldq-8000.inc1.devtunnels.ms${restaurantLogo}` : logo} alt="Food" className="h-[60px] w-[60px]"></img>
              <h4 className="font-semibold text-xl flex items-center justify-center">{restaurantName || "Restaurant Dashboard"}</h4>
            </div>


            <ul className="flex flex-col gap-2">
              <li className="">
                <Link to="/adminDash" className="sidebar-link" onClick={closeSidebar}>
                  <FaTachometerAlt className="me-2" /> Dashboard
                </Link>
              </li>

              <li className="">
                <Link to="/new-order" className="sidebar-link" onClick={closeSidebar}>
                  <FaPlusCircle className="me-2" /> New Order
                </Link>
              </li>

              <li className="">
                <Link to="/orders/active" className="sidebar-link " onClick={closeSidebar}>
                  <span className="w-5 min-w-[20px] flex justify-center">
                  <FaShoppingCart className="me-2" /> 
                  </span>
                  Active Orders
                </Link>
              </li>

                <li className="">
                  <Link to="/completedorders" className="sidebar-link" onClick={closeSidebar}>
                  <span className="w-5 min-w-[20px] flex justify-center">
                    <FaFileInvoiceDollar className="" /> 
                    </span>
                    Completed Orders
                  </Link>
                </li>

              {/* <li className="nav-item mb-2">
                <Link to="#" className="sidebar-link" onClick={closeSidebar}>
                  <FaChartLine className="me-2" /> Sales Report
                </Link>
              </li> */}

              <li className="">
                <Link to="human-resources" className="sidebar-link" onClick={closeSidebar}>
                <span className="w-5 min-w-[20px] flex justify-center">
                  <FaUserTie className="" /> 
                  </span>
                  Human Resource
                </Link>
              </li>


              {features.includes("CUSTOMER_INSIGHTS") && (
                <li className="">
                  <Link to="/customerFeed" className="sidebar-link" onClick={closeSidebar}>
                    <FaUsers className="me-2" /> Customers
                  </Link>
                </li>
              )}

              {features.includes("FEEDBACK") && (
              <li className="">
                <Link to="feedback" className="sidebar-link" onClick={closeSidebar}>
                  <VscFeedback className="me-2" size={20} /> FeedBack
                </Link>
              </li>
              )}

              <li className="nav-item relative">
                <button
                  onClick={() => setOpenConfig(!openConfig)}
                  className="sidebar-link w-full text-left flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <GrConfigure className="me-2" size={20} />
                    Configuration
                  </span>
                </button>
                {openConfig && (
                  <ul className="mr-6 mt-1 flex flex-col gap-1">

                    {features.includes("TABLES") && (
                      <li className="">
                        <Link to="/inventory/tables" className="sidebar-link" onClick={closeSidebar}>
                  <span className="w-5 min-w-[20px] flex justify-center">
                          <FaChair className="" /> 
                          </span>
                          Table Inventory
                        </Link>
                      </li>
                    )}

                      <li className="">
                        <Link to="menu-management" className="sidebar-link" onClick={closeSidebar}>
                  <span className="w-5 min-w-[20px] flex justify-center">
                          <FaUtensils className="me-2" />
                          </span>
                           Menu Management
                        </Link>
                      </li>

                    <li>
                      <button
                        onClick={() => setOpenGstModal(true)}
                        className="sidebar-link"
                      >
                        <div className="flex items-center">
                          <RiDiscountPercentLine className="me-2" /> GST Settings
                        </div>
                      </button>

                    </li>

                  </ul>
                )}
              </li>


            </ul>

            <button
              onClick={handleLogout}
              className="mt-4 w-full text-white py-2 rounded-md"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              Log Out
            </button>


          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
