"use client";
import PrivateRoute from '@/Route/privateroute';
import { useProfile } from "@/hooks/useProfile";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppNavigation } from "@/hooks/useNavigation";

const dummyApplicants = [
  {
    id: 1,
    name: "Riya Sharma",
    headline: "Frontend Developer at TechCorp",
    appliedAt: "2 hours ago",
    profilePic: "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png",
    jobTitle: "Senior React Engineer"
  },
  {
    id: 2,
    name: "Jay",
    headline: "Full Stack Engineer | Node.js | React",
    appliedAt: "1 day ago",
    profilePic: "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png",
    jobTitle: "Full Stack Developer"
  },
  {
    id: 3,
    name: "Yash Palil",
    headline: "Software Engineer",
    appliedAt: "3 days ago",
    profilePic: "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png",
    jobTitle: "Senior React Engineer"
  }
];

function JobTrackerPage() {
  const { profile } = useProfile();
  const { goToJobs } = useAppNavigation();

  return (
    <div className="px-3 xl:px-5 py-9 flex flex-col items-center w-full bg-[#f3f2ef] min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm border border-gray-300 p-6">
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-4">
          <button onClick={goToJobs} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowBackIcon className="text-gray-600" />
          </button>
          <h1 className="text-md font-semibold text-black">Applicants</h1>
        </div>

        <div className="flex flex-col gap-4">
          {dummyApplicants.map((applicant) => (
            <div key={applicant.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <img src={applicant.profilePic} alt={applicant.name} className="w-14 h-14 rounded-full object-cover" />
              <div className="flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-black">{applicant.name}</h3>
                <p className="text-sm text-gray-700">{applicant.headline}</p>
                <div className="mt-2 text-xs text-gray-500 font-medium">
                  Applied for: <span className="text-black font-semibold">{applicant.jobTitle}</span> • {applicant.appliedAt}
                </div>
              </div>
              <button className="px-4 py-1.5 border border-[#0a66c2] text-[#0a66c2] font-semibold rounded-full hover:bg-blue-50 transition">
                Message
              </button>
            </div>
          ))}
          {dummyApplicants.length === 0 && (
            <div className="text-center py-10 text-gray-500 font-medium">
              No one has applied to your jobs yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobTracker() {
  return (
    <PrivateRoute>
      <JobTrackerPage />
    </PrivateRoute>
  );
}
