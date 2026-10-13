import React from "react";
import Link from "next/link";
import GoogleLoginComp from "@/components/auth/googlelogincomp";
import { ROUTES } from "@/hooks/useNavigation";

export default function LandingPage() {
  return (
    <div className="my-4 py-[50px] md:pl-[120px] px-5 md:flex justify-between items-center w-full max-w-7xl mx-auto">
      <div className="md:w-[40%]">
        <h1 className="text-4xl text-gray-500 mb-8">
          Welcome To Your Professional Community
        </h1>

        <div className="flex flex-col gap-4 w-full max-w-[400px]">
          <div className="my-3 flex mx-auto mt-[20px] bg-white gap-2 rounded-3xl w-[70%] text-black cursor-pointer">
            <GoogleLoginComp />
          </div>
          <Link
            href={ROUTES.LOGIN}
            className="flex mx-auto py-2 px-2 bg-white gap-2 rounded-3xl w-[70%] text-black hover:bg-gray-100 border-2 cursor-pointer justify-center"
          >
            Sign in with Email
          </Link>

          <div className="text-xs text-gray-500 mt-2 text-left">
            By clicking Continue to join or sign in, you agree to LinkedIn's
            <span className="text-blue-700 font-semibold hover:underline">
           
              User Agreement
            </span>
            ,
            <span className="text-blue-700 font-semibold hover:underline">
           
              Privacy Policy
            </span>
            , and
            <span className="text-blue-700 font-semibold hover:underline">
           
              Cookie Policy
            </span>
            .
          </div>

          <Link
            href={ROUTES.REGISTER}
            className="text-base text-gray-800 mt-6 font-medium text-left"
          >
            New to LinkedIn?{" "}
            <span className="text-blue-700 font-semibold hover:underline">
              Join now
            </span>
          </Link>
        </div>
      </div>
      <div className="md:w-[50%] h-120">
        <img
          src="https://media.licdn.com/media//AAYAAgSrAAgAAQAAAAAAAGM6w-NyPk-_SVikYiCJ6V3Z-Q.png"
          alt="image"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
