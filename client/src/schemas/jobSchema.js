import * as yup from "yup";

export const jobCreateSchema = yup.object().shape({
  title: yup.string().required("Job Title is required"),
  company_name: yup.string().required("Company Name is required"),
  description: yup.string().required("Job Description is required"),
  location: yup.string().required("Location is required"),
  work_mode: yup.string().required("Work Mode is required"),
  employment_type: yup.string().required("Employment Type is required"),
  salary_min: yup
    .number()
    .typeError("Must be a number")
    .required("Minimum Salary is required")
    .positive("Must be a positive number"),
  salary_max: yup
    .number()
    .typeError("Must be a number")
    .required("Maximum Salary is required")
    .positive("Must be a positive number")
    .moreThan(yup.ref('salary_min'), "Maximum salary must be greater than minimum salary"),
  currency: yup.string().required("Currency is required"),
  salary_period: yup.string().required("Salary Period is required"),
});
