import profileImage from "./assets/logo-Bg.png";
import { FaEdit } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { LuLogOut } from 'react-icons/lu';
import { useState } from "react";




function SlidingPanel() {

    const handleProfileImageChange = async () => {

    }
    const [userName, setUserName] = useState("");
    const [email, setEmailName] = useState("");
    const [projects, setProjects] = useState([]);

    return (
        <div className="flex flex-col gap-6 p-3">
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-5 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                {/* Profile Image */}
                <div className="relative w-28 h-28">
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full rounded-full border-4 border-gray-300 shadow-md object-cover"
                    />
                    <label className="absolute bottom-1 right-1 bg-blue-500 p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition duration-200">
                        <FaEdit className="text-white text-lg" />
                        <input type="file" className="hidden" onChange={handleProfileImageChange} />
                    </label>
                </div>

                {/* User Details */}
                <div className="w-full flex flex-col gap-3 text-center">
                    {/* Name Edit */}
                    <div className="flex flex-col items-center">
                        <label className="text-sm font-semibold text-gray-700">User Name</label>
                        <input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Enter new username"
                            className="w-3/4 h-11 px-4 text-sm border rounded-lg border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-center"
                        />
                    </div>

                    {/* Email (Non-Editable) */}
                    <div className="flex flex-col items-center">
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <input
                            value={email}
                            className="w-3/4 h-11 px-4 text-sm border rounded-lg border-gray-300 bg-gray-200 text-gray-600 cursor-not-allowed text-center"
                            disabled
                        />
                    </div>
                </div>
            </div>

            {/* Saved Projects Section */}
            <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow-md border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">My Projects</h2>

                {projects.length > 0 ? (
                    projects.map((project, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 transition duration-200"
                        >
                            <span className="text-gray-800">{project.name}</span>
                            <button
                                className="text-blue-500 text-sm font-medium hover:underline"
                                onClick={() => openProject(project)}
                            >
                                Open
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm italic text-center">No projects saved</p>
                )}
            </div>

            {/* Logout Button */}
            <div
                className="mt-auto flex items-center gap-4 px-6 py-4 rounded-lg cursor-pointer transition duration-300 bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 active:bg-red-700"
                onClick={() => navigate("/logout")}
            >
                <LuLogOut className="text-2xl" />
                <span className="text-lg">Logout</span>
            </div>
        </div>
    )
}
export default SlidingPanel;