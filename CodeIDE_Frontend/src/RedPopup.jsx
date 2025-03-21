import React from "react"
import { GrClose } from "react-icons/gr";


function RedPopup({ open, onClose, message, child }) {
    return (

        <div className={`fixed inset-0 flex justify-center transition-colors ${open ? "block bg-black/20" : "opacity-0 pointer-events-none"}`}>
            <div className={`relative flex items-center justify-between text-md w-145 h-16 font-bold rounded-lg border border-red-400 bg-red-400 px-4 text-white transition-all ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`} onClick={(e) => e.stopPropagation()}>

                <h1 className="flex-1 text-center">{message}</h1>

                {/* Close Button */}
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200" onClick={onClose}>
                    <GrClose />
                </button>
            </div>

            {child}
        </div>

    )
}

export default RedPopup