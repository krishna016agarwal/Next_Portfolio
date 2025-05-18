import dbConnect from "@/lib/dbConnect";
import CertificationModel from "@/model/certification";
import fs from "fs";
import { parseFormData } from "@/helpers/parseForm";
import { uploadOnCloudinary } from "@/helpers/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await dbConnect();
  try {
    const data = await CertificationModel.find();
    return Response.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.log("Error in Certificates display");
    return Response.json({
      success: false,
      message: "ERROR in Certificates display",
    });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { fields, files } = await parseFormData(req);
    const localImagePath = files.image?.filepath;
    const cloudinaryUrl = await uploadOnCloudinary(localImagePath);
    if (fs.existsSync(localImagePath)) fs.unlinkSync(localImagePath);
console.log(fields);

    const certificate = await CertificationModel.create({
      name: fields.name,
      instituteName: fields.instituteName,
      image: cloudinaryUrl,
    });

    return Response.json({
      success: true,
      message: "Certificate added successfully",
      data:certificate
    });
  } catch (error) {
    console.log("Error in Certification submission");
    return Response.json({
      success: false,
      message: "Error in Certification submission",
    });
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  try {
    const { _id } = await req.json();
    await CertificationModel.findByIdAndDelete(_id);
    return Response.json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    console.log("Certification delete Error");
    return Response.json({
      success: false,
      message: "Certification delete Error",
    });
  }
}

export async function PATCH(req: Request) {
  await dbConnect();

  try {
    const { fields, files } = await parseFormData(req);
    const _id = fields._id;

    if (!_id) {
      return Response.json({ success: false, message: "ID is required" });
    }
console.log(fields);

    const updateData: any = {};
    if (fields.name) updateData.name = fields.name;
    if (fields.instituteName) updateData.instituteName = fields.instituteName;
console.log(updateData);

    if (files.image) {
      const localImagePath = files.image.filepath;
      const cloudinaryUrl = await uploadOnCloudinary(localImagePath);
      if (fs.existsSync(localImagePath)) fs.unlinkSync(localImagePath);
      updateData.image = cloudinaryUrl;
    }
console.log("Updating:", _id, updateData);

    const updated = await CertificationModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return Response.json({
        success: false,
        message: "Certificate not found",
      });
    }

    return Response.json({
      success: true,
      message: "Certificate updated",
      data: updated,
    });
  } catch (error) {
    console.error("Update error", error);
    return Response.json({ success: false, message: "Update failed" });
  }
}
