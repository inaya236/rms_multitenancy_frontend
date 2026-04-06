import axios from "axios";
import { useEffect, useState } from "react";
import Base_URL from "../../../../../../config";
import { useLocation } from "react-router-dom";

const RestaurantInfo = () => {
    const [restaurantList, setRestaurantList] = useState([])

 const location = useLocation();
    const restId = location.state?.restId;

    const getRestaurant = async () => {
        try {
            const res = await axios.get(`${Base_URL}core/restaurants/${restId}/`)
            console.log("restaurant list", res.data)
            setRestaurantList(res.data)
        } catch (error) {
            console.error("error getting restaurant list", error)
        }
    }



    useEffect(() => {
        getRestaurant();
    }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">

      {/* LEFT SIDE */}
      <div className="flex flex-col gap-6">

        {/* Admin Info */}
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="text-gray-500 text-sm font-semibold mb-3">
            Admin Info
          </h2>
          <hr className="mb-4" />

          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-medium text-gray-900">Name:</span> {restaurantList?.admin?.name}</p>
            <p><span className="font-medium text-gray-900">Email:</span> {restaurantList?.admin?.email}</p>
          </div>

           <h2 className="text-gray-500 text-sm font-semibold mb-3">
            Dates
          </h2>
          <hr className="mb-4" />

          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-medium text-gray-900">Start Date:</span> {restaurantList?.subscription?.end_date || "--"}</p>
            <p><span className="font-medium text-gray-900">End Date:</span> {restaurantList?.subscription?.start_date || "--"}</p>
          </div>
        </div>

        {/* Dates */}
        {/* <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h2 className="text-gray-500 text-sm font-semibold mb-3">
            Dates
          </h2>
          <hr className="mb-4" />

          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-medium text-gray-900">Start Date:</span> —</p>
            <p><span className="font-medium text-gray-900">End Date:</span> —</p>
            <p><span className="font-medium text-gray-900">Created:</span> 01 Apr 2026</p>
          </div>
        </div> */}

      </div>

      {/* RIGHT SIDE */}
      <div className="bg-white p-5 rounded-xl shadow-sm border flex flex-col justify-between">

        <div>
          <h2 className="text-gray-500 text-sm font-semibold mb-3">
            Subscription Details
          </h2>
          <hr className="mb-4" />

          <div className="space-y-3 text-sm text-gray-700">
            <p><span className="font-medium text-gray-900">Plan:</span> {restaurantList?.subscription?.plan_name}</p>
            <p><span className="font-medium text-gray-900">Duration:</span> {restaurantList?.subscription?.plan_interval}</p>
            <p><span className="font-medium text-gray-900">Amount:</span> {restaurantList?.subscription?.price}</p>

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Status:</span>
              {restaurantList?.subscription?.status === "pending" ? (
             <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                {restaurantList?.subscription?.status}
              </span>
              ) : (
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium">
                {restaurantList?.subscription?.status}
              </span>
              )}
             
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {/* <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Payment Status</span>
            <span>0% Paid</span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div className="bg-red-500 h-2 rounded-full w-[10%]"></div>
          </div>
        </div> */}

      </div>

    </div>
  );
};

export default RestaurantInfo;