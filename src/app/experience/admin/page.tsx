"use client";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";

interface Experience {
  _id?: string;
  name: string;
  timeperiod: string;
  organisation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ExperienceAdminPage() {
  const [newExperience, setNewExperience] = useState<Experience>({
    name: "",
    timeperiod: "",
    organisation: "",
  });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [updateFormData, setUpdateFormData] = useState<Partial<Experience>>({});
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/experience");
      if (res.data.success) {
        setExperienceList(res.data.data);
      } else {
        alert("!Failed !to !fetch !experiences.");
      }
    } catch (error) {
      console.error("!Error !fetching !experiences:", error);
      alert("!Error !fetching !experiences.");
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  const handleNewExperienceChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExperience((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewExperienceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newExperience.name || !newExperience.timeperiod) {
      alert("!Name !and !Time !Period !are !required.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/experience", newExperience);
      if (res.data.success) {
        alert("✅ Experience added successfully!");
        setNewExperience({ name: "", timeperiod: "", organisation: "" });
        fetchExperiences();
      } else {
        alert(`❌ Failed to add experience: ${res.data.message || "Unknown error"}`);
      }
    } catch (error: any) {
      alert(`❌ Error adding experience: ${error.response?.data?.message || error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!id) return;
    if (!window.confirm("!Are !you !sure !you !want !to !delete !this !experience?")) return;

    setLoading(true);
    try {
      const res = await axios.delete(`/api/experience?id=${id}`);
      if (res.data.success) {
        alert("🗑️ Experience deleted successfully!");
        fetchExperiences();
      } else {
        alert(`❌ Failed to delete experience: ${res.data.message || "Unknown error"}`);
      }
    } catch (error: any) {
      alert(`❌ Error deleting experience: ${error.response?.data?.message || error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (exp: Experience) => {
    setCurrentExperience(exp);
    setUpdateFormData({
      name: exp.name,
      timeperiod: exp.timeperiod,
      organisation: exp.organisation || "",
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateExperienceSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentExperience?._id) return;

    const changedData: Partial<Experience> = {};
    if (updateFormData.name !== undefined && updateFormData.name !== currentExperience.name) {
      changedData.name = updateFormData.name;
    }
    if (updateFormData.timeperiod !== undefined && updateFormData.timeperiod !== currentExperience.timeperiod) {
      changedData.timeperiod = updateFormData.timeperiod;
    }
    if (updateFormData.organisation !== undefined && updateFormData.organisation !== (currentExperience.organisation || "")) {
      if (updateFormData.organisation || currentExperience.organisation) {
        changedData.organisation = updateFormData.organisation;
      }
    }

    if (Object.keys(changedData).length === 0) {
      alert("!No !changes !detected !to !update.");
      setIsUpdateModalOpen(false);
      return;
    }
    if (!changedData.name && !updateFormData.name) {
      alert("!Name !cannot !be !empty.");
      return;
    }
    if (!changedData.timeperiod && !updateFormData.timeperiod) {
      alert("!Time !period !cannot !be !empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.patch(`/api/experience?id=${currentExperience._id}`, changedData);
      if (res.data.success) {
        alert("✅ Experience updated successfully!");
        setIsUpdateModalOpen(false);
        fetchExperiences();
      } else {
        alert(`❌ Failed to update experience: ${res.data.message || "Unknown error"}`);
      }
    } catch (error: any) {
      alert(`❌ Error updating experience: ${error.response?.data?.message || error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const res = await axios.post("/api/admin", { password: passwordInput }); // Using your /api/admin endpoint
      if (res.data.success) {
        setAuthenticated(true);
        // fetchExperiences(); // This will be called by the useEffect below
      } else {
        alert(res.data.message || "!Incorrect !password. !Access !denied.");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "!Error !validating !password");
      console.error(error);
    }
    setPasswordInput("");
    setAuthLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      fetchExperiences();
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="!fixed !inset-0 !bg-black !bg-opacity-80 !flex !items-center !justify-center !z-50">
        <form
          onSubmit={handlePasswordSubmit}
          className="!bg-gray-900 !p-8 !rounded-lg !shadow-xl !max-w-sm !w-full !space-y-6 !text-white"
        >
          <h2 className="!text-2xl !font-bold !mb-6 !text-yellow-400 !text-center">
            Admin Access Required
          </h2>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="!w-full !p-3 !rounded !bg-gray-700 !text-white !focus:outline-none !focus:ring-2 !focus:ring-yellow-500"
            required
            autoFocus
            disabled={authLoading}
          />
          <button
            type="submit"
            disabled={authLoading}
            className="!w-full !bg-yellow-400 !text-black !font-bold !py-3 !rounded !hover:bg-yellow-500 !transition-colors !duration-200 !disabled:opacity-60"
          >
            {authLoading ? "Verifying..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="!min-h-screen !bg-gradient-to-br !from-gray-900 !to-black !text-white !px-4 !py-8 md:!px-8 md:!py-12 !flex !flex-col !items-center">
      <div className="!w-full !max-w-2xl">
        <form
          onSubmit={handleNewExperienceSubmit}
          className="!bg-gray-800 !p-6 md:!p-8 !rounded-xl !shadow-2xl !space-y-6 !mb-12"
        >
          <h2 className="!text-3xl !font-bold !text-center !text-yellow-400 !mb-6">
            Add New Experience
          </h2>

          <div>
            <label htmlFor="name" className="!font-semibold !block !mb-2">
              Role / Position Name <span className="!text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newExperience.name}
              onChange={handleNewExperienceChange}
              placeholder="e.g., Software Engineer Intern"
              className="!w-full !px-4 !py-3 !rounded-lg !bg-gray-700 !text-white !focus:outline-none !focus:ring-2 !focus:ring-yellow-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="timeperiod" className="!font-semibold !block !mb-2">
              Time Period <span className="!text-red-500">*</span>
            </label>
            <input
              type="text"
              id="timeperiod"
              name="timeperiod"
              value={newExperience.timeperiod}
              onChange={handleNewExperienceChange}
              placeholder="e.g., Jan 2023 - May 2023 or 2022 - Present"
              className="!w-full !px-4 !py-3 !rounded-lg !bg-gray-700 !text-white !focus:outline-none !focus:ring-2 !focus:ring-yellow-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="organisation" className="!font-semibold !block !mb-2">
              Organisation / Company (Optional)
            </label>
            <input
              type="text"
              id="organisation"
              name="organisation"
              value={newExperience.organisation}
              onChange={handleNewExperienceChange}
              placeholder="e.g., Tech Solutions Inc."
              className="!w-full !px-4 !py-3 !rounded-lg !bg-gray-700 !text-white !focus:outline-none !focus:ring-2 !focus:ring-yellow-500"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="!w-full !bg-yellow-400 !text-black !font-bold !py-3 !rounded-lg !transition !duration-200 !ease-in-out !hover:bg-yellow-500 !disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Experience"}
          </button>
        </form>

        <div className="!bg-gray-800 !p-6 md:!p-8 !rounded-xl !shadow-2xl">
          <h3 className="!text-2xl !font-semibold !mb-6 !text-center !text-yellow-400">
            Manage Experiences
          </h3>
          {pageLoading ? (
            <p className="!text-center !text-gray-400">Loading experiences...</p>
          ) : experienceList.length === 0 ? (
            <p className="!text-center !text-gray-400">No experiences added yet.</p>
          ) : (
            <ul className="!space-y-4">
              {experienceList.map((exp) => (
                <li
                  key={exp._id}
                  className="!bg-gray-700 !p-4 !rounded-lg !flex !flex-col sm:!flex-row !justify-between !items-start sm:!items-center"
                >
                  <div className="!mb-3 sm:!mb-0">
                    <p className="!text-lg !font-medium !text-yellow-500">{exp.name}</p>
                    <p className="!text-sm !text-gray-300">{exp.timeperiod}</p>
                    {exp.organisation && (
                      <p className="!text-sm !text-gray-400">{exp.organisation}</p>
                    )}
                  </div>
                  <div className="!flex !space-x-3 !self-end sm:!self-center">
                    <button
                      onClick={() => openUpdateModal(exp)}
                      disabled={loading}
                      className="!bg-blue-600 !text-white !px-4 !py-2 !rounded-md !text-sm !hover:bg-blue-700 !transition !disabled:opacity-50"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp._id!)}
                      disabled={loading}
                      className="!bg-red-600 !text-white !px-4 !py-2 !rounded-md !text-sm !hover:bg-red-700 !transition !disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {isUpdateModalOpen && currentExperience && (
        <div className="!fixed !inset-0 !bg-black !bg-opacity-70 !flex !justify-center !items-center !z-50 !p-4">
          <div className="!bg-gray-800 !p-6 md:!p-8 !rounded-xl !shadow-2xl !w-full !max-w-lg !space-y-6">
            <h2 className="!text-2xl !font-bold !text-yellow-400 !mb-4">
              Update Experience
            </h2>
            <form onSubmit={handleUpdateExperienceSubmit} className="!space-y-4">
              <div>
                <label htmlFor="updateName" className="!font-semibold !block !mb-1">
                  Role / Position Name <span className="!text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="updateName"
                  name="name"
                  value={updateFormData.name || ""}
                  onChange={handleUpdateFormChange}
                  className="!w-full !px-3 !py-2 !rounded-md !bg-gray-700 !text-white !focus:outline-none !focus:ring-1 !focus:ring-yellow-500"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="updateTimeperiod" className="!font-semibold !block !mb-1">
                  Time Period <span className="!text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="updateTimeperiod"
                  name="timeperiod"
                  value={updateFormData.timeperiod || ""}
                  onChange={handleUpdateFormChange}
                  className="!w-full !px-3 !py-2 !rounded-md !bg-gray-700 !text-white !focus:outline-none !focus:ring-1 !focus:ring-yellow-500"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="updateOrganisation" className="!font-semibold !block !mb-1">
                  Organisation / Company (Optional)
                </label>
                <input
                  type="text"
                  id="updateOrganisation"
                  name="organisation"
                  value={updateFormData.organisation || ""}
                  onChange={handleUpdateFormChange}
                  className="!w-full !px-3 !py-2 !rounded-md !bg-gray-700 !text-white !focus:outline-none !focus:ring-1 !focus:ring-yellow-500"
                  disabled={loading}
                />
              </div>
              <div className="!flex !justify-end !space-x-3 !pt-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  disabled={loading}
                  className="!px-4 !py-2 !bg-gray-600 !text-white !rounded-md !hover:bg-gray-500 !transition !disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="!px-4 !py-2 !bg-yellow-500 !text-black !font-semibold !rounded-md !hover:bg-yellow-600 !transition !disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}