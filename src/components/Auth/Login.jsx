
import React, { useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import BASE_URL from "../../../config";
import 'bootstrap/dist/css/bootstrap.min.css';
import loginn from "../../assets/loginn.avif"; 
import backclr from "../../assets/backclr.jpg";

console.log("BASE_URL:", BASE_URL);

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTC, setAgreeTC] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!agreeTC) {
    //   toast.error("Please agree to Terms & Conditions");
    //   return;
    // }

    setLoading(true);

    try {
      
      const response = await axios.post(`${BASE_URL}login/`, {
        email: formData.email,
        password: formData.password,
      });

      const { access, refresh, user_id, role, restaurant_id } = response.data;
console.log("login res",response.data);

     localStorage.setItem("login res",response.data)
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("restaurant_id",restaurant_id)
      localStorage.setItem("role", role.toLowerCase());
      localStorage.setItem("email",formData.email);

      window.dispatchEvent(new Event("userChange"));

      toast.success("Login successful!");

      setTimeout(() => {
        if (role.toLowerCase() === "admin") {
          // navigate("/adminDash", { replace: true });
          window.location.href = "/adminDash";
        } else {
          navigate("/login", { replace: true });
        }
        // window.location.reload();
      }, 700);

    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      
      <div
  className="fixed inset-0 flex items-center justify-center overflow-hidden"

        style={{
          backgroundImage: `url(${backclr})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* PHONE CARD */}
        <div className="bg-white text-black w-[350px] rounded-[40px] shadow-2xl p-8 relative">

          {/* TOP IMAGE */}
          <div className="w-full h-40 rounded-[30px] overflow-hidden shadow">
            <img src={loginn} alt="Food" className="w-full h-full object-cover" />
          </div>

          <h4 className="text-center mt-4 font-bold">LOGIN ACCOUNT</h4>

          <Form onSubmit={handleSubmit} className="mt-4">

            {/* EMAIL */}
            <Form.Group className="mb-3">
              <div className="rounded-xl bg-white/60 backdrop-blur p-2 shadow">
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="border-0 bg-transparent"
                />
              </div>
            </Form.Group>

            {/* PASSWORD */}
            <Form.Group className="mb-3">
              <div className="rounded-xl bg-white/60 backdrop-blur p-2 shadow position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="border-0 bg-transparent"
                />

                <span
                  className="position-absolute top-50 end-0 translate-middle-y pe-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>
            </Form.Group>

            {/* TERMS */}
            {/* <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label={
                  <span className="font-bold">
                    I agree to <Link to="/terms">Terms & Conditions</Link>
                  </span>
                }
                checked={agreeTC}
                onChange={() => setAgreeTC(!agreeTC)}
                required
              />
            </Form.Group> */}

            {/* LOGIN BUTTON */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              style={{
                backgroundColor: "#ff5722",
                border: "none",
                padding: "12px",
                fontWeight: "bold",
                borderRadius: "12px",
              }}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Logging in...
                </>
              ) : (
                "LOGIN"
              )}
            </Button>
          </Form>

          {/* LINKS */}
          <div className="text-center mt-3">
            <Link to="/forgotpassword" className="text-muted small me-2">
              Forgot password?
            </Link>
            |
            <Link to="/signup" className="text-muted small ms-2">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
