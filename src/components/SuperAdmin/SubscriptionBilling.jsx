import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Base_URL from '../../../config';
import { FiSearch } from 'react-icons/fi';

const SubscriptionBilling = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [restaurantList, setRestaurantList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(`${Base_URL}/restaurants`);
        setRestaurantList(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurantList.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.admin_name && r.admin_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.admin_email && r.admin_email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    const matchesPlan = planFilter ? r.plan === planFilter : true;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-yellow-100 text-yellow-800',
    Expired: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      <Sidebar sidebarOpen={sidebarOpen} />
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="p-6">
     
          <h2 className="text-2xl font-bold text-[#3D5A40] mb-6">Subscription & Billing</h2>

          {/* filters */}
          <div className="flex flex-col md:flex-row items-center gap-3 mb-6 text-black">
            <div className="relative w-full md:w-1/3">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by restaurant or admin"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D5A40] text-sm"
              />
            </div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-full md:w-40"
            >
              <option value="">All Plans</option>
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Premium">Premium</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-full md:w-40"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* cards*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((r, i) => (
                <div key={r.id || i} className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition">
                  <h3 className="font-semibold text-lg text-[#3D5A40]">{r.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">Admin: {r.admin_name || '-'}</p>
                  <p className="text-gray-500 text-sm">{r.admin_email || '-'}</p>

                  <div className="flex justify-between items-center mt-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[r.status] || 'bg-gray-100 text-gray-800'}`}>
                      {r.status || '-'}
                    </span>
                    <span className="text-sm text-gray-600">{r.plan || '-'}</span>
                  </div>

                  <p className="text-gray-400 text-sm mt-2">Expiry: {r.expiry_date || '-'}</p>

                  <button className="mt-3 w-full bg-[#ff5722] text-white py-2 rounded-lg text-sm hover:bg-[#e64a19] transition">
                    View
                  </button>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400">No restaurants found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBilling;

// import Sidebar from './Sidebar';
// import Navbar from './Navbar';
// import { useState } from 'react';
// import { FiSearch } from 'react-icons/fi';

// const sampleData = [
//   { id: 1, name: "Sunrise Diner", admin_name: "Alice", admin_email: "alice@example.com", plan: "Basic", status: "Active", expiry_date: "2026-06-30" },
//   { id: 2, name: "Green Garden", admin_name: "Bob", admin_email: "bob@example.com", plan: "Pro", status: "Inactive", expiry_date: "2026-05-15" },
//   { id: 3, name: "Ocean Grill", admin_name: "Carol", admin_email: "carol@example.com", plan: "Premium", status: "Expired", expiry_date: "2025-12-31" },
//   { id: 4, name: "Spice Hub", admin_name: "David", admin_email: "david@example.com", plan: "Pro", status: "Active", expiry_date: "2026-08-10" },
// ];

// const SubscriptionBilling = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [restaurantList] = useState(sampleData);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('');
//   const [planFilter, setPlanFilter] = useState('');

//   const filteredRestaurants = restaurantList.filter(r => {
//     const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       r.admin_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       r.admin_email.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = statusFilter ? r.status === statusFilter : true;
//     const matchesPlan = planFilter ? r.plan === planFilter : true;
//     return matchesSearch && matchesStatus && matchesPlan;
//   });

//   const statusColors = {
//     Active: 'bg-green-100 text-green-800',
//     Inactive: 'bg-yellow-100 text-yellow-800',
//     Expired: 'bg-red-100 text-red-800',
//   };

//   return (
//     <div className="flex min-h-screen bg-[#f5f5f5]">
//       <Sidebar sidebarOpen={sidebarOpen} />
//       <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
//         <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//         <div className="p-6">
//           <h2 className="text-2xl font-bold text-[#3D5A40] mb-6">Subscription & Billing</h2>

//           {/* Filters */}
//           <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
//             <div className="relative w-full md:w-1/3">
//               <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by restaurant or admin"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D5A40] text-sm"
//               />
//             </div>
//             <select
//               value={planFilter}
//               onChange={(e) => setPlanFilter(e.target.value)}
//               className="border rounded-lg px-3 py-2 text-sm w-full md:w-40"
//             >
//               <option value="">All Plans</option>
//               <option value="Basic">Basic</option>
//               <option value="Pro">Pro</option>
//               <option value="Premium">Premium</option>
//             </select>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="border rounded-lg px-3 py-2 text-sm w-full md:w-40"
//             >
//               <option value="">All Status</option>
//               <option value="Active">Active</option>
//               <option value="Inactive">Inactive</option>
//               <option value="Expired">Expired</option>
//             </select>
//           </div>

//           {/* Cards Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredRestaurants.length > 0 ? (
//               filteredRestaurants.map((r, i) => (
//                 <div key={r.id || i} className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition">
//                   <h3 className="font-semibold text-lg text-[#3D5A40]">{r.name}</h3>
//                   <p className="text-gray-500 text-sm mt-1">Admin: {r.admin_name}</p>
//                   <p className="text-gray-500 text-sm">{r.admin_email}</p>

//                   <div className="flex justify-between items-center mt-4">
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[r.status]}`}>
//                       {r.status}
//                     </span>
//                     <span className="text-sm text-gray-600">{r.plan}</span>
//                   </div>

//                   <p className="text-gray-400 text-sm mt-2">Expiry: {r.expiry_date}</p>

//                   <button className="mt-3 w-full bg-[#ff5722] text-white py-2 rounded-lg text-sm hover:bg-[#e64a19] transition">
//                     View
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <p className="col-span-full text-center text-gray-400">No restaurants found.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionBilling;