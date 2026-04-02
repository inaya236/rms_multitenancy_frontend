import React, { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import Base_URL from "../../../../../config";
import EditableField from "../../EditableField";
import { useNavigate } from "react-router-dom";
import axios from "../../../../api/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProfile = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    phone_number: "",
  });

  const [adminDetails, setAdminDetails] = useState({});

  const email = localStorage.getItem("email");
  const adminId = localStorage.getItem("user_id");

  const navigate = useNavigate();

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    try {
      const res = await axios.get(`${Base_URL}get-users/`);
      const users = res.data;

      const matchedUser = users.find((u) => u.email === email);

      setAdminDetails(matchedUser);
      setFormData(matchedUser);
      console.log("admin details res", matchedUser)
    } catch (error) {
      console.error("Error fetching admin details", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const originalData = {
      first_name: adminDetails.first_name || "",
      last_name: adminDetails.last_name || "",
      gender: adminDetails.gender || "",
      email: adminDetails.email || "",
      phone_number: adminDetails.phone_number || "",
    };

    const hasChanges = Object.keys(originalData).some(
      (key) =>
        formData[key]?.toString().trim() !==
        (originalData[key]?.toString().trim() || "")
    );

    if (!hasChanges) {
      toast.info("No changes to save.");
      return;
    }

    try {
      await axios.patch(`${Base_URL}get-users/${adminId}/`, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        phone_number: formData.phone_number,
      });

      toast.success("Changes saved successfully!");

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Error saving changes", error);
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} position="top-center" />
<div className="min-h-screen">
      {/* desktop*/}
      <div className="hidden md:block ">
<div className=" flex flex-col bg-white relative p-6 md:p-12 ">
          <div className="absolute w-[700px] h-[700px] bg-[var(--primary-color)] rounded-full top-[-200px] left-[-200px] opacity-20"></div>
          <div className="absolute w-[600px] h-[600px] bg-[var(--primary-color)] rounded-full bottom-[-200px] right-[-200px] opacity-10"></div>


          <div className="relative flex flex-col max-w-5xl mx-auto my-8 md:my-12 bg-white/60 border border-gray-200 rounded-2xl shadow-lg  w-full min-h-[70vh] p-8">

            <div className="flex  justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center gap-4">
                <FaUserAlt
                  size={70}
                  className="bg-gray-200 rounded-full p-4"
                />

                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {adminDetails.first_name} {adminDetails.last_name}
                  </h2>

                  <p className="text-gray-700">{email}</p>
                </div>
              </div>
            </div>

            {/* form */}
            <div className="flex justify-center items-center flex-1 mt-10">
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl text-gray-700"
              >

                <div className="flex flex-col gap-6 w-full">
                  <EditableField
                    label="First Name"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />

                  <div>
                    <label className="block mb-2 font-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full p-3 rounded-md bg-gray-100 border border-gray-300"
                    />
                  </div>

                  <EditableField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </div>

                {/* right side */}
                <div className="flex flex-col gap-6 w-full">
                  <EditableField
                    label="Last Name"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />

                  <EditableField 
                  label="Phone Number" 
                  type="text" 
                  name="phone_number"
                   placeholder="Phone Number" 
                   value={formData.phone_number} 
                   onChange={(e) => { const val = e.target.value; if (/^\d*$/.test(val) && val.length <= 10) { handleChange(e); } }} 
                   maxLength={10} 
                   pattern="\d{10}" 
                   title="Phone number must be 10 digits" 
                   />

                </div>

                <div className="flex flex-col items-center justify-end">
                  <button
                    type="button"
                    className="mt-4 bg-[var(--primary-color)] text-white px-6 py-2 rounded-md shadow hover:bg-[var(--primary-color)]/90 w-48"
                    onClick={() => navigate("/changepassword")}
                  >
                    Change Password
                  </button>
                </div>

                <div className="flex gap-4 md:justify-end">
                  <button
                    type="submit"
                    className="px-6 h-[50px] bg-[var(--primary-color)] text-white rounded hover:[var(--primary-color)]/90"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="px-6 h-[50px] bg-[var(--primary-color)] text-white rounded hover:bg-[var(--primary-color)]/90"
                  >
                    Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

       {/* mobile ui */}
<div className="md:hidden min-h-screen max-h-screen overflow-y-auto bg-gray-50 pb-32">
          <div className="bg-[var(--primary-color)] pt-10 pb-16 flex flex-col items-center text-white rounded-b-3xl shadow-md">
          <div className="bg-white text-[var(--primary-color)] rounded-full p-5 shadow-lg">
            <FaUserAlt size={35} />
          </div>

          <h2 className="mt-3 text-lg font-semibold">
            {adminDetails.first_name} {adminDetails.last_name}
          </h2>

          <p className="text-sm opacity-90">{email}</p>
        </div>

        {/* form */}
        <div className="px-4 -mt-10 pb-10">
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <EditableField
                label="First Name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />

              <EditableField
                label="Last Name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Email
                </label>
                <input
                  disabled
                  value={formData.email}
                  className="w-full bg-gray-100 border border-gray-200 p-3 rounded-lg"
                />
              </div>

              <EditableField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                ]}
              />

             <EditableField 
                  label="Phone Number" 
                  type="text" 
                  name="phone_number"
                   placeholder="Phone Number" 
                   value={formData.phone_number} 
                   onChange={(e) => { const val = e.target.value; if (/^\d*$/.test(val) && val.length <= 10) { handleChange(e); } }} 
                   maxLength={10} 
                   pattern="\d{10}" 
                   title="Phone number must be 10 digits" 
                   />

              <button
                type="button"
                onClick={() => navigate("/changepassword")}
                className="w-full border border-[var(--primary-color)] text-[var(--primary-color)] py-3 rounded-lg font-medium"
              >
                Change Password
              </button>

              <button
                type="submit"
                className="w-full bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full text-gray-500 py-3"
              >
                Back
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default AdminProfile;