import React, { useEffect, useState } from "react";
import axios from "../../../../api/axiosInstance";
import BASE_URL from "../../../../../config";
import { useNavigate } from "react-router-dom";
import BillModal from "../../BillingDashboard/BillModal";
import BillReceipt from "../../BillingDashboard/BillReceipt";
import dayjs from "dayjs";
// import 'bootstrap/dist/css/bootstrap.min.css';

const ActiveOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBill, setShowBill] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const accessToken=localStorage.getItem("accessToken")


  const handlePaymentSuccess = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
  };

  const navigate = useNavigate();

  const openBill = (order) => {
    setSelectedOrder(order);
    setShowBill(true);
    console.log("open bill called")
  };


const fetchOrders=()=>{
  axios
      .get(`${BASE_URL}active-orders/`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      })
      .then((res) => {
        setOrders(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      })
       .finally(() => setLoading(false));
}

  useEffect(() => {
    fetchOrders()
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading Active Orders...</div>;
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">

      <h2 className="text-2xl font-semibold mb-1">Active Orders</h2>
      <p className="text-gray-500 mb-6">
        Manage billing and payments for ongoing tables.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">

        {orders.length>0 ? orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border shadow-sm p-4 min-h-[200px] sm:min-h-[220px]"

          >

            {/* HEADER */}
            <div className="flex justify-between items-start ">
              <div>
                {/* TABLE NUMBER – BIG */}
                <h4 className="text-[18px] font-semibold text-gray-900">
                  {order.table ? `Table ${order.table_number}` : "Parcel Order"}
                  {/* {order.table ? `Table ${order.table_number}` : `Token Number - ${order.token_number}`} */}
                </h4>

                <div>
                <p className="text-sm font-medium text-gray-600 mb-0">
                  Customer Name: {order.customer}
                </p>

                {/* ORDER ID – MEDIUM (no #) */}
                <p className="text-sm font-medium text-gray-600 mb-0">
                  Order: {order.id}
                </p>

                <p className="text-sm font-medium text-gray-600 mb-1">
                  Ordered at: {order.created_at && dayjs(order.created_at).format('DD MMM YYYY, h:mm A')}
                </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold px-3 py-0.5 rounded-full 
  bg-orange-100 text-orange-600">
                ACTIVE
              </span>
            </div>

            {/* AMOUNT + ITEMS */}
            <div className="flex justify-between items-center mt-2 mb-3">
              {/* ITEMS – SAME AS ORDER ID */}
              <span className="text-sm font-medium text-gray-600">
                {order.order_items?.length || 0} items
              </span>

              {/* TOTAL */}
              <span className="text-lg font-bold text-gray-900">
                ₹{order.total_amount}
              </span>
            </div>


            {/* ACTIONS */}
            <div className="mt-3 space-y-2">
              <button
                onClick={() =>
                  navigate(
                    order.table
                      ? `/pos/${order.table}?order=${order.id}`
                      : `/pos/parcel?order=${order.id}`,
                      {
                        state:{
                          customerName:order.customer,
                          customerPhone:order.customer_phone_number
                        }
                      }
                  )
                }

                className="w-full py-2 text-sm font-medium rounded-lg 
    bg-gray-800 text-white hover:bg-gray-900 transition"
              >
                Add Items
              </button>

              <button
                onClick={() => {
                  openBill(order)
                  console.log("view bill & pay clicked")
                }}
                className="w-full py-2 text-sm font-semibold rounded-lg 
    bg-green-600 text-white hover:bg-green-700 transition"
              >
                View Bill & Pay
              </button>
            </div>


          </div>

        )) : (
          <div className="text-md font-semibold flex items-center">
            No Active Orders
          </div>
        )}
      </div>

      {/* BILL MODAL */}
      {showBill && selectedOrder && (
        <BillModal onClose={() => setShowBill(false)}>
          <BillReceipt
            order={selectedOrder}
            onClose={() => setShowBill(false)}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </BillModal>
      )}
    </div>
  );
};

export default ActiveOrders;


