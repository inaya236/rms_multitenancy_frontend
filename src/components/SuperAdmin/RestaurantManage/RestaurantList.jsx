import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Base_URL from '../../../../config';
import Switch from '@mui/material/Switch';
import { FaEye } from "react-icons/fa";
import demoLogo from "../../../assets/rms_logo2.jpg"


const RestaurantList = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const [restaurantList, setRestaurantList] = useState([])
    const [isOn, setIsOn] = useState(true);

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
                <div className=' min-h-screen flex justify-center'>
                    <div className='bg-[#f5f5f5]  shadow-lg rounded-lg  p-4 w-full '>
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
                                        <th className="px-4 py-3 font-medium">Restaurant</th>
                                        <th className="px-4 py-3 font-medium">Admin</th>
                                        <th className="px-4 py-3 font-medium">Subscription</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {/* <tr className="text-left text-gray-600">
                                        <td className="px-4 py-3 font-medium">{1}</td>
                                        <td className="px-4 py-3 font-bold ">
                                            <div className='flex items-center gap-2'>
                                                <img src={demoLogo} alt="" className='w-[50px] h-[50px]'/>
                                              <span className='text-lg'> DineIn</span> 
                                                </div> 
                                            </td>
                                        <td className="px-4 py-3 font-bold text-lg">Hiba <br />
                                            <span className='font-medium '>hiba@gmail.com</span></td>
                                        <td className="px-4 py-3 font-medium text-lg">Basic
                                            <span>(Monthly)</span> <br />
                                            <span>499</span>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-lg">Active</td>
                                        <td className="px-4 py-3 font-medium">
                                            <div className='flex items-center gap-2'>
                                                <FaEye size={25} className='text-green-700 hover:text-green-500'/>

                                                <Switch checked={isOn} onChange={(e) => setIsOn(e.target.checked)} />
                                            </div>
                                        </td>
                                    </tr> */}

                                    {restaurantList.map((r, i) => (
                                        <tr className="text-left text-gray-600">
                                            <td className="px-4 py-3 font-medium">{i + 1}</td>
                                            <td className="px-4 py-3 font-bold">
                                                <div className='flex items-center gap-2'>
                                                    <img src={`${Base_URL}${r.logo}`} alt="" className='w-[40px] h-[40px]' />
                                                    <span className='text-lg'>{r.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-bold">{r.admin.name || "-"} <br />
                                                <span className='font-medium '>{r.admin.email || "-"}</span></td>
                                            <td className="px-4 py-3 font-medium">{r.subscription.plan_name || "-"}
                                                <span>({r.subscription.plan_interval})</span> <br />
                                                <span>{r.subscription.price}</span>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-lg">{isOn ? "Active" : "In Active"}</td>
                                            <td className="px-4 py-3 font-medium">
                                                <div className='flex items-center gap-2'>
                                                    <button onClick={() => {
                                                        navigate("/overview", {
                                                            state: {restId:r.id, restaurantName: r.name, restaurantLogo: r.logo, restPhone: r.phone_number, restAddress:r.address, theme:r.theme}
                                                        })
                                                    }}>
                                                        <FaEye size={25} className='text-green-700 hover:text-green-500' />
                                                    </button>
                                                    <Switch checked={isOn} onChange={(e) => setIsOn(e.target.checked)} />
                                                </div>
                                            </td>
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