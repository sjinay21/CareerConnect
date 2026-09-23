"use client";
import PublicRoute from '@/Route/publicroute';
import React from "react";
import Link from "next/link";
import { useAppNavigation } from "@/hooks/useNavigation";
import { Formik, Form, Field } from "formik";
import Buttonvariant from "@/components/ui/button";
import GoogleLoginComp from "@/components/auth/googlelogincomp";
import { loginSchema } from "../../schemas/authSchema";
import { loginUser, getUserProfile } from "../../utils/api";
import { TOAST_MESSAGES, showSuccessToast, showErrorToast } from "@/components/ui/toastUtils";

function Login() {
  const { goToFeeds, goToOnboarding } = useAppNavigation();
  return (
    <div className="w-full flex flex-col items-center text-black justify-center">
      <div className="w-[85%] md:w-[28%] shadow-xl rounded-sm box p-10">
        <div className="text-3xl">Login</div>

        <div className="my-5">
          <GoogleLoginComp />
        </div>

        <div className="flex items-center gap-2">
          <div className="border border-gray-400 w-[45%]" />

          <div className="text-gray-500">or</div>

          <div className="border border-gray-400 w-[45%] my-6" />
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={async (values) => {
            try {
              const res = await loginUser(values);
              if (res.ok) {
                // Store a generic user flag so the UI knows we are authenticated
                localStorage.setItem("user", "true");
                
                // Check if profile is complete
                try {
                  const profileRes = await getUserProfile();
                  if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    const { summary, location, about } = profileData.user;
                    
                    if (!summary || !location || !about) {
                      localStorage.setItem("profileComplete", "false");
                      showSuccessToast(TOAST_MESSAGES.NEW_USER_WELCOME);
                      setTimeout(() => {
                        goToOnboarding();
                      }, 1000);
                      return;
                    } else {
                      localStorage.setItem("profileComplete", "true");
                    }
                  }
                } catch (e) {
                  console.error("Failed to check profile completion");
                }
                
                showSuccessToast(TOAST_MESSAGES.LOGIN_SUCCESS);
                setTimeout(() => {
                  goToFeeds();
                }, 1000);
              } else {
                const errorData = await res.json();
                showErrorToast(errorData.message || TOAST_MESSAGES.LOGIN_ERROR);
              }
            } catch (err) {
              showErrorToast(TOAST_MESSAGES.NETWORK_ERROR);
            }
          }}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-4">
              <div>
                <label htmlFor="email">Email</label>

                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full text-xl border-2 rounded-lg px-5 py-1"
                />

                {errors.email && touched.email ? (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="password">Password</label>

                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full text-xl border-2 rounded-lg px-5 py-1"
                />

                {errors.password && touched.password ? (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                ) : null}
              </div>

              <Buttonvariant 
                variant="primary"
                type="submit"
              >
                Login
              </Buttonvariant>
            </Form>
          )}
        </Formik>
      </div>

      <div className="mt-4 mb-10 flex gap-2">
        New to Linkedin?
        <Link
          href="/register"
          className="text-blue-800 cursor-pointer hover:underline"
        >
          Join now
        </Link>
      </div>
    </div>
  );
}


export default function WrappedLogin() {
  return <PublicRoute><Login /></PublicRoute>;
}

