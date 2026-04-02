import React, { useState } from "react";
import axios from "../../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentSection = ({ orderId, discount, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);

  const confirmPayment = async () => {
    try {
      setLoading(true);
      await axios.post(
        `http://127.0.0.1:8000/orders/${orderId}/bill/`,
        {
          payment_method: paymentMethod,
          discount,
        }
      );
    
      onSuccess(); 
    } catch (err) {
      toast.error("Payment failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <ToastContainer autoClose={2000} position={"top-right"}/>
    <div className="mt-4 space-y-3">
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm"
      >
        <option>Cash</option>
        <option>UPI</option>
        <option>Card</option>
      </select>

      <button
        onClick={confirmPayment}
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded"
      >
        {loading ? "Processing..." : "Confirm Payment"}
        
      </button>
    </div>
    </>
  );
};

export default PaymentSection;
