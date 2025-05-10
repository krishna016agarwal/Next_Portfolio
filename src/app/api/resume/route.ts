import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import dbConnect from '@/lib/dbConnect';
import ResumeModel from '../../../model/resume';
import { parseFormData } from '@/helpers/parseForm';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { fields, files } = await parseFormData(req);

    const file = Array.isArray(files.resume) ? files.resume[0] : files.resume;

    if (!file || !file.filepath) {
      throw new Error('Resume file is missing or invalid');
    }

    const buffer = fs.readFileSync(file.filepath);

    // Extract proper filename
    const originalFilename = file.filename?.filename || 'resume.pdf';
    const fileName = `${Date.now()}_${originalFilename}`;

    // Save to /public/uploads
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fullPath = path.join(uploadDir, fileName);
    fs.writeFileSync(fullPath, buffer);

    const resumeUrl = `/uploads/${fileName}`;

    // Save to DB
    const resume = await ResumeModel.create({
      name: fields.name,
      email: fields.email,
      url: resumeUrl,
    });

    return NextResponse.json({ success: true, resume });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Resume upload failed' }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();

  try {
    const resumes = await ResumeModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, resumes });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error fetching resumes' }, { status: 500 });
  }
}
