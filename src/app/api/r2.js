import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv'; // For ES Modules, you need to import the default export

dotenv.config(); // Call config on the imported module

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL;

const R2_IS_CONFIGURED = R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME && R2_PUBLIC_BASE_URL;

if (!R2_IS_CONFIGURED) {
    console.warn("One or more Cloudflare R2 environment variables are not correctly set. File uploads to R2 will fail. Ensure R2_PUBLIC_BASE_URL is also set.");
}

let s3Client;
if (R2_IS_CONFIGURED) {
    s3Client = new S3Client({
        region: "auto",
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
    });
} else {
    s3Client = null;
}

async function uploadFileToR2(fileBuffer, originalFileName, mimeType) {
    if (!R2_IS_CONFIGURED || !s3Client) {
        console.error("R2 service is not configured. Cannot upload file.");
        throw new Error("R2 service is not configured.");
    }

    const fileExtension = originalFileName.includes('.') ? originalFileName.substring(originalFileName.lastIndexOf('.')) : '';
    const uniqueKey = `${uuidv4()}${fileExtension}`;

    const params = {
        Bucket: R2_BUCKET_NAME,
        Key: uniqueKey,
        Body: fileBuffer,
        ContentType: mimeType,
    };

    try {
        await s3Client.send(new PutObjectCommand(params));
        const cleanedBaseUrl = R2_PUBLIC_BASE_URL.replace(/\/$/, '');
        const fileUrl = `${cleanedBaseUrl}/${uniqueKey}`;
        return { key: uniqueKey, url: fileUrl, originalName: originalFileName, mimeType, size: fileBuffer.length };
    } catch (error) {
        console.error("Error uploading to R2:", error);
        throw error;
    }
}

async function deleteFileFromR2(key) {
    if (!R2_IS_CONFIGURED || !s3Client) {
        console.warn("R2 service is not configured. Cannot delete file.");
        return;
    }
    if (!key) {
        console.warn("No key provided for R2 deletion.");
        return;
    }

    const params = {
        Bucket: R2_BUCKET_NAME,
        Key: key,
    };
    try {
        await s3Client.send(new DeleteObjectCommand(params));
        console.log(`Successfully deleted ${key} from R2.`);
    } catch (error) {
        console.error(`Error deleting ${key} from R2:`, error);
        // throw error; // Uncomment if you want to propagate the error
    }
}

// For ES Modules, you use export statements
export { uploadFileToR2, deleteFileFromR2, R2_IS_CONFIGURED };