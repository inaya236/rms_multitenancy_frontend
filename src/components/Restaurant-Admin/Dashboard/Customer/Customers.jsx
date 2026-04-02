import React, { useEffect, useState } from "react";
import { IoIosPerson } from "react-icons/io";

import { CiPhone } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import BASE_URL from "../../../../../config";
import BillReceiptView from "../CompletedOrdersview/BillReceiptView";
import axios from "../../../../api/axiosInstance";
import 'bootstrap/dist/css/bootstrap.min.css';


const Customers = () => {
    const [orderHistory, setOrderHistory] = useState(true)
    const { id } = useParams()
    const [feedbackHistory, setFeedbackHistory] = useState(false)
    const [showBillDrawer, setShowBillDrawer] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null);


    const [customer, setCustomer] = useState(null)
    const [orders, setOrders] = useState([])


    // useEffect(() => {
    //     if (id) {
    //         fetch(`${BASE_URL}customers/`)
    //             .then(res => res.json())
    //             .then(data => {
    //                 const singleCustomer = data.find(
    //                     (c) => c.id === parseInt(id)
    //                 );
    //                 setCustomer(singleCustomer);
    //             })
    //             .catch(err => console.error(err));
    //     }
    // }, [id]);

    useEffect(() => {
        if (id) {
            fetch(`${BASE_URL}customers/${id}/`)
                .then(res => res.json())
                .then(data => {
                    setCustomer(data);
                })
                .catch(err => console.error("Customer fetch error:", err));
        }
    }, [id]);

    const fetchOrders = () => {
        axios.get(`${BASE_URL}completed-orders/`).then((res) => {
            console.log(res.data.results);
            setOrders(res.data.results || []);


        }).catch((err) => {
            console.log(err);

        })
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
        (sum, order) => sum + Number(order.total_amount || 0),
        0
    );

    if (!customer) {
        return <div className="p-10 text-center">Loading...</div>;
    }
    return (
        <div className="min-h-screen w-full bg-gray-50 flex justify-center items-start p-4 sm:p-6">


            <div className="w-full  max-w-8xl bg-white rounded-xl shadow-md border p-6">


                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">


                    <div className="flex items-center gap-5">


                        <div className="bg-gray-400 h-14 w-14 rounded-full flex items-center justify-center text-white text-5xl md:text-6xl md:h-24 md:w-24">
                            <IoIosPerson />
                        </div>


                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {customer?.name || "Loading..."}
                            </h2>
                            <p className="text-gray-500  text-sm flex gap-2"> <CiPhone size={22} /> {customer?.phone_number || "-"}
                            </p>
                            <p className="text-gray-500 text-sm flex gap-2">
                                <TfiEmail size={17} />{customer?.email || "-"}

                            </p>
                        </div>
                    </div>

                    {/* BOXES */}
                    {orderHistory && (


                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full lg:w-auto lg:ml-auto">

                            <div className="bg-gray-100 p-4 rounded-xl text-center">
                                <p className="text-sm text-gray-500">Total Visits</p>
                                <p className="text-xl font-semibold text-gray-800"> {customer?.total_visits || "0"}
                                </p>
                            </div>

                            <div className="bg-gray-100 p-4 rounded-xl text-center">
                                <p className="text-sm text-gray-500">Total Orders</p>
                                {customer?.orders?.length || "0"}
                                <p className="text-xl font-semibold text-gray-800"></p>
                            </div>

                            {/* <div className="bg-gray-100 p-4 rounded-xl text-center">
                            <p className="text-sm text-gray-500">Total Spent</p>
                            <p className="text-xl font-semibold text-green-600">_</p>
                        </div> */}

                            <div className="bg-gray-100 p-4 rounded-xl text-center">
                                <p className="text-sm text-gray-500">Loyalty Points</p>
                                <p className="text-xl font-semibold text-orange-600"> {customer?.loyalty_points || "0"}
                                </p>
                            </div>

                        </div>
                    )}
                </div>

                <div className="border-t my-6"></div>

                {/* ORDER HISTORY */}
                <div className=" mb-4">
                    <div className="flex gap-8 border-b border-gray-300">

                        <h3
                            className={`relative pb-3 text-lg font-semibold cursor-pointer transition ${orderHistory
                                ? "text-yellow-700"
                                : "text-gray-600 hover:text-yellow-700"
                                }`}
                            onClick={() => {
                                setOrderHistory(true);
                                setFeedbackHistory(false);
                            }}
                        >
                            Order History
                            {orderHistory && (
                                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-yellow-700"></span>
                            )}
                        </h3>

                        <h3
                            className={`relative pb-3 text-lg font-semibold cursor-pointer transition ${feedbackHistory
                                ? "text-yellow-700"
                                : "text-gray-600 hover:text-yellow-700"
                                }`}
                            onClick={() => {
                                setFeedbackHistory(true);
                                setOrderHistory(false);
                            }}
                        >
                            Feedback History
                            {feedbackHistory && (
                                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-yellow-700"></span>
                            )}
                        </h3>

                    </div>


                    <div className="mt-3">
                        <div className="hidden md:block  mt-3">
                            {orderHistory ? (
                                <table className="w-full text-sm border">



                                    <thead className="bg-gray-100 text-gray-600">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Order ID</th>
                                            <th className="px-4 py-3 text-left">Table</th>
                                            <th className="px-4 py-3 text-left">Order type</th>


                                            <th className="px-4 py-3 text-left">Date</th>
                                            <th className="px-4 py-3 text-left">Payment</th>


                                            <th className="px-4 py-3 text-left">Total Amount</th>
                                            <th className="px-4 py-3 text-left">View Bill</th>


                                        </tr>
                                    </thead>

                                    <tbody>
                                        {customer.orders?.map((order) => (
                                            <tr key={order.id} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-3">#{order.id}</td>
                                                <td className="px-4 py-3">{order.table}</td>
                                                <td className="px-4 py-3">{order.order_method}</td>


                                                <td className="px-4 py-3">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">{order.billing?.payment_method}</td>

                                                <td className="px-4 py-3">
                                                    ₹{order.billing?.total_amount}
                                                </td>
                                                <td className="px-4 py-3 text-orange-600" onClick={() => {
                                                    const fullOrder = orders.find(
                                                        (o) => o.order_id === order.id
                                                    );

                                                    setSelectedOrder(fullOrder);
                                                    setShowBillDrawer(true);
                                                }}><FaRegMoneyBillAlt size={20} /></td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <>
                                    <table className="w-full text-sm border">



                                        <thead className="bg-gray-100 text-gray-600">
                                            <tr>
                                                {/* <th className="px-4 py-3 text-left">Order ID</th> */}
                                                <th className="px-4 py-3 text-left">Date</th>
                                                <th className="px-4 py-3 text-left">Feedback</th>


                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr className="border-t hover:bg-gray-50">
                                                {/* <td className="px-4 py-3">#00327</td> */}
                                                <td className="px-4 py-3">15/6/25</td>
                                                <td className="px-4 py-3">
                                                    <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs sm:max-w-md md:max-w-lg break-words text-sm text-gray-700">
                                                        Food was delicious. Enjoyed the view.
                                                    </div>
                                                </td>


                                            </tr>


                                        </tbody>
                                    </table>
                                </>
                            )
                            }
                        </div>

                        {/* ===== MOBILE VIEW ===== */}
                        <div className="md:hidden mt-4 space-y-4">

                            {orderHistory ? (
                                <>
                                    {/* Order Cards */}
                                    {customer.orders?.map((order) => (
                                        <div
                                            key={order.id}
                                            className="bg-white border rounded-2xl p-4 shadow-sm"
                                        >

                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-gray-800">
                                                    Order #{order.id}
                                                </p>
                                                <p className="text-green-600 font-medium">
                                                    ₹{order.billing?.total_amount}
                                                </p>
                                                {/* <p className="text-gray-600 font-medium">
                                                    bill
                                                </p> */}
                                            </div>

                                            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <p className="text-gray-400">Table</p>
                                                    <p>{order.table}</p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-400">Type</p>
                                                    <p>{order.order_method}</p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-400">Date</p>
                                                    <p>
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-gray-400">Payment</p>
                                                    <p>{order.billing?.payment_method || "—"}</p>
                                                </div>
                                            </div>


                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(orders);
                                                        setShowBillDrawer(true);
                                                    }}

                                                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                                                >
                                                    <FaRegMoneyBillAlt size={18} />
                                                    Bill
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {/* Feedback Cards */}
                                    <div className="bg-white border rounded-xl p-4 shadow-sm">
                                        <p className="text-sm text-gray-400">Date</p>
                                        <p className="font-medium mb-2">15/6/25</p>

                                        <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700">
                                            Food was delicious. Enjoyed the view.
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                </div>


                {showBillDrawer && selectedOrder && (
                    <div
                        className="fixed inset-0 z-[9999] bg-black/40 flex justify-center items-center"
                        onClick={() => setShowBillDrawer(false)}
                    >
                        <div
                            className="w-[400px] h-[600px] bg-white shadow-xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <div className="p-4 border-b flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Bill Preview
                                    </h2>
                                    <p className="text-xs text-gray-500">
                                        ORD-{selectedOrder.order_id} | Table {selectedOrder.table_number}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowBillDrawer(false)}
                                    className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* body */}
                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                <div className="flex justify-center">
                                    <BillReceiptView order={selectedOrder} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Customers;