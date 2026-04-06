import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import Base_URL from "../../../../../../config";
import axios from "axios";
import { useLocation } from "react-router-dom";
import dayjs from 'dayjs'

const Transaction = () => {
    const location = useLocation();
    const restId = location.state?.restId;

  const [filters, setFilters] = useState({
    duration: "Last 12 Months",
    status: "All Status",
    search: "",
  });

  const [transactions,setTransactions]=useState([])

//   const [transaction,set]

//   const transactions = [
//     {
//       date: "June 14, 2024",
//       admin: "Sahil Mishra",
//       amount: "₹4,999.00",
//       status: "Completed",
//       balance: "₹0.0",
//     },
//     {
//       date: "April 10, 2024",
//       admin: "Aria Sharma",
//       amount: "₹4,999.00",
//       status: "Completed",
//       balance: "₹0.0",
//     },
//     {
//       date: "Feb 22, 2024",
//       admin: "Fawad Khan",
//       amount: "₹1,499.00",
//       status: "Pending",
//       balance: "₹2,000",
//     },
//     {
//       date: "Jan 25, 2024",
//       admin: "Fawad Khan",
//       amount: "₹1,000.00",
//       status: "Completed",
//       balance: "₹3,000",
//     },
//   ];

  const getTransactions=async()=>{
   try {
      const res=await axios.get(`${Base_URL}core/transactions/restaurant/${restId}/`)
      console.log("transaction data",res.data)
       setTransactions(res.data);
   } catch (error) {
      console.error("error",error);
   }
  }

  useEffect(()=>{
   getTransactions()
  },[])

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <select className="border rounded-md px-3 py-2 text-sm">
          <option>Last 12 Months</option>
          <option>Last 6 Months</option>
          <option>Last 30 Days</option>
        </select>

        <select className="border rounded-md px-3 py-2 text-sm">
          <option>All Status</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>

        <input
          type="text"
          placeholder="Search by Admin Name"
          className="border rounded-md px-3 py-2 text-sm flex-1 min-w-[200px]"
        />

        <button className="px-4 py-2 border rounded-md text-sm">
          Clear
        </button>

        <button className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600">
          Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount Paid</th>
              <th className="px-4 py-3">Payment Mode</th>
              <th className="px-4 py-3">Remaining Balance</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{item.created_at && dayjs(item.created_at).format("DD MMM YYYY")}</td>
                <td className="px-4 py-3">{item.amount}</td>

                {/* Status Badge */}
                <td className="px-4 py-3">
                 {item.payment_mode}
                </td>

                <td className="px-4 py-3">{item.remaining_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
     
    </div>
  );
};

export default Transaction;