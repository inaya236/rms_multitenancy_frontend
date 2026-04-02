import React, { useState, useEffect } from "react";
import axios from "../../../../api/axiosInstance";
import BASE_URL from "../../../../../config";
import KpiCard from "./KpiCard";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRestaurant } from "../../../../context/RestaurantContext";


import {
  FaShoppingCart,
  FaClipboardList,
  FaUtensils,
  FaChair,
} from "react-icons/fa";

import "../../../../App.css";

/* ================= PAYMENT METHOD SUMMARY ================= */

const LiveOrders = () => {

  const [cash, setCash] = useState(0);
  const [upi, setUpi] = useState(0);
  const [card, setCard] = useState(0);

  useEffect(() => {

    const fetchPaymentSummary = async () => {

      try {

        const response = await axios.get(
          `${BASE_URL}payment_method_summary/`
        );

        setCash(response.data.cash_revenue?.cash_revenue || 0);
        setUpi(response.data.upi_revenue?.upi_revenue || 0);
        setCard(response.data.card_revenue?.card_revenue || 0);

      } catch (error) {

        console.error(error);

      }

    };

    fetchPaymentSummary();

  }, []);



  return (

    <div
      className="bg-white shadow-sm d-flex flex-column transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
      style={{
        borderTop: "4px solid #f97316",
        borderRadius: "16px",
        padding: "24px",
        height: "100%",
      }}
    >

      <h6 className="fw-semibold mb-4">

        Today's Payment Method Summary

      </h6>



      {/* Cash */}

      <div className="d-flex justify-content-between mb-3">

        <div>

          <div className="fw-semibold">

            Cash

          </div>

          <small className="text-muted">

            Offline payments

          </small>

        </div>

        <span className="badge bg-warning-subtle text-warning px-3 py-2">

          ₹{cash}

        </span>

      </div>



      {/* UPI */}

      <div className="d-flex justify-content-between mb-3">

        <div>

          <div className="fw-semibold">

            UPI

          </div>

          <small className="text-muted">

            Digital payments

          </small>

        </div>

        <span className="badge bg-success-subtle text-success px-3 py-2">

          ₹{upi}

        </span>

      </div>



      {/* Card */}

      <div className="d-flex justify-content-between">

        <div>

          <div className="fw-semibold">

            Card

          </div>

          <small className="text-muted">

            Debit / Credit Card

          </small>

        </div>

        <span className="badge bg-primary-subtle text-primary px-3 py-2">

          ₹{card}

        </span>

      </div>


    </div>

  );

};





/* ================= TOP SELLING ITEMS ================= */

const TopSellingItems = () => {

  const [items, setItems] = useState([]);
  const [period, setPeriod] = useState("today");


  useEffect(() => {

    axios
      .get(`${BASE_URL}best_selling_items/?period=${period}`)
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, [period]);



  return (

    <div
      className="bg-white shadow-sm d-flex flex-column transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
      style={{
        borderTop: "4px solid #22c55e",
        borderRadius: "16px",
        padding: "24px",
        height: "100%",
      }}
    >

      <div className="d-flex justify-content-between align-items-center mb-3">

  <h6 className="fw-semibold mb-0">
    Top Selling Items
  </h6>

  <div className="d-flex gap-2">

    <button
      className={`btn btn-sm ${period === "today" ? "btn-success" : "btn-outline-success"}`}
      onClick={() => setPeriod("today")}
    >
      Today
    </button>

    <button
      className={`btn btn-sm ${period === "weekly" ? "btn-success" : "btn-outline-success"}`}
      onClick={() => setPeriod("weekly")}
    >
      Weekly
    </button>

    <button
      className={`btn btn-sm ${period === "monthly" ? "btn-success" : "btn-outline-success"}`}
      onClick={() => setPeriod("monthly")}
    >
      Monthly
    </button>

  </div>

</div>




      {items.map((item, index) => (

        <div
          key={index}
          className="d-flex justify-content-between mb-3"
        >

          <div>

            <div className="fw-semibold">
              {item.menu_item__name}
            </div>

            <small className="text-muted">
              {item.total_sold} sold
            </small>

          </div>


          <span className="badge bg-success-subtle text-success px-3 py-2">
            #{index + 1}
          </span>


        </div>

      ))}


    </div>

  );

};




/* ================= MAIN DASHBOARD ================= */

const AdminDash = () => {

  const [dashboard, setDashboard] = useState(null);

   const { restaurant } = useRestaurant();

const features = restaurant?.subscription?.features || [];

  useEffect(() => {

    axios
      .get(`${BASE_URL}dashboard/`)
      .then((res) => {

        setDashboard(res.data);

      })
      .catch((err) => {

        console.log(err);

      });

  }, []);



  return (

    <div className="bg-light p-4">


      {/* ================= KPI ROW ================= */}
              {features.includes("ANALYTICS") && (
      <div className="row mb-4">


        <div className="col-lg-3 col-md-6 mb-3">

          <KpiCard
            title="Total Sales Today"
            value={dashboard ? `₹${dashboard.total_billing_collection}` : "₹0"}
            color="#f97316"
            icon={<FaShoppingCart />}
          />

        </div>



        <div className="col-lg-3 col-md-6 mb-3">

          <KpiCard
            title="Total Orders Today"
            value={dashboard ? dashboard.total_orders : "0"}
            color="#3b82f6"
            icon={<FaClipboardList />}
          />

        </div>



        <div className="col-lg-3 col-md-6 mb-3">

          <KpiCard
            title="Active Orders Today"
            value={dashboard ? dashboard.active_orders : "0"}
            color="#22c55e"
            icon={<FaUtensils />}
          />

        </div>



        <div className="col-lg-3 col-md-6 mb-3">

          <KpiCard
            title="Available Tables "
            value={
              dashboard
                ? `${dashboard.available_tables}/${dashboard.total_tables}`
                : "0/0"
            }
            color="#eab308"
            icon={<FaChair />}
          />

        </div>


      </div>
              )}



      {/* ================= SECOND ROW ================= */}

      <div className="row">

              {features.includes("PAYMENT_INSIGHTS") && (

        <div className="col-lg-6 col-md-12 mb-3">

          <LiveOrders />

        </div>
              )}

              {features.includes("ANALYTICS") && (
        <div className="col-lg-6 col-md-12 mb-3">

          <TopSellingItems />

        </div>
              )}


      </div>



    </div>

  );

};


export default AdminDash;



