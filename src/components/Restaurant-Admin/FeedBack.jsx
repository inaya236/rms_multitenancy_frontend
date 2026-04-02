import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { Eye, Printer, Download } from "lucide-react";
import BASE_URL from "../../../config";
import 'bootstrap/dist/css/bootstrap.min.css';



export default function CustomerFeed() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // FRONTEND FILTERS
    const [numberSearch, setnumberSearch] = useState("");
    const [nameSearch, setnameSearch] = useState("");
    const [loyaltySearch, setLoyaltySearch] = useState("");
    const [paymentMode, setPaymentMode] = useState("");

    // BACKEND DATE FILTERS
    const [timeDuration, setTimeDuration] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [showInfo, setShowInfo] = useState(false);

    const [showMobileFilters, setShowMobileFilters] = useState(false);



    /* ===== ERP INPUT STYLES ===== */
    const erpInput =
        "h-[42px] w-full px-3 text-sm bg-white border border-gray-300 rounded-md " +
        "placeholder:text-gray-400 focus:outline-none focus:ring-0 " +
        "focus:border-orange-600 focus:shadow-[0_0_0_1px_#fb923c] transition";

    const erpSelect =
        "h-[42px] w-full px-3 text-sm bg-white border border-gray-300 rounded-md " +
        "focus:outline-none focus:ring-0 " +
        "focus:border-orange-600 focus:shadow-[0_0_0_1px_#fb923c] transition";




    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">


            {/* ===== HEADER ===== */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    FeedBack
                </h2>
                <p className="text-sm text-gray-500">
                    Monitor and view feedback from customers
                </p>
            </div>

            {/* ===== FILTER CARD ===== */}
            <div className=" hidden md:block bg-white rounded-xl shadow border p-4 mb-6">
                <div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-6
  gap-4
">

                    <div className="flex items-center gap-2 col-span-1">

                        {/* SELECT */}
                        <select
                            className={erpSelect}
                        // value={timeDuration}
                        // onChange={(e) => {
                        //     setTimeDuration(e.target.value);

                        // }}
                        >
                            <option value="">Time Duration</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="last_7_days">Last 7 Days</option>
                            <option value="last_30_days">Last 30 Days</option>
                            <option value="this_week">This Week</option>
                            <option value="last_week">Last Week</option>
                            <option value="this_month">This Month</option>
                            <option value="last_month">Last Month</option>
                        </select>

                        {/* INFO ICON */}
                        <div className="relative">
                            <button
                                onClick={() => setShowInfo(!showInfo)}
                                className="w-5 h-5 flex items-center justify-center text-[10px] rounded-full border border-gray-400 text-gray-500 cursor-pointer"
                            >
                                i
                            </button>

                            {/* TOOLTIP */}
                            {showInfo && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-6 z-50 w-64 bg-gray-800 text-white text-xs rounded-lg p-3">
                                    <ul className="space-y-2">
                                        <li><b>Today:</b> Today 00:00 → now</li>
                                        <li><b>Yesterday:</b> Previous day</li>
                                        <li><b>Last 7 Days:</b> Today − 7 days</li>
                                        <li><b>Last 30 Days:</b> Today − 30 days</li>
                                        <li><b>This Week:</b> Monday → today</li>
                                        <li><b>Last Week:</b> Previous week</li>
                                        <li><b>This Month:</b> 1st → today</li>
                                        <li><b>Last Month:</b> Previous month</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>





                    <input
                        className={erpInput}
                        placeholder="Customer Name"
                    // value={nameSearch}
                    // onChange={(e) => setnameSearch(e.target.value)}
                    />

                    <input
                        className={erpInput}
                        placeholder="Mobile Number"
                    // value={numberSearch}
                    // onChange={(e) => setnumberSearch(e.target.value)}
                    />
                    <input
                        className={erpInput}
                        placeholder="Message"
                    // value={loyaltySearch}
                    // onChange={(e) => setLoyaltySearch(e.target.value)}
                    />

                </div>
            </div>

            {/* ================= MOBILE COLLAPSIBLE FILTER ================= */}
            <div className="md:hidden mb-6">

                {/* Toggle Button */}
                <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="w-full bg-white rounded-xl shadow border p-2.5 flex justify-between items-center"
                >
                    <span className="font-xs text-gray-700">Filters</span>

                    <span
                        className={`transition-transform duration-300 ${showMobileFilters ? "rotate-90" : ""
                            }`}
                    >
                        ›
                    </span>
                </button>

                {/* Expanded Filter Content */}
                {showMobileFilters && (
                    <div className="mt-4 bg-white rounded-2xl shadow border p-5 space-y-4">

                        {/* Time Duration */}

                        <div className="flex items-center gap-2 col-span-1">

                            {/* SELECT */}
                            <select
                                className={erpSelect}
                            // value={timeDuration}
                            // onChange={(e) => {
                            //     setTimeDuration(e.target.value);

                            // }}
                            >
                                <option value="">Time Duration</option>
                                <option value="today">Today</option>
                                <option value="yesterday">Yesterday</option>
                                <option value="last_7_days">Last 7 Days</option>
                                <option value="last_30_days">Last 30 Days</option>
                                <option value="this_week">This Week</option>
                                <option value="last_week">Last Week</option>
                                <option value="this_month">This Month</option>
                                <option value="last_month">Last Month</option>
                            </select>

                            {/* INFO ICON */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowInfo(!showInfo)}
                                    className="w-5 h-5 flex items-center justify-center text-[10px] rounded-full border border-gray-400 text-gray-500 cursor-pointer"
                                >
                                    i
                                </button>

                                {/* TOOLTIP */}
                                {showInfo && (
                                    <div className="absolute left-1/2 -translate-x-1/2 top-6 z-50 w-64 bg-gray-800 text-white text-xs rounded-lg p-3">
                                        <ul className="space-y-2">
                                            <li><b>Today:</b> Today 00:00 → now</li>
                                            <li><b>Yesterday:</b> Previous day</li>
                                            <li><b>Last 7 Days:</b> Today − 7 days</li>
                                            <li><b>Last 30 Days:</b> Today − 30 days</li>
                                            <li><b>This Week:</b> Monday → today</li>
                                            <li><b>Last Week:</b> Previous week</li>
                                            <li><b>This Month:</b> 1st → today</li>
                                            <li><b>Last Month:</b> Previous month</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>


                        <input
                            className="w-full h-[45px] px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"

                            placeholder="Customer Name"
                        // value={nameSearch}
                        // onChange={(e) => setnameSearch(e.target.value)}
                        />

                        <input
                            className="w-full h-[45px] px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"

                            placeholder="Phone Number"
                        // value={numberSearch}
                        // onChange={(e) => setnumberSearch(e.target.value)}
                        />
                        <input
                            className="w-full h-[45px] px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"

                            placeholder="Message"
                        // value={loyaltySearch}
                        // onChange={(e) => setLoyaltySearch(e.target.value)}
                        />
                    </div>
                )}
            </div>


            {/* ===== TABLE CARD ===== */}
            <div className="bg-white rounded-xl shadow border overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b text-gray-600">
                        <tr>
                            <th className="px-4 py-3 text-left">Customer Name</th>
                            <th className="px-4 py-3">Mobile Number</th>
                            <th className="px-4 py-3">Feedback Message</th>
                            <th className="px-4 py-3">Rating</th>

                            <th className="px-4 py-3 text-center">Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr
                            // key={order.order_id}
                            className="border-b hover:bg-gray-50 transition"
                        >
                            <td className="px-4 py-3 font-medium">

                            </td>
                            <td className="px-4 py-3"></td>
                            <td className="px-4 py-3">

                            </td>
                            <td className="px-4 py-3"></td>


                            <td className="px-4 py-3">

                            </td>
                        </tr>

                    </tbody>
                </table>
                {loading && (
                    <div className="p-6 text-center text-gray-500">
                        Loading completed orders...
                    </div>
                )}
            </div>
        </div>
    );
}



