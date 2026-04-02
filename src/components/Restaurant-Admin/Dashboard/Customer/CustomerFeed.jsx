import React, { useEffect, useState } from "react";
import axios from "../../../../api/axiosInstance";
import { Eye, Printer, Download } from "lucide-react";
import BASE_URL from "../../../../../config";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';



export default function CustomerFeed() {

    const navigate = useNavigate();
    const [customer, setCustomer] = useState([]);
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


    /* ===== ERP INPUT STYLES ===== */
    const erpInput =
        "h-[42px] w-full px-3 text-sm bg-white border border-gray-300 rounded-md " +
        "placeholder:text-gray-400 focus:outline-none focus:ring-0 " +
        "focus:border-orange-600 focus:shadow-[0_0_0_1px_#fb923c] transition";

    const erpSelect =
        "h-[42px] w-full px-3 text-sm bg-white border border-gray-300 rounded-md " +
        "focus:outline-none focus:ring-0 " +
        "focus:border-orange-600 focus:shadow-[0_0_0_1px_#fb923c] transition";





    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const getCustomer = () => {
        axios.get(`${BASE_URL}customers/`).then((res) => {

            console.log(res.data);
            setCustomer(res.data)


        }).catch((err) => {
            console.log('Customer Feed', err);


        })
    }

    const filteredCustomers = customer.filter((c) => {
        return (
            (nameSearch === "" ||
                c.name?.toLowerCase().includes(nameSearch.toLowerCase())) &&

            (numberSearch === "" ||
                c.phone_number?.includes(numberSearch)) &&

            (loyaltySearch === "" ||
                c.loyalty_points?.toString().includes(loyaltySearch))
        );
    });

  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

      const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;

    const currentCustomers = filteredCustomers.slice(
        indexOfFirstCustomer,
        indexOfLastCustomer
    );

    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [nameSearch, numberSearch, loyaltySearch]);


    useEffect(() => {
        getCustomer()
    }, [])


    return (


        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">


            {/* ===== HEADER ===== */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Customer
                </h2>
                <p className="text-sm text-gray-500">
                    View and manage customer information and activity
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

                    {/* <div className="flex items-center gap-2 "> */}

                    {/* SELECT */}
                    {/* <select
                            className={erpSelect} */}
                    {/* // value={timeDuration}
                        // onChange={(e) => {
                        //     setTimeDuration(e.target.value);

                        // }}
                        > */}
                    {/* <option value="">Time Duration</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="last_7_days">Last 7 Days</option>
                            <option value="last_30_days">Last 30 Days</option>
                            <option value="this_week">This Week</option>
                            <option value="last_week">Last Week</option>
                            <option value="this_month">This Month</option>
                            <option value="last_month">Last Month</option>
                        </select> */}

                    {/* INFO ICON */}
                    {/* <div className="relative">
                            <button
                                onClick={() => setShowInfo(!showInfo)}
                                className="w-5 h-5 flex items-center justify-center text-[10px] rounded-full border border-gray-400 text-gray-500 cursor-pointer"
                            >
                                i
                            </button>

                            {/* TOOLTIP */}
                    {/* {showInfo && (
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
                            )} */}
                    {/* </div> */}
                    {/* </div>  */}

                    <input
                        className={erpInput}
                        placeholder="Name"
                        value={nameSearch}
                        onChange={(e) => setnameSearch(e.target.value)}
                    />

                    <input
                        className={erpInput}
                        placeholder="Number"
                        value={numberSearch}
                        onChange={(e) => setnumberSearch(e.target.value)}
                    />
                    <input
                        className={erpInput}
                        placeholder="Loyalty points"
                        value={loyaltySearch}
                        onChange={(e) => setLoyaltySearch(e.target.value)}
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
                            {/* <select
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
                            </select> */}

                            {/* INFO ICON */}
                            {/* <div className="relative">
                                <button
                                    onClick={() => setShowInfo(!showInfo)}
                                    className="w-5 h-5 flex items-center justify-center text-[10px] rounded-full border border-gray-400 text-gray-500 cursor-pointer"
                                >
                                    i
                                </button> */}

                            {/* TOOLTIP */}
                            {/* {showInfo && (
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
                             </div>*/}
                        </div>


                        <input
                            className="w-full h-[45px] px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"

                            placeholder="Name"
                            value={nameSearch}
                            onChange={(e) => setnameSearch(e.target.value)}
                        />

                        <input
                            className="w-full h-[45px] px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"

                            placeholder="Number"
                            value={numberSearch}
                            onChange={(e) => setnumberSearch(e.target.value)}
                        />
                        <input
                            className="w-full h-[45px] px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"

                            placeholder="Loyalty points"
                            value={loyaltySearch}
                            onChange={(e) => setLoyaltySearch(e.target.value)}
                        />
                    </div>
                )}
            </div>

            {/* ===== TABLE CARD ===== */}
            <div className=" hidden md:block bg-white rounded-xl shadow border overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b text-gray-600">
                        <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3">Number</th>
                            <th className="px-4 py-3">Total Visits</th>
                            <th className="px-4 py-3">Loyalty Points</th>

                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredCustomers.length === 0 || customer.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-6 text-gray-500">
                                  {customer.length === 0 ? "No Customers found" : "No customers match your search" }
                                </td>
                            </tr>
                        ) : (
                                currentCustomers.map((v, i, a) => (



                                    <tr
                                        key={v.order_id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {v.name}


                                        </td>
                                        <td className="px-4 py-3">{v.phone_number} </td>
                                        <td className="px-4 py-3">
                                            {v.total_visits}
                                        </td>
                                        <td className="px-4 py-3">{v.loyalty_points} </td>


                                        <td className="px-4 py-3">
                                            <div className="flex justify-center items-center gap-6" onClick={() => {
                                                navigate(`/customers/${v.id}`)
                                            }}>

                                                {/* VIEW */}
                                                <div className="relative group">
                                                    <Eye
                                                        className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition"
                                                    />
                                                    <span
                                                        className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap"
                                                    >
                                                        View
                                                    </span>
                                                </div>




                                            </div>
                                        </td>
                                    </tr>

                                ))
                            )}
                    </tbody>
                </table>

                {/* pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 mb-2 flex-wrap">

                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                        >
                            Prev
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 py-1 rounded-md text-sm ${currentPage === index + 1
                                    ? "bg-orange-500 text-white"
                                    : "border"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                        >
                            Next
                        </button>

                    </div>
                )}

                {loading && (
                    <div className="p-6 text-center text-gray-500">
                        Loading completed orders...
                    </div>
                )}
            </div>


            {/* ===== MOBILE CARDS ===== */}
            <div className="md:hidden space-y-4">
                {filteredCustomers.length === 0 && (
                    <div className="bg-white p-4 rounded-xl shadow border text-center text-gray-500">
                        No customers Match your search
                    </div>
                )}

                {currentCustomers.map((v, i, a) => (
                    <div
                        key={v.order_id}
                        className="bg-white rounded-2xl shadow border p-4 space-y-3"
                    >
                        {/* Name + Visits */}
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-gray-800 text-base">
                                    {v.name || "—"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Visits: {v.total_visits || 0}
                                </p>
                            </div>

                            {/* Action */}
                            <button
                                onClick={() => navigate(`/customers/${v.id}`)}
                                className="p-2 rounded-lg border hover:bg-gray-50"
                            >
                                <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="border-t"></div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-gray-400 text-xs">Number</p>
                                <p className="font-medium text-gray-700">
                                    {v.phone_number || "—"}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-400 text-xs">Loyalty Points</p>
                                <p className="font-medium text-gray-700">
                                    {v.loyalty_points || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                        >
                            Prev
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 py-1 rounded-md text-sm ${currentPage === index + 1
                                        ? "bg-orange-500 text-white"
                                        : "border"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                        >
                            Next
                        </button>

                    </div>
                )}
                
            </div>


        </div>
    );
}



