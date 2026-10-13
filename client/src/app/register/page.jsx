"use client";
import PublicRoute from "@/Route/publicroute";
import React from "react";
import Link from "next/link";
import { useAppNavigation, ROUTES } from "@/hooks/useNavigation";
import { Formik, Form, Field } from "formik";
import Buttonvariants from "@/components/ui/button";
import GoogleLoginComp from "@/components/auth/googlelogincomp";
import { registerSchema } from "../../schemas/authSchema";
import { registerUser } from "../../utils/api";
import InfoMessage from "@/components/ui/InfoMessage";
import {
  TOAST_MESSAGES,
  showSuccessToast,
  showErrorToast,
} from "@/components/ui/toastUtils";

function Register() {
  const { goToLogin } = useAppNavigation();
  return (
    <div className="w-full flex flex-col items-center text-black justify-center">
      <div className="text-4xl mb-5">
        Make the most of your professional life
      </div>
      <div className="w-[85%] md:w-[28%] shadow-xl rounded-sm box p-10">
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
          }}
          validationSchema={registerSchema}
          onSubmit={async (values) => {
            try {
              const res = await registerUser(values);
              if (res.ok) {
                showSuccessToast(TOAST_MESSAGES.REGISTER_SUCCESS);
                setTimeout(() => {
                  goToLogin();
                }, 1000);
              } else {
                const errorData = await res.json();
                showErrorToast(
                  errorData.message || TOAST_MESSAGES.REGISTER_ERROR,
                );
              }
            } catch (err) {
              showErrorToast(TOAST_MESSAGES.NETWORK_ERROR);
            }
          }}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <label htmlFor="name">Full name</label>
                <div className="relative">
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                    className="w-full text-xl border-2 rounded-lg px-5 py-1 pr-10"
                  />
                  <InfoMessage message="Please enter your full name as it appears on LinkedIn" />
                </div>
                {errors.name && touched.name ? (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <div className="relative">
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full text-xl border-2 rounded-lg px-5 py-1 pr-10"
                  />
                  <InfoMessage message="Please use the email address associated with your LinkedIn account" />
                </div>
                {errors.email && touched.email ? (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <div className="relative">
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    className="w-full text-xl border-2 rounded-lg px-5 py-1 pr-10"
                  />
                  <InfoMessage message="Please use the password you registered with on LinkedIn" />
                </div>
                {errors.password && touched.password ? (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                ) : null}
              </div>

              <Buttonvariants variant="primary" type="submit">
                Register
              </Buttonvariants>
            </Form>
          )}
        </Formik>

        <div className="flex items-center gap-2">
          <div className="border border-gray-400 w-[45%]" />
          <div className="text-gray-500">or</div>
          <div className="border border-gray-400 w-[45%] my-6" />
        </div>
        <div>
          <GoogleLoginComp />
        </div>
      </div>
      <div className="mt-4 mb-10 flex gap-2">
        Already on Linkedin?
        <Link
          href={ROUTES.LOGIN}
          className="text-blue-800 cursor-pointer hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default function WrappedRegister() {
  return (
    <PublicRoute>
      <Register />
    </PublicRoute>
  );
}
