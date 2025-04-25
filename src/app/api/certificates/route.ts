import dbConnect from "@/lib/dbConnect";
import CertificationModel from "@/model/certification";
import fs from 'fs';

import { parseFormData } from '@/helpers/parseForm';
import { uploadOnCloudinary } from '@/helpers/cloudinary';
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    await dbConnect();
    try {
        
        const data = await CertificationModel.find();

        if (data) {
            return Response.json({
                success: true, data: data
            })
        }
        return Response.json({
            success: false, message: 'Certificate not found'
        })



    } catch (error) {
        console.log('Error in Certificates display');
        return Response.json({
            success: false,
            message: "ERROR in Certificates display"
        })
    }
}

export async function POST(req: Request) {
    await dbConnect();

    try {
          const { fields, files } = await parseFormData(req);
          const localImagePath = files.image?.filepath;
              const cloudinaryUrl = await uploadOnCloudinary(localImagePath);
          
              if (fs.existsSync(localImagePath)) fs.unlinkSync(localImagePath);
      

        const certificate = await CertificationModel.create({
            name:fields.name,  certificationLink:fields.certificationLink, image:cloudinaryUrl
        })
        if (certificate) {
            return Response.json({
                success: true, message: 'Certificate added successfully'
            })
        }

    } catch (error) {
        console.log('Error in Certification submission');
        return Response.json({
            success: false,
            message: "Error in Certification submission"
        })
    }
}

export async function DELETE(req: Request) {
    await dbConnect();

    try {
        const { _id } = await req.json();

        const certificate = await CertificationModel.findByIdAndDelete(_id);
        if (certificate) {
            return Response.json({
                success: true, message: 'Certificate deleted successfully'
            })
        }

    } catch (error) {
        console.log('Certification delete Error');
        return Response.json({
            success: false,
            message: "Certification delete Error"
        })
    }
}