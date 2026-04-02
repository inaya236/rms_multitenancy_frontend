import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Base_URL from '../../../../config';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const themes = {
    orange_white: {
        name: "Classic",
        primary: "#ff5722",
        secondary: "#ffffff",
    },
    olive_white: {
        name: "Fresh",
        primary: "#3D5A40",
        secondary: "#ffffff",
    },
    skyBlue_white: {
        name: "Coastal",
        primary: "#9cc6f7",
        secondary: "#ffffff",
    },
    gold_black: {
        name: "Premium",
        primary: "#d4af37",
        secondary: "#1111",
    },
    maroon_white: {
        name: "Imperial",
        primary: "#721a17",
        secondary: "#fffdfd",
    }
};

const AddRestaurant = () => {
    // const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate()

    const [plans, setPlans] = useState([]);

    const [planOpt, setPlanOpt] = useState([])


    const [formData, setFormData] = useState({
        // Restaurant Info
        name: "",
        phone_number: "",
        address: "",

        // Admin Info
        first_name: "",
        last_name: "",
        email: "",
        password: "",

        // Subscription
        plan_pricing: "",
        plan_duration: "",
        total_amount: 0,
        current_payment: "",
        payment_mode:"",
        balance_due: 0,

        // UI Info
        theme: "orange_white",
        primary_color: "white",
        secondary_color: "orange",
        logo: "",

        // Features
        features: []
    });

    const selectedTheme = themes[formData.theme];

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await axios.get(`${Base_URL}plans/`);
                setPlans(res.data)
            } catch (error) {
                console.error(error)
            }
        }

        //   fetchPlans()
    }, [])

    const getPlanOpt = async () => {
        try {
            const res = await axios.get(`${Base_URL}core/plan-pricing/`)
            console.log("plan options", res.data)
            setPlanOpt(res.data)
        } catch (error) {
            console.error("error", error);
        }
    }

    useEffect(() => {
        getPlanOpt()
    }, [])

    // const handleFeatureChange = (e) => {
    //     const { name, checked } = e.target;
    //     setFormData((prev) => {
    //         if (checked) {
    //             return {
    //                 ...prev,
    //                 features: [...prev.features, name]
    //             }
    //         } else {
    //             return {
    //                 ...prev,
    //                 features: prev.features.filter((f) => f !== name)
    //             }
    //         }
    //     });
    // };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "logo") {
            setFormData((prev) => ({
                ...prev,
                logo: files[0],
            }));
            return
        }


        let updatedData = {
            ...formData,
            [name]: value
        };

        const selectedPlan = planOpt.find(
            (p) =>
                p.plan === Number(name === "plan" ? value : formData.plan) &&
                p.interval === (name === "plan_duration" ? value : formData.plan_duration)
        );
        if (selectedPlan) {
            const price = Number(selectedPlan.price);

            updatedData.total_amount = price;
            updatedData.plan_pricing=selectedPlan.id

            const current = Number(updatedData.current_payment || 0);
            updatedData.balance_due = price - current;
        }

        if (name === "current_payment") {
            const current = Number(value);
            const total = Number(formData.total_amount);

            if (current < 0) {
                toast.warning("Payment cannot be negative");
                return;
            }

            if (current > total) {
                toast.warning("Payment cannot exceed total amount");
                return;
            }
            updatedData.current_payment = current;
            updatedData.balance_due = total - current;
        }

        setFormData(updatedData);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedTheme = themes[formData.theme];

        const formDataToSend = new FormData();

        formDataToSend.append("name", formData.name);
        formDataToSend.append("phone_number", formData.phone_number);
        formDataToSend.append("address", formData.address);

        formDataToSend.append("first_name", formData.first_name);
        formDataToSend.append("last_name", formData.last_name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("amount_paid",formData.current_payment);
        formDataToSend.append("payment_mode",formData.payment_mode);

        formDataToSend.append("plan_pricing", formData.plan_pricing);

        console.log("plan id",formData.plan)

        formDataToSend.append("theme", formData.theme);
        formDataToSend.append("primary_color", selectedTheme.primary);
        formDataToSend.append("secondary_color", selectedTheme.secondary);

        if (formData.logo) {
            formDataToSend.append("logo", formData.logo);
        }

        formData.features.forEach((feature) => {
            formDataToSend.append("features", feature);
        });

        try {
            const res = await axios.post(
                `${Base_URL}core/register_restaurant/`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success("Restaurant registered successfully");
            setFormData({
                name: "",
                phone_number: "",
                address: "",
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                plan: "",
                theme: "orange_white",
                primary_color: "",
                secondary_color: "",
                current_payment:"",
                payment_mode:"",
                logo: "",
                features: []
            });
            setTimeout(() => {
                navigate("/restaurantList")
            }, 2000)

        } catch (error) {
            console.error(error);
            toast.error("Error registering restaurant");
        }
    };


    return (
        <>
            <ToastContainer duration={2000} position={"top-center"} />
            <div className='min-h-screen bg-[#FBF7F2] px-4 py-8 overflow-visible '>
                {/* page content */}
                <form onSubmit={handleSubmit} className='max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-[#f3d7cf] overflow-hidden'
                >

                    <div className='relative p-6 md:p-8 border-b border-[#f1e7df]'>

                        <div className='absolute top-0 left-0 w-full h-2 bg-[#ff5722]' />
                        <div className='flex items-start justify-between gap-4'>
                            <h2 className='text-2xl md:text-3xl font-bold text-black'>Create Restaurant</h2>

                            {/* close button */}
                            <button type='button' onClick={() => navigate(-1)}
                                className='w-10 h-10 rounded-xl flex items-center justify-center text-2xl text-gray-700 hover:bg-gray-100'
                            >
                                &times;
                            </button>
                        </div>
                    </div>

                    <div className='p-6 md:p-8 space-y-10'>
                        {/* restaurant info */}
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-bold text-[#3D5A40]'>Restaurant Details</h3>
                            <div className='h-[2px] flex-1 ml-4 bg-gradient-to-r from-[#3D5A40]/40 to-transparent' />
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">Restaurant Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. PizzaPoint"
                                    className="w-full mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">Phone</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ""); // allow only digits

                                        if (value.length <= 10) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                phone_number: value,
                                            }));
                                        }
                                    }}
                                    maxLength={10}
                                    onWheel={(e) => e.target.blur()}
                                    placeholder="e.g. 9876543210"
                                    className="w-full no-spinner mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-[#1F1F1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30"

                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Street / Area"
                                    className="w-full mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-[#1F1F1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30"

                                />
                            </div>
                        </div>

                        {/* admin info */}
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-bold text-[#3D5A40]'>Admin Details</h3>
                            <div className='h-[2px] flex-1 ml-4 bg-gradient-to-r from-[#3D5A40]/40 to-transparent' />
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Fawad"
                                    className="w-full mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-[#1F1F1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Khan"
                                    className="w-full mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-[#1F1F1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">Admin Email</label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="e.g. admin@pizzahub.com"
                                    autoComplete='off'
                                    type="email"
                                    className="w-full mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-[#1F1F1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">Admin Password</label>
                                <input
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Set a temporary password"
                                    autoComplete='new-password'
                                    type="password"
                                    className="w-full mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-[#1F1F1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30"
                                    required
                                />
                            </div>
                        </div>

                        {/* subscription */}
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-bold text-[#3D5A40]'>Subscription</h3>
                            <div className='h-[2px] flex-1 ml-4 bg-gradient-to-r from-[#3D5A40]/40 to-transparent' />
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">Plan</label>
                                <select
                                    name="plan"
                                    value={formData.plan}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-[#1F1F1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30"
                                >
                                    <option value="">Select</option>
                                    {[
                                        ...new Map(planOpt.map(p => [p.plan, p])).values()
                                    ].map((p) => (
                                        <option key={p.plan} value={p.plan}>
                                            {p.plan_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">Plan Duration</label>
                                <select
                                    name="plan_duration"
                                    value={formData.plan_duration}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-[#1F1F1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30"
                                >
                                    <option value="">Select</option>

                                    {planOpt
                                        .filter(p => p.plan === Number(formData.plan))
                                        .map((p) => (
                                            <option key={p.id} value={p.interval}>
                                                {p.interval}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">Total Amount</label>
                                <input
                                    name="total_amount"
                                    value={formData.total_amount}
                                    disabled
                                    onChange={handleChange}
                                    type='number'
                                    onWheel={(e) => e.target.blur()}
                                    className="w-full no-spinner mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-[#1F1F1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30 cursor-not-allowed"
                                />
                            </div>

                             <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">Balance Due</label>
                                <input
                                    name="balance_due"
                                    value={formData.balance_due}
                                    onChange={handleChange}
                                    type='number'
                                    onWheel={(e) => e.target.blur()}
                                    className="w-full no-spinner mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-[#1F1F1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">Current Payment</label>
                                <input
                                    name="current_payment"
                                    value={formData.current_payment}
                                    onChange={handleChange}
                                    type='number'
                                    onWheel={(e) => e.target.blur()}
                                    className="w-full no-spinner mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-[#1F1F1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">Payment Mode</label>
                                <select
                                    name="payment_mode"
                                    value={formData.payment_mode}
                                    onChange={handleChange}
                                    className="w-full no-spinner mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-[#1F1F1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30"
                                >
                                  <option value="">Select</option>
                                  <option value="cash">Cash</option>
                                  <option value="card">Card</option>
                                  <option value="upi">UPI</option>
                                </select>
                            </div>

                           
                        </div>

                        {/* ui info */}
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-bold text-[#3D5A40]'>UI / Branding</h3>
                            <div className='h-[2px] flex-1 ml-4 bg-gradient-to-r from-[#3D5A40]/40 to-transparent' />
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-semibold text-[#1F1F1F]">Theme</label>
                                <select
                                    name="theme"
                                    value={formData.theme}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-black"
                                >
                                    {Object.entries(themes).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="">
                                <label className="text-sm font-semibold text-[#1F1F1F]">Upload Logo</label>

                                <input
                                    type="file"
                                    name='logo'
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-[#f3d7cf] bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#ff5722]/30"
                                />
                            </div>
                            {/* ui preview */}
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-[#1F1F1F] mb-3 block">
                                    Live UI Preview
                                </label>

                                {/* mobile wrapper */}
                                <div className="w-full overflow-x-auto">
                                    <div className="min-w-[900px] scale-90 sm:scale-100 origin-top-left transition-all duration-300">

                                        <div className="w-full max-w-4xl h-[380px] rounded-2xl overflow-hidden shadow-2xl border bg-white flex">

                                            {/* sidebar */}
                                            <div className="w-56 flex flex-col justify-between text-black p-4">

                                                <div>
                                                    <div className='flex items-center gap-2'>
                                                        <div className="text-md mb-6">LOGO</div>
                                                        <div className="text-lg font-bold mb-6">
                                                            Restaurant
                                                            <span style={{ color: selectedTheme.primary }}>
                                                                Name
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 text-sm">
                                                        <div className="h-8 bg-gray-200 rounded-md"></div>
                                                        <div className="h-8 bg-gray-200 rounded-md"></div>
                                                        <div className="h-8 bg-gray-200 rounded-md"></div>
                                                        <div
                                                            className="h-8 rounded-md"
                                                            style={{ backgroundColor: selectedTheme.primary }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <div className="h-8 bg-gray-200 rounded-md"></div>
                                            </div>

                                            {/* main content */}
                                            <div className="flex-1 flex flex-col bg-gray-100">

                                                {/* navbar */}
                                                <div className="h-14 bg-white shadow-sm flex items-center justify-between px-6">
                                                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                                                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                                                </div>

                                                {/* page content */}
                                                <div className="flex-1 p-6 space-y-5">

                                                    {/* cards */}
                                                    <div className="grid grid-cols-3 gap-4">
                                                        {[1, 2, 3].map((item) => (
                                                            <div key={item} className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                                                                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                                                <div
                                                                    className="h-6 w-20 rounded"
                                                                    style={{ backgroundColor: selectedTheme.primary }}
                                                                ></div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* tables */}
                                                    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                                                        <div className="h-4 w-40 bg-gray-200 rounded"></div>
                                                        <div className="space-y-2">
                                                            <div className="h-8 bg-gray-100 rounded"></div>
                                                            <div className="h-8 bg-gray-100 rounded"></div>
                                                            <div className="h-8 bg-gray-100 rounded"></div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* features */}
                        {/* <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-bold text-[#3D5A40]'>Functionalities (Enable Features)</h3>
                            <div className='h-[2px] flex-1 ml-4 bg-gradient-to-r from-[#3D5A40]/40 to-transparent' />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 bg-[#FBF7F2] p-5 rounded-2xl border border-[#f3d7cf] overflow-visible">

                            <div className="daisy-tooltip w-full" data-tip="Manage billing, generate invoices, apply discounts and handle payments seamlessly.">

                                <label className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-[#f3d7cf] hover:shadow-sm transition cursor-pointer">

                                    <input
                                        type="checkbox"
                                        name="BILLING"
                                        checked={formData.features.includes("BILLING")}
                                        onChange={handleFeatureChange}
                                        className="w-4 h-4 accent-[#ff5722]"
                                    />

                                    <span className="text-sm font-semibold text-gray-800">
                                        Billing
                                    </span>

                                </label>

                            </div>

                            <div className="daisy-tooltip w-full" data-tip="Dynamic menu control with pricing updates, item availability, and category management.">

                                <label className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-[#f3d7cf] hover:shadow-sm transition cursor-pointer">

                                    <input
                                        type="checkbox"
                                        name="MENU"
                                        checked={formData.features.includes("MENU")}
                                        onChange={handleFeatureChange}
                                        className="w-4 h-4 accent-[#ff5722]"
                                    />

                                    <span className="text-sm font-semibold text-gray-800">
                                        Menu Management
                                    </span>

                                </label>

                            </div>

                            <div className="daisy-tooltip w-full" data-tip="Seamless ordering system with live tracking and automated order processing.">
                                <label className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-[#f3d7cf] hover:shadow-sm transition cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="ORDERS"
                                        checked={formData.features.includes("ORDERS")}
                                        onChange={handleFeatureChange}
                                        className="w-4 h-4 accent-[#ff5722]"
                                    />
                                    <span className="text-sm font-semibold text-gray-800">Orders</span>
                                </label>
                            </div>

                            <div className="daisy-tooltip w-full" data-tip="Efficient table management with real-time table availability and booking control.">
                                <label className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-[#f3d7cf] hover:shadow-sm transition cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="tables"
                                        checked={formData.features.includes("tables")}
                                        onChange={handleFeatureChange}
                                        className="w-4 h-4 accent-[#ff5722]"
                                    />
                                    <span className="text-sm font-semibold text-gray-800">Tables</span>
                                </label>
                            </div>

                            <label className="relative group flex items-center gap-3 p-3 rounded-xl bg-white border border-[#f3d7cf] hover:shadow-sm transition cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="staffManagement"
                                    checked={formData.features.includes("staffManagement")}
                                    onChange={handleFeatureChange}
                                    className="w-4 h-4 accent-[#ff5722]"
                                />
                                <span className="text-sm font-semibold text-gray-800">Staff Management</span>
                                {/* tooltip */}
                        {/* <div className='absolute left-0 z-10 -bottom-12 w-64 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none'>
                                    <div className='bg-black/80 text-white text-xs rounded-lg p-2 shadow-lg'>
                                        Complete workforce management including roles, shifts, payroll, and activity monitoring.
                                    </div>
                                </div>
                            </label>
                        </div>  */}

                        {/* submit */}
                        <div className='flex items-center justify-end gap-3 pt-2'>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-2 rounded-xl border border-[#f3d7cf] text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="px-8 py-2 rounded-xl bg-[#ff5722] hover:bg-[#e64a19] text-white font-semibold shadow-sm"
                            >
                                Create Restaurant
                            </button>
                        </div>
                    </div>




                </form>
                {/* </div> */}
            </div>
        </>
    )
}
export default AddRestaurant;