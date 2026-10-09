"use client";
import { useState, useEffect } from "react";
import PrivateRoute from "@/Route/privateroute";
import { useProfile } from "@/hooks/useProfile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppNavigation } from "@/hooks/useNavigation";
import { getJobApplicants } from "@/utils/api";

function JobTrackerPage() {
  const { profile } = useProfile();
  const { goToJobs } = useAppNavigation();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await getJobApplicants();
        if (response.ok) {
          const data = await response.json();
          setApplicants(data.applicants || []);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    fetchApplicants();
  }, []);

  return (
    <div className="px-3 xl:px-5 py-9 flex flex-col items-center w-full bg-[#f3f2ef] min-h-screen">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm border border-gray-300 p-6">
        <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-4">
          <button
            onClick={goToJobs}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowBackIcon className="text-gray-600" />
          </button>
          <h1 className="text-md font-semibold text-black">Applicants</h1>
        </div>

        <div className="flex flex-col gap-4">
          {applicants.map((applicant) => {
            const date = new Date(applicant.applied_at);
            const formattedDate =
              date.toLocaleDateString() +
              "" +
              date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            return (
              <div
                key={applicant.application_id}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <img
                  src={
                    applicant.profile_picture_url ||
                    "https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
                  }
                  alt={applicant.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex flex-col w-full">
                  <h3 className="text-lg font-semibold text-black">
                    {applicant.name}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {applicant.summary || "No summary provided"}
                  </p>
                  <div className="mt-2 text-xs text-gray-500 font-medium">
                    Applied for:{" "}
                    <span className="text-black font-semibold">
                      {applicant.job_title}
                    </span>{" "}
                    • {formattedDate}
                  </div>
                </div>
                <button className="px-4 py-1.5 border border-[#0a66c2] text-[#0a66c2] font-semibold rounded-full hover:bg-blue-50 transition">
                  Message
                </button>
              </div>
            );
          })}
          {applicants.length === 0 && (
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
