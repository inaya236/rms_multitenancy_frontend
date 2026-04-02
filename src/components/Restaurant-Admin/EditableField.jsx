import { useEffect, useRef, useState } from "react";
import { FaPen } from "react-icons/fa";

const EditableField = ({
    label,
    value,
    name,
    type,
    onChange,
    options = []
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const wrapperRef = useRef(null)

    // detect click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsEditing(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div ref={wrapperRef} className="relative group">
            <label className="block mb-2 font-semibold">{label}</label>
            {options.length > 0 ? (
                <select
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className={`w-full p-3 rounded-md border border-gray-300 focus:outline-none 
            focus:ring-2 focus:ring-teal-500 transition
            ${isEditing ? "bg-white" : "bg-gray-100 cursor-default"}`}
                >
                    <option value="">Select {label}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    disabled={!isEditing}
                    className={`w-full p-3 rounded-md bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition ${isEditing ? "cursor-text bg-white" : "cursor-default"}`}
                />
            )}


            {/* pen icon */}
            {!isEditing && (
                <FaPen
                    size={14}
                    className="absolute right-3 top-14 text-gray-400  hover:text-teal-600 cursor-pointer transition"
                    onClick={() => setIsEditing(true)}
                />
            )}
        </div>
    )
}
export default EditableField;