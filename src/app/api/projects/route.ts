import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { parseFormData, ParsedFormData, UploadedFile } from '@/helpers/parseForm';
import { uploadOnCloudinary } from '@/helpers/cloudinary';
import ProjectModel, { Project as IProjectType } from '@/model/project';
import dbConnect from '@/lib/dbConnect';

export const dynamic = 'force-dynamic';

// Define a type for the data used to CREATE a new project.
// This should only include the fields you define in your schema.
interface ProjectCreationData {
  name: string;
  github: string;
  projectLink?: string; // Optional based on your schema, make it required if it is
  technologiesUsed: string[];
  image: string | null; // Mongoose will handle 'null' if your schema allows it or has a default
}


// --- POST Handler ---
export async function POST(req: Request) {
  await dbConnect();

  try {
    const parsedData: ParsedFormData = await parseFormData(req);
    const fields = parsedData.fields;
    const files = parsedData.files;

    const name = fields.name;
    const github = fields.github;
    const technologiesUsedString = fields.technologiesUsed;
    const projectLink = fields.projectLink;

    if (!name || !github) {
        return NextResponse.json(
            { success: false, message: 'Project name and GitHub link are required.' },
            { status: 400 }
        );
    }

    const technologiesArray: string[] = technologiesUsedString
      ? technologiesUsedString.split(',').map((tech: string) => tech.trim()).filter(Boolean)
      : [];

    let cloudinaryUrl: string | null = null;
    const imageFile: UploadedFile | undefined = files.image;
    let localImagePathForCleanup: string | undefined;

    if (imageFile && imageFile.filepath) {
      const localImagePath = imageFile.filepath;
      localImagePathForCleanup = localImagePath;

      const uploadedUrl = await uploadOnCloudinary(localImagePath);
      if (uploadedUrl) {
        cloudinaryUrl = uploadedUrl;
      } else {
        console.warn("Cloudinary upload in POST returned no URL.");
      }
    } else if (imageFile && !imageFile.filepath) {
        console.warn("[POST] Image file object received but filepath is missing:", imageFile);
    }

    // Use the new ProjectCreationData interface
    const projectData: ProjectCreationData = {
      name: name,
      github: github,
      projectLink: projectLink || undefined, // Use undefined if optional and not provided
      technologiesUsed: technologiesArray,
      image: cloudinaryUrl, // Your model's image type is 'string', but 'null' is fine for creation if schema allows
    };

    const createdProject: IProjectType = await ProjectModel.create(projectData); // Mongoose handles this correctly

    if (localImagePathForCleanup && fs.existsSync(localImagePathForCleanup)) {
      try {
        fs.unlinkSync(localImagePathForCleanup);
      } catch (unlinkErr) {
        console.error("Error deleting local image after POST:", unlinkErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Project added successfully',
      project: createdProject,
    });

  } catch (error: unknown) {
    let errorMessage = 'Failed to add project.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    console.error('Error adding project:', error);
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

// --- GET Handler ---
export async function GET() {
  await dbConnect();
  try {
    const data: IProjectType[] = await ProjectModel.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error: unknown) {
    let errorMessage = "Error fetching projects.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    console.error('Error fetching projects:', error);
    return NextResponse.json({
      success: false,
      message: errorMessage,
    }, { status: 500 });
  }
}

// --- PATCH Handler ---
interface ProjectUpdatePayload {
  name?: string;
  github?: string;
  projectLink?: string;
  image?: string | null;
  technologiesUsed?: string[];
}

export async function PATCH(req: NextRequest) {
  await dbConnect();

  try {
    const parsedData: ParsedFormData = await parseFormData(req);
    const fields = parsedData.fields;
    const files = parsedData.files;

    const projectId = fields.id;
    if (!projectId) {
      return NextResponse.json({
        success: false,
        message: "Project ID is required for update.",
      }, { status: 400 });
    }

    let imageToUpdate: string | null | undefined;
    let localImagePathForCleanup: string | undefined;

    const existingProject = await ProjectModel.findById(projectId);
    if (!existingProject) {
        return NextResponse.json({ success: false, message: "Project not found to update." }, { status: 404 });
    }
    // Your `Project` interface defines `image: string`. If the DB can have it as null/undefined initially:
    imageToUpdate = existingProject.image as (string | null | undefined);


    if (fields.image !== undefined) {
        if (fields.image === "" || fields.image === null) {
            imageToUpdate = null;
        } else {
            if (!files.image) {
               imageToUpdate = fields.image;
            }
        }
    }


    const newImageFile: UploadedFile | undefined = files.image;
    if (newImageFile && newImageFile.filepath) {
      const localPath = newImageFile.filepath;
      localImagePathForCleanup = localPath;

      try {
        const newCloudinaryUrl = await uploadOnCloudinary(localPath);
        if (newCloudinaryUrl) {
          imageToUpdate = newCloudinaryUrl;
        } else {
          console.error("Cloudinary upload (PATCH) returned no URL for the new image.");
        }
      } catch (uploadError: unknown) {
        console.error("Error processing new image (PATCH):", uploadError);
      }
    } else if (newImageFile && !newImageFile.filepath) {
        console.warn("[PATCH] New image file object received but filepath is missing:", newImageFile);
    }


    const updates: ProjectUpdatePayload = {};
    if (fields.name !== undefined && fields.name !== existingProject.name) updates.name = fields.name;
    if (fields.github !== undefined && fields.github !== existingProject.github) updates.github = fields.github;
    if (fields.projectLink !== undefined && fields.projectLink !== (existingProject.projectLink || "")) {
        updates.projectLink = fields.projectLink;
    }

    const currentImageInDb = existingProject.image as (string | null | undefined); // Cast for comparison
    if (imageToUpdate !== currentImageInDb) { // Check if image has actually changed
        updates.image = imageToUpdate;
    }

    if (fields.technologiesUsed && typeof fields.technologiesUsed === 'string') {
      const newTechArray = fields.technologiesUsed.split(',').map((tech: string) => tech.trim()).filter(Boolean);
      if (JSON.stringify(newTechArray) !== JSON.stringify(existingProject.technologiesUsed || [])) { // Ensure existing is array for compare
        updates.technologiesUsed = newTechArray;
      }
    }

    if (Object.keys(updates).length === 0) {
        if (localImagePathForCleanup && fs.existsSync(localImagePathForCleanup)) {
           fs.unlinkSync(localImagePathForCleanup);
        }
        return NextResponse.json({
            success: true,
            message: "No effective changes provided to update.",
            project: existingProject,
        }, { status: 200 });
    }

    const updatedProjectDoc: IProjectType | null = await ProjectModel.findByIdAndUpdate(
      projectId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (localImagePathForCleanup && fs.existsSync(localImagePathForCleanup)) {
        try {
            fs.unlinkSync(localImagePathForCleanup);
        } catch (unlinkErr) {
            console.error("Error deleting local image after PATCH:", unlinkErr);
        }
    }

    if (!updatedProjectDoc) {
      return NextResponse.json({
        success: false,
        message: "Project not found or failed to update.",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      project: updatedProjectDoc,
    });

  } catch (error: unknown) {
    let errorMessage = 'Failed to update project.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

// --- DELETE Handler ---
interface DeleteRequestBody {
    id?: string;
}

export async function DELETE(req: Request) {
  await dbConnect();

  try {
    const body: DeleteRequestBody = await req.json();
    const { id } = body;

    if (!id) {
        return NextResponse.json(
            { success: false, message: "Project ID is required for deletion." },
            { status: 400 }
        );
    }

    const projectToDelete: IProjectType | null = await ProjectModel.findByIdAndDelete(id);

    if (projectToDelete) {
      return NextResponse.json({
        success: true, message: 'Project deleted successfully'
      });
    }

    return NextResponse.json({
      success: false,
      message: "Project not found."
    }, { status: 404 });

  } catch (error: unknown) {
    let errorMessage = "Error deleting project.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 });
  }
}