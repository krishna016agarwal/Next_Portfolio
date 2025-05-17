// app/api/resume/latest/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_URL_BASE!;

export async function GET() {
  try {
    const file = await fs.readFile(path.join(process.cwd(), "public", "latest.json"), "utf-8");
    const { fileName } = JSON.parse(file);
    return NextResponse.json({ fileUrl: `${R2_PUBLIC_BASE_URL}/${fileName}` });
  } catch {
    return NextResponse.json({ fileUrl: null }, { status: 404 });
  }
}
