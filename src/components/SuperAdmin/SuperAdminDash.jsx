import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { FaHospital, FaHeartbeat, FaRegClock, FaRupeeSign, FaChartLine } from 'react-icons/fa';
import { IoRestaurant } from "react-icons/io5";
import backgroundimg from '../../assets/backgroundimg.png';
import Card from './Card';


const SuperAdminDash = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const cards = [
    { title: "Total Restaurants", icon: <IoRestaurant className="text-[#ff5722] text-4xl" />, count: 42, color: "bg-[#ff5722]" },

    { title: "Active Restaurants", icon: <FaHeartbeat className="text-[#2e7d32] text-4xl" />, count: 38, color: "bg-[#2e7d32]" },

    { title: "Subscriptions Expiring Soon", icon: <FaRegClock className="text-[#f9a825] text-4xl" />, count: 24, color: "bg-[#f9a825]" },

    { title: "Total Revenue", icon: <FaRupeeSign className="text-[#6D1F2A] text-4xl" />, count: "₹1.2L", color: "bg-[#6D1F2A]" },

    { title: "System Usage", icon: <FaChartLine className="text-[#3D5A40] text-4xl" />, count: "1.2k", color: "bg-[#3D5A40]" }
  ];


  return (
    <>
      <div className="flex min-h-screen bg-[#FBF7F2] text-black">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} />
        {/* main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
          {/* Navbar */}
          <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* page content */}

          <div className='relative mt-12  min-h-screen'>
            {/* <img src={backgroundimg} alt="image" className='absolute w-full min-h-screen object-cover z-0' /> */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cards.map((card, i) => (
                <Card
                  key={i}
                  title={card.title}
                  value={card.count}
                  icon={card.icon}
                  color={card.color}
                />
              ))}
            </div>

            {/* charts and graphs */}

          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDash