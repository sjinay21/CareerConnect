import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }
        
        console.log("Uploading file to Cloudinary:", localFilePath);

        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("CLOUDINARY UPLOAD SUCCESS");
        console.log("URL:", result.secure_url);

        // Delete the temporary local file now that it is uploaded
        fs.unlinkSync(localFilePath);

        return result;

    } catch (error) {
        console.log("UPLOAD FAILED");
        console.log("Message:", error.message);
        console.log("HTTP CODE:", error.http_code);

        // Even if it failed to upload, we should clean up the local temp file
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        throw error;
    }
};

export { uploadOnCloudinary };