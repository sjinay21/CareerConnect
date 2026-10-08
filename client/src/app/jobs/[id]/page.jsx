"use client";

import PrivateRoute from '@/Route/privateroute';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { formatSalary } from "@/data/dummyJobs";
import { getAllJobs, getJobById, deleteJob, applyToJob } from "@/utils/api";
import { useAppNavigation } from "@/hooks/useNavigation";
import { useProfile } from "@/hooks/useProfile";
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import PaymentsIcon from '@mui/icons-material/Payments';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import Buttonvariants from "@/components/ui/button";
function JobDetailsPage() {
  const params = useParams();
  const { goToJob } = useAppNavigation();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: "" });
  const { profile } = useProfile();

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const response = await getAllJobs();
        if (response.ok) {
          const data = await response.json();
          if (data.jobs) setJobs(data.jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchAllJobs();
  }, []);

  useEffect(() => {
    const fetchSelectedJob = async () => {
      if (params.id) {
        try {
          const response = await getJobById(params.id);
          if (response.ok) {
            const data = await response.json();
            if (data.job) {
              setSelectedJob(data.job);
            }
          }
        } catch (error) {
          console.error("Error fetching specific job:", error);
        }
      }
    };
    fetchSelectedJob();
  }, [params.id]);

  const handleJobClick = (job) => {
    goToJob(job.id);
  };

  const handleApply = async () => {
    try {
      const response = await applyToJob(selectedJob.id);
      const data = await response.json();

      if (response.ok) {
        const newCount = (selectedJob.applicant_count || 0) + 1;
        setSelectedJob({...selectedJob,has_applied: true,applicant_count: newCount});
        setJobs(jobs.map(j => 
          j.id == selectedJob.id 
            ? { ...j, has_applied: true, applicant_count: newCount } 
            : j
        ));
        
        setAlertModal({ isOpen: true, message: data.message || "Application submitted successfully" });
      } else {
        setAlertModal({ isOpen: true, message: data.message || "Error applying to job" });
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      setAlertModal({ isOpen: true, message: "Server error occurred" });
    }
  };

  const handleDeleteJob = async (e, jobId) => {
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(j => j.id != jobId));
      if (selectedJob?.id == jobId) {
        setSelectedJob(null); // Clear right pane if active job was deleted
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="px-3 xl:px-5 py-9 flex flex-col items-center w-full bg-[#f3f2ef] min-h-screen">
      <div className="w-full py-5">
        <div className="flex w-full bg-white rounded-lg border border-gray-300 h-[80vh] ">
          <div className="w-[40%] border-r border-gray-300 overflow-y-auto bg-white flex flex-col ">
            <div className="p-5 border-b border-gray-300 bg-white top-0 z-10">
               <h2 className="text-xl font-semibold text-black">Jobs based on your preferences</h2>
               <p className="text-sm text-gray-600 mt-1">Full-time Software Engineer or Full Stack Engineer or Data Analyst or Artificial Intelligence Engineer, on-site or hybrid or remote in Surat or Ahmedabad or Mumbai or Vadodara or Pune District</p>
               <p className="text-xs text-gray-500 mt-3 font-semibold">99+ results • How promoted jobs are ranked</p>
            </div>
            
            <div className="flex-1">
              {jobs.map(job => {
                const isSelected = selectedJob?.id == job.id;
                return (
                  <div 
                    key={job.id} 
                    onClick={() => handleJobClick(job)}
                    className={`p-4 flex gap-3 cursor-pointer relative border-b border-gray-300 ${isSelected ? "bg-gray-200 hover:bg-gray-200" : "bg-white hover:bg-gray-200"}`}
                  >
                    <div className="pt-1">
                      <div className="w-14 h-14 bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center">
                         <BusinessIcon className="text-gray-500" sx={{ fontSize: 32 }} />
                      </div>
                    </div>
                    
                    <div className="flex-1 pr-6">
                       <h3 className="text-base font-semibold text-blue-700 hover:underline mb-1">{job.title}</h3>
                       <p className="text-sm text-black">{job.company_name}</p>
                       <p className="text-sm text-gray-600">{job.location}</p>
                       
                       
                       <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          {isSelected && <span className="font-semibold text-gray-600">Viewed</span>}
                          {isSelected && (job.post_at || job.easy_apply) && <span className="mx-1">•</span>}
                          {job.post_at && <span className="font-semibold text-gray-600">{job.post_at}</span>}
                          {job.post_at && job.easy_apply && <span className="mx-1">•</span>}
                          {job.easy_apply && (
                            <span className="text-blue-900 font-semibold flex items-center gap-1">
                               {job.has_applied ? "Applied" : (
                                 <>
                                   <img 
                                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEG3aEUmQKntiQbFep_sRg_0Wz2CzKQAaNAG5V1KcN5g&s=10" 
                                     alt="in" 
                                     className="w-[14px] h-[14px] rounded-sm"
                                   /> Easy Apply
                                 </>
                               )}
                            </span>
                          )}
                       </div>
                    </div>
                    
                    <Buttonvariants 
                      variant="jobIconDelete"
                      onClick={(e) => handleDeleteJob(e, job.id)}
                    >
                       <CloseIcon sx={{ fontSize: 20 }} />
                    </Buttonvariants>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-[60%] overflow-y-auto bg-white relative">
            {selectedJob ? (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center">
                      <BusinessIcon className="text-gray-500" sx={{ fontSize: 20 }} />
                    </div>
                    <span className="font-semibold text-black text-sm hover:text-blue-900 hover:underline cursor-pointer">{selectedJob.company_name}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    {selectedJob.has_applied || jobs.find(j => j.id == selectedJob.id)?.has_applied ? (
                      <Buttonvariants variant="jobApplied" disabled>
                        Applied
                      </Buttonvariants>
                    ) : selectedJob.applicant_limit && (selectedJob.applicant_count || 0) >= selectedJob.applicant_limit ? (
                      <Buttonvariants variant="jobApplied" disabled>
                        Limit Reached
                      </Buttonvariants>
                    ) : selectedJob.posted_by == profile?.id ? (
                      <Buttonvariants variant="jobApplied" disabled>
                        Your Job
                      </Buttonvariants>
                    ) : (
                      <Buttonvariants 
                        variant="jobApply"
                        onClick={handleApply}
                      >
                        <img 
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEG3aEUmQKntiQbFep_sRg_0Wz2CzKQAaNAG5V1KcN5g&s=10" 
                          alt="in" 
                          className="w-[14px] h-[14px] rounded-sm"
                        /> Easy Apply
                      </Buttonvariants>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-black mb-1">{selectedJob.title}</h1>
                  <div className="flex items-center flex-wrap gap-1 text-sm text-black mb-2">
                     <span>{selectedJob.company_name}</span> • 
                     <span className="text-black">{selectedJob.location}</span>
                     {selectedJob.post_at && (
                       <>
                         <span>•</span>
                         <span className="text-black">{selectedJob.post_at}</span>
                       </>
                     )}
                     <span>•</span>
                     <span className="text-blue-900 font-semibold hover:underline cursor-pointer">
                       {selectedJob.applicant_count || 0} applicants
                     </span>
                  </div>
                </div>

                <div className="flex gap-2 mb-6 flex-wrap">
                   <div className="flex items-center gap-1.5 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-sm text-sm font-semibold border border-gray-200">
                      <WorkIcon className="text-red-500" sx={{ fontSize: 16 }} />
                      <span>{selectedJob.work_mode}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-sm text-sm font-semibold border border-gray-200">
                      <AccessTimeIcon className="text-blue-500" sx={{ fontSize: 16 }} />
                      <span>{selectedJob.employment_type}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-sm text-sm font-semibold border border-gray-200">
                      <PaymentsIcon className="text-green-500" sx={{ fontSize: 16 }} />
                      <span>{formatSalary(selectedJob.salary_min, selectedJob.salary_max)}</span>
                   </div>
                </div>
                
                <div className="bg-white border border-gray-300 rounded-lg p-5 mb-8 flex justify-between items-start shadow-sm">
                   <div>
                     <h3 className="text-[15px] font-semibold text-black mb-4">Your profile and resume <span className="text-green-700 font-bold">match</span> the required qualifications well</h3>
                     <Buttonvariants variant="jobMatchOutline">
                       <span className="text-yellow-600"><AutoAwesomeIcon sx={{ fontSize: 16 }} /></span> Show match details
                     </Buttonvariants>
                   </div>
                   <div className="relative shrink-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                        <img src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png" alt="Profile" className="w-full h-full " />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-300">
                         <BusinessIcon className="text-red-500" sx={{ fontSize: 12 }} />
                      </div>
                   </div>
                </div>
                
                <div>
                   <h2 className="text-lg font-semibold text-black mb-4">About the job</h2>
                   <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                     {selectedJob.description || selectedJob.about || "No description provided."}
                   </div>
                </div>
                
                <div className="bg-[#f9fafb] border border-gray-200 rounded-lg p-5 mt-8 shadow-sm">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="font-semibold text-black">Job search faster with Premium</span>
                     <StarIcon className="text-yellow-500" sx={{ fontSize: 16 }} />
                   </div>
                   <p className="text-sm text-gray-600 mb-2 pb-2">Access company insights like strategic priorities, headcount trends, and more</p>
                   <Buttonvariants variant="jobPremium">
                      Activate Premium for ₹0
                   </Buttonvariants>
                </div>

              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 font-medium">
                Select a job to view details
              </div>
            )}
          </div>
        </div>
      </div>
      
      {alertModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-black">Notification</h2>
              <button 
                onClick={() => setAlertModal({ isOpen: false, message: "" })}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <CloseIcon />
              </button>
            </div>
            
            <div className="p-4 md:p-6">
              <p className="text-lg text-center text-black font-medium mb-8 pb-6">
                {alertModal.message}
              </p>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setAlertModal({ isOpen: false, message: "" })}
                  className="px-6 py-2 bg-[#0a66c2] text-white rounded-md font-semibold hover:bg-blue-800 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobDetailsRoute() {
  return (
    <PrivateRoute>
      <JobDetailsPage />
    </PrivateRoute>
  );
}
