import React, { useEffect, useState } from "react";
import axios from "../../../../api/axiosInstance";
import BASE_URL from "../../../../../config";
import { Eye, Printer, Download } from "lucide-react";
import BillReceiptView from "./BillReceiptView";
import jsPDF from "jspdf";
import Select from "react-select";
import { CiCalendar } from "react-icons/ci";
import dayjs from "dayjs";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CompletedOrders() {

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // FRONTEND FILTERS
  const [orderIdSearch, setOrderIdSearch] = useState("");
  const [tableNoSearch, setTableNoSearch] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [orderTypeSearch, setOrderTypeSearch] = useState("");

  // BACKEND DATE FILTERS
  const [timeDuration, setTimeDuration] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  // bill
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showBillDrawer, setShowBillDrawer] = useState(false);
  const [actionType, setActionType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const accessToken=localStorage.getItem("accessToken")


  /* ===== ERP INPUT STYLES ===== */
  const erpInput =
    "h-[42px] w-full px-3 text-sm bg-white border border-gray-300 rounded-md " +
    "placeholder:text-gray-400 focus:outline-none focus:ring-0 " +
    "focus:border-orange-600 focus:shadow-[0_0_0_1px_#fb923c] transition";

  const erpSelect =
    "h-[42px] w-full px-3 text-sm bg-white border border-gray-300 rounded-md " +
    "focus:outline-none focus:ring-0 " +
    "focus:border-orange-600 focus:shadow-[0_0_0_1px_#fb923c] transition";

  /* ===== FETCH ===== */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (timeDuration) params.time_duration = timeDuration;
      if (fromDate || toDate) {
        params.from_date = fromDate;
        params.to_date = toDate;
      }
      if (orderIdSearch) params.order_id = orderIdSearch;
      if (paymentMode) params.payment_mode = paymentMode;
      if (tableNoSearch) params.table_number = tableNoSearch;
      if (orderTypeSearch) params.order_method = orderTypeSearch;

      // params.customer_name,
      // params.min_total,
      // params.max_total

      const res = await axios.get(
        `${BASE_URL}completed-orders/`,
        { params },{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      }
      );
      setOrders(res.data.results || []);
      console.log("orders list", res.data)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [timeDuration, fromDate, toDate, orderIdSearch, paymentMode, tableNoSearch, orderTypeSearch]);


  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total_amount || 0),
    0
  );

   const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // print bill
  const handlePrintBill = () => {
    const bill = document.getElementById("bill-print-area");
    if (!bill) return;

    const printContent = bill.innerHTML;

    const win = window.open("", "", "width=380,height=600");

    win.document.write(`
    <html>
      <head>
        <title>Print Bill</title>
        <style>
          body {
            font-family: "Courier New", monospace;
            padding: 10px;
            width: 280px;
          }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `);

    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  // download bill
  const handleDownloadPDF = (order) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 200], // receipt size
    });

    const num = (v) => Number(v || 0);

    const gstPercent = Number(localStorage.getItem("gst_percent") || 5);

    const items = order.items || order.order_items || [];

    const subtotal = items.reduce(
      (sum, item) => sum + num(item.quantity) * num(item.price),
      0
    );

    const gst = subtotal * (gstPercent / 100);
    const discount = num(order.discount || 0);
    const grandTotal = subtotal + gst - discount;

    let y = 8;

    // header
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    doc.text("ABC CAFE & RESTRO", 40, y, { align: "center" });

    y += 6;
    doc.setFontSize(9);
    doc.setFont("courier", "normal");
    doc.text("Near Mecaps", 40, y, { align: "center" });

    y += 4;
    doc.text("Bhopal - 461020", 40, y, { align: "center" });

    y += 5;
    doc.line(5, y, 75, y);


    y += 5;
    doc.setFontSize(8);

    const dateStr = order.created_at
      ? new Date(order.created_at).toLocaleString("en-IN")
      : "-";

    doc.text(`Date:${dateStr}`, 5, y);
    doc.text(`Table:${order.table_number || "-"}`, 75, y, { align: "right" });

    y += 3;
    doc.text(`Bill No: ${order.order_id || order.id}`, 5, y);
    doc.text(`Cashier: Admin`, 75, y, { align: "right" });
    
    



    y += 4;
    doc.line(5, y, 75, y);

    // table
    y += 5;
    doc.setFont("courier", "bold");
    doc.text("Item", 5, y);
    doc.text("Qty", 45, y, { align: "center" });
    doc.text("Rate", 60, y, { align: "right" });
    doc.text("Amt", 75, y, { align: "right" });

    y += 2;
    doc.line(5, y, 75, y);

    // items
    y += 5;
    doc.setFont("courier", "normal");
    doc.setFontSize(8);

    items.forEach((item) => {
      const name = item.menu_item_name || item.name || "Item";
      const qty = num(item.quantity);
      const rate = num(item.price);
      const amt = qty * rate;

      // wrap long name
      const lines = doc.splitTextToSize(name, 38);

      lines.forEach((line, idx) => {
        doc.text(line, 5, y);

        // only show qty/rate/amt on first line
        if (idx === 0) {
          doc.text(String(qty), 45, y, { align: "center" });
          doc.text(rate.toFixed(2), 60, y, { align: "right" });
          doc.text(amt.toFixed(2), 75, y, { align: "right" });
        }

        y += 4;
      });

      // auto page height limit
      if (y > 185) {
        doc.addPage([80, 200]);
        y = 10;
      }
    });

    y += 1;
    doc.line(5, y, 75, y);

    // totals
    y += 6;
    doc.setFont("courier", "normal");

    doc.text("Sub Total", 5, y);
    doc.text(subtotal.toFixed(2), 75, y, { align: "right" });

    y += 4;
    doc.text(`GST (${gstPercent}%)`, 5, y);
    doc.text(gst.toFixed(2), 75, y, { align: "right" });

    y += 4;
    doc.text("Discount", 5, y);
    doc.text(`-${discount.toFixed(2)}`, 75, y, { align: "right" });

    y += 3;
    doc.line(5, y, 75, y);

    // grand total
    y += 6;
    doc.setFont("courier", "bold");
    doc.setFontSize(10);
    doc.text("GRAND TOTAL", 5, y);
    doc.text(grandTotal.toFixed(2), 75, y, { align: "right" });

    // footer
    y += 8;
    doc.setFont("courier", "normal");
    doc.setFontSize(9);
    doc.text("Thank You! Visit Again :)", 40, y, { align: "center" });

    y += 6;
    doc.setFontSize(8);
    doc.text(
      `Paid via ${(order.payment_method || "-").toUpperCase()}`,
      40,
      y,
      { align: "center" }
    );

    doc.save(`Bill_${order.order_id || order.id}.pdf`);
  };

  const options = [
    {
      value: "",
      label: "Select"
    },
    {
      options: Array.from({ length: 12 }, (_, i) => ({
        value: `TBL-00${i + 1}`,
        label: `TBL-00${(i + 1)}`
      }))
    }
  ];




  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">


      {/* ===== HEADER ===== */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Completed Orders
        </h2>
        <p className="text-sm text-gray-500">
          Review completed orders and manage invoices
        </p>
      </div>

      {/* ===== FILTER CARD ===== */}
      {/* ================= DESKTOP FILTER ================= */}
      <div className="hidden md:block bg-white rounded-xl shadow border p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          <div className="flex items-center gap-2 col-span-1">
            <select
              className={erpSelect}
              value={timeDuration}
              onChange={(e) => {
                setTimeDuration(e.target.value);
                setFromDate("");
                setToDate("");
              }}
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

            <div className="relative">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="w-5 h-5 flex items-center justify-center text-[10px] rounded-full border border-gray-400 text-gray-500"
              >
                i
              </button>

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

          <div className="relative w-full">
            <input
              type="date"
              className={`${erpInput} pr-10`}
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setTimeDuration("");
              }}
            />

            {/* Calendar Icon */}
            <CiCalendar
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              size={18}
            />
          </div>

          <div className="relative w-full">
            <input
              type="date"
              className={`${erpInput} pr-10`}
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setTimeDuration("");
              }}
            />

            {/* Calendar Icon */}
            <CiCalendar
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              size={18}
            />
          </div>

          <select
            className={erpSelect}
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <option value="">Payment</option>
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>

          <input
            className={erpInput}
            placeholder="Order ID"
            value={orderIdSearch}
            onChange={(e) => setOrderIdSearch(e.target.value)}
          />



          <select
            className={erpInput}
            placeholder="Order Type"
            value={orderTypeSearch}
            onChange={(e) => setOrderTypeSearch(e.target.value)}
          >
            <option value="">Order Type</option>
            <option value="dine-in">Dine-in</option>
            <option value="parcel">Parcel</option>
          </select>

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
            <div className="flex items-center gap-2">
              <select
                className="w-full h-[45px] px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
                value={timeDuration}
                onChange={(e) => {
                  setTimeDuration(e.target.value);
                  setFromDate("");
                  setToDate("");
                }}
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

              <button
                onClick={() => setShowInfo(!showInfo)}
                className="w-6 h-6 flex items-center justify-center text-xs rounded-full border border-gray-300 text-gray-500"
              >
                i
              </button>
            </div>

            <div className="relative w-full">
              <input
                type="date"
                className={`${erpInput} pr-10`}
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setTimeDuration("");
                }}
              />

              {/* Calendar Icon */}
              <CiCalendar
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>

            <div className="relative w-full">
              <input
                type="date"
                className={`${erpInput} pr-10`}
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setTimeDuration("");
                }}
              />

              {/* Calendar Icon */}
              <CiCalendar
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>

            <select
              className="w-full h-[45px] px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="">Payment</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>

            <input
              className="w-full h-[45px] px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
              placeholder="Order ID"
              value={orderIdSearch}
              onChange={(e) => setOrderIdSearch(e.target.value)}
            />

            <input
              className="w-full h-[45px] px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500"
              placeholder="Table No"
              value={tableNoSearch}
              onChange={(e) => setTableNoSearch(e.target.value)}
            />
          </div>
        )}
      </div>







      {/* ===== TABLE CARD ===== */}
      {/* ===== DESKTOP TABLE ===== */}
      <div className="hidden md:block bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3">Table</th>
              <th className="px-4 py-3">Order Type</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              currentOrders.map((order) => (
                <tr
                  key={order.order_id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">
                    ORD-{order.order_id}
                  </td>
                  <td className={`px-4 py-3 ${order.table_number ? "" : "text-blue-600"}`}>{order.table_number || "Parcel"}</td>
                  <td className={`px-4 py-3`}>{order.order_method ? order.order_method : "Dine-In"}</td>
                  <td className="px-4 py-3">
                    {/* {new Date(order.created_at).toLocaleString()} */}
                    {order.created_at ? dayjs(order.created_at).format("DD MMM YYYY h:mm A") : "-"}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {order.payment_method}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ₹ {order.total_amount}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center gap-6">
                      <Eye onClick={() => {
                        setSelectedOrder(order);
                        setShowBillDrawer(true);
                      }} className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition" />
                      <Printer onClick={() => {
                        setSelectedOrder(order);
                        setTimeout(() => handlePrintBill(), 200);
                      }} className="w-5 h-5 text-orange-500 cursor-pointer hover:text-orange-600 transition" />
                      <Download onClick={() => handleDownloadPDF(order)} className="w-5 h-5 text-green-600 cursor-pointer hover:text-green-700 transition" />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>

          <tfoot className="bg-gray-100 border-t">
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-800">
                Total
              </td>

              <td className="px-4 py-3 text-gray-700">
                {totalOrders} Orders
              </td>

              <td className="px-4 py-3"></td>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3"></td>

              <td className="px-4 py-3 font-bold text-gray-900">
                ₹ {totalRevenue.toFixed(2)}
              </td>

              <td className="px-4 py-3 text-center text-gray-500 text-xs"></td>
              <td className="px-4 py-3 text-center text-gray-500 text-xs"></td>
            </tr>
          </tfoot>
        </table>

          {/* Pagination */}
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

      {/* mobile view */}

      {/* ===== MOBILE CARDS ===== */}
      <div className="md:hidden space-y-4">
        {!loading &&
          currentOrders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-xl shadow border p-2.5"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-sm text-gray-800">
                    ORD-{order.order_id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {order.table_number}
                  </p>
                </div>
                <div className="font-semibold text-sm text-gray-800">
                  ₹ {order.total_amount}
                </div>
              </div>

              {/* Date */}
              <div className="text-[11px] text-gray-500 mt-1">
                {new Date(order.created_at).toLocaleString()}
              </div>

              {/* Payment */}
              <div className="text-xs mt-1 capitalize text-gray-700">
                {order.payment_method}
              </div>

              {/* Actions */}
              <div className="flex justify-around mt-4 pt-3 border-t">
                <button onClick={() => {
                  setSelectedOrder(order);
                  setShowBillDrawer(true);
                }} className="flex items-center gap-1 text-gray-600 text-sm">
                  <Eye className="w-3 h-3" />
                  View
                </button>

                <button onClick={() => {
                  setSelectedOrder(order);
                  setTimeout(() => handlePrintBill(), 200);
                }} className="flex items-center gap-1 text-orange-500 text-sm">
                  <Printer className="w-3 h-3" />
                  Print
                </button>

                <button onClick={() => handleDownloadPDF(order)} className="flex items-center gap-1 text-green-600 text-sm">
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            </div>
          ))}

        {/* Mobile Total Section */}
        <div className="bg-gray-100 rounded-xl p-4 flex justify-between text-sm font-medium">
          <span>Total Orders: {totalOrders}</span>
          <span>₹ {totalRevenue.toFixed(2)}</span>
        </div>

           {/* Pagination */}
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

      {/* bill preview */}
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

      {/* bill for print/pdf */}
      <div className="fixed left-[-9999px] top-0">
        {selectedOrder && (
          <div id="bill-print-area">
            <BillReceiptView order={selectedOrder} />
          </div>
        )}
      </div>


    </div>
  );
}
