import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";

/* super admin */
import SuperAdminDash from "./components/SuperAdmin/SuperAdminDash";
import RestaurantList from "./components/SuperAdmin/RestaurantManage/RestaurantList";
import AddRestaurant from "./components/SuperAdmin/RestaurantManage/AddRestaurant";
import SubscriptionBilling from "./components/SuperAdmin/SubscriptionBilling";

/* restaurant admin */
import AdminDash from "./components/Restaurant-Admin/Dashboard/AdminDashboard/AdminDash";
import NewOrder from "./components/Restaurant-Admin/Dashboard/OrderManagement/NewOrder";
import POS from "./components/Restaurant-Admin/Dashboard/OrderManagement/POS";
import ActiveOrders from "./components/Restaurant-Admin/Dashboard/OrderManagement/ActiveOrders";
import CompletedOrders from "./components/Restaurant-admin/Dashboard/CompletedOrdersview/CompletedOrders";
import CustomerFeed from "./components/Restaurant-admin/Dashboard/Customer/CustomerFeed";
import Customers from "./components/Restaurant-admin/Dashboard/Customer/Customers";
import AdminProfile from "./components/Restaurant-admin/Dashboard/AdminDashboard/AdminProfile";

import TableInventory from "./components/Restaurant-Admin/TableInventory";
import MenuManagement from "./components/Restaurant-admin/Menu/MenuManagement";
import FeedBack from "./components/Restaurant-admin/FeedBack";
import HumanResources from "./components/Restaurant-admin/HumanResources";

/* auth */
import Login from "./components/Auth/Login";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import ChangePassword from "./components/Auth/ChangePassword";

import MyNavbar from "./components/Restaurant-Admin/MyNavbar";
import Sidebar from "./components/Restaurant-Admin/Sidebar";
import GstModal from "./components/Restaurant-Admin/BillingDashboard/GstModal";
import axios from "axios";
import Base_URL from "../config";


import { useRestaurant } from "./context/RestaurantContext";
import Home from "./components/Landing/Home";
import Overview from "./components/SuperAdmin/RestaurantManage/Restaurant_details/Overview";
import Settings from "./components/Restaurant-Admin/Dashboard/AdminDashboard/Settings";

import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { toast } from "react-toastify";

function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openGstModal, setOpenGstModal] = useState(false);

 const [notifications, setNotifications] = useState([]);

  const [authState, setAuthState] = useState({
    accessToken: localStorage.getItem("accessToken"),
    role: localStorage.getItem("role")
  });

//  useEffect(() => {
//   const unsubscribe = onMessage(messaging, (payload) => {
//     console.log("📩 Message received:", payload);
//     toast(
//       payload.notification?.title + "\n" +
//       payload.notification?.body
//     );
//   });

// navigator.serviceWorker.ready.then(reg => {
//   console.log("SW ready:", reg);
// });
//   return () => unsubscribe();
// }, []);


useEffect(() => {
  onMessage(messaging, (payload) => {
    const newNotification = {
      title: payload.notification?.title,
      body: payload.notification?.body,
      time: new Date(),
      read: false,
    };

    console.log("📩 Message:", newNotification);

    setNotifications((prev) => [newNotification, ...prev]);
  });
}, []);

useEffect(() => {
  localStorage.setItem("notifications", JSON.stringify(notifications));
}, [notifications]);

useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("notifications")) || [];
  setNotifications(saved);
}, []);

useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  useEffect(() => {
    const handleUserChange = () => {
      setAuthState({
        accessToken: localStorage.getItem("accessToken"),
        role: localStorage.getItem("role")
      });
    };

    window.addEventListener("userChange", handleUserChange);

    return () => {
      window.removeEventListener("userChange", handleUserChange);
    };
  }, []);

  const { loading } = useRestaurant();

  const location = useLocation();
  const navigate = useNavigate();

  const accessToken = authState.accessToken;
  const role = authState.role?.toLowerCase();

  const isAdmin = accessToken && role === "admin";
  const isSuperAdmin = accessToken && role === "no role";


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-gray-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

   if (!accessToken && location.pathname === "/") {
  return <Home />;
}

if (accessToken && location.pathname === "/") {
  if (isAdmin) navigate("/adminDash");
}

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };


  const hideLayout =
    location.pathname === "/adminProfile" ||
    location.pathname === "/forgotpassword" ||
    location.pathname === "/resetpassword" ||
    location.pathname === "/changepassword" ||
    location.pathname === "/settings";

  return (
    <>
    
      {/* ---------------- SUPER ADMIN ---------------- */}
      {isSuperAdmin && (
        <div className="min-h-screen bg-[#FBF7F2]">

          <Routes>
            <Route path="/" element={<SuperAdminDash />} />
            <Route path="/restaurantList" element={<RestaurantList />} />
            <Route path="/addRestaurant" element={<AddRestaurant />} />
            <Route path="/subscriptionBilling" element={<SubscriptionBilling />} />
            <Route path="/overview" element={<Overview/>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

        </div>
       )} 

      {/* ---------------- RESTAURANT ADMIN ---------------- */}
      {isAdmin && (
        <>
        
          <div className={`flex ${location.pathname === "/settings" ? "min-h-screen overflow-y-auto" : "h-screen overflow-hidden"}  bg-gray-100 `}>

            {/* Mobile overlay */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 backdrop-blur-[1px] bg-white/20 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            {!hideLayout && (
              <div
                className={`main-content
                fixed inset-y-0 left-0 bg-white shadow-xl z-50
                transform transition-transform duration-300
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:static lg:translate-x-0
                ${isSidebarOpen ? "lg:w-56" : "lg:w-1"}
                `}
              >
                <Sidebar
                  isOpen={isSidebarOpen}
                  closeSidebar={() => setIsSidebarOpen(false)}
                  setOpenGstModal={setOpenGstModal}
                />
              </div>
            )}

            {/* Main Area */}
            <div className={hideLayout ? "w-full" : "flex-1 flex flex-col w-full"}>

              {!hideLayout && (
                <div className="h-14 bg-white shadow-md w-full sticky top-0 z-40">
                  <MyNavbar toggleSidebar={toggleSidebar} notifications={notifications}  setNotifications={setNotifications}/>
                </div>
              )}

              {/* Restaurant routes */}
              {/* <div className="flex-1 p-4 sm:p-6 overflow-x-hidden overflow-y-auto min-h-0"> */}
              <div
                className={
                  hideLayout
                    ? "w-full min-h-screen overflow-y-auto"
                    : "flex-1 p-4 sm:p-6 overflow-x-hidden overflow-y-auto min-h-0"
                }
              >

                <Routes>
                  <Route path="/" element={<Navigate to="/adminDash" replace />} />
                  <Route path="/new-order" element={<NewOrder />} />
                  <Route path="/pos/:tableId" element={<POS />} />
                  <Route path="/orders/active" element={<ActiveOrders />} />
                  <Route path="/completedorders" element={<CompletedOrders />} />
                  <Route path="/inventory/tables" element={<TableInventory />} />
                  <Route path="/menu-management" element={<MenuManagement />} />
                  <Route path="/customerFeed" element={<CustomerFeed />} />
                  <Route path="/customers/:id" element={<Customers />} />
                  <Route path="/feedback" element={<FeedBack />} />
                  <Route path="/human-resources" element={<HumanResources />} />
                  <Route path="/adminProfile" element={<AdminProfile />} />
                  <Route path="/settings" element={<Settings />} />
          <Route path="/changepassword" element={<ChangePassword />} />


                  <Route path="/adminDash" element={<AdminDash/>} />
                </Routes>

              </div>

            </div>
          </div>

          <GstModal
            open={openGstModal}
            onClose={() => setOpenGstModal(false)}
          />
        </>
     )}  

      {/* ---------------- AUTH ---------------- */}

      {!accessToken && (
        <Routes>
          <Route
            path="/login"
            element={
              accessToken ? (
                role === "admin"
                  ? <Navigate to="/adminDash" replace />
                  : <Navigate to="/" replace />
              ) : (
                <Login />
              )
            }
          />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/changepassword" element={<ChangePassword />} />

          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/settings" element={<Settings />} />

        </Routes>
       )} 
    </>
  );
}

export default App;

