
import { FaEdit } from "react-icons/fa";
import profileImage from "./assets/Default_Profile.png";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useState, useEffect } from "react";
import { Mail, User } from "lucide-react";
import { LuLogOut } from 'react-icons/lu';
// import { useNavigate } from "react-router-dom";







function SlidingPanel() {

    const [projects, setProjects] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editName, setEditName] = useState("");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch("http://localhost:8080/CodeVision/FetchUserDetailsServlet", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }
                const data = await response.json();
                console.log(data);
                setUserProfile(data);
            }
            catch {
                console.error("Error fetching profile:", error);
                setUserProfile(null);
            }
            finally {
                setLoadingProfile(false);
            }
        };
        fetchUserProfile();
    }, []);

    const isValidImageUrl = (url) => {
        if (!url || typeof url !== "string") return false;
        const dataUriPattern = /^data:image\/[a-zA-Z]+;base64,/i;
        return dataUriPattern.test(url); // Ensures valid MIME type (e.g., image/png)
    };

    const handleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        if (file || editName) { // Proceed if there's a file or a new name
            const formData = new FormData();
            if (file) {
                formData.append("profileImage", file);
            }
            const newName = editName || userProfile?.name; // Use editName if set, else current name
            formData.append("username", newName); // Send updated username
            formData.append("userId", userProfile?.userId || "1");

            try {
                const response = await fetch("http://localhost:8080/CodeVision/UpdateProfileImageServlet", {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                });
                if (response.ok) {
                    const updatedProfile = await response.json();
                    setUserProfile(updatedProfile); // Update state with server response
                    setIsEditingName(false); // Exit edit mode if active
                    setEditName(""); // Reset editName
                } else {
                    console.error("Failed to update profile:", response.statusText);
                }
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        }
    };

    const saveName = async () => {
        if (editName && editName !== userProfile?.name) { // Only update if name changed
            const formData = new FormData();
            formData.append("username", editName);
            formData.append("userId", userProfile?.userId || "1");

            try {
                const response = await fetch("http://localhost:8080/CodeVision/UpdateProfileImageServlet", {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                });
                if (response.ok) {
                    const updatedProfile = await response.json();
                    setUserProfile(updatedProfile);
                    setIsEditingName(false);
                    setEditName("");
                } else {
                    console.error("Failed to update name:", response.statusText);
                }
            } catch (error) {
                console.error("Error updating name:", error.message);
            }
        } else {
            setIsEditingName(false); // Exit edit mode if no change
        }
    };


    return (
        <div className="flex flex-col h-full p-6 gap-6">
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg">
                {/* Profile Image */}
                <div className="relative w-32 h-32 group">
                    <img
                        src={isValidImageUrl(userProfile?.imageUrl) ? userProfile.imageUrl : profileImage}
                        alt="Profile"
                        className="w-full h-full rounded-full border-4 border-blue-200 shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.target.src = profileImage; }}
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-full cursor-pointer">
                        <FaEdit className="text-white text-2xl" />
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleProfileImageChange}
                            accept="image/*"
                        />
                    </label>
                </div>

                {/* User Details */}
                <div className="w-full flex shrink-0 flex-col gap-4 text-center">
                    {/* Editable Name */}
                    <div className="flex flex-row px-4 items-start gap-2">
                        <User />
                        {isEditingName ? (
                            <div className="flex items-center gap-2 w-3/4">
                                <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="flex-1 h-8 px-2 text-base border-2 rounded-lg border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                    placeholder="Enter new username"
                                />
                                <button
                                    onClick={saveName}
                                    className="px-1 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                                >
                                    <IoCheckmarkSharp className="text-2xl" />
                                </button>
                                <button
                                    onClick={() => setIsEditingName(false)}
                                    className="px-1 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                >
                                    <IoCloseSharp className="text-2xl" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-gray-800">{userProfile?.name || "Guest"}</span>
                                <FaEdit
                                    className="text-gray-500 cursor-pointer hover:text-blue-500 transition duration-200"
                                    onClick={() => { setEditName(userProfile?.name || ""); setIsEditingName(true); }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Email (Non-Editable) */}
                    <div className="flex flex-row px-4 items-center gap-2">
                        <Mail />
                        <span className="text-lg font-semibold text-gray-800">{userProfile?.email || ""}</span>
                    </div>
                </div>
            </div>

            {/* Saved Projects Section */}
            <div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-md border border-gray-200 flex-1 overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-800">My Projects</h2>
                {projects.length > 0 ? (
                    projects.map((project, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200"
                        >
                            <span className="text-gray-800 font-medium">{project.name}</span>
                            <button
                                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-sm"
                                onClick={() => openProject(project)}
                            >
                                Open
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm italic text-center py-4">No projects saved yet</p>
                )}
            </div>

            {/* Logout Button */}
            <div className="mt-auto pt-1">
                <button
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300 active:bg-red-700 cursor-pointer"
                    onClick={() => navigate("/logout")}
                >
                    <LuLogOut className="text-2xl" />
                    <span className="text-lg">Logout</span>
                </button>
            </div>
        </div>
    )
}
export default SlidingPanel;