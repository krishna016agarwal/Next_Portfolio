"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Page() {
  const [data, setData] = useState({
    name: "",
    image: null as File | null,
    github: "",
    projectLink: "",
    technologiesUsed: [] as string[],
  });

  const [techInput, setTechInput] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [updateData, setUpdateData] = useState({
    image: null as File | null,
    github: "",
    projectLink: "",
    technologiesUsed: [] as string[],
  });
  const [updateTechInput, setUpdateTechInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setData({ ...data, image: files[0] });
    } else if (name === "technologiesUsed") {
      setTechInput(value);
      setData({
        ...data,
        technologiesUsed: value
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
      });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image) formData.append("image", data.image);
    formData.append("github", data.github);
    formData.append("projectLink", data.projectLink);
    formData.append("technologiesUsed", JSON.stringify(data.technologiesUsed));

    try {
      await axios.post("/api/projects", formData);
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
    const res = await axios.get("/api/projects");
    setProjectList(res.data.data);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete("/api/projects", { data: { id } });
      alert("🗑️ Project deleted");
      fetchProjects();
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("❌ Failed to delete project");
    }
  };

  const handleUpdateSubmit = async () => {
    const updates: any = {};
    if (updateData.image) updates.image = updateData.image;
    if (updateData.github) updates.github = updateData.github;
    if (updateData.projectLink) updates.projectLink = updateData.projectLink;
    if (updateData.technologiesUsed.length > 0)
      updates.technologiesUsed = updateData.technologiesUsed;


    const formData = new FormData();
    
    
    formData.append("id", currentProjectId!);
    
    for (const key in updates) {
      const value = updates[key];
      if (value !== null && value !== undefined) {
        if (key === "technologiesUsed") {
          console.log(value);
          
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      }
    }
    
    // // Debug FormData content
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }
    


    try {
      await axios.patch("/api/projects", formData);
     
      
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

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setUpdateData({ ...updateData, image: files[0] });
    } else if (name === "technologiesUsed") {
      setUpdateTechInput(value);
      setUpdateData({
        ...updateData,
        technologiesUsed: value
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
      });
      
      
    } else {
      setUpdateData({ ...updateData, [name]: value });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
          <label className="text-white font-semibold block mb-2!">Project Name</label>
          <input
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
          <label className="text-white font-semibold block mb-4!">Project Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-white file:bg-yellow-500 file:text-white file:rounded-lg file:px-4 file:py-2! file:border-none file:cursor-pointer bg-gray-700"
            required
          />
        </div>

        <div>
          <label className="text-white font-semibold block mb-4!">GitHub Link</label>
          <input
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
          <label className="text-white font-semibold block mb-4!">Website Link</label>
          <input
            type="text"
            name="projectLink"
            value={data.projectLink}
            onChange={handleChange}
            placeholder="Enter live project link"
            className="w-full px-4! py-3! rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="text-white font-semibold block mb-4!">Technologies Used</label>
          <input
            type="text"
            name="technologiesUsed"
            value={techInput}
            onChange={handleChange}
            placeholder="Enter technologies (e.g., html, css, js)"
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
        <h3 className="text-2xl text-white font-semibold mb-4!">📋 Submitted Projects</h3>
        {projectList.length === 0 ? (
          <p className="text-gray-300">No projects yet.</p>
        ) : (
          projectList.map((project: any) => (
            <div
              key={project._id!}
              className="flex justify-between items-center bg-gray-700 px-4! py-3! rounded-lg!"
            >
              <span className="text-white font-medium">{project.name}</span>
              <div className="flex space-x-2!">
                <button
                  onClick={() => handleDelete(project._id!)}
                  className="bg-red-600! text-white! px-3! py-1! rounded-lg! text-sm! hover:bg-red-700! transition!"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setCurrentProjectId(project._id);
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

      {isUpdateOpen && (
        <div className="fixed inset-0 bg-black! bg-opacity-50! flex justify-center items-center z-50!">
          <div className="bg-gray-200! text-black! p-6! rounded-lg! space-y-4 w-full max-w-md!">
            <h2 className="text-xl font-bold! mb-4!">Update Project</h2>
            <input
              type="file"
              name="image"
              onChange={handleUpdateInputChange}
              className="w-full! file:bg-blue-600! file:text-white! file:rounded! file:px-4! file:py-2! file:border-none! bg-gray-200!"
            />
            <input
              type="text"
              name="github"
              onChange={handleUpdateInputChange}
              placeholder="Update GitHub Link"
              className="w-full! px-4! py-2! rounded bg-gray-200!"
            />
            <input
              type="text"
              name="projectLink"
              onChange={handleUpdateInputChange}
              placeholder="Update Website Link"
              className="w-full px-4! py-2! rounded bg-gray-200!"
            />
            <input
              type="text"
              name="technologiesUsed"
              value={updateTechInput}
              onChange={handleUpdateInputChange}
              placeholder="Update Technologies (comma-separated)"
              className="w-full! px-4! py-2! rounded bg-gray-200!"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsUpdateOpen(false)}
                className="px-4! py-2! bg-gray-400! rounded text-white!"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4! py-2! bg-yellow-500! rounded text-white!"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
