// app/api/resume/route.ts
import { NextResponse } from "next/server";
import {
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
    S3ServiceException // For type checking specific S3 errors like NoSuchKey
} from "@aws-sdk/client-s3";
import {
    getR2Client,
    R2_BUCKET_NAME,
    R2_PUBLIC_BASE_URL,
    LATEST_RESUME_METADATA_KEY,
    LatestResumeMetadata,
    streamToString
} from "@/lib/r2";

// Helper function to get an error message string
function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return "An unknown error occurred";
}

export async function POST(req: Request) {
    const r2Client = getR2Client();

    if (!r2Client || !R2_BUCKET_NAME || !R2_PUBLIC_BASE_URL) {
        console.error("R2 client or essential R2 configuration is missing in POST /api/resume.");
        return NextResponse.json(
            { success: false, message: "Server configuration error for R2." },
            { status: 500 }
        );
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file provided." }, { status: 400 });
        }

        // --- 1. Fetch existing metadata to find the old resume key (if any) ---
        let oldResumeKey: string | null = null;
        try {
            const getObjectParams = {
                Bucket: R2_BUCKET_NAME,
                Key: LATEST_RESUME_METADATA_KEY,
            };
            const { Body } = await r2Client.send(new GetObjectCommand(getObjectParams));

            if (Body) {
                const metadataString = await streamToString(Body);
                if (metadataString) {
                    const oldMetadata: LatestResumeMetadata = JSON.parse(metadataString);
                    oldResumeKey = oldMetadata.resumeFileKey;
                }
            }
        } catch (error: unknown) { // MODIFIED: error type to unknown
            // Line 53 Error was here
            if (error instanceof S3ServiceException && error.name === 'NoSuchKey') {
                console.log("No existing resume metadata found. This is a first upload or metadata was deleted.");
            } else {
                console.warn("Could not retrieve old resume metadata, proceeding with upload:", getErrorMessage(error));
            }
        }

        // --- 2. Prepare the new file for upload ---
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const newResumeFileKey = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

        // --- 3. Upload the new resume file to R2 ---
        await r2Client.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: newResumeFileKey,
                Body: buffer,
                ContentType: file.type || "application/octet-stream",
            })
        );
        console.log(`Successfully uploaded new resume: ${newResumeFileKey}`);

        // --- 4. If an old resume key was found, delete the old resume file from R2 ---
        if (oldResumeKey && oldResumeKey !== newResumeFileKey) {
            try {
                await r2Client.send(
                    new DeleteObjectCommand({
                        Bucket: R2_BUCKET_NAME,
                        Key: oldResumeKey,
                    })
                );
                console.log(`Successfully deleted old resume: ${oldResumeKey}`);
            } catch (deleteError: unknown) { // MODIFIED: error type to unknown
                // Line 91 Error was here
                console.warn(`Failed to delete old resume '${oldResumeKey}':`, getErrorMessage(deleteError));
            }
        } else if (oldResumeKey) {
            console.log(`Old resume key ${oldResumeKey} is the same as new; no deletion needed or something is unexpected.`);
        }

        // --- 5. Create and upload/overwrite the new metadata file in R2 ---
        const newMetadata: LatestResumeMetadata = {
            resumeFileKey: newResumeFileKey,
            originalFileName: file.name,
            contentType: file.type || "application/octet-stream",
            uploadedAt: new Date().toISOString(),
            size: file.size,
        };

        await r2Client.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: LATEST_RESUME_METADATA_KEY,
                Body: Buffer.from(JSON.stringify(newMetadata), "utf-8"),
                ContentType: "application/json",
            })
        );
        console.log(`Successfully updated metadata file: ${LATEST_RESUME_METADATA_KEY}`);

        const newFileUrl = `${R2_PUBLIC_BASE_URL!.replace(/\/$/, '')}/${newResumeFileKey}`; // Added non-null assertion for R2_PUBLIC_BASE_URL as it's checked above

        return NextResponse.json({ success: true, fileUrl: newFileUrl, message: "File uploaded and old version (if any) processed." });

    } catch (error: unknown) { // MODIFIED: error type to unknown
        // Line 123 Error was here
        console.error("Critical error in POST /api/resume:", getErrorMessage(error), error); // Log full error object for more details in dev
        const errorMessage = getErrorMessage(error);
        // Provide more context from the error if available
        return NextResponse.json(
            {
                success: false,
                message: `Upload failed: ${errorMessage}`,
                errorDetails: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}
