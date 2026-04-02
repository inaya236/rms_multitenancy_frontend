import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function BillReceiptView({ order }) {
  const num = (v) => Number(v || 0);

  const gstPercent = Number(localStorage.getItem("gst_percent") || 5);

  const subtotal = (order.items || []).reduce(
    (sum, item) => sum + num(item.quantity) * num(item.price),
    0
  );

  const gst = subtotal * (gstPercent / 100);

  const discount = num(order.discount || 0);

  const grandTotal = subtotal + gst - discount;

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

  return (
    <div
      className="bg-white p-4 text-sm rounded-lg w-[320px] shadow border"
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
      {/* 
      <div className="flex justify-between text-xs">
        <span>Date: {formatDateTime(order.created_at)}</span>
        <span>Table: {order.table_number}</span>
      </div>

      <div className="flex justify-between text-xs">
        <span>Bill No: {order.order_id}</span>
        <span>Cashier: Admin</span>
        <span>Customer: {order.customer}</span>

      </div> */}
      <div className="mt-2 grid grid-cols-2 gap-y-1 text-xs">
        <span>Date: {formatDateTime(order.created_at)}</span>
        <span className="text-right">Table: {order.table_number}</span>

        <span>Bill No: {order.order_id}</span>
        <span className="text-right">Cashier: Admin</span>

        <span className="col-span-2">
          Customer: {order.customer}
        </span>
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
          {(order.items || []).map((item, i) => {
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
          <span>-₹{discount.toFixed(2)}</span>
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

      <div className="mt-2 text-[11px] text-gray-600 flex justify-between border-t pt-2">
        <span>Paid via {order.payment_method?.toUpperCase()}</span>
        {/* <span>Total: ₹{num(order.total_amount || grandTotal).toFixed(2)}</span> */}
        <span>Total: ₹{grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
