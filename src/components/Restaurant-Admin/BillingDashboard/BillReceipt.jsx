import React, { useState, useRef, useEffect } from "react";
import axios from "../../../api/axiosInstance";
import jsPDF from "jspdf";
import BASE_URL from "../../../../config";
import { toast, ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';

const BillReceipt = ({ order, onClose, onPaymentSuccess }) => {
  const [discount, setDiscount] = useState(0);
  const printRef = useRef();

  const num = (v) => Number(v || 0);

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accessToken = localStorage.getItem("accessToken")

  /* ---------- CALCULATIONS ---------- */
  const subtotal = order.order_items.reduce(
    (sum, item) => sum + num(item.quantity) * num(item.price),
    0
  );

  const gstPercent = Number(localStorage.getItem("gst_percent") || 5);
  const gst = subtotal * (gstPercent / 100);

  const grandTotal = subtotal + gst - num(discount);

  /* ---------- DATE FORMAT ---------- */
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* ---------- PRINT ---------- */
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
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
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }
            th, td {
              padding: 2px 0;
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

  /* ---------- PDF ---------- */
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 200],
    });

    doc.html(printRef.current, {
      x: 5,
      y: 5,
      width: 70,
      callback: function (doc) {
        doc.save(`Bill_${order.id}.pdf`);
      },
    });
  };

  /* ---------- PRINT ONLY ---------- */
  const finalizeBill = () => {
    try {
      if (subtotal !== 0) {
        handlePrint();
        generatePDF();
      } else {
        toast.warn("Print failed, Order must contain at least one item")
      }
    } catch (error) {
      console.error(error);
      toast.error("Print failed");
    }
  };




  /* ---------- CONFIRM PAYMENT ---------- */
  const confirmPayment = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (num(discount) > subtotal + gst) {
      toast.dismiss()
      toast.error("Discount cannot exceed total bill amount");
      setIsSubmitting(false);
      return;
    }

    if (subtotal === 0) {
      toast.warn("Order must contain at least one item")
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}billing/`,
        {
          order: order.id,
          discount: num(discount),
          subtotal: subtotal.toFixed(2),
          total_amount: grandTotal.toFixed(2),
          tax: 0,
          payment_method: paymentMethod,
        }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
      );
      console.log("payment post res", res.data)
      toast.success(`Payment completed via ${paymentMethod.toUpperCase()}`);
      onPaymentSuccess(order.id)
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
    }
  };


  return (
    <>
      <ToastContainer autoClose={2000} position={"top-right"} />
      <div className="w-full flex flex-col items-center">

        {/* ================= RECEIPT ================= */}
        <div
          ref={printRef}
          className="bg-white p-4 text-sm rounded-lg w-[320px]"
          style={{ fontFamily: "Courier New, monospace" }}
        >
          <h2 className="text-center text-lg font-semibold">
            ABC CAFE & RESTRO
          </h2>

          <p className="text-center text-xs text-gray-600">
            Near Mecaps <br />
            Bhopal - 461020
          </p>

          <hr className="my-2" />

          <div className="flex justify-between text-xs">
            <span>Date: {formatDateTime(order.created_at)}</span>
            <span>Table: {order.table_number}</span>
          </div>

          <div className="flex justify-between text-xs">
            <span>Bill No: {order.id}</span>
            <span>Cashier: Admin</span>
          </div>

          <hr className="my-2" />

          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th align="left">Item</th>
                <th align="center">Qty</th>
                <th align="right">Rate</th>
                <th align="right">Amt</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item, i) => {
                const qty = num(item.quantity);
                const rate = num(item.price);
                const amt = qty * rate;

                return (
                  <tr key={i}>
                    <td>{item.menu_item_name}</td>
                    <td align="center">{qty}</td>
                    <td align="right">₹{rate.toFixed(2)}</td>
                    <td align="right">₹{amt.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <hr className="my-2" />

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST ({gstPercent}%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-₹{num(discount).toFixed(2)}</span>
            </div>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-semibold">
            <span>GRAND TOTAL</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>

          <p className="text-center text-xs mt-2">
            Thank You! Visit Again 😊
          </p>

          {/* PRINT */}
          <div className="flex justify-center mt-3">
            <button
              onClick={finalizeBill}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm"
            >
              🖨 Print
            </button>
          </div>
        </div>

        {/* PAYMENT SECTION */}
        <div className="w-[320px] mt-2 pt-2 border-t">

          {/* DISCOUNT */}
          <label className="block text-xs font-medium mb-1">
            Discount Amount (₹)
          </label>
          <input
            type="number"
            value={discount}
            min="0"
            max={(subtotal + gst).toFixed(2)}
            onChange={(e) => {
              let value = e.target.value;

              const maxDiscount = subtotal + gst;

              if (value === "") {
                setDiscount("");
                return;
              }

              let numValue = Number(value);

              if (numValue < 0) numValue = 0;

              if (numValue > maxDiscount) {
                toast.warning("Discount cannot exceed total bill amount");
                numValue = maxDiscount;
              }

              setDiscount(numValue);
            }}
            onWheel={(e) => e.target.blur()}
            className="w-full no-spinner border rounded-md px-2 py-1.5 text-sm mb-2 bg-white"
          />

          {/* PAYMENT METHOD */}
          <p className="text-xs font-medium mb-2">Payment Method</p>

          <div className="flex gap-3 mb-3">
            {/* CASH */}
            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={`flex-1 border rounded-lg py-2 text-xs font-medium flex items-center justify-center gap-1
      ${paymentMethod === "cash"
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-300 text-gray-600"}
    `}
            >
              💵 Cash
            </button>

            {/* UPI */}
            <button
              type="button"
              onClick={() => setPaymentMethod("upi")}
              className={`flex-1 border rounded-lg py-2 text-xs font-medium flex items-center justify-center gap-1
      ${paymentMethod === "upi"
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-300 text-gray-600"}
    `}
            >
              📱 UPI
            </button>

            {/* CARD */}
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`flex-1 border rounded-lg py-2 text-xs font-medium flex items-center justify-center gap-1
      ${paymentMethod === "card"
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-300 text-gray-600"}
    `}
            >
              💳 Card
            </button>
          </div>


          {/* PAY BUTTON */}
          <div className="flex justify-center mt-3">
            <button
              onClick={confirmPayment}
              disabled={isSubmitting}
              className={`${isSubmitting ? "bg-gray-100 cursor-not-allowed text-black" : "bg-orange-600 hover:bg-orange-700"} text-white
               px-6 py-2 min-w-[180px]
               rounded-lg font-semibold text-sm
               shadow-md active:scale-95 transition mb-2`}
            >
              Pay ₹ {grandTotal.toFixed(2)}
            </button>
          </div>

        </div>

      </div>
    </>
  );

};

export default BillReceipt;
