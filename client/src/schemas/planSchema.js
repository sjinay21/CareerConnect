import * as Yup from "yup";

export const planSchema = Yup.object().shape({
  name: Yup.string().required("Plan name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number().min(0, "Price cannot be negative").required("Price is required"),
  currency: Yup.string().required("Currency is required"),
  billing_period: Yup.string().required("Billing period is required"),
  featureIds: Yup.array().of(Yup.number()),
  features: Yup.string().optional(),
  tier: Yup.string().optional(),
});
