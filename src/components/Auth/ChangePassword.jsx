import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../config";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${BASE_URL}change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();
       console.log("ChangePassword res",data)
      if (response.ok) {
        setMessage("✅ Password changed successfully.");
        setOldPassword("");
        setNewPassword("");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(data.detail || "❌ Failed to change password.");
      }
    } catch (err) {
      setMessage("❌ An error occurred.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-sky-200 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-sky-900 mb-6">Change Password</h2>

        {message && (
          <div
            className={`mb-4 text-center text-sm ${
              message.startsWith("✅")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="old-password" className="block font-medium text-sky-900 mb-1">
              Old Password
            </label>
            <input
              id="old-password"
              type="password"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white text-black border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label htmlFor="new-password" className="block font-medium text-sky-900 mb-1">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 bg-white text-black  py-2 border rounded-lg text-black  focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-800 text-white py-2 rounded-lg hover:bg-sky-900 transition"
          >
            🔄 Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;