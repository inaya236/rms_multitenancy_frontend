import React, { useEffect, useState } from "react";
import axios from "../../../../api/axiosInstance";
import BASE_URL from "../../../../../config";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import BillModal from "../../BillingDashboard/BillModal";
import 'bootstrap/dist/css/bootstrap.min.css';
import BillReceipt from "../../BillingDashboard/BillReceipt";

const POS = () => {
  const { tableId } = useParams();

  const isParcel = tableId === "parcel";


  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);


  const [showBill, setShowBill] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const location = useLocation();

    const accessToken=localStorage.getItem("accessToken")

  useEffect(() => {
    if (location.state) {
      setCustomer({
        name: location.state.customerName || "",
        phone_number: location.state.customerPhone || ""
      });
    }
  }, [location.state]);

  const isCustomerLocked = !!location.state?.customerName;

  const orderId = new URLSearchParams(location.search).get("order");

  const [customer, setCustomer] = useState({
    name: "",
    phone_number: ""
  });

  const [isExistingCustomer, setIsExistingCustomer] = useState(false);

  const navigate = useNavigate()

  /* 🔹 FETCH TABLE INFO */
  useEffect(() => {
    if (tableId === "parcel") {
      setTable({
        id: null,
        table_number: "PARCEL",
        status: "parcel",
      });
      setLoading(false);
      return;
    }

    axios
      .get(`${BASE_URL}tables/${tableId}/`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      })
      .then((res) => setTable(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [tableId]);


  /* 🔹 FETCH-CATEGORIES  */
  // useEffect(() => {
  //   axios.get(`${BASE_URL}menu-categories/`,{
  //       headers:{
  //         Authorization:`Bearer ${accessToken}`
  //       }
  //     }).then((res) => {
  //     setCategories(res.data);
  //     setActiveCat(res.data[0]?.id || null);
  //   });
  // }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}menu-categories/`).then((res) => {
      const allCategory = { id: "all", name: "All" };

      const updatedCategories = [allCategory, ...res.data];

      setCategories(updatedCategories);
      // console.log("menu-categories", res.data);

      setActiveCat("all");
    });
  }, []);

  /* FETCH-ITEMS*/
  // useEffect(() => {
  //   if (!activeCat) return;
  //   axios
  //     .get(`${BASE_URL}menu/items/${activeCat}/`,{
  //       headers:{
  //         Authorization:`Bearer ${accessToken}`
  //       }
  //     })
  //     .then((res) => setItems(res.data))
  //     .catch((err) => console.error(err));
  // }, [activeCat]);

  useEffect(() => {
    if (!activeCat) return;

    const url =
      activeCat === "all"
        ? `${BASE_URL}menu-items/`
        : `${BASE_URL}menu/items/${activeCat}/`;

    axios
      .get(url)
      .then((res) => {
        setItems(res.data)
        // console.log("menu items res", res.data)
      })
      .catch((err) => console.error(err));
  }, [activeCat]);


  useEffect(() => {
    if (!orderId) return;

    axios
      .get(`${BASE_URL}orders/${orderId}/`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      })
      .then(res => {

        const existingItems = res.data.order_items.map(i => ({
          id: i.menu_item,
          name: i.menu_item_name,
          price: Number(i.price),
          qty: i.quantity
        }));
        setCart(existingItems);
        console.log("item names", res.data)

        const fullName = `${res.data.first_name || ""} ${res.data.last_name || ""}`.trim();

        setCustomer({
          name: res.data.customer || "",
          phone_number: res.data.customer_phone_number || ""
        });

        setIsExistingCustomer(
          !!res.data.customer_phone_number
        );

      })
      .catch(err => console.error("Order load error", err));
  }, [orderId]);


  /* 🔹 ADD ITEM */
  const addItem = (item) => {
    const exist = cart.find((i) => i.id === item.id);

    if (exist) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...item,
          price: Number(item.price),
          qty: 1,
        },
      ]);
    }
  };


  const handleKOT = async () => {

    if (isSubmitting) return;
    setIsSubmitting(true)

    const name = customer.name.trim();
    const phone = customer.phone_number.trim();
    // if one is filled 
    if (name !== "Walk-in Customer") {
      if ((name && !phone) || (!name && phone)) {
        toast.warning("Please enter both Customer Name and Phone Number")
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const fullName = customer.name.trim();
      const parts = fullName.split(" ").filter(Boolean);

      const first_name = parts[0] || "";
      const last_name = parts.slice(1).join(" ") || "";

      const payload = {
        table: isParcel ? null : table.id,
        first_name,
        last_name,
        phone_number: customer.phone_number,
        order_items: cart.map(i => ({
          menu_item: i.id,
          quantity: i.qty,
          price: i.price
        }))
      };


      if (orderId) {
        // UPDATE ORDER (ADD ITEMS)
        const res = await axios.patch(`${BASE_URL}orders/${orderId}/`, payload,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
        console.log("patch res", payload);

      } else {
        // NEW ORDER
        await axios.post(`${BASE_URL}orders/`, payload,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      }

      setCart([]);
      navigate("/orders/active");
    } catch (err) {
      console.error("KOT ERROR:", err.response?.data || err.message);
      if (err.response?.data === "Order must contain at least one item"){
        toast.error("Order must contain at least one item");
        setIsSubmitting(false)
      }else{
      toast.error("Order failed");
        setIsSubmitting(false)

      }
    }
  };

  /* 🔹 CHANGE QUANTITY */
  const changeQty = (id, type) => {
    setCart(
      cart
        .map((i) =>
          i.id === id
            ? {
              ...i,
              qty: type === "+" ? i.qty + 1 : i.qty - 1,
            }
            : i
        )
        .filter((i) => i.qty >= 0)
    );
  };

  /* 🔹 TOTAL */
  const total = cart.reduce(
    (sum, i) => sum + Number(i.price) * i.qty,
    0
  );

  /* 🔹 LOADING */
  if (loading || !table) {
    return <div className="p-6 text-gray-500">Loading POS...</div>;
  }

  // save and pay function
  const handleSaveAndPay = async () => {
    if (isSubmittingPay) return;
    setIsSubmittingPay(true);

    const name = customer.name.trim();
    const phone = customer.phone_number.trim();

    if ((name && !phone) || (!name && phone)) {
      toast.warning("Please enter both Customer Name and Phone Number");
      setIsSubmittingPay(false);
      return;
    }

    try {
      const parts = name.split(" ").filter(Boolean);

      const payload = {
        table: isParcel ? null : table.id,
        first_name: parts[0] || "",
        last_name: parts.slice(1).join(" ") || "",
        phone_number: phone,
        order_items: cart.map((i) => ({
          menu_item: i.id,
          quantity: i.qty,
          price: i.price,
        })),
      };

      let res;

      if (orderId) {
        res = await axios.patch(`${BASE_URL}orders/${orderId}/`, payload);
      } else {
        res = await axios.post(`${BASE_URL}orders/`, payload);
      }

      setCurrentOrder(res.data);
      setShowBill(true);

    } catch (err) {
      console.error(err);
      toast.error("Order failed");
    }

    setIsSubmittingPay(false);
  };

  return (
    <>
      <ToastContainer autoClose={1000} position="top-center" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 sm:p-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-8 col-span-1">
          <h3 className="font-semibold mb-4 text-lg">
            Point Of Sale (POS) – {isParcel ? "Parcel Order" : `Table ${table.table_number}`}
          </h3>

          {/* CATEGORY TABS */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`px-4 py-1 text-sm rounded-md border
                ${activeCat === cat.id
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-300"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* MENU ITEMS – LIST STYLE */}
          <div className="bg-white border rounded-lg divide-y">
            {items.map((item) => (
              // <div
              //   key={item.id}
              //   className="grid grid-cols-[1fr_90px_90px] items-center px-4 py-3 hover:bg-gray-50"
              // >
               <div
                key={item.id}
                className={`grid grid-cols-[1fr_90px_90px] items-center px-4 py-3
                     ${item.is_available ? "hover:bg-gray-50" : "bg-red-50 opacity-70"}
                     `}
              >
                {/* ITEM NAME */}
                <p className="text-base font-medium text-gray-800 truncate">
                  {item.name}
                </p>

                {/* PRICE */}
                <p className="text-base font-semibold text-gray-700 text-right tabular-nums">
                  ₹{Number(item.price).toFixed(0)}
                   {!item.is_available && (
                    <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded whitespace-nowrap">
                      Out of stock
                    </span>
                  )}
                </p>

                {/* BUTTON */}
                <div className="text-right">
                  {/* <button
                    onClick={() => addItem(item)}
                    className="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium"
                  >
                    Add
                  </button> */}
                   <div className="text-right">
                    {item.is_available ? (
                      <button
                        onClick={() => addItem(item)}
                        className="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium"
                      >
                        Add
                      </button>
                    ) : null}
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-4 col-span-1 bg-white border rounded-xl p-4 sticky lg:top-6">
          <h4 className="font-semibold mb-3">Order Summary</h4>

          {cart.length === 0 && (
            <p className="text-sm text-gray-400">No items added</p>
          )}

            <div className="flex-1 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-2 sm:grid-cols-[1fr_90px_70px] items-center gap-2 mb-2"
              >
                {/* Item Name */}
                <span className="text-sm text-gray-800 truncate">
                  {item.name}
                </span>

                {/* Qty Controls */}
                <div className="flex items-center justify-center gap-1">
                  <button
                    onClick={() => changeQty(item.id, "-")}
                    className="w-6 h-6 text-xs
                   border rounded-md
                   flex items-center justify-center
                   hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="w-5 text-center text-sm">
                    {item.qty}
                  </span>

                  <button
                    onClick={() => changeQty(item.id, "+")}
                    className="w-6 h-6 text-xs
                   border rounded-md
                   flex items-center justify-center
                   hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <span className="text-sm text-right">
                  ₹{item.price * item.qty}
                </span>
              </div>
            ))}
          </div>


          <hr className="my-3" />

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <div className="mt-4 space-y-3">

            <div>
              <label className="text-sm font-medium text-gray-700">
                Customer Name
              </label>
              <input
                type="text"
                // disabled={isCustomerLocked}
                disabled={isExistingCustomer}
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
                className={`w-full rounded-lg px-3 py-2 text-sm
                   ${isExistingCustomer
                    ? "bg-gray-100 cursor-not-allowed"
                    : "border border-gray-200 bg-white focus:ring-2 focus:ring-orange-400"
                  }`}
                placeholder="e.g. Zyan Khan"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                // disabled={isCustomerLocked}
                disabled={isExistingCustomer}
                value={customer.phone_number}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // allow only digits
                  if (value.length <= 10) {
                    setCustomer({ ...customer, phone_number: value })
                  }
                }}
                maxLength={10}
                onWheel={(e) => e.target.blur()}
                className={`w-full rounded-lg px-3 py-2 text-sm
                   ${isExistingCustomer
                    ? "bg-gray-100 cursor-not-allowed"
                    : "border border-gray-200 bg-white focus:ring-2 focus:ring-orange-400"
                  }`}
                placeholder="e.g. 9876543210"
              />
            </div>

          </div>


          {/* ACTION BUTTONS */}
          <div className="mt-4 space-y-2">

            {/* ROW 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleSaveAndPay}
                disabled={isSubmittingPay}
                className={`py-2 text-sm rounded-md  font-semibold ${isSubmittingPay ? "bg-gray-100 cursor-not-allowed" : "bg-green-600 text-white"}`}
              >
                {isSubmittingPay ? "Save & Pay" : "Save & Pay"}
              </button>

              <button
                onClick={handleKOT}
                disabled={isSubmitting}
                className={`py-2 text-sm rounded-md  font-semibold ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : " bg-gray-700 text-white"}`}>
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>



          </div>

        </div>
      </div>

      {showBill && currentOrder && (
        <BillModal onClose={() => setShowBill(false)}>
          <BillReceipt
            order={currentOrder}
            onClose={() => setShowBill(false)}
            onPaymentSuccess={() => {
              setCart([]);
              navigate("/completedorders");
            }}
          />
        </BillModal>
      )}
    </>
  );
};

export default POS;
