"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

// Define interfaces for our data structures
interface ProjectFormData {
  name: string;
  image: File | null;
  github: string;
  projectLink: string;
  technologiesUsed: string[]; // Stored as an array of strings in state
}

interface UpdateProjectData {
  image: File | null;
  github: string;
  projectLink: string;
  technologiesUsed: string[]; // Stored as an array of strings in state
}

// Interface for project objects received from the backend
interface Project {
  _id: string;
  name: string;
  image?: string; // URL string from backend
  github?: string;
  projectLink?: string;
  technologiesUsed?: string[]; // Array of strings from backend
  // Add any other properties your project object might have
}

// Interface for the dynamically built payload for PATCH updates
interface DynamicUpdatePayload {
  image?: File;
  github?: string;
  projectLink?: string;
  technologiesUsed?: string[]; // Array of strings
}

// Interface for API responses (examples)
interface AdminAuthResponse {
  success: boolean;
  message?: string;
}

interface ProjectsApiResponse {
  success: boolean;
  data: Project[];
  message?: string;
}

interface ProjectMutationResponse {
  success: boolean;
  message?: string;
  project?: Project; // For create/update
}


export default function Page() {
  const [data, setData] = useState<ProjectFormData>({
    name: "",
    image: null,
    github: "",
    projectLink: "",
    technologiesUsed: [],
  });
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [techInput, setTechInput] = useState<string>(""); // For the create form's tech input field
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [updateData, setUpdateData] = useState<UpdateProjectData>({
    image: null,
    github: "",
    projectLink: "",
    technologiesUsed: [],
  });
  const [updateTechInput, setUpdateTechInput] = useState<string>(""); // For the update form's tech input field

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      setData({ ...data, image: files[0] });
    } else if (name === "technologiesUsed") {
      setTechInput(value); // Keep track of the raw input string
      setData({
        ...data,
        technologiesUsed: value
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean), // Process into an array of strings
      });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image) {
      formData.append("image", data.image);
    }
    formData.append("github", data.github);
    formData.append("projectLink", data.projectLink);
    // Send technologiesUsed as a comma-separated string
    formData.append("technologiesUsed", data.technologiesUsed.join(","));

    try {
      await axios.post<ProjectMutationResponse>("/api/projects", formData);
      alert("✅ Project submitted successfully!");
      setData({
        name: "",
        image: null,
        github: "",
        projectLink: "",
        technologiesUsed: [],
      });
      setTechInput("");
      fetchProjects();
    } catch (error) {
      alert("❌ Failed to submit project.");
      console.error(error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get<ProjectsApiResponse>("/api/projects");
      if (res.data.success && res.data.data) {
        setProjectList(res.data.data);
      } else {
        setProjectList([]);
        console.error("Failed to fetch projects or data is missing:", res.data.message);
      }
    } catch (error) {
        console.error("Error fetching projects:", error);
        setProjectList([]);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post<AdminAuthResponse>("/api/admin", {
        password: passwordInput,
      });
      if (res.data.success) {
        setAuthenticated(true);
        fetchProjects();
      } else {
        alert(res.data.message || "Incorrect password. Access denied.");
      }
    } catch (err) {
      alert("Error validating password");
      console.error(err);
    }
    setPasswordInput("");
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete<ProjectMutationResponse>("/api/projects", { data: { id } });
      alert("🗑️ Project deleted");
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("❌ Failed to delete project");
    }
  };

  const handleUpdateSubmit = async () => {
    if (!currentProjectId) {
      alert("❌ No project selected for update.");
      console.error("currentProjectId is null in handleUpdateSubmit");
      return;
    }

    const payload: DynamicUpdatePayload = {};
    if (updateData.image) payload.image = updateData.image;
    if (updateData.github.trim()) payload.github = updateData.github.trim();
    if (updateData.projectLink.trim()) payload.projectLink = updateData.projectLink.trim();
    if (updateData.technologiesUsed.length > 0) {
      payload.technologiesUsed = updateData.technologiesUsed;
    }

    const formData = new FormData();
    formData.append("id", currentProjectId);

    // Iterate over the typed payload
    (Object.keys(payload) as Array<keyof DynamicUpdatePayload>).forEach((key) => {
      const value = payload[key];
      if (value !== undefined && value !== null) {
        if (key === "technologiesUsed" && Array.isArray(value)) {
          // Send technologiesUsed as a comma-separated string
          formData.append(key, value.join(","));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'string') {
          formData.append(key, value);
        }
      }
    });
    
    // Debug: Check FormData contents
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    try {
      await axios.patch<ProjectMutationResponse>("/api/projects", formData);
      alert("✅ Project updated successfully!");
      setIsUpdateOpen(false);
      setUpdateData({
        image: null,
        github: "",
        projectLink: "",
        technologiesUsed: [],
      });
      setUpdateTechInput("");
      fetchProjects();
    } catch (error) {
      console.error("Update failed", error);
      alert("❌ Failed to update project");
    }
  };

  const handleUpdateInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      setUpdateData({ ...updateData, image: files[0] });
    } else if (name === "technologiesUsed") {
      setUpdateTechInput(value); // Keep track of the raw input string
      setUpdateData({
        ...updateData,
        technologiesUsed: value
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean), // Process into an array of strings
      });
    } else {
      setUpdateData({ ...updateData, [name]: value });
    }
  };

  useEffect(() => {
    // Optionally, you might want to only fetch projects if authenticated,
    // but fetching initially and then again on auth is also fine.
    fetchProjects();
  }, []); // Fetch projects on initial load

  if (!authenticated) {
    return (
      <div className="!fixed !inset-0 !bg-black !bg-opacity-80 !flex !items-center !justify-center !z-50">
        <form
          onSubmit={handlePasswordSubmit}
          className="!bg-gray-900 !p-6 !rounded-lg !max-w-sm !w-full !space-y-4 !text-white"
        >
          <h2 className="!text-xl !font-bold !mb-4 !text-yellow-400 !text-center">
            ONLY ADMIN CAN ACCESS
          </h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="!w-full !p-3 !rounded !bg-gray-700 !text-white"
            required
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="!w-full !bg-yellow-400 !text-black !font-bold !py-3 !rounded !hover:bg-yellow-500"
          >
            {loading ? "Checking..." : "Submit"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4! mt-16! py-12! flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-gray-800 p-10! rounded-2xl shadow-2xl space-y-6 mb-10"
      >
        <h2 className="text-4xl font-bold text-center text-yellow-400 mb-4!">
          Submit Your Project
        </h2>

        <div>
          <label htmlFor="name" className="text-white font-semibold block mb-2!">
            Project Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Enter project name"
            className="w-full px-4! py-3! rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="text-white font-semibold block mb-4!">
            Project Image
          </label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-white file:bg-yellow-500 file:text-white file:rounded-lg file:px-4 file:py-2! file:border-none file:cursor-pointer bg-gray-700"
            // Making image optional for initial creation, can be required if needed
            // required
          />
        </div>

        <div>
          <label htmlFor="github" className="text-white font-semibold block mb-4!">
            GitHub Link
          </label>
          <input
            id="github"
            type="text"
            name="github"
            value={data.github}
            onChange={handleChange}
            placeholder="Enter GitHub repository link"
            className="w-full px-4! py-3! rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <div>
          <label htmlFor="projectLink" className="text-white font-semibold block mb-4!">
            Website Link
          </label>
          <input
            id="projectLink"
            type="text"
            name="projectLink"
            value={data.projectLink}
            onChange={handleChange}
            placeholder="Enter live project link"
            className="w-full px-4! py-3! rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label htmlFor="technologiesUsed" className="text-white font-semibold block mb-4!">
            Technologies Used (comma-separated)
          </label>
          <input
            id="technologiesUsed"
            type="text"
            name="technologiesUsed"
            value={techInput}
            onChange={handleChange}
            placeholder="e.g., html, css, javascript"
            className="w-full px-4! py-3! rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-5! border-2! border-amber-50! bg-yellow-400 text-black font-bold py-3 rounded-lg transition duration-200 ease-in-out hover:bg-yellow-500"
        >
          Submit Project
        </button>
      </form>

      <div className="w-full! max-w-xl! bg-gray-800 p-6! rounded-2xl! mt-6! shadow-xl! space-y-4!">
        <h3 className="text-2xl text-white font-semibold mb-4!">
          📋 Submitted Projects
        </h3>
        {projectList.length === 0 ? (
          <p className="text-gray-300">No projects yet.</p>
        ) : (
          projectList.map((project) => (
            <div
              key={project._id}
              className="flex justify-between items-center bg-gray-700 px-4! py-3! rounded-lg!"
            >
              <span className="text-white font-medium">{project.name}</span>
              <div className="flex space-x-2!">
                <button
                  onClick={() => handleDelete(project._id)}
                  className="bg-red-600! text-white! px-3! py-1! rounded-lg! text-sm! hover:bg-red-700! transition!"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setCurrentProjectId(project._id);
                    // Pre-fill update form with existing data if available
                    setUpdateData({
                        image: null, // Reset image, user must re-select if changing
                        github: project.github || "",
                        projectLink: project.projectLink || "",
                        technologiesUsed: project.technologiesUsed || []
                    });
                    setUpdateTechInput((project.technologiesUsed || []).join(", "));
                    setIsUpdateOpen(true);
                  }}
                  className="bg-blue-600! text-white! px-3! py-1! rounded-lg! text-sm! hover:bg-blue-700! transition!"
                >
                  Update
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isUpdateOpen && currentProjectId && (
        <div className="fixed inset-0 bg-black! bg-opacity-50! flex justify-center items-center z-50!">
          <div className="bg-gray-200! text-black! p-6! rounded-lg! space-y-4 w-full max-w-md!">
            <h2 className="text-xl font-bold! mb-4!">Update Project: {projectList.find(p => p._id === currentProjectId)?.name}</h2>
            <div>
              <label htmlFor="updateImage" className="text-sm font-medium text-gray-700 block mb-1">New Project Image (optional)</label>
              <input
                id="updateImage"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleUpdateInputChange}
                className="w-full! text-sm file:bg-blue-600! file:text-white! file:rounded! file:px-3! file:py-1.5! file:border-none! bg-white border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="updateGithub" className="text-sm font-medium text-gray-700 block mb-1">GitHub Link</label>
              <input
                id="updateGithub"
                type="text"
                name="github"
                value={updateData.github}
                onChange={handleUpdateInputChange}
                placeholder="Update GitHub Link"
                className="w-full! px-3! py-1.5! rounded bg-white border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label htmlFor="updateProjectLink" className="text-sm font-medium text-gray-700 block mb-1">Website Link</label>
              <input
                id="updateProjectLink"
                type="text"
                name="projectLink"
                value={updateData.projectLink}
                onChange={handleUpdateInputChange}
                placeholder="Update Website Link"
                className="w-full px-3! py-1.5! rounded bg-white border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label htmlFor="updateTechnologiesUsed" className="text-sm font-medium text-gray-700 block mb-1">Technologies Used (comma-separated)</label>
              <input
                id="updateTechnologiesUsed"
                type="text"
                name="technologiesUsed"
                value={updateTechInput}
                onChange={handleUpdateInputChange}
                placeholder="Update Technologies (e.g., react, node, mongo)"
                className="w-full! px-3! py-1.5! rounded bg-white border border-gray-300 text-sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsUpdateOpen(false);
                  setCurrentProjectId(null); // Clear current project ID on cancel
                  setUpdateData({ image: null, github: "", projectLink: "", technologiesUsed: [] }); // Reset form
                  setUpdateTechInput("");
                }}
                className="px-4! py-2! bg-gray-500! rounded text-white! text-sm hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4! py-2! bg-yellow-500! rounded text-black! text-sm hover:bg-yellow-600 font-semibold"
              >
                Submit Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}