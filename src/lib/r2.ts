// src/lib/r2.ts
import { S3Client } from "@aws-sdk/client-s3";
import { Readable } from 'stream';

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
export const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_URL_BASE;
export const LATEST_RESUME_METADATA_KEY = "latest-resume-info.json";

let r2ClientInstance: S3Client | null = null;

export function getR2Client(): S3Client | null {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey || !R2_BUCKET_NAME || !R2_PUBLIC_BASE_URL) {
        console.warn(
            "One or more Cloudflare R2 environment variables are not correctly set. " +
            "R2 operations might fail."
        );
        return null;
    }

    if (!r2ClientInstance) {
        r2ClientInstance = new S3Client({
            region: "auto",
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });
    }
    return r2ClientInstance;
}

// MINIMAL ADDITION: Helper function (if not already present or imported)
function getErrorMessageMinimal(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return "An unknown error occurred in streamToString.";
}

type StreamLike = {
    getReader?: () => ReadableStreamDefaultReader<Uint8Array>;
    arrayBuffer?: () => Promise<ArrayBuffer>;
};

export async function streamToString(
    stream: Readable | ReadableStream<Uint8Array> | Blob | StreamLike | undefined | null
): Promise<string> {
    if (!stream) {
        return "";
    }
    if (stream instanceof Readable) {
        return new Promise((resolve, reject) => {
            const chunks: Uint8Array[] = [];
            stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on("error", reject);
            stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        });
    }
    if (stream instanceof Blob) {
        return stream.text();
    }
    const streamAsPotentiallyReadableStream = stream as StreamLike;
    if (typeof streamAsPotentiallyReadableStream.getReader === 'function') {
        const webStream = stream as ReadableStream<Uint8Array>;
        const reader = webStream.getReader();
        const chunks: Uint8Array[] = [];
        while (true) {
            try {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) chunks.push(value);
            } catch (error: unknown) { // Assuming error here also needs to be unknown
                console.error("Error reading from Web ReadableStream:", getErrorMessageMinimal(error));
                throw error; // Re-throw original error or a new Error(getErrorMessageMinimal(error))
            }
        }
        return Buffer.concat(chunks).toString("utf-8");
    }
    const streamAsPotentiallyBufferSource = stream as StreamLike;
    if (typeof streamAsPotentiallyBufferSource.arrayBuffer === 'function') {
        try {
            const buffer = await streamAsPotentiallyBufferSource.arrayBuffer();
            return Buffer.from(buffer).toString('utf-8');
        } catch (e: unknown) { // MODIFIED if this was the flagged catch
            console.error("Could not convert stream-like object to string via arrayBuffer:", getErrorMessageMinimal(e));
            // Fall through to next attempt or re-throw
        }
    }
    try {
        // @ts-expect-error TS2345: (This was from a previous fix for other reasons, kept if relevant)
        return Buffer.from(stream).toString('utf-8');
    } catch (e: unknown) { // MODIFIED: If this was the flagged `catch (e)`
        const message = getErrorMessageMinimal(e);
        console.error("Could not convert stream-like object to string with final fallback:", message, e);
        throw new Error(`Unsupported stream-like object provided to streamToString: ${message}`);
    }
}

export interface LatestResumeMetadata {
    resumeFileKey: string;
    originalFileName: string;
    contentType: string;
    uploadedAt: string;
    size: number;
}