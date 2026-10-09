"use client";

import React from "react";
import PrivateRoute from "@/Route/privateroute";
import { useAppNavigation } from "@/hooks/useNavigation";
import { createJob } from "@/utils/api";
import { Formik, Form, Field } from "formik";
import { jobCreateSchema } from "@/schemas/jobSchema";
import Buttonvariants from "@/components/ui/button";

function JobCreatePage() {
  const { goToJob, goToJobs } = useAppNavigation();

  const initialValues = {
    title: "",
    company_name: "",
    description: "",
    location: "",
    work_mode: "On-site",
    employment_type: "Full-time",
    salary_min: "",
    salary_max: "",
    currency: "INR",
    salary_period: "year",
    easy_apply: true,
    post_at: "",
    applicant_limit: "",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await createJob(values);
      if (response.ok) {
        const data = await response.json();
        if (data.job) {
          // Redirect to the newly created job details page
          goToJob(data.job.id);
        }
      } else {
        const errorData = await response.json();
        console.error("Error from backend:", errorData);
      }
    } catch (error) {
      console.error("Error creating job:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center bg-[#f3f2ef] min-h-screen py-8 px-4">
      <div className="bg-white rounded-lg border border-gray-300 shadow-sm w-full max-w-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-black">Post a free job</h1>
          <Buttonvariants
            variant="createJobCancelText"
            onClick={goToJobs}
            type="button"
          >
            Cancel
          </Buttonvariants>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={jobCreateSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="title"
                    className="w-full border border-gray-400 rounded p-2 focus:border-gray-700 focus:outline-none transition-colors"
                    placeholder="e.g. Software Engineer"
                  />
                  {errors.title && touched.title ? (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  ) : null}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      name="company_name"
                      className="w-full border border-gray-400 rounded p-2"
                      placeholder="e.g. Google"
                    />
                    {errors.company_name && touched.company_name ? (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.company_name}
                      </p>
                    ) : null}
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Posted Date <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      name="post_at"
                      className="w-full border border-gray-400 rounded p-2"
                      placeholder="e.g. 13 Oct"
                    />
                    {errors.post_at && touched.post_at ? (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.post_at}
                      </p>
                    ) : null}
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Applicant Limit{" "}
                    </label>
                    <Field
                      type="number"
                      name="applicant_limit"
                      className="w-full border border-gray-400 rounded p-2"
                      placeholder="e.g. 100"
                      min="1"
                    />
                    {errors.applicant_limit && touched.applicant_limit ? (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.applicant_limit}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows="6"
                    className="w-full border border-gray-400 rounded p-2 focus:border-gray-700 focus:outline-none transition-colors"
                    placeholder="Describe the role, responsibilities, and requirements..."
                  />
                  {errors.description && touched.description ? (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="location"
                    className="w-full border border-gray-400 rounded p-2"
                    placeholder="e.g. Mumbai, Maharashtra"
                  />
                  {errors.location && touched.location ? (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Work Mode <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="work_mode"
                      className="w-full border border-gray-400 rounded p-2 bg-white"
                    >
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                    </Field>
                    {errors.work_mode && touched.work_mode ? (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.work_mode}
                      </p>
                    ) : null}
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Employment Type <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="employment_type"
                      className="w-full border border-gray-400 rounded p-2 bg-white"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Temporary">Temporary</option>
                    </Field>
                    {errors.employment_type && touched.employment_type ? (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.employment_type}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Minimum Salary <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="number"
                      name="salary_min"
                      className="w-full border border-gray-400 rounded p-2 focus:border-gray-700 focus:outline-none transition-colors"
                      placeholder="e.g. 500000"
                    />
                    {errors.salary_min && touched.salary_min ? (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.salary_min}
                      </p>
                    ) : null}
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Maximum Salary <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="number"
                      name="salary_max"
                      className="w-full border border-gray-400 rounded p-2"
                      placeholder="e.g. 1000000"
                    />
                    {errors.salary_max && touched.salary_max ? (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.salary_max}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Currency <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="currency"
                      className="w-full border border-gray-400 rounded p-2 bg-white"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </Field>
                    {errors.currency && touched.currency ? (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.currency}
                      </p>
                    ) : null}
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Salary Period <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="salary_period"
                      className="w-full border border-gray-400 rounded p-2 bg-white"
                    >
                      <option value="year">Per Year</option>
                      <option value="month">Per Month</option>
                      <option value="hour">Per Hour</option>
                    </Field>
                    {errors.salary_period && touched.salary_period ? (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.salary_period}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Buttonvariants
                  variant="createJobCancelBtn"
                  onClick={goToJobs}
                  type="button"
                >
                  Cancel
                </Buttonvariants>
                <Buttonvariants variant="createJobSubmit" type="submit">
                  Post Job
                </Buttonvariants>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default function JobCreateRoute() {
  return (
    <PrivateRoute>
      <JobCreatePage />
    </PrivateRoute>
  );
}
