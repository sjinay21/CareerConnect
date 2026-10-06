"use client";
import PrivateRoute from '@/Route/privateroute';
import { useAppNavigation } from "@/hooks/useNavigation";
import Profile from "@/components/profile/profile";
import { useProfile } from "@/hooks/useProfile";
import { dummyJobs, removeDummyJob } from "@/data/dummyJobs";
import { useState } from "react";
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
function JobsListingPage() {
  const { goToJob, goToJobCreate, goToJobTracker } = useAppNavigation();
  const { profile } = useProfile();

  const handleJobClick = (jobId) => {
    goToJob(jobId);
  };

  const [dummyState, setDummyState] = useState(0);

  const handleDeleteJob = (e, jobId) => {
    removeDummyJob(jobId);
    setDummyState(prev => prev + 1);
  };

  return (
    <div className="px-3 xl:px-5 py-9 flex flex-col md:flex-row gap-5 w-full bg-[#f3f2ef] min-h-screen">
      <div className="w-full md:w-[23%] lg:w-[23%] flex flex-col gap-4 py-5">
          <div className="hidden md:block">
            <Profile user={profile} />
          </div>
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
            <div className="flex flex-col">
              <div className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center gap-3">
                 <DescriptionIcon className="text-blue-500" />
                 <span className="text-sm font-semibold text-black">Preferences</span>
              </div>
              <div onClick={goToJobTracker} className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center gap-3">
                 <LocalOfferIcon className="text-green-500" />
                 <span className="text-sm font-semibold text-black">Job tracker</span>
              </div>
              <div className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3">
                 <SignalCellularAltIcon className="text-yellow-600" />
                 <span className="text-sm font-semibold text-black">My Career Insights</span>
              </div>
            </div>
          </div>

          <div 
            onClick={goToJobCreate}
            className="bg-white rounded-lg border border-gray-300 p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
          >
             <EditNoteIcon className="text-[#0a66c2]" />
             <span className="text-sm font-semibold text-black">Post a free job</span>
          </div>
        </div>
        <div className="w-full md:w-[50%] lg:w-[50%] flex-1 flex flex-col gap-4 py-5">
          <div className="bg-white rounded-lg border border-gray-300 overflow-hidden ">
             <div className="p-5 border-b border-gray-300">
               <h2 className="text-[20px] font-semibold text-black">Jobs based on your preferences</h2>
               <p className="text-[14px] text-gray-600 mt-1 ">
                 Full-time Software Engineer or Full Stack Engineer or Data Analyst or Artificial Intelligence Engineer, on-site or hybrid or remote
               </p>
               <p className="text-[12px] text-gray-500 mt-3 font-semibold mb-4">99+ results • How promoted jobs are ranked</p>
               
               <div className="flex gap-2">
                  <button className="bg-white border border-gray-500 rounded-full pl-4 pr-3 py-1.5 text-sm font-semibold hover:bg-gray-100 hover:border-gray-700 text-gray-700 flex items-center transition-colors">
                    Date posted <ArrowDropDownSharpIcon sx={{ fontSize: 20 }} className="ml-0.5" />
                  </button>
                  <button className="bg-white border border-gray-500 rounded-full px-4 py-1.5 text-sm font-semibold hover:bg-gray-100 hover:border-gray-700 text-gray-700 transition-colors">
                    Easy Apply
                  </button>
               </div>
             </div>

             <div>
               {dummyJobs.slice(0, 3).map(job => (
                 <div 
                   key={job.id} 
                   onClick={() => handleJobClick(job.id)}
                   className="p-4 flex gap-4 cursor-pointer relative hover:bg-gray-50 border-b border-gray-200 transition-colors bg-white"
                 >
                   <div className="shrink-0 pt-1">
                     <div className="w-14 h-14 bg-gray-100 border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden">
                        <BusinessIcon className="text-gray-400" sx={{ fontSize: 32 }} />
                     </div>
                   </div>
                   
                   <div className="flex-1 pr-6">
                      <h3 className="text-base font-semibold text-[#0a66c2] hover:underline leading-tight mb-1">{job.title}</h3>
                      <p className="text-sm text-black">{job.company_name}</p>
                      <p className="text-sm text-gray-600">{job.location} ({job.work_mode})</p>
                      

                      <div className="flex items-center gap-1 mt-2 text-[12px] text-gray-500">
                         <span>{job.posted_at}</span>
                         {job.easy_apply && (
                           <>
                              <span className="mx-1">•</span>
                              <span className="text-[#0a66c2] font-semibold flex items-center gap-1">
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
                   
                   <button 
                      onClick={(e) => handleDeleteJob(e, job.id)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-black hover:bg-gray-200 rounded-full p-1 transition-colors"
                   >
                      <CloseIcon sx={{ fontSize: 20 }} />
                   </button>
                 </div>
               ))}
             </div>
             
             <div 
                onClick={() => dummyJobs.length > 0 && handleJobClick(dummyJobs[0].id)}
                className="p-4 hover-border-blue-600 cursor-pointer text-center text-white bg-blue-600 font-semibold text-[15px] border-t border-gray-200"
             >
                Show all 
             </div>
          </div>
        </div>

    <div className="w-full md:w-[26%] lg:w-[26%] flex flex-col gap-4 py-5">
           <div className="bg-white rounded-lg border border-gray-300 p-5 shadow-sm text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden border border-gray-300 mb-3">
                 <img src={profile?.profile_picture_url || "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-base font-semibold text-black mb-1">See what's out there</h3>
              <p className="text-xs text-gray-500 mb-4 pb-2">Discover jobs that fit your profile.</p>
              <button className="border border-[#0a66c2] text-[#0a66c2] font-semibold rounded-full px-5 py-1.5 text-[15px] hover:bg-blue-50 hover:border-2 transition-colors w-full">
                Get started
              </button>
           </div>
           
           <div className="bg-white rounded-lg border border-gray-300 p-5 shadow-sm text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-[#f8e5b6] flex items-center justify-center rounded-lg mb-3">
                <WorkIcon className="text-yellow-700" sx={{ fontSize: 32 }} />
              </div>
              <h3 className="text-[17px] font-semibold text-black mb-1">Search for jobs</h3>
              <p className="text-[13px] text-gray-600 mb-4 px-2">Start a search and we'll share opportunities that meet your search criteria.</p>
              <button className="border border-[#0a66c2] text-[#0a66c2] font-semibold rounded-full px-5 py-1.5 text-[15px] hover:bg-blue-50 hover:border-2 transition-colors w-full">
                Search now
              </button>
           </div>
        </div>
    </div>
  );
}

export default function JobsListingRoute() {
  return (
    <PrivateRoute>
      <JobsListingPage />
    </PrivateRoute>
  );
}
