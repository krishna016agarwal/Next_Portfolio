// app/api/resume/latest/route.ts
import { NextResponse } from "next/server";
import { GetObjectCommand, S3ServiceException } from "@aws-sdk/client-s3";
import {
    getR2Client,
    R2_BUCKET_NAME,
    R2_PUBLIC_BASE_URL,
    LATEST_RESUME_METADATA_KEY,
    streamToString,
    LatestResumeMetadata
} from "@/lib/r2";

// REMOVED: Unused getApiErrorMessage function
// function getApiErrorMessage(error: unknown): string { ... }

export async function GET() {
    const r2Client = getR2Client();

    if (!r2Client || !R2_BUCKET_NAME || !R2_PUBLIC_BASE_URL) {
        console.error("R2 client or essential R2 configuration is missing in GET /api/resume/latest.");
        return NextResponse.json(
            { fileUrl: null, message: "Server configuration error for R2." },
            { status: 500 }
        );
    }

    try {
        const getObjectParams = {
            Bucket: R2_BUCKET_NAME,
            Key: LATEST_RESUME_METADATA_KEY,
        };
        const { Body } = await r2Client.send(new GetObjectCommand(getObjectParams));

        if (!Body) {
            return NextResponse.json({ fileUrl: null, message: "Latest resume metadata not found (Body is undefined)." }, { status: 404 });
        }

        const metadataString = await streamToString(Body);
        if (!metadataString) {
            return NextResponse.json({ fileUrl: null, message: "Latest resume metadata is empty." }, { status: 404 });
        }

        const metadata: LatestResumeMetadata = JSON.parse(metadataString);

        if (!metadata.resumeFileKey) {
            console.error("Malformed metadata in R2:", metadata);
            return NextResponse.json({ fileUrl: null, message: "Latest resume metadata is malformed." }, { status: 500 });
        }

        const fileUrl = `${R2_PUBLIC_BASE_URL!.replace(/\/$/, '')}/${metadata.resumeFileKey}`;

        return NextResponse.json({
            fileUrl,
            originalFileName: metadata.originalFileName,
            uploadedAt: metadata.uploadedAt
        });

    } catch (error: unknown) { // MODIFIED: from 'any' to 'unknown'
        let errorMessage = "An unknown API error occurred"; // Default message
        let errorStack = undefined;

        if (error instanceof Error) {
            errorMessage = error.message;
            errorStack = error.stack;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        // The console.error line remains as it was, but now uses the derived errorMessage and errorStack
        console.error("Error in GET /api/resume/latest:", errorMessage, errorStack, error); // Log original error object for full context

        if (error instanceof S3ServiceException && error.name === 'NoSuchKey') {
            return NextResponse.json({ fileUrl: null, message: "Latest resume metadata not found (NoSuchKey)." }, { status: 404 });
        }

        // The response message construction remains as it was, using the derived errorMessage
        return NextResponse.json(
            {
                fileUrl: null,
                message: `Failed to retrieve latest file info: ${errorMessage}`, // Uses derived errorMessage
                errorDetails: process.env.NODE_ENV === 'development' ? errorStack : undefined // Uses derived errorStack
            },
            { status: 500 }
        );
    }
}