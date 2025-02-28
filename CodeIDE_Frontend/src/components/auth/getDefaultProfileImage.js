// src/utils/getDefaultProfileImage.js
import defaultProfileImage from "../../assets/Default_Profile.png";

export async function getDefaultProfileImage() {
    try {
        const response = await fetch(defaultProfileImage);
        if (!response.ok) {
            throw new Error("Failed to fetch default profile image");
        }
        const blob = await response.blob();
        return new File([blob], "Default_Profile.png", { type: blob.type });
    } catch (error) {
        console.error("Error fetching default profile image:", error);
        throw error; // Let the caller handle it
    }
}