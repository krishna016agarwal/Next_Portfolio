import { NextRequest, NextResponse } from 'next/server';

import fs from 'fs';

import { parseFormData } from '@/helpers/parseForm';
import { uploadOnCloudinary } from '@/helpers/cloudinary';
import ProjectModel from '@/model/project'; // adjust this if needed
import dbConnect from '@/lib/dbConnect'; // adjust this path if needed

export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  await dbConnect();

  try {
    const { fields, files } = await parseFormData(req);

    // Split the 'technologiesUsed' field by commas and trim any extra spaces
    const technologiesArray = fields.technologiesUsed
      ? fields.technologiesUsed.split(',').map((tech:any) => tech.trim())
      : [];

    const localImagePath = files.image?.filepath;
    const cloudinaryUrl = await uploadOnCloudinary(localImagePath);

    if (fs.existsSync(localImagePath)) fs.unlinkSync(localImagePath);

    const project = await ProjectModel.create({
      name: fields.name,
      github: fields.github,
      projectLink: fields.projectLink,
      technologiesUsed: technologiesArray, // Now an array of technologies
      image: cloudinaryUrl,
    });

    return NextResponse.json({
      success: true,
      message: 'Project added successfully',
      project,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload project' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();
  const data = await ProjectModel.find();

  if (data) {
    return Response.json({
      success: true, data: data
    })
  }

  try {

  } catch (error) {
    console.log('Error in project display',error);
    return Response.json({
      success: false,
      message: "ERROR in project display",
      data:error
    })
  }
}


export async function PATCH(req: NextRequest) {
  await dbConnect();

  try {
    const { fields, files } = await parseFormData(req); // Parse the form data
console.log(fields,files);

    const projectId = fields.id;
    if (!projectId) {
      return NextResponse.json({
        success: false,
        message: "Project ID is required.",
      }, { status: 400 });
    }

    
    // Handle the image upload (if a new image is provided)
    let cloudinaryUrl = fields.image; // Default to existing image URL (if not updating the image)
    if (files.image) {
      const localImagePath = files.image?.filepath;
      cloudinaryUrl = await uploadOnCloudinary(localImagePath);

      // Delete the local image after upload to Cloudinary
      if (fs.existsSync(localImagePath)) fs.unlinkSync(localImagePath);
    }


    // Construct the update object based on the fields
    const updates = {
      name: fields.name,
      github: fields.github,
      projectLink: fields.projectLink,
      
      image: cloudinaryUrl, // Update the image field (if provided)
    };
    if ('technologiesUsed' in fields) {
      updates.technologiesUsed = fields.technologiesUsed
        .split(',')
        .map((tech: any) => tech.trim());
    }
    // Update the project in the database
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return NextResponse.json({
        success: false,
        message: "Project not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update project" },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  await dbConnect();

  try {
    const {id} = await req.json();


    const project = await ProjectModel.findByIdAndDelete(id);
    if (project) {
      return Response.json({
        success: true, message: 'Project deleted successfully'
      })
    }

return Response.json({
      success: false,
      message: "Project not found"
    })
  } catch (error) {
    console.log('Error in project submission');
    return Response.json({
      success: false,
      message: "Error in Project Submission"
    })
  }
}

//frotend
// 'use client';

// import { useState } from 'react';

// export default function UpdateProjectForm() {
//   const [formData, setFormData] = useState({
//     id: '',
//     name: '',
//     github: '',
//     projectLink: '',
//     image: '',
//     technologiesUsed: ''
//   });

//   const [response, setResponse] = useState(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Prepare dynamic update object
//     const updates: any = {};
//     for (const key in formData) {
//       if (key !== 'id' && formData[key as keyof typeof formData]) {
//         if (key === 'technologiesUsed') {
//           updates[key] = formData[key].split(',').map(tech => tech.trim());
//         } else {
//           updates[key] = formData[key];
//         }
//       }
//     }

//     try {
//       const res = await fetch('/api/projects', {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ id: formData.id, updates })
//       });

//       const data = await res.json();
//       setResponse(data);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 border rounded-lg shadow-md mt-8">
//       <h2 className="text-xl font-semibold mb-4">Update Project</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="id"
//           placeholder="Project ID (required)"
//           className="w-full p-2 border rounded"
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="name"
//           placeholder="Project Name"
//           className="w-full p-2 border rounded"
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="github"
//           placeholder="GitHub Link"
//           className="w-full p-2 border rounded"
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="projectLink"
//           placeholder="Live Project Link"
//           className="w-full p-2 border rounded"
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="image"
//           placeholder="Image URL"
//           className="w-full p-2 border rounded"
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="technologiesUsed"
//           placeholder="Technologies (comma-separated)"
//           className="w-full p-2 border rounded"
//           onChange={handleChange}
//         />
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Update Project
//         </button>
//       </form>

//       {response && (
//         <div className="mt-4">
//           <h3 className="font-medium">Server Response:</h3>
//           <pre className="bg-gray-100 p-2 rounded text-sm">
//             {JSON.stringify(response, null, 2)}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// }
