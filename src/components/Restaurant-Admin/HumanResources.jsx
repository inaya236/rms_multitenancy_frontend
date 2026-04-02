import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import BASE_URL from "../../../config";

import { Plus, Search, Trash2 } from "lucide-react";
import { IoMdAddCircle } from "react-icons/io";
import dayjs from "dayjs";
// import 'bootstrap/dist/css/bootstrap.min.css';

const HumanResources = () => {

  const roles = ["All", "Manager", "Waiter"];

  const [staff, setStaff] = useState([]);
  const [role, setRole] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [newStaff, setNewStaff] = useState({
    first_name: "",
    last_name: "",
    role: "",
    phone_number: "",
    email: "",
    password: "",
    salary: "",
    gender: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

   const [currentPage, setCurrentPage] = useState(1);
  const staffPerPage = 8;


  /* ---------- FETCH STAFF ---------- */

  const fetchStaff = async () => {

    setLoading(true);

    try {

      const res = await axios.get(`${BASE_URL}get-users/`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
    });

      setStaff(Array.isArray(res.data) ? res.data : []);
      console.log(res.data);


    }
    catch (err) {

      console.error(err);

      setStaff([]);

    }
    finally {

      setLoading(false);

    }

  };
  /* ---------- ADD STAFF ---------- */

  const addStaff = async () => {

    if (!newStaff.first_name || !newStaff.email || !newStaff.password || !newStaff.role || !newStaff.salary) {
      setIsSubmitting(false);
      return alert("Please fill all required fields");
    }

    if (isSubmitting) return;
    setIsSubmitting(true)

    try {

      await axios.post(`${BASE_URL}register-staff/`, newStaff,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
    });

      setShowModal(false);

      setNewStaff({
        first_name: "",
        last_name: "",
        role: "",
        phone_number: "",
        email: "",
        password: "",
        salary: "",
        gender: ""
      });

      fetchStaff();

    }
    catch (err) {

      console.error(err.response?.data);

      alert("Failed to add staff");

    }

  };


  /* ---------- DELETE STAFF ---------- */

  const removeStaff = async (id) => {

    if (!window.confirm("Delete this staff?")) return;

    try {

      await axios.delete(`${BASE_URL}register-staff/${id}/`,{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
    });

      fetchStaff();

    }
    catch {

      alert("Delete failed");

    }

  };


  useEffect(() => {

    fetchStaff();

  }, []);



  /* ---------- SAFE FILTER ---------- */

  const filteredStaff = staff.filter((s) => {

    const staffRole = s.role?.toLowerCase() || "";

    if (role === "All") return true;

    return staffRole === role.toLowerCase();

  });



  /* ---------- SAFE SEARCH ---------- */

  const searchedStaff = filteredStaff.filter((s) => {

    const fullName =
      `${s.first_name || ""} ${s.last_name || ""}`.toLowerCase();

    return fullName.includes(search.toLowerCase());

  });

   const indexOfLastStaff = currentPage * staffPerPage;
  const indexOfFirstStaff = indexOfLastStaff - staffPerPage;

  const currentStaff = searchedStaff.slice(indexOfFirstStaff, indexOfLastStaff);

  const totalPages = Math.ceil(searchedStaff.length / staffPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, role]);



  /* ---------- UI ---------- */

  return (

    <div className="p-6 bg-gray-50 min-h-screen">


      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">

        <div>
          <h2 className="text-xl md:text-2xl font-bold">
            Human Resources
          </h2>

          <p className="text-gray-500 text-sm md:text-base">
            Manage your restaurant staff
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90  text-white 
               px-3 py-2 md:px-4 
               rounded-md flex items-center justify-center 
               gap-2 text-sm md:text-base 
               w-full md:w-auto"
        >
          <Plus size={18} />
          <span>Add Staff</span>
        </button>

      </div>




      {/* FILTER */}

      <div className="flex flex-wrap gap-3 mb-4 items-center">

        <Search size={18} />

        <input
          placeholder="Search staff..."
          className="border px-3 py-2 rounded-md bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />


        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border px-3 py-2 rounded-md bg-white"
        >

          {roles.map((r) => (

            <option key={r} value={r}>
              {r}
            </option>

          ))}

        </select>


        {/* <p className="text-sm text-gray-500">
          Showing {searchedStaff.length}
        </p> */}


      </div>



      {/* TABLE */}

      {
        loading

          ?

          <p>Loading...</p>

          :

          (

            <div className=" hidden md:block bg-white rounded-xl shadow border overflow-x-auto">


              <table className="w-full text-sm">


                <thead className="bg-gray-50 border-b">

                  <tr>

                    <th className="px-4 py-3 text-left">Name</th>

                    <th className="px-4 py-3 text-left">Role</th>

                    <th className="px-4 py-3 text-left">Phone</th>

                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Salary</th>


                    <th className="px-4 py-3 text-left">Joining Date</th>

                  </tr>

                </thead>


                <tbody>

                  {currentStaff.filter(r => r.role)
                    .map((s) => (

                      <tr key={s.id} className="border-t hover:bg-gray-50">


                        <td className="px-4 py-3 font-medium">

                          {s.first_name} {s.last_name}

                        </td>


                        <td className=" py-3">

                          {
                            s.role && (
                              <span className={`px-3 py-1 rounded-full text-xs font-medium
                               ${s.role === "Manager"
                                  ? "bg-blue-100 text-blue-700"
                                  : s.role === "Waiter"
                                    ? "bg-green-100 text-green-700"
                                    : ""
                                }`}
                              >
                                {s.role}
                              </span>
                            )
                          }


                        </td>


                        <td className="px-4 py-3">

                          {s.phone_number || "-"}

                        </td>


                        <td className="px-4 py-3">

                          {s.email}

                        </td>
                        <td className="px-4 py-3">

                          {s.salary || "-"}

                        </td>


                        <td className="px-4 py-3 ">
                          {s.date_joined ? dayjs(s.date_joined).format("DD MMM YYYY") : "-"}
                        </td>


                      </tr>

                    ))}

                </tbody>


              </table>

              {/* pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 rounded-md text-sm ${currentPage === index + 1
                          ? "bg-orange-500 text-white"
                          : "border"
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                  >
                    Next
                  </button>

                </div>
              )}


            </div>

          )

      }


      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4">
        {currentStaff.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 rounded-xl shadow border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {s.first_name} {s.last_name}
                </h3>

                {s.role && (
                  <span
                    className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium
              ${s.role === "Manager"
                        ? "bg-blue-100 text-blue-700"
                        : s.role === "Waiter"
                          ? "bg-green-100 text-green-700"
                          : ""
                      }`}
                  >
                    {s.role}
                  </span>
                )}
              </div>

              {/* <button
                onClick={() => removeStaff(s.id)}
                className="text-red-600 text-sm font-medium"
              >
                Remove
              </button> */}
            </div>

            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p><strong>Phone:</strong> {s.phone_number || "-"}</p>
              <p><strong>Email:</strong> {s.email}</p>
              <p><strong>Salary:</strong> {s.salary || "-"}</p>

            </div>
          </div>
        ))}

          {/* pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded-md text-sm ${currentPage === index + 1
                    ? "bg-orange-500 text-white"
                    : "border"
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>

          </div>
        )}

      </div>




      {/* MODAL */}

      {
        showModal && (

          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">


            <div className="bg-white p-6 rounded-xl w-96">


              <h3 className="text-lg font-semibold mb-4">
                Add Staff
              </h3>



              <input
                placeholder="First Name"
                className="border w-full p-2 mb-3 bg-white text-black "
                value={newStaff.first_name}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, first_name: e.target.value })
                }
              />

              <input
                placeholder="Last Name"
                className="border w-full p-2 mb-3 bg-white text-black"
                value={newStaff.last_name}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, last_name: e.target.value })
                }
              />

              <input
                placeholder="Email"
                className="border w-full p-2 mb-3 bg-white text-black"
                autoComplete="off"
                value={newStaff.email}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, email: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="border w-full p-2 mb-3 bg-white text-black"
                autoComplete="new-password"
                value={newStaff.password}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, password: e.target.value })
                }
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="border w-full p-2 mb-3 bg-white text-black"
                value={newStaff.phone_number}
                  onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // allow only digits
                  if (value.length <= 10) {
                    setNewStaff({ ...newStaff, phone_number: value })
                  }
                }}
                maxLength={10}
              />

              <select
                className="border w-full p-2 mb-3 bg-white text-black"
                value={newStaff.gender}
                onChange={(e) =>
                  setNewStaff({ ...newStaff, gender: e.target.value })
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              {/* role */}
              <select
                className="border w-full p-2 mb-3 bg-white text-black"
                value={newStaff.role}
                onChange={(e) => {
                  const role = e.target.value;
                  setNewStaff({
                    ...newStaff,
                    role,
                    salary: role === "Admin" ? "" : newStaff.salary
                  });
                }}
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Waiter">Waiter</option>
              </select>

              {newStaff.role && newStaff.role !== "Admin" && (
                <input
                  type="number"
                  placeholder="Salary"
                  className="border w-full p-2 mb-3 bg-white text-black no-spinner"
                  onWheel={(e)=>e.target.blur(e)}
                  value={newStaff.salary}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, salary: e.target.value })
                  }
                />
              )}



              <div className="flex justify-end gap-3">


                <button
                  onClick={() =>{setShowModal(false)
                    setNewStaff([])
                  }}
                  className="border px-4 py-2 rounded-md"
                >

                  Cancel

                </button>



                <button
                  onClick={addStaff}
                  className={` px-4 py-2 rounded-md flex gap-2 items-center ${isSubmitting ? "bg-gray-100 cursor-not-allowed" : "bg-orange-500 text-white"}`}
                >

                  <IoMdAddCircle size={18} />

                  {isSubmitting ? "Create" : "Create"}

                </button>


              </div>


            </div>


          </div>

        )

      }



    </div>

  );

};

export default HumanResources;