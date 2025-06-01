// app/api/resume/route.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_URL_BASE!;

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ success: false, message: "No file provided" });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: file.name,
        Body: buffer,
      })
    );

    // Save latest file name in a JSON file
    const latestPath = path.join(process.cwd(), "public", "latest.json");
    await fs.writeFile(latestPath, JSON.stringify({ fileName: file.name }), "utf-8");

    const fileUrl = `${R2_PUBLIC_BASE_URL}/${file.name}`;
    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Upload failed",error:error }, { status: 500 });
  }
}
