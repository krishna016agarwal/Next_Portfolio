"use client"
import { useEffect, useState } from "react";
import axios from "axios";

export default function SkillsManager() {

     const [passwordInput, setPasswordInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const fetchSkills = async () => {
    try {
      const res = await axios.get("/api/skills");
      if (res.data.success) setSkills(res.data.skills);
    } catch (err) {
      console.error("Error fetching skills", err);
    }
  };



   const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/admin", {
        password: passwordInput,
      });
      if (res.data.success) {
        setAuthenticated(true);
        fetchSkills();
      } else {
        alert("Incorrect password. Access denied.");
      }
    } catch (err) {
      alert("Error validating password");
      console.error(err);
    }
    setPasswordInput("");
    setLoading(false);
  };


  useEffect(() => {
    fetchSkills();
  }, []);

  const addSkill = async () => {
    if (!skillInput.trim()) return;
    try {
      const res = await axios.post("/api/skills", { skills: skillInput });
      if (res.data.success) {
        setSkills(res.data.data);
        setSkillInput("");
      }
    } catch (err) {
      console.error("Error adding skill", err);
    }
  };

  const deleteSkill = async (skillToDelete: string) => {
    try {
      const res = await axios.delete("/api/skills", {
        data: { skills: [skillToDelete] },
      });
      if (res.data.success) {
        setSkills(skills.filter((skill) => skill !== skillToDelete));
      }
    } catch (err) {
      console.error("Error deleting skill", err);
    }
  };

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
    <div className="min-h-screen! bg-gray-900! text-white! flex! flex-col! items-center! justify-center! p-4! space-y-8!">
      <h1 className="text-4xl! font-bold!">Skills Manager</h1>

      <div className="flex! space-x-2!">
        <input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          placeholder="Add a new skill"
          className="px-4! py-2! rounded-lg! bg-gray-800 border! border-gray-600! text-white! focus:outline-none! focus:ring-2! focus:ring-blue-500!"
        />
        <button
          onClick={addSkill}
          className="bg-blue-600! hover:bg-blue-700! text-white! font-semibold! px-4! py-2! rounded-lg! transition!"
        >
          Add
        </button>
      </div>

      <div className="w-full! max-w-md! space-y-4!">
        {skills.map((skill) => (
          <div
            key={skill}
            className="flex! justify-between! items-center! bg-gray-800! px-4! py-2! rounded-lg! shadow-md! border! border-gray-700!"
          >
            <span className="text-lg!">{skill}</span>
            <button
              onClick={() => deleteSkill(skill)}
              className="bg-red-600! hover:bg-red-700! text-white! px-3! py-1! rounded-lg! transition!"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
