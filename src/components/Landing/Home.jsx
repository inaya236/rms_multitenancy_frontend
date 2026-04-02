import React, { useEffect, useState } from "react";
import { MdOutlineInventory } from "react-icons/md";
import { GiWoodenChair } from "react-icons/gi";
import { IoFastFoodOutline } from "react-icons/io5";
import aboutImg from "../../assets/about.png";
import { motion } from "framer-motion";
import demo from "../../assets/demo.png"
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoIosMail } from "react-icons/io";
import { IoMenu, IoClose } from "react-icons/io5";


const Home = () => {

  const [activeSection, setActiveSection] = useState("home")
  const [menuOpen, setMenuOpen] = useState(false);

  // useEffect(() => {
  //   const sections = ["home", "about", "services", "pricing", "contact"];

  //   const handleScroll = () => {
  //     let current = "";

  //     sections.forEach((id) => {
  //       const section = document.getElementById(id);

  //       if (section) {
  //         const rect = section.getBoundingClientRect();

  //         if (rect.top <= 150 && rect.bottom >= 150) {
  //           current = id;
  //         }
  //       }
  //     });

  //     setActiveSection(current);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [])

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };
  return (
    <div className="bg-[#f7f5f2] text-gray-800 scroll-smooth">

      {/* navbar */}
      <nav className="sticky top-0 z-20 flex justify-between items-center px-6 md:px-10 py-4 bg-white shadow-sm">

  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
    RMS<span className="text-orange-500">Control</span>
  </h1>

  {/* desktop menu */}
  <div className="hidden md:flex gap-8 items-center">
    {["home", "about", "services", "pricing", "contact"].map((item) => (
      <a
        key={item}
        href={`#${item}`}
        onClick={() => setActiveSection(item)}
        className={`group relative text-lg font-medium transition duration-300 
        ${activeSection === item
            ? "text-orange-500"
            : "text-gray-700 hover:text-orange-500"}`}
      >
        {item.charAt(0).toUpperCase() + item.slice(1)}

        {/* underline */}
        <span
          className={`absolute left-0 -bottom-1 h-[2px] bg-orange-500 transition-all duration-300
          ${activeSection === item ? "w-full" : "w-0 group-hover:w-full"}`}
        ></span>
      </a>
    ))}
  </div>

  {/*mobile menu button */}
  <div className="md:hidden">
    <button onClick={() => setMenuOpen(!menuOpen)}>
      {menuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
    </button>
  </div>

  {/* mobile dropdown */}
  {menuOpen && (
    <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-6 gap-6 md:hidden">

      {["home", "about", "services", "pricing", "contact"].map((item) => (
        <a
          key={item}
          href={`#${item}`}
          onClick={() => {
            setActiveSection(item);
            setMenuOpen(false);
          }}
          className={`text-lg font-medium transition duration-300 
          ${activeSection === item
              ? "text-orange-500"
              : "text-gray-700 hover:text-orange-500"}`}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </a>
      ))}

    </div>
  )}

</nav>

      {/* hero section */}
      <section id="home" className="min-h-screen grid md:grid-cols-2 items-center px-10 py-16 gap-10 bg-gradient-to-b from-[#f7f5f2] to-[#f1ede7]">

        {/*left */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          {/* badge */}
          <div className="inline-block mb-4 px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
            Smart Restaurant Management
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6 text-gray-900">
            Control Your Restaurant. <br />
            <span className="text-orange-500">Increase Your Profits.</span>
          </h1>

          <p className="text-gray-600 mb-8 text-lg max-w-lg">
            Manage orders, track inventory, and monitor performance —
            all in one powerful system built for modern restaurants.
          </p>

          <div className="flex gap-4">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 shadow-md">
              Request Demo
            </button>

            <button className="border px-6 py-3 rounded-xl hover:bg-gray-100">
              Contact Us
            </button>
          </div>
        </motion.div>

        {/* right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >

          {/* Background glow */}
          <div className="absolute inset-0 bg-orange-100 rounded-3xl blur-2xl opacity-40"></div>

          {/* Image */}
          <img
            src={demo}
            alt="RMS Dashboard"
            className="relative rounded-2xl shadow-xl border"
          />

        </motion.div>

      </section>

      {/* about us */}
      <section id="about" className="min-h-screen flex items-center px-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <img
            src={aboutImg}
            alt="about"
            className="rounded-2xl shadow-md w-full object-cover"
          />

          <div>
            <h2 className="text-4xl font-bold mb-6">About Us</h2>

            <p className="text-gray-700 text-lg leading-relaxed">
              We built RMSControl to solve real problems faced by restaurant owners every day.
              Managing orders, inventory, and staff shouldn’t be complicated.

              RMSControl brings everything into one system — helping you reduce losses,
              improve efficiency, and make smarter business decisions.

              Whether you run a café or multiple outlets, we scale with your growth.
            </p>
          </div>

        </div>
      </section>

      {/* services */}

      <section id="services" className="min-h-screen px-10 py-20 bg-[#f1ede7]">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-orange-500 font-medium mb-2">Features</p>

          <h2 className="text-4xl font-bold mb-4">
            Everything You Need to Run Your Restaurant
          </h2>

          <p className="text-gray-600">
            Powerful tools designed to simplify operations and boost performance
          </p>
        </div>

        {/* cards */}
        <div className="grid md:grid-cols-3 gap-10">

          <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2">

            <div className="w-14 h-14 flex items-center justify-center bg-green-100 rounded-xl mb-5 group-hover:scale-110 transition">
              <MdOutlineInventory size={28} className="text-green-700" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Inventory Control
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              Track stock levels in real-time, reduce wastage, and never run out of
              essential ingredients.
            </p>

          </div>


          <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2">

            <div className="w-14 h-14 flex items-center justify-center bg-red-100 rounded-xl mb-5 group-hover:scale-110 transition">
              <GiWoodenChair size={28} className="text-red-700" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Table Management
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              Manage table availability, reservations, and seating efficiently with
              real-time updates.
            </p>

          </div>


          <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2">

            <div className="w-14 h-14 flex items-center justify-center bg-teal-100 rounded-xl mb-5 group-hover:scale-110 transition">
              <IoFastFoodOutline size={28} className="text-teal-600" />
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Order Management
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed">
              Streamline orders with live tracking, faster processing, and seamless
              coordination between staff.
            </p>

          </div>

        </div>

      </section>

      {/* pricing*/}
      <section id="pricing" className="min-h-screen flex items-center px-10">
        <div className="w-full text-center">

          <h2 className="text-4xl font-bold mb-12">Pricing Plans</h2>
          <p className="">Choose the perfect plan for your restaurant and start growing today. </p>


          <div className="grid md:grid-cols-3 gap-8">

            <div className="group bg-gray-100 border border-gray-200 p-8 rounded-2xl 
                 shadow-sm hover:shadow-xl transition duration-300 
                 hover:-translate-y-2 hover:bg-orange-500 hover:text-white">

              <h3 className="text-xl font-semibold mb-2 group-hover:text-white">
                Basic
              </h3>

              <p className="text-gray-600 group-hover:text-white/80">
                For small restaurants
              </p>

              <p className="text-3xl font-bold mb-4 group-hover:text-white">
                ₹999/mo
              </p>

              <hr className="group-hover:border-white/30" />

              <p className="text-gray-600 mb-3 group-hover:text-white/80">
                Order management
              </p>

              <p className="text-gray-600 mb-3 group-hover:text-white/80">
                Table management
              </p>

              <p className="text-gray-600 mb-3 group-hover:text-white/80">
                Basic reports
              </p>

              <p className="text-gray-600 mb-6 group-hover:text-white/80">
                Email support
              </p>

              <button className="border px-6 py-2 rounded-lg 
                  group-hover:bg-white group-hover:text-orange-500">
                Get Started
              </button>

            </div>
            <div className="group bg-gray-100 border border-gray-200 p-8 rounded-2xl 
                 shadow-sm hover:shadow-xl transition duration-300 
                 hover:-translate-y-2 hover:bg-orange-500 hover:text-white">
              <h3 className="text-xl font-semibold mb-4">Pro</h3>
              <p>Best for growing restaurants</p>
              <p className="text-3xl font-bold mb-4">₹1999/mo</p>
              <hr />
              <p className="text-gray-600 mb-3 group-hover:text-white/80">Everything in basic</p>
              <p className="text-gray-600 mb-3 group-hover:text-white/80">Inventory control</p>
              <p className="text-gray-600 mb-3 group-hover:text-white/80">Advanced analytics </p>
              <p className="text-gray-600 mb-3 group-hover:text-white/80">Staff management</p>

              <button className="border px-6 py-2 rounded-lg 
                group-hover:bg-white group-hover:text-orange-500">
                Get Started
              </button>
            </div>

            <div className="group bg-gray-100 border border-gray-200 p-8 rounded-2xl 
                 shadow-sm hover:shadow-xl transition duration-300 
                 hover:-translate-y-2 hover:bg-orange-500 hover:text-white">
              <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
              <p className="text-3xl font-bold mb-4">Custom</p>
              <p className="text-gray-600 mb-3 group-hover:text-white/80">For large businesses</p>
              <button className="border px-6 py-2 rounded-lg 
                group-hover:bg-white group-hover:text-orange-500">Contact Us</button>
            </div>

          </div>
        </div>
      </section>

      {/* contact us*/}
      <section id="contact" className="min-h-screen flex items-center px-10 py-20 bg-[#f1ede7]">

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto w-full">

          <div>
            <p className="text-orange-500 font-medium mb-2">Contact</p>

            <h2 className="text-4xl font-bold mb-6">
              Let's Grow Your Restaurant
            </h2>

            <p className="text-gray-600 mb-8">
              Tell us about your restaurant and we’ll help you streamline operations,
              reduce losses, and increase profits with RMSControl.
            </p>

            <div className="space-y-4 text-gray-700">
              <div className="flex gap-2 items-center">
                <BsFillTelephoneFill className="text-red-900" />
                +91 98765 43210
              </div>

              <div className="flex gap-2 items-center">
                <IoIosMail className="text-[#5b5b58]" size={20} />
                support@rmscontrol.com
              </div>

              <p>📍 India</p>
            </div>
          </div>

          {/* form */}
          <form className="bg-white p-8 rounded-3xl shadow-xl space-y-5">

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Restaurant Name"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              <input
                type="text"
                placeholder="Owner Name"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <textarea
              rows="4"
              placeholder="Tell us about your restaurant"
              className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button className="w-full bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition font-medium shadow-md">
              Request Demo
            </button>

          </form>

        </div>

      </section>

    </div>
  )
}

export default Home;


{/* <section id="pricing" className="min-h-screen flex items-center px-10 py-20 bg-[#f7f5f2]">

  <div className="w-full text-center max-w-6xl mx-auto"> */}

{/* Heading */ }
// <p className="text-orange-500 font-medium mb-2">Pricing</p>

// <h2 className="text-4xl font-bold mb-4">
//   Simple, Transparent Pricing
// </h2>

// <p className="text-gray-600 mb-14">
//   No hidden fees. Choose a plan that fits your restaurant size.
// </p>

{/* Cards */ }
// <div className="grid md:grid-cols-3 gap-10">

{/* BASIC */ }
// <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2">

//   <h3 className="text-xl font-semibold mb-2">Basic</h3>
//   <p className="text-gray-500 text-sm mb-4">For small restaurants</p>

//   <p className="text-4xl font-bold mb-6">
//     ₹999<span className="text-lg font-normal text-gray-500">/mo</span>
//   </p>

//   <ul className="text-gray-600 text-sm space-y-3 mb-8 text-left">
//     <li>✔ Order Management</li>
//     <li>✔ Table Management</li>
//     <li>✔ Basic Reports</li>
//     <li>✔ Email Support</li>
//   </ul>

//   <button className="w-full border py-3 rounded-xl hover:bg-gray-100 transition">
//     Get Started
//   </button>
// </div>

{/* PRO (highlighted) */ }
// <div className="relative bg-orange-500 text-white p-10 rounded-3xl shadow-xl scale-105">

{/* badge */ }
//   <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-orange-500 text-xs px-4 py-1 rounded-full shadow">
//     MOST POPULAR
//   </span>

//   <h3 className="text-xl font-semibold mb-2">Pro</h3>
//   <p className="text-sm mb-4 opacity-90">Best for growing restaurants</p>

//   <p className="text-4xl font-bold mb-6">
//     ₹1999<span className="text-lg font-normal opacity-80">/mo</span>
//   </p>

//   <ul className="text-sm space-y-3 mb-8 text-left">
//     <li>✔ Everything in Basic</li>
//     <li>✔ Inventory Control</li>
//     <li>✔ Advanced Analytics</li>
//     <li>✔ Staff Management</li>
//     <li>✔ Priority Support</li>
//   </ul>

//   <button className="w-full bg-white text-orange-500 py-3 rounded-xl hover:bg-gray-100 transition font-medium">
//     Get Started
//   </button>
// </div>

{/* ENTERPRISE */ }
//       <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2">

//         <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
//         <p className="text-gray-500 text-sm mb-4">For large businesses</p>

//         <p className="text-4xl font-bold mb-6">
//           Custom
//         </p>

//         <ul className="text-gray-600 text-sm space-y-3 mb-8 text-left">
//           <li>✔ Multi-Outlet Support</li>
//           <li>✔ Custom Integrations</li>
//           <li>✔ Dedicated Manager</li>
//           <li>✔ 24/7 Support</li>
//         </ul>

//         <button className="w-full border py-3 rounded-xl hover:bg-gray-100 transition">
//           Contact Us
//         </button>
//       </div>

//     </div>
//   </div>
// </section>