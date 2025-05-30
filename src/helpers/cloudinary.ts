import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY , 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    

    const uploadOnCloudinary=async(localFilePath:string)=>{

        try {
            if(!localFilePath) return null;
           const uploadResult =await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
 
            console.log("file uploaded on cloudinary successfully");
            console.log(uploadResult.url);
            return uploadResult.url;
        } catch (error) {
            console.log(error);
         fs.unlinkSync(localFilePath)
         return null;   
        }
    }
    // Upload an image
    
    
   export {uploadOnCloudinary}

    
