// src/app/api/experience/route.ts
import dbConnect from "@/lib/dbConnect"; // Assuming this is your DB connection utility
import ExperienceModel from "@/model/experience"; // Your Experience Mongoose model
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

/**
 * @method POST
 * @description Create a new experience
 * @param {NextRequest} req
 * @returns {NextResponse}
 */
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { name, timeperiod, organisation } = body;

    // Basic validation
    if (!name || !timeperiod) {
      return NextResponse.json(
        { success: false, message: "Name and time period are required." },
        { status: 400 }
      );
    }

    const newExperience = new ExperienceModel({
      name,
      timeperiod,
      organisation,
    });

    await newExperience.save();

    return NextResponse.json(
      {
        success: true,
        message: "Experience created successfully",
        data: newExperience,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating experience:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, message: "Validation Error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "An error occurred while creating the experience." },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @description Get all experiences or a single experience by ID
 * @param {NextRequest} req
 * @returns {NextResponse}
 */
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const experienceId = searchParams.get('id');

    if (experienceId) {
      // Get a single experience by ID
      if (!mongoose.Types.ObjectId.isValid(experienceId)) {
        return NextResponse.json(
          { success: false, message: "Invalid Experience ID format." },
          { status: 400 }
        );
      }
      const experience = await ExperienceModel.findById(experienceId);
      if (!experience) {
        return NextResponse.json(
          { success: false, message: "Experience not found." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, data: experience },
        { status: 200 }
      );
    } else {
      // Get all experiences
      const experiences = await ExperienceModel.find({}).sort({ createdAt: -1 }); // Sort by newest first
      return NextResponse.json(
        { success: true, data: experiences },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching experience(s):", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching experience(s)." },
      { status: 500 }
    );
  }
}

/**
 * @method PATCH
 * @description Update an existing experience by ID
 * @param {NextRequest} req
 * @returns {NextResponse}
 */
export async function PATCH(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const experienceId = searchParams.get('id');

    if (!experienceId) {
      return NextResponse.json(
        { success: false, message: "Experience ID is required for update." },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(experienceId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Experience ID format." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, timeperiod, organisation } = body;

    // Construct update object with only provided fields
    const updateData: { name?: string; timeperiod?: string; organisation?: string } = {};
    if (name !== undefined) updateData.name = name;
    if (timeperiod !== undefined) updateData.timeperiod = timeperiod;
    if (organisation !== undefined) updateData.organisation = organisation;

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
            { success: false, message: "No fields provided for update." },
            { status: 400 }
        );
    }

    const updatedExperience = await ExperienceModel.findByIdAndUpdate(
      experienceId,
      updateData,
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );

    if (!updatedExperience) {
      return NextResponse.json(
        { success: false, message: "Experience not found or no changes made." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Experience updated successfully",
        data: updatedExperience,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating experience:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, message: "Validation Error", errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "An error occurred while updating the experience." },
      { status: 500 }
    );
  }
}

/**
 * @method DELETE
 * @description Delete an experience by ID
 * @param {NextRequest} req
 * @returns {NextResponse}
 */
export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const experienceId = searchParams.get('id');

    if (!experienceId) {
      return NextResponse.json(
        { success: false, message: "Experience ID is required for deletion." },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(experienceId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Experience ID format." },
        { status: 400 }
      );
    }

    const deletedExperience = await ExperienceModel.findByIdAndDelete(experienceId);

    if (!deletedExperience) {
      return NextResponse.json(
        { success: false, message: "Experience not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Experience deleted successfully", data: deletedExperience },
      { status: 200 } // Or 204 No Content if you prefer not to send data back
    );
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while deleting the experience." },
      { status: 500 }
    );
  }
}