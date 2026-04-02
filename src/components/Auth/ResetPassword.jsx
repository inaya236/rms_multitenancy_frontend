import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BASE_URL from "../../../config";

const ResetPassword = () => {
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const token=localStorage.getItem("resetToken")

  const handleReset = async () => {
    if (!otp || !newPass) {
      setError("Please fill all fields");
      return;
    }

    if (!email) {
      setError("Email missing! Please restart the process.");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${BASE_URL}password-reset-confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, new_password: newPass,token }),
      });

      const data = await res.json();
      console.log("Response Data:", data);

      if (res.ok) {
        setSuccess("✅ Password reset successful!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(data.detail || JSON.stringify(data) || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      setError("Network error, try again later");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-sky-200 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-sky-900 mb-6">
          Reset Password
        </h2>

        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 text-sm text-center">{success}</div>}

        <div className="mb-4">
          <label htmlFor="otp" className="block text-sky-800 font-medium mb-1">
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="new-password" className="block text-sky-800 font-medium mb-1">
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            placeholder="Enter new password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-sky-800 text-white py-2 rounded-lg hover:bg-sky-900 transition"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;