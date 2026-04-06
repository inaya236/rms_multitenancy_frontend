import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../Sidebar';
import Navbar from '../../Navbar';
import { SlArrowLeft } from "react-icons/sl";


// tabs
import RestaurantInfo from './Tabs/RestaurantInfo';
import Transaction from './Tabs/Transaction';

import demoLogo from "../../../../assets/rms_logo2.jpg"
import Base_URL from '../../../../../config';
import { GiShop } from "react-icons/gi";
import { IoSettingsOutline } from "react-icons/io5";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";


const Overview = () => {
    const [tab, setTab] = useState("restaurantinfo")
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate()

    const location = useLocation();
    const restaurantName = location.state?.restaurantName;
    const restaurantLogo = location.state?.restaurantLogo;
    const restPhone = location.state?.restPhone;
    const restAddress = location.state?.restAddress
    const theme = location.state?.theme


    const renderTabContent = () => {
        switch (tab) {
            case "restaurantinfo":
                return <RestaurantInfo />;
            case "transaction":
                return <Transaction />
            default:
                <RestaurantInfo />
        }
    }

    const handleTabClick = (tabName) => {
        // navigate(`/viewDetails/${ipd_no}/${tabName}`, {
        //   state: { patientId }
        // });
        setTab(tabName);
    };

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
                    <div className='p-4'>
                        <h1>Overview</h1>
                        <div className="flex items-center gap-2 mt-2 p-2 text-gray-600">
                            <button onClick={() => { navigate("/restaurantList") }} className="flex items-center gap-1 hover:text-black">
                                <SlArrowLeft size={14} />
                                <span>Restaurants</span>
                            </button>

                            <span>/</span>

                            <span className="text-black font-medium">{restaurantName}</span>
                        </div>

                        <div className="mt-2 p-4 flex items-center gap-4">

                            {/* Logo */}
                            <img
                                src={`${Base_URL}${restaurantLogo}`}
                                alt="restaurant"
                                className="w-16 h-16 rounded-lg object-cover border"
                            />

                            <div className="flex flex-col justify-center">

                                <h1 className="text-lg font-semibold text-gray-900">
                                    {restaurantName}
                                </h1>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">

                                    <div className="flex items-center gap-1">
                                        <MdLocationPin className="text-blue-500 text-base" />
                                        <span>{restAddress}</span>
                                    </div>

                                    <span className="text-gray-400">|</span>

                                    <span className="font-medium text-gray-700">
                                        {restPhone}
                                    </span>
                                </div>

                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 overflow-x-auto border-b border-gray-300">
                            <button
                                onClick={() => handleTabClick("restaurantinfo")}
                                className={`whitespace-nowrap px-3 py-2 border-b-2 rounded transition-all duration-300 ${tab === "restaurantinfo"
                                    ? "border-orange-500 text-orange-500 font-medium"
                                    : "border-transparent text-gray-800 hover:text-orange-500"
                                    }`}
                            >
                                <div className='flex items-center gap-2'>
                                    <GiShop size={15} />
                                    Restaurant Info
                                </div>
                            </button>

                            {/* <button
                                onClick={() => handleTabClick("features")}
                                className={`whitespace-nowrap px-3 py-2 border-b-2 rounded transition-all duration-300 ${tab === "features"
                                    ? "border-orange-500 text-orange-500 font-medium"
                                    : "border-transparent text-gray-800 hover:text-orange-500 "
                                    }`}
                            >
                                <div className='flex items-center gap-2'>
                                <IoSettingsOutline />
                                Features
                                </div>
                            </button> */}

                            <button
                                onClick={() => handleTabClick("transaction")}
                                className={`whitespace-nowrap px-3 py-2 border-b-2 rounded transition-all duration-300 ${tab === "transaction"
                                    ? "border-orange-500 text-orange-500 font-medium"
                                    : "border-transparent text-gray-800 hover:text-orange-500"
                                    }`}
                            >
                                <div className='flex items-center gap-2'>
                                    <FaMoneyBillTransfer />
                                    Transaction History
                                </div>
                            </button>
                        </div>

                        {renderTabContent()}

                    </div>
                </div>
            </div>
        </>
    )
}

export default Overview;