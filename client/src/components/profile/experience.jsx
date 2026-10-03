"use client";
import { useState, useEffect } from "react";
import Card from "@/components/shared/card";
import CreateIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Buttonvariants from "@/components/ui/button";
import Input from "@/components/ui/input";
import Model from "@/components/shared/model";
import { getExperiences, createExperience, updateExperience, deleteExperience } from "@/utils/api";
import { showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";

export default function Experience({ userId, isOwnProfile = true }) {
  const [experiences, setExperiences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  
  const [formData, setFormData] = useState({
    id: null,
    job_title: "",
    start_date: "",
    end_date: "",
    location: "",
    company_name: "",
  });

  const fetchExp = async () => {
    try {
      const res = await getExperiences(userId || "");
      if (res.ok) {
        const data = await res.json();
        setExperiences(data.experiences || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchExp();
  }, [userId]);

  const openAddModal = () => {
    setFormData({ id: null, job_title: "", start_date: "", end_date: "", location: "", company_name: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    const formatDt = (dt) => dt ? new Date(dt).toISOString().split('T')[0] : "";
    setFormData({
      id: exp.id,
      job_title: exp.job_title,
      company_name: exp.company_name,
      location: exp.location || "",
      start_date: formatDt(exp.start_date),
      end_date: formatDt(exp.end_date),
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.job_title || !formData.company_name || !formData.start_date) {
      showErrorToast("Title, Company, and Start Date are required");
      return;
    }
    try {
      if (isEditing) {
        const res = await updateExperience(formData.id, formData);
        if (res.ok) {
          showSuccessToast("Experience updated!");
        } else {
          showErrorToast("Failed to update experience");
        }
      } else {
        const res = await createExperience(formData);
        if (res.ok) {
          showSuccessToast("Experience added!");
        } else {
          showErrorToast("Failed to add experience");
        }
      }
      setIsModalOpen(false);
      fetchExp();
    } catch (e) {
      showErrorToast("Network error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteExperience(id);
      if (res.ok) {
        showSuccessToast("Experience deleted!");
        fetchExp();
      }
    } catch (e) {
      showErrorToast("Failed to delete experience");
    }
  };

  return (
    <div className="my-5">
      <Card padding={1}>
        <div className="p-2 border-b border-gray-100 flex justify-between items-center">
          <div className="text-xl ">Experience</div>
          {isOwnProfile && (
            <div className="flex gap-2">
              <div onClick={openAddModal} className="cursor-pointer p-1 rounded-full transition">
                <AddIcon fontSize="medium" className="text-black-600" />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col mt-2">
          {experiences.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm">No experiences added yet. Click + to add one.</div>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="p-4 border-b border-gray-100 flex justify-between group">
                <div>
                  <div className="text-lg text-gray-800">{exp.job_title}</div>
                  <div className="text-sm text-gray-800">{exp.company_name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {exp.start_date ? new Date(exp.start_date).toLocaleDateString() : ""} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : "Present"}
                  </div>
                  <div className="text-xs text-gray-500">{exp.location}</div>
                </div>
                <div className="flex gap-2">
                  {isOwnProfile && (
                    <>
                      <div onClick={() => openEditModal(exp)} className="cursor-pointer p-1.5 rounded-full h-fit">
                        <CreateIcon fontSize="medium" className="text-black-500" />
                      </div>
                      <div onClick={() => handleDelete(exp.id)} className="cursor-pointer p-1.5 rounded-full h-fit">
                        <DeleteIcon fontSize="medium" className="text-black-500" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
      
      {isModalOpen && (
        <Model title={isEditing ? "Edit Experience" : "Add Experience"} onClose={() => setIsModalOpen(false)}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-sm text-left w-full">Title <span className="text-red-500">*</span></label>
            <Input
              type="text"
              value={formData.job_title}
              onChange={(e) => setFormData({...formData, job_title: e.target.value})}
              variant="outline"
              placeholder="Ex: Retail Sales Manager"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold text-sm text-left w-full">Company name <span className="text-red-500">*</span></label>
            <Input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              variant="outline"
              placeholder="Ex: Microsoft"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold text-sm text-left w-full">Location</label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              variant="outline"
              placeholder="Ex: Mumbai, India"
            />
          </div>

          <div className="flex gap-4 mb-6 text-left">
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-sm text-left w-full">Start Date <span className="text-red-500">*</span></label>
              <Input 
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                variant="outline"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-semibold text-sm text-left w-full">End Date</label>
              <Input 
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                variant="outline"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4">
            <Buttonvariants onClick={() => setIsModalOpen(false)} variant="cancel">
              Cancel
            </Buttonvariants>
            <Buttonvariants onClick={handleSave} variant="expsend">
              Save
            </Buttonvariants>
          </div>
        </Model>
      )}
    </div>
  );
}
