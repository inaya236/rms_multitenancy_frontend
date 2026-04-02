import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${BASE_URL}password-reset-request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("OTP sent to your email");
        setTimeout(() => {
          navigate("/resetpassword", { state: { email } });
        }, 1500);
        console.log("reset res",data)
       localStorage.setItem("resetToken",data.token)
      } else {
        setError(data.detail || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error, try again later",err);
      console.error("Network error, try again later",err);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-sky-200 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-sky-900 mb-6">
          Forgot Password
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
        )}
        {success && (
          <div className="mb-4 text-green-600 text-sm text-center">{success}</div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-sky-800 font-medium mb-1">
            Enter your registered email
          </label>
          <input
            type="email"
            id="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-white text-black border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <button
          onClick={handleSendOtp}
          className="w-full bg-sky-800 text-white py-2 rounded-lg hover:bg-sky-900 transition"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
