import * as Yup from "yup";

export const planSchema = Yup.object().shape({
  name: Yup.string().required("Plan name is required"),
  description: Yup.string().required("Description is required"),
  features: Yup.string().required("Features are required"),
  price: Yup.number().min(0, "Price cannot be negative").required("Price is required"),
  currency: Yup.string().required("Currency is required"),
  billing_period: Yup.string().required("Billing period is required"),
});
