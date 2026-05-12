import { BsCalendarDate } from "react-icons/bs";
import { FaRupeeSign } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import { useEffect, useState } from "react";
import planImg from "../../../../assets/planImg.svg"
import { useRestaurant } from "../../../../context/RestaurantContext";
import dayjs from "dayjs"
import Base_URL from "../../../../../config";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("plan");

    const [isPaying, setIsPaying] = useState(false);

    const [planDuration, setPlanDuration] = useState("monthly");
    const [selectedPlan, setSelectedPlan] = useState(null);
    const { restaurant, loading } = useRestaurant();

    const [plans, setPlans] = useState([])
    const [subsHistory, setSubsHistory] = useState([])

    const restaurantId = localStorage.getItem("restaurant_id");
    const paymentId = restaurant?.payment?.payment_id

    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const [paymentForm, setPaymentForm] = useState({
        total: 0,
        remaining: 0,
        amount: "",
        mode: ""
    });

    const [errors, setErrors] = useState({});

    const [showPlanModal, setShowPlanModal] = useState(false)
    const [planForm, setPlanForm] = useState({
        plan_id: "",
        plan_name: "",
        amount: "",
        duration: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        let newForm = { ...paymentForm, [name]: value };

        // auto calculate remaining balance
        if (name === "amount") {
            const amt = Number(value);

            if (!isNaN(amt)) {
                newForm.remaining = Number(restaurant.payment?.remaining) - amt;
            }
        }

        setPaymentForm(newForm);
    };

    const validate = () => {
        let err = {};

        const amt = Number(paymentForm.amount);

        if (!paymentForm.amount) {
            err.amount = "Enter amount";
        } else if (amt <= 0) {
            err.amount = "Amount must be greater than 0";
        } else if (amt > Number(restaurant.payment?.remaining)) {
            err.amount = "Cannot pay more than remaining balance";
        }

        if (!paymentForm.mode) {
            err.mode = "Select payment mode";
        }

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            console.log("Sending Data:", {
                amount_paid: paymentForm.amount,
                payment_mode: paymentForm.mode
            });

            setIsPaying(true);

            await axios.post(`${Base_URL}core/payments/pay/${paymentId}/`, {
                amount: paymentForm.amount,
                payment_mode: paymentForm.mode
            });

            toast.success("Payment Successful");

            setShowPaymentModal(false);

            getPlans()

        } catch (error) {
            console.error(error);
            setIsPaying(false)
            toast.error("Payment Failed");
        }
    };

    const handlePlanSubmit = async () => {
    try {
        await axios.post(`${Base_URL}core/subscribe/`, {
            plan_id: planForm.plan_id,
            restaurant_id: restaurantId
        });

        toast.success("Plan Activated");

        setShowPlanModal(false);
        getPlans();
        getPreviousSubs();

    } catch (error) {
        console.error(error);
        toast.error("Failed to activate plan");
    }
};


    const getPlans = async () => {
        try {
            const res = await axios.get(`${Base_URL}core/plan-pricing/`)
            setPlans(res.data)
            console.log("plans res", res.data);

        } catch (error) {
            console.error("error fetching plans", error);
        }
    }

    const getPreviousSubs = async () => {
        try {
            const res = await axios.get(`${Base_URL}core/restaurant_subscriptions/${restaurantId}/`)
            setSubsHistory(res.data)
            console.log("subscription history", res.data);

        } catch (error) {
            console.error("error fetching subscription history", error);
        }
    }

    useEffect(() => {
        getPlans()
        getPreviousSubs()
    }, [])

    const filteredPlans = plans.filter(
        (p) => p.interval.toLowerCase() === planDuration
    )

    return (
        <>
            <ToastContainer duration={1000} />
            <div className="relative min-h-screen bg-[#f8fafc] p-6 overflow-y-auto">

                {/* background circles */}
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute top-40 -right-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-70"></div>

                <div className="relative max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
                    <p className="text-gray-500 mt-1">Manage your restaurant preferences, plan, and account settings</p>

                    {/* tabs */}
                    <div className="flex gap-6 mt-6 border-b">
                        <button
                            onClick={() => setActiveTab("plan")}
                            className={`whitespace-nowrap px-3 py-2 border-b-2 transition-all duration-300
                                    ${activeTab === "plan"
                                    ? "border-[var(--primary-color)] text-[var(--primary-color)]"
                                    : "border-transparent text-gray-500 hover:text-[var(--primary-color)]"
                                }`}                    >
                            <div className='flex items-center gap-2'>
                                {/* <GiShop size={15} /> */}
                                Plan & Subscriptions
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab("transactions")}
                            className={`whitespace-nowrap px-3 py-2 border-b-2 transition-all duration-300
                                   ${activeTab === "transactions"
                                    ? "border-[var(--primary-color)] text-[var(--primary-color)]"
                                    : "border-transparent text-gray-500 hover:text-[var(--primary-color)]"
                                }`}                        >
                            <div className='flex items-center gap-2'>
                                {/* <FaMoneyBillTransfer /> */}
                                Transactions
                            </div>
                        </button>

                        <button
                            onClick={() => setActiveTab("theme")}
                            className={`whitespace-nowrap px-3 py-2 border-b-2 transition-all duration-300
                                   ${activeTab === "theme"
                                    ? "border-[var(--primary-color)] text-[var(--primary-color)]"
                                    : "border-transparent text-gray-500 hover:text-[var(--primary-color)]"
                                }`}                        >
                            <div className='flex items-center gap-2'>
                                {/* <FaMoneyBillTransfer /> */}
                                Theme
                            </div>
                        </button>



                    </div>
                    {activeTab === "plan" && (
                        <div className="bg-white p-4 rounded-xl border shadow-sm col-span-1">
                            {/* current plan details */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">

                                <div className="bg-green-50 p-4 rounded-xl">
                                    <div className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-lg mb-3">
                                        <BsCalendarDate />
                                    </div>
                                    <p className="text-sm text-gray-500">Current Plan</p>
                                    <h2 className="text-xl font-bold mt-1">{restaurant.subscription?.plan_name}</h2>
                                    <span className="text-xs bg-green-200 px-2 py-1 rounded mt-2 inline-block">
                                        {restaurant.subscription?.plan_interval}
                                    </span>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg mb-3">
                                        <BsCalendarDate />
                                    </div>
                                    <p className="text-sm text-gray-500">Valid Until</p>
                                    <h2 className="text-lg font-semibold mt-1">{restaurant?.subscription?.end_date && dayjs(restaurant?.subscription?.end_date).format("DD MMM YYYY")}</h2>
                                    <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded mt-2 inline-block ">
                                        <b>Next Renewal:</b> 15 Feb 2025
                                    </span>

                                </div>

                                <div className="bg-orange-50 p-4 rounded-xl">
                                    <div className="w-10 h-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded-lg mb-3">
                                        <FaRupeeSign />
                                    </div>
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <h2 className="text-xl font-bold mt-1"> ₹ {restaurant.payment?.total_amount}</h2>
                                </div>

                                <div className="bg-cyan-50 p-4 rounded-xl">
                                    <div className="w-10 h-10 flex items-center justify-center bg-cyan-100 text-cyan-600 rounded-lg mb-3">
                                        <MdAccountBalanceWallet />
                                    </div>
                                    <p className="text-sm text-gray-500">Remaining Due</p>
                                    <h2 className="text-xl font-bold text-red-500 mt-1">₹ {restaurant.payment?.remaining}</h2>
                                    <button
                                        onClick={() => {
                                            setPaymentForm({
                                                total: Number(restaurant.payment?.total_amount),
                                                remaining: Number(restaurant.payment?.remaining),
                                                amount: "",
                                                mode: ""
                                            });
                                            setShowPaymentModal(true);
                                            setIsPaying(false)
                                        }}
                                        className="mt-3 bg-cyan-500 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Pay Now
                                    </button>

                                    {showPaymentModal && (
                                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                            <div className="bg-white w-[400px] rounded-xl p-6 shadow-lg">

                                                <h2 className="text-lg font-semibold mb-4">
                                                    Make Payment
                                                </h2>

                                                {/* Total */}
                                                <div className="mb-3">
                                                    <label className="text-sm text-gray-500">Total Amount</label>
                                                    <input
                                                        type="text"
                                                        value={paymentForm.total}
                                                        disabled
                                                        className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
                                                    />
                                                </div>

                                                {/* Remaining */}
                                                <div className="mb-3">
                                                    <label className="text-sm text-gray-500">Remaining Balance</label>
                                                    <input
                                                        type="text"
                                                        value={paymentForm.remaining}
                                                        disabled
                                                        className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
                                                    />
                                                </div>

                                                {/* Amount */}
                                                <div className="mb-3">
                                                    <label className="text-sm text-gray-500">Current Payment</label>
                                                    <input
                                                        type="number"
                                                        name="amount"
                                                        value={paymentForm.amount}
                                                        onChange={handleChange}
                                                        onWheel={(e) => e.target.blur()}
                                                        className="w-full border rounded px-3 py-2 mt-1 no-spinner"
                                                    />
                                                    {errors.amount && (
                                                        <p className="text-red-500 text-xs">{errors.amount}</p>
                                                    )}
                                                </div>

                                                {/* Payment Mode */}
                                                <div className="mb-3">
                                                    <label className="text-sm text-gray-500">Payment Mode</label>
                                                    <select
                                                        name="mode"
                                                        value={paymentForm.mode}
                                                        onChange={handleChange}
                                                        className="w-full border rounded px-3 py-2 mt-1"
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="cash">Cash</option>
                                                        <option value="upi">UPI</option>
                                                        <option value="card">Card</option>
                                                    </select>
                                                    {errors.mode && (
                                                        <p className="text-red-500 text-xs">{errors.mode}</p>
                                                    )}
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex justify-end gap-2 mt-4">
                                                    <button
                                                        onClick={() => {
                                                            setShowPaymentModal(false)
                                                            setIsPaying(false)
                                                        }}
                                                        className="px-3 py-1 border rounded"
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        onClick={handleSubmit}
                                                        disabled={isPaying}
                                                        className={`px-4 py-2 rounded text-white transition 
                                                                ${isPaying
                                                                ? "bg-gray-400 cursor-not-allowed"
                                                                : "bg-orange-500 hover:bg-orange-600"
                                                            }`}
                                                    >
                                                        {isPaying ? "Processing..." : "Pay"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* subscription plans and their features */}
                            <div className="grid md:grid-cols-3 gap-5 mt-6">
                                <div className="bg-white p-4 rounded-xl border shadow-sm col-span-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col">
                                            <h3 className="font-semibold text-gray-800">Subscription Plans</h3>
                                            <p>Choose the perfect plan for your restaurant</p>
                                        </div>

                                        <div className="flex bg-gray-100 rounded-lg p-1 text-sm">
                                            <button
                                                onClick={() => {
                                                    setPlanDuration("monthly")
                                                    setSelectedPlan(null)
                                                }}
                                                className={`px-3 py-1 rounded-md transition 
                                                        ${planDuration === "monthly"
                                                        ? "bg-white shadow text-[var(--primary-color)] rounded"
                                                        : "text-gray-500"
                                                    }`}
                                            >
                                                Monthly
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setPlanDuration("yearly");
                                                    setSelectedPlan(null);
                                                }}
                                                className={`px-3 py-1 rounded-md transition 
                                                       ${planDuration === "yearly"
                                                        ? "bg-white shadow text-[var(--primary-color)] rounded"
                                                        : "text-gray-500"
                                                    }`}
                                            >
                                                Yearly
                                            </button>
                                        </div>
                                    </div>

                                    <table className="w-full text-sm">
                                        <thead className="">
                                            <tr className="text-gray-500 border-b">
                                                <th className="py-2 text-left">Plan Name</th>
                                                <th>Duration</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>

                                        <tbody className="text-gray-700">
                                            {filteredPlans.map((p, i) => (
                                                <tr
                                                    key={i}
                                                    onClick={() => {
                                                        setSelectedPlan(p);

                                                        setPlanForm({
                                                            plan_id: p.id,
                                                            plan_name: p.plan_name,
                                                            amount: p.price,
                                                            duration: p.duration_days,
                                                        });
                                                    }}
                                                    className={`cursor-pointer border-b hover:bg-gray-50
                                                    ${selectedPlan?.id === p.id ? "bg-[var(--primary-color)]/25" : ""}
                                                    `}
                                                >
                                                    <td className="py-3 font-medium rounded-l-lg pl-1">{p.plan_name}</td>
                                                    <td>{p.duration_days} Days</td>
                                                    <td className="rounded-r-lg">₹ {p.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                </div>

                                <div className="bg-white p-4 rounded-xl border shadow-sm col-span-1">
                                    <h3 className="font-semibold text-gray-800 mb-4">Plan Details</h3>
                                    {!selectedPlan ? (
                                        <>
                                            <p className="text-gray-500">Select a plan to see its features</p>
                                            <div className="flex items-center gap-2 mt-4">
                                                <img src={planImg} alt="Plan Illustration" className="w-25 mx-auto" />
                                                <p>Choose any plan from the list to view the features and see how it can help your restaurant grow. </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-semibold">{selectedPlan.plan_name} Plan</h4>
                                                <span className="text-xs bg-teal-500/50 text-white px-2 py-1 rounded">
                                                    {planDuration}
                                                </span>
                                            </div>

                                            <ul className="mt-4 space-y-2 text-sm text-gray-400">
                                                {selectedPlan.features.map((f, i) => (
                                                    <li key={i}>✔ {f.name}</li>
                                                ))}
                                            </ul>

                                            <button onClick={() => setShowPlanModal(true)} className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg">
                                                Choose Plan
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {showPlanModal && (
                                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                    <div className="bg-white w-[400px] rounded-xl p-6 shadow-lg">

                                        <h2 className="text-lg font-semibold mb-4">
                                            Confirm Plan
                                        </h2>

                                        {/* Plan Name */}
                                        <div className="mb-3">
                                            <label className="text-sm text-gray-500">Plan Name</label>
                                            <input
                                                type="text"
                                                value={planForm.plan_name}
                                                disabled
                                                className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
                                            />
                                        </div>

                                        {/* Duration */}
                                        <div className="mb-3">
                                            <label className="text-sm text-gray-500">Duration</label>
                                            <input
                                                type="text"
                                                value={`${planForm.duration} Days`}
                                                disabled
                                                className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
                                            />
                                        </div>

                                        {/* Amount */}
                                        <div className="mb-3">
                                            <label className="text-sm text-gray-500">Amount</label>
                                            <input
                                                type="text"
                                                value={`₹ ${planForm.amount}`}
                                                disabled
                                                className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
                                            />
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button
                                                onClick={() => setShowPlanModal(false)}
                                                className="px-3 py-1 border rounded"
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                onClick={handlePlanSubmit}
                                                className="px-4 py-2 rounded text-white bg-orange-500 hover:bg-orange-600"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* previous subscriptions */}
                            <div className="mt-6 bg-white p-5 rounded-xl border shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-800">Your Previous Subscriptions</h3>
                                </div>

                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-500 border-b">
                                            <th className="py-2 text-left">Plan</th>
                                            <th>Duration</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody className="text-gray-700">
                                        {(subsHistory || []).length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-gray-400">
                                                    No previous subscriptions found
                                                </td>
                                            </tr>
                                        ) : (
                                            subsHistory.map((sub, i) => (
                                                <tr key={i} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 font-medium">{sub.plan_name}</td>
                                                    <td>{sub.interval}</td>
                                                    <td>{dayjs(sub.start_date).format("DD MMM YYYY") || "-"}</td>
                                                    <td>{dayjs(sub.end_date).format("DD MMM YYYY") || "-"}</td>
                                                    <td>
                                                        <span className={`text-xs px-2 py-1 rounded 
                                                                      ${sub.status === "active"
                                                                ? "bg-green-100 text-green-600"
                                                                : "bg-gray-100 text-gray-500"
                                                            }`}>
                                                            {sub.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    )}

                    {activeTab === "transactions" && (
                        <div className="bg-white p-4 rounded-xl border shadow-sm col-span-1">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-gray-800">Transactions</h3>

                            </div>

                            <table className="w-full text-sm">
                                <thead className="">
                                    <tr className="text-gray-500 border-b">
                                        <th className="py-2 text-left">Date</th>
                                        <th className="py-2 text-left">Total Amount</th>
                                        <th className="py-2 text-left">Amount Paid</th>
                                        <th className="py-2 text-left">Balance Due</th>
                                        <th className="py-2 text-left">Payment Mode</th>
                                    </tr>
                                </thead>

                                <tbody className="text-gray-700">

                                </tbody>
                            </table>

                        </div>

                    )}

                    {activeTab === "theme" && (
                        <div className="mt-6 grid md:grid-cols-3 gap-4">

                            <h2>Theme</h2>
                        </div>
                    )}
                </div>
            </div>

        </>
    )
}

export default Settings

