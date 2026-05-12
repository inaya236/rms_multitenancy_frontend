import React, { useEffect, useState } from "react";
import axios from "../../../../api/axiosInstance";
import BASE_URL from "../../../../../config";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const NewOrder = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [areaFilter, setAreaFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    const accessToken= localStorage.getItem("accessToken")

    try {
      const res = await axios.get(`${BASE_URL}tables/`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      setTables(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTables =
    areaFilter === "All"
      ? tables
      : tables.filter(
        (table) =>
          table.area?.toLowerCase() === areaFilter.toLowerCase()
      );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-[var(--primary-color)] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">

        <h2 className="text-xl font-semibold">New Order</h2>

        <div className="flex gap-2 overflow-x-auto pb-1">

          {["All", "Dining", "Outdoor", "Reserved", "Parcel"].map((area) => (
            <button
              key={area}
              onClick={() => {
                if (area === "Parcel") {
                  navigate("/pos/parcel");
                } else {
                  setAreaFilter(area);
                }
              }}

              className={`px-4 py-1 rounded-md text-sm border transition whitespace-nowrap

                ${areaFilter === area
                  ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)]"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

<button onClick={() => {
  const payload = {
    notification: {
      title: "Test Title",
      body: "Test Body"
    }
  };

  console.log("Message received:", payload);
  alert(payload.notification.title + "\n" + payload.notification.body);

}}
className="text-black"
>
  Test Notification
</button>


      {/* TABLE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

        {filteredTables.map((table) => (
          <div
            key={table.id}
            className="bg-white border rounded-xl p-4
           flex flex-col items-center gap-3
           hover:shadow-md transition
           min-h-[150px]"

          >

            <h4 className="text-base font-semibold text-gray-800">
              Table {table.table_number}
            </h4>


            <span
              className={`px-3 py-1 text-sm rounded-full font-medium
                ${table.status === "available"
                  ? "bg-green-100 text-green-700"
                  : table.status === "occupied"
                    ? "bg-orange-100 text-orange-700"
                    : table.status === "reserved"
                    ? "bg-blue-100 text-blue-700"
                    : table.status === "parcel"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-600"
                }`}
            >
              {table.status}
            </span>

            {/* SELECT TABLE BUTTON */}
            <button
              disabled={table.status !== "available" && table.status !== "reserved"}
              onClick={() => navigate(`/pos/${table.id}`)}
              className={`mt-1 w-full text-sm py-2 rounded-lg transition
                ${table.status === "available" || table.status === "reserved"
                  ? "border border-orange-500 text-orange-600 hover:bg-orange-50"
                  : "border border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              Select Table
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewOrder;
