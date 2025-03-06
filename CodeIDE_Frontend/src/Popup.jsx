import React from "react"
import { GrClose } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Popup({ open, onClose, child }) {
    const navigate = useNavigate();
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === "Enter" && open) {
                navigate("/logout"); // Trigger logout on Enter key
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [open, navigate]);
    return (
        
        <div className={`fixed inset-0 flex justify-center transition-colors ${open ? "visible bg-black/20" : "invisible"}`}>
            <div className={`transition-all bg-white w-80 h-40 rounded-xl p-6 ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`} onClick={(e) => e.stopPropagation()}>
                <button className='absolute top-2 right-2 p-1 rounded-lg text-gray-500 bg-white hover:text-gray-700 hover:bg-gray-200' onClick={onClose}><GrClose /></button>
                <h1 className="text-center m-3">Are you sure want to Logout?</h1>
                <div className="flex items-center justify-center">
                    <button className='border-blue-400 border p-2.5 m-3 rounded-md w-25 cursor-pointer' onClick={onClose}>Cancel</button>
                    <button className='bg-blue-600 text-white p-2.5 m-3 rounded-md w-25 cursor-pointer' onClick={() => navigate("/logout")}>Logout</button>
                </div>
            </div>

            {child}
        </div>
    )
}




