import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import BASE_URL from "../../../config";
import { Plus, Filter, Trash2, CalendarDays, Users, Phone, Calendar, Clock, MessageSquareText, CalendarCheck } from "lucide-react";
import { IoMdAddCircle } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { Bookmark } from "lucide-react";
import { CheckCircle } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';

const TableInventory = () => {
  const areas = ["All", "Dining", "Outdoor"];

  const [tables, setTables] = useState([]);
  const [area, setArea] = useState("All");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [newTable, setNewTable] = useState({ area: "" });

  const accessToken=localStorage.getItem("accessToken")

  // reserve table
  const [reserveModal, setReserveModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  const [reservation, setReservation] = useState({
    customer_name: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    request: "",
  });



  /* ---------- FETCH TABLES ---------- */
  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}tables/`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      setTables(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load tables", err);
    } finally {
      setLoading(false);
    }
  };



  const addTable = async () => {
    if (!newTable.area) return;
    try {
      await axios.post(`${BASE_URL}tables/`, {
        area: newTable.area,
      },{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      setNewTable({ area: "" });
      setShowModal(false);
      toast.success("Table Added successfully")
      fetchTables();
    } catch (err) {
      toast.error("Failed to add table");
      console.error(err);
    }
  };

  /* ---------- DELETE TABLE ---------- */
  const removeTable = async (id) => {
    if (!window.confirm("Remove this table?")) return;
    try {
      await axios.delete(`${BASE_URL}tables/${id}/`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      fetchTables();
    } catch (err) {
      toast.error("Failed to delete table");
      console.error(err);
    }
  };



  const reserveTable = async (table) => {
    try {
      await axios.patch(`${BASE_URL}tables/${table.id}/`, {
        status: "reserved",
      },{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });

      fetchTables(); // refresh
    } catch (err) {
      console.error(err);
      toast.error("Failed to reserve table");
    }
  };


  useEffect(() => {
    fetchTables();
  }, []);

  const filteredTables =
    area === "All"
      ? tables
      : tables.filter(
        (t) => t.area.toLowerCase() === area.toLowerCase()
      );

  const statusBadge = (status) => {
    const s = status?.toLowerCase();

    if (s === "occupied") {
      return "bg-red-100 text-red-700 border border-red-200";
    }

    if (s === "reserved") {
      return "bg-amber-100 text-amber-700 border border-amber-200";
    }

    return "bg-green-100 text-green-700 border border-green-200";
  };

  // const toggleReservation = async (table) => {
  //   try {
  //     const newStatus =
  //       (table.status || "").toLowerCase() === "reserved"
  //         ? "available"
  //         : "reserved";

  //     await axios.patch(`${BASE_URL}tables/${table.id}/`, {
  //       status: newStatus,
  //     });

  //     fetchTables();
  //     toast.success(`Table marked as ${newStatus}`);
  //   } catch (err) {
  //     toast.error("Failed to update status");
  //   }
  // };

  /* ---------- UI ---------- */
  return (
    <>
      <ToastContainer autoClose={2000} position={"top-right"} />
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Table Inventory</h2>
            <p className="text-gray-500 text-sm">
              Manage your restaurant tables
            </p>
          </div>

          <button
            onClick={() => {
              setShowModal(true);
              // fetchNextTableNumber();
            }}
            className=" w-full md:w-auto bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90  text-white px-3 py-2 rounded-md flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Table
          </button>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-3">
          <Filter size={16} />
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border px-5 py-2 rounded-md bg-white focus:outline-none"
          >
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* <p className="text-sm text-gray-500">
            Showing {filteredTables.length} of {tables.length} tables
          </p> */}
        </div>

        {/* --------------  TABLE LIST */}

        {/* ================= DESKTOP TABLE ================= */}
        < div className="hidden md:block bg-white rounded-xl shadow border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3 font-medium">Table Number</th>
                <th className="px-4 py-3 font-medium">Area</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTables.map((table) => (
                <tr key={table.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-semibold">
                    {table.table_number}
                  </td>

                  <td className="px-4 py-3 capitalize text-gray-600">
                    {table.area}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(table.status)}`}
                    >
                      ● {table.status || "Available"}
                    </span>
                    {/* <span
                      onClick={() => toggleReservation(table)}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition hover:scale-105 ${statusBadge(table.status)}`}
                    >
                      ● {table.status || "Available"}
                    </span> */}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end items-center gap-2">
                      {(table.status || "").toLowerCase() === "available" && (
                        <button
                          onClick={() => reserveTable(table)}
                          // className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-xs"
                          className=" text-amber-700 p-2 rounded-md transition"

                        >
                          {/* Reserve */}
                          <CalendarCheck size={25} />
                        </button>
                      )}

                      <button
                        onClick={() => removeTable(table.id)}
                        // className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-xs"
                        className="text-red-600 p-2 rounded-md transition"
                      >
                        {/* <div className="flex justify-center items-center gap-1">
                          <MdDelete />  Remove
                        </div> */}

                        <MdDelete size={25} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div >



        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredTables.map((table) => (
            <div
              key={table.id}
              className="bg-white rounded-xl border shadow p-4 flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Table {table.table_number}
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                    table.status
                  )}`}
                >
                  ● {table.status || "Available"}
                </span>
              </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 capitalize">
                Area: <span className="font-medium">{table.area}</span>
              </p>

              <span >
                {(table.status || "").toLowerCase() === "available" && (
                  // <button
                  //   onClick={() => reserveTable(table)}
                  //   className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-md text-sm"
                  // >
                  //   Reserve
                  // </button>
                    <button
                          onClick={() => reserveTable(table)}
                          // className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-xs"
                          className=" text-amber-700 p-2 rounded-md transition"

                        >
                          {/* Reserve */}
                          <CalendarCheck size={22} />
                        </button>
                )}

                {/* <button
                  onClick={() => removeTable(table.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
                >
                  Remove
                </button> */}
                <button
                        onClick={() => removeTable(table.id)}
                        // className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-xs"
                        className="text-red-600 p-2 rounded-md transition"
                      >
                        {/* <div className="flex justify-center items-center gap-1">
                          <MdDelete />  Remove
                        </div> */}

                        <MdDelete size={25} />
                      </button>
              </span>
              </div>
            </div>
          ))}
        </div>






        {/* ---------- ADD TABLE MODAL ---------- */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>

              <h3 className="text-xl font-semibold mb-6">
                Add New Table
              </h3>



              {/* Area */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Select Area <span className="text-red-500">*</span>
                </label>
                <select
                  value={newTable.area}
                  onChange={(e) =>
                    setNewTable({ area: e.target.value })
                  }
                  className="w-full bg-white border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Choose area</option>
                  <option value="dining">Dining</option>
                  <option value="outdoor">Outdoor</option>
                  {/* <option value="reserved">Reserved</option> */}
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  disabled={!newTable.area}
                  onClick={addTable}
                  className={`px-5 py-2 rounded-md text-white flex items-center gap-2 ${newTable.area
                    ? "bg-[var(--primary-color)] hover:[var(--primary-color)]/90"
                    : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                  <IoMdAddCircle size={18} />
                  Create Table
                </button>
              </div>
            </div>
          </div>
        )}
      </ div>
    </>
  );
};

export default TableInventory;
