"use client";

import PrivateRoute from '@/Route/privateroute';
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { dummyJobs, formatSalary, applyToDummyJob, removeDummyJob } from "@/data/dummyJobs";
import { useAppNavigation } from "@/hooks/useNavigation";
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
  const [dummyState, setDummyState] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (params.id) {
      const job = dummyJobs.find(j => j.id.toString() == params.id);
      if (job) {
        setSelectedJob(job);
      } else {
        setSelectedJob(dummyJobs[0]);
      }
    }
  }, [params.id]);

  const handleJobClick = (job) => {
    goToJob(job.id);
  };

  const handleApply = () => {
    applyToDummyJob(selectedJob.id);
    setSelectedJob({ ...selectedJob, has_applied: true });
  };

  const handleDeleteJob = (e, jobId) => {
    removeDummyJob(jobId);
    setDummyState(prev => prev + 1);
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
              {dummyJobs.map(job => {
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
                          {isSelected && <span className="font-semibold text-gray-600">Viewed • </span>}
                          <span>{job.posted_at}</span>
                          {job.easy_apply && (
                            <>
                               <span className="mx-1">•</span>
                               <span className="text-blue-900 font-semibold flex items-center gap-1">
                                  <img 
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEG3aEUmQKntiQbFep_sRg_0Wz2CzKQAaNAG5V1KcN5g&s=10" 
                                    alt="in" 
                                    className="w-[14px] h-[14px] rounded-sm"
                                  /> Easy Apply
                               </span>
                            </>
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
                    <span className="font-semibold text-black text-sm hover:text-[#0a66c2] hover:underline cursor-pointer">{selectedJob.company_name}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    {selectedJob.has_applied ? (
                      <Buttonvariants variant="jobApplied" disabled>
                        Applied
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
                     <span className="text-gray-600">{selectedJob.location}</span> • 
                     <span className="text-gray-600">{selectedJob.posted_at}</span> • 
                     <span className="text-blue-900 font-semibold hover:underline cursor-pointer">{selectedJob.applicants}</span>
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
                     {selectedJob.about}
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
