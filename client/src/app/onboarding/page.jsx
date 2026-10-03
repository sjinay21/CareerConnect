"use client";
import PrivateRoute from '@/Route/privateroute';
import React from "react";
import { useAppNavigation } from "@/hooks/useNavigation";
import { updateUserProfile, logoutUser } from "@/utils/api";
import Buttonvariants from "@/components/ui/button";
import InfoMessage from "@/components/ui/InfoMessage";
import { Formik, Form, Field } from "formik";
import { onboardingSchema } from "@/schemas/authSchema";
import { TOAST_MESSAGES, showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";

function Onboarding() {
  const { goToFeeds } = useAppNavigation();

  async function handleSave(values) {
    try {
      const res = await updateUserProfile({
        summary: values.summary,
        location: values.location,
        about: values.about,
        skills: values.skills,
      });
      
      if (res.status == 200) {
        localStorage.setItem("profileComplete", "true");
        showSuccessToast(TOAST_MESSAGES.ONBOARDING_SUCCESS);
        setTimeout(() => {
          goToFeeds();
        }, 1000);
      } else {
        showErrorToast(TOAST_MESSAGES.ONBOARDING_ERROR);
      }
    } catch (err) {
      showErrorToast(TOAST_MESSAGES.NETWORK_ERROR);
    }
  }

  async function handleLogout() {
    try {
      await logoutUser();
      localStorage.removeItem("user");
      localStorage.removeItem("profileComplete");
      showSuccessToast(TOAST_MESSAGES.LOGOUT_SUCCESS);
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 800);
    } catch (err) {
      console.error("Error logging out:", err);
      showErrorToast("Logout failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 relative">
        <button 
          onClick={handleLogout}
          className="absolute top-4 right-4 text-sm font-semibold text-gray-500 hover:text-gray-800 transition"
        >
          Logout
        </button>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to LinkedIn!</h1>
          <p className="text-gray-500 mt-2">Let's set up your profile so you can start connecting.</p>
        </div>

        <Formik
          initialValues={{
            summary: "",
            location: "",
            about: "",
            skills: "",
          }}
          validationSchema={onboardingSchema}
          onSubmit={handleSave}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-5">
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Summary
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    name="summary"
                    placeholder="e.g. Software Engineer at Tech Lead"
                    className="w-full text-md border-2 rounded-lg px-3 py-2 pr-10"
                  />
                  <InfoMessage message="Provide a short professional headline" />
                </div>
                {errors.summary && touched.summary ? (
                  <p className="text-red-500 text-sm mt-1">{errors.summary}</p>
                ) : null}
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Location
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    type="text"
                    name="location"
                    placeholder="e.g. Surat, India"
                    className="w-full text-md border-2 rounded-lg px-3 py-2 pr-10"
                  />
                  <InfoMessage message="Enter your current city and country" />
                </div>
                {errors.location && touched.location ? (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                ) : null}
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">About Me
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    as="textarea"
                    name="about"
                    placeholder="Tell everyone a little bit about yourself..."
                    rows="4"
                    className="w-full text-md border-2 rounded-lg px-3 py-2 pr-10 resize-none"
                  />
                  <InfoMessage message="Write a brief overview of your professional background" />
                </div>
                {errors.about && touched.about ? (
                  <p className="text-red-500 text-sm mt-1">{errors.about}</p>
                ) : null}
              </div>

              <div>
                <label className="block mb-1 font-semibold text-gray-700">Skills  
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    as="textarea"
                    name="skills"
                    placeholder="e.g. HTML, CSS, JavaScript, React"
                    rows="2"
                    className="w-full text-md border-2 rounded-lg px-3 py-2 pr-10 resize-none"
                  />
                  <InfoMessage message="List your key technical and soft skills" />
                </div>
                {errors.skills && touched.skills ? (
                  <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
                ) : null}
              </div>

              <div className="mt-4 flex justify-end">
                <Buttonvariants
                  variant="primary"
                  type="submit"
                >
                  Save & Continue
                </Buttonvariants>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default function WrappedOnboarding() {
  return <PrivateRoute><Onboarding /></PrivateRoute>;
}

