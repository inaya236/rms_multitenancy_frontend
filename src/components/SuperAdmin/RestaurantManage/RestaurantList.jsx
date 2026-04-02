import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Base_URL from '../../../../config';

const RestaurantList = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const [restaurantList, setRestaurantList] = useState([])


    const getRestaurant = async () => {
        try {
            const res = await axios.get(`${Base_URL}core/restaurants/`)
            console.log("restaurant list", res.data)
            setRestaurantList(res.data)
        } catch (error) {
            console.error("error getting restaurant list", error)
        }
    }

 

    useEffect(() => {
        getRestaurant();
    }, [])

    return (
        <div className="flex min-h-screen bg-[#FBF7F2] text-black">
            {/* Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} />
            {/* main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
                {/* Navbar */}
                <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                {/* page content */}
                <div className='mt-2 min-h-screen flex justify-center'>
                    <div className=' bg-white shadow-lg rounded-lg  p-2 w-full m-4'>
                        <div className='flex justify-between border-b border-[#3D5A40]'>
                            <h2 className='text-xl m-2 text-[#3D5A40] font-bold'>Restaurants</h2>
                            <button
                                className='bg-[#ff5722] text-white px-3 py-1 m-2 rounded-lg hover:opacity-90 transition'
                                onClick={() => { navigate("/addRestaurant") }}
                            > Add Restaurant
                            </button>
                        </div>

                        <div className="hidden md:block bg-white rounded-xl shadow border overflow-x-auto m-2">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 border-b">
                                    <tr className="text-left text-gray-700">
                                        <th className="px-4 py-3 font-medium">S. no.</th>
                                        <th className="px-4 py-3 font-medium">Restaurant Name</th>
                                        <th className="px-4 py-3 font-medium">Admin</th>
                                        <th className="px-4 py-3 font-medium">Subscription</th>
                                        <th className="px-4 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {restaurantList.map((r, i) => (
                                        <tr className="text-left text-gray-600">
                                            <td className="px-4 py-3 font-medium">{i + 1}</td>
                                            <td className="px-4 py-3 font-bold">{r.name}</td>
                                            <td className="px-4 py-3 font-bold">{r.admin.name || "-"} <br /> 
                                            <span className='font-medium '>{r.admin.email || "-"}</span></td>
                                            <td className="px-4 py-3 font-medium">{r.subscription.plan_name || "-"} 
                                                <span>({r.subscription.plan_interval})</span> <br />
                                                <span>{r.subscription.price}</span>
                                            </td>
                                            <td className="px-4 py-3 font-medium"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden space-y-4 m-2">
                            {restaurantList.map((r, i) => (
                                <div
                                    key={r.id || i}
                                    className="bg-white rounded-xl shadow border p-4 space-y-2"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-gray-500">
                                            #{i + 1}
                                        </span>
                                        <button className="text-xs bg-[#ff5722] text-white px-3 py-1 rounded-lg">
                                            View
                                        </button>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Restaurant</p>
                                        <p className="font-semibold text-[#3D5A40]">{r.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Admin Name</p>
                                        <p>{r.admin.name || "-"}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Admin Email</p>
                                        <p className="break-all">{r.admin.email || "-"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RestaurantList;